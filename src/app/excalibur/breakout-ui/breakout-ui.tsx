import { createRoot } from "react-dom/client";
import {
  Engine,
  Actor,
  Color,
  CollisionType,
  vec,
  DisplayMode,
} from "excalibur";
import React from "react";
import UI from "./UI";
import { createSignal, type Setter, type Accessor } from "./utils";

const initializePaddle = (game: Engine) => {
  // Create an actor with x position of 150px,
  // y position of 40px from the bottom of the screen,
  // width of 200px, height and a height of 20px
  const paddle = new Actor({
    x: 150,
    y: game.drawHeight - 40,
    width: 200,
    height: 20,
    // Let's give it some color with one of the predefined
    // color constants
    color: Color.Chartreuse,
  });

  // Make sure the paddle can participate in collisions, by default excalibur actors do not collide with each other
  // CollisionType.Fixed is like an object with infinite mass, and cannot be moved, but does participate in collision.
  paddle.body.collisionType = CollisionType.Fixed;

  // `game.add` is the same as calling
  // `game.currentScene.add`
  game.add(paddle);

  game.input.pointers.primary.on("move", (evt) => {
    paddle.pos.x = evt.worldPos.x;
  });
  return paddle;
};

const initializeBall = (
  game: Engine,
  gameState: Accessor<GameState>,
  setGameState: Setter<GameState>,
  bricks: Actor[],
) => {
  // Create a ball at pos (100, 300) to start
  const ball = new Actor({
    x: 100,
    y: 300,
    // Use a circle collider with radius 10
    radius: 10,
    // Set the color
    color: Color.Red,
  });
  // Start the serve after a second
  const ballSpeed = vec(100, 100);
  setTimeout(() => {
    // Set the velocity in pixels per second
    ball.vel = ballSpeed;
  }, 1000);

  // Set the collision Type to passive
  // This means "tell me when I collide with an emitted event, but don't let excalibur do anything automatically"
  ball.body.collisionType = CollisionType.Passive;
  // Other possible collision types:
  // "ex.CollisionType.PreventCollision - this means do not participate in any collision notification at all"
  // "ex.CollisionType.Active - this means participate and let excalibur resolve the positions/velocities of actors after collision"
  // "ex.CollisionType.Fixed - this means participate, but this object is unmovable"

  // Add the ball to the current scene
  game.add(ball);

  // Wire up to the postupdate event
  ball.on("postupdate", () => {
    // If the ball collides with the left side
    // of the screen reverse the x velocity
    if (ball.pos.x < ball.width / 2) {
      ball.vel.x = ballSpeed.x;
    }

    // If the ball collides with the right side
    // of the screen reverse the x velocity
    if (ball.pos.x + ball.width / 2 > game.drawWidth) {
      ball.vel.x = ballSpeed.x * -1;
    }

    // If the ball collides with the top
    // of the screen reverse the y velocity
    if (ball.pos.y < ball.height / 2) {
      ball.vel.y = ballSpeed.y;
    }
  });

  // On collision remove the brick, bounce the ball
  let colliding = false;
  ball.on("collisionstart", function (ev) {
    if (bricks.indexOf(ev.other) > -1) {
      setGameState((prevState) => {
        prevState.score++;
        return prevState;
      });
      // kill removes an actor from the current scene
      // therefore it will no longer be drawn or updated
      ev.other.kill();
    }

    // reverse course after any collision
    // intersections are the direction body A has to move to not be clipping body B
    // `ev.content.mtv` "minimum translation vector" is a vector `normalize()` will make the length of it 1
    // `negate()` flips the direction of the vector
    const intersection = ev.contact.mtv.normalize();

    // Only reverse direction when the collision starts
    // Object could be colliding for multiple frames
    if (!colliding) {
      colliding = true;
      // The largest component of intersection is our axis to flip
      if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
        ball.vel.x *= -1;
      } else {
        ball.vel.y *= -1;
      }
    }
  });

  ball.on("collisionend", () => {
    // ball has separated from whatever object it was colliding with
    colliding = false;
  });

  // Loss condition
  ball.on("exitviewport", () => {
    // alert("You lose!");
    setGameState((prevState) => {
      prevState.lives--;
      return prevState;
    });
    if (gameState().lives > 0) {
      ball.pos = vec(100, 300);
      ball.vel = ballSpeed;
    }
  });

  return ball;
};

const generateBrick = (
  game: Engine,
  {
    x,
    y,
    width,
    height,
    color,
  }: { x: number; y: number; width: number; height: number; color: Color },
) => {
  const brick = new Actor({
    x,
    y,
    width,
    height,
    color,
  });

  // Make sure that bricks can participate in collisions
  brick.body.collisionType = CollisionType.Active;

  // Add the brick to the current scene to be drawn
  game.add(brick);
  return brick;
};

// Padding between bricks
const bricks_PADDING = 20; // px
const bricks_XOFFSET = 65; // x-offset
const bricks_YOFFSET = 20; // y-offset
const bricks_COLUMNS = 5;
const bricks_ROWS = 3;

const bricks_COLORS = [Color.Violet, Color.Orange, Color.Yellow];

// Individual brick width with padding factored in
const bricks_WIDTH = (game: Engine) =>
  game.drawWidth / bricks_COLUMNS -
  bricks_PADDING -
  bricks_PADDING / bricks_COLUMNS; // px
const bricks_HEIGHT = 30; // px

const initializeBricks = (game: Engine) => {
  const bricks: Actor[] = [];
  for (let j = 0; j < bricks_ROWS; j++) {
    for (let i = 0; i < bricks_COLUMNS; i++) {
      const brick = generateBrick(game, {
        x:
          bricks_XOFFSET +
          i * (bricks_WIDTH(game) + bricks_PADDING) +
          bricks_PADDING,
        y:
          bricks_YOFFSET +
          j * (bricks_HEIGHT + bricks_PADDING) +
          bricks_PADDING,
        width: bricks_WIDTH(game),
        height: bricks_HEIGHT,
        color: bricks_COLORS[j % bricks_COLORS.length]!,
      });

      bricks.push(brick);
    }
  }
  return bricks;
};

export type GameState = {
  score: number;
  lives: number;
};

export const intializeGame = (
  game: Engine | undefined,
  gameCanvas: HTMLCanvasElement,
  uiRoot: HTMLDivElement,
) => {
  game = new Engine({
    canvasElement: gameCanvas,
    displayMode: DisplayMode.FitContainerAndFill,
    // width: 800,
    // height: 600,
  });

  const ui = createRoot(uiRoot);

  const [gameState, setGameState] = createSignal({ score: 0, lives: 3 }, [
    (state, setState) => {
      ui.render(<UI gameState={state} setGameState={setState} game={game} />);
    },
  ]);

  ui.render(
    <UI gameState={gameState()} setGameState={setGameState} game={game} />,
  );

  const paddle = initializePaddle(game);
  const bricks = initializeBricks(game);

  const ball = initializeBall(game, gameState, setGameState, bricks);

  game?.start().catch((e) => console.error(e));
};

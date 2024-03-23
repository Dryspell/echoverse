"use client";
import { type Engine } from "excalibur";
import React from "react";
import { intializeGame } from "~/components/games/breakout";

export default function Game() {
  const gameCanvas = React.useRef<HTMLCanvasElement>(null);
  const gameRef = React.useRef<Engine>();

  React.useEffect(() => {
    if (
      !gameRef.current &&
      gameCanvas.current &&
      typeof window !== "undefined"
    ) {
      intializeGame(gameRef, gameCanvas);
    }
  }, []);

  return (
    <div>
      <h1>Excalibur Game</h1>
      <canvas ref={gameCanvas} id="gameCanvas"></canvas>
      {/* <Script src="game.js" /> */}
    </div>
  );
}

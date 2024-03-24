import React from "react";
import { Accessor, Setter } from "./utils";
import { GameState } from "./breakout-ui";
import { Engine } from "excalibur";

export default function UI({
	gameState,
	setGameState,
	game,
}: {
	gameState: GameState;
	setGameState: Setter<GameState>;
	game: Engine;
}) {
	return (
		<>
			<div style={{ position: "absolute", right: 0, top: "55%" }}>
				<button
					style={{
						padding: "1rem",
						margin: "1rem",
						borderRadius: "0.5rem",
						backgroundColor: "#2e026d",
						color: "white",
						border: "none",
					}}
					onClick={() => {
						setGameState((prev) => {
							prev.score = prev.score + 1;
							return prev;
						});
					}}
				>
					{`Score: ${gameState.score}`}
				</button>
				<button
					style={{
						padding: "1rem",
						borderRadius: "0.5rem",
						backgroundColor: "#2e026d",
						color: "white",
						border: "none",
					}}
					onClick={() => {
						setGameState((prev) => {
							prev.lives = prev.lives + 1;
							return prev;
						});
					}}
				>
					{`Lives: ${gameState.lives}`}
				</button>
			</div>
		</>
	);
}

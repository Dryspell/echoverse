"use client";
import { type Engine } from "excalibur";
import React from "react";
import { intializeGame } from "./breakout";

export default function Game() {
	const gameCanvas = React.useRef<HTMLCanvasElement>(null);
	const gameRef = React.useRef<Engine>();

	React.useEffect(() => {
		if (!gameRef.current && gameCanvas.current) {
			intializeGame(gameRef, gameCanvas);
		}
	}, []);

	return (
		<div>
			<canvas ref={gameCanvas} id="gameCanvas"></canvas>
		</div>
	);
}

"use client";
import { type Engine } from "excalibur";
import React from "react";
import { intializeGame } from "./breakout-ui";

export default function Game() {
	const gameCanvas = React.useRef<HTMLCanvasElement>(null);
	const gameRef = React.useRef<Engine>();
	const uiRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!gameRef.current && gameCanvas.current && uiRef.current) {
			console.log(gameCanvas.current);
			intializeGame(gameRef.current, gameCanvas.current, uiRef.current);
		}
	}, []);

	return (
		<div
			style={{
				justifyContent: "center",
				alignItems: "center",
				position: "relative",
				width: 800,
				height: 600,
			}}
		>
			<canvas ref={gameCanvas} id="gameCanvas"></canvas>
			<div
				// style={{ position: "absolute", display: "flex", width: "100%" }}
				ref={uiRef}
			/>
		</div>
	);
}

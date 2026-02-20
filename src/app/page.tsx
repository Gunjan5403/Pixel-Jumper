"use client";

import { useState, useEffect, useCallback } from "react";
import PixelJumperGame from "@/components/game/PixelJumperGame";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Gamepad2, PauseCircle, Play, RotateCw, Home as HomeIcon } from "lucide-react";
import { initAudio } from "@/lib/game/audio";

type GameState = "start" | "playing" | "paused" | "gameOver" | "win";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [finalScore, setFinalScore] = useState(0);
  const [gameId, setGameId] = useState(0);

  // Avoid hydration errors with client-side only components
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartGame = () => {
    initAudio();
    setGameState("playing");
  };

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameState("gameOver");
  }, []);

  const handleWin = useCallback((score: number) => {
    setFinalScore(score);
    setGameState("win");
  }, []);

  const handlePause = useCallback(() => {
    setGameState((prev) => (prev === "playing" ? "paused" : "playing"));
  }, []);

  const handleRestart = () => {
    setGameId((id) => id + 1);
    setGameState("playing");
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <p>Loading Game...</p>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      {gameState === "start" && (
        <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in-up border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-5xl font-bold text-primary flex items-center justify-center gap-4">
              <Gamepad2 className="h-12 w-12" /> Pixel Jumper
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2 text-lg">
              A classic 2D platformer adventure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-2 rounded-lg border bg-secondary/30 p-4">
              <p className="font-bold text-xl">Controls:</p>
              <p>
                Move:{" "}
                <span className="font-mono p-1 rounded-md bg-primary/20 text-primary font-bold">
                  Left/Right Arrow Keys
                </span>
              </p>
              <p>
                Jump:{" "}
                <span className="font-mono p-1 rounded-md bg-primary/20 text-primary font-bold">
                  Up Arrow Key
                </span>{" "}
                or{" "}
                <span className="font-mono p-1 rounded-md bg-primary/20 text-primary font-bold">
                  Spacebar
                </span>
              </p>
              <p>
                Pause:{" "}
                <span className="font-mono p-1 rounded-md bg-primary/20 text-primary font-bold">
                  Escape
                </span>
              </p>
            </div>
            <Button
              onClick={handleStartGame}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      )}

      {(gameState === "playing" || gameState === "paused") && (
        <PixelJumperGame
          key={gameId}
          onGameOver={handleGameOver}
          onWin={handleWin}
          onPause={handlePause}
          isPaused={gameState === "paused"}
        />
      )}

      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in-up border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-4xl font-bold text-primary flex items-center justify-center gap-2">
                <PauseCircle /> Paused
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={handlePause}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <Play className="mr-2" /> Resume
              </Button>
              <Button
                onClick={handleRestart}
                variant="outline"
                className="w-full font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <RotateCw className="mr-2" /> Restart
              </Button>
              <Button
                onClick={() => setGameState("start")}
                variant="secondary"
                className="w-full font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <HomeIcon className="mr-2" /> Main Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {(gameState === "gameOver" || gameState === "win") && (
        <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in-up border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-5xl font-bold text-primary">
              {gameState === "win" ? "You Win!" : "Game Over"}
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2 text-lg">
              Your final score is:{" "}
              <span className="font-bold text-accent">{finalScore}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleRestart}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

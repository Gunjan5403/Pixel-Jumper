"use client";

import React, { useRef, useEffect, useState } from "react";
import { Player } from "@/lib/game/player";
import { Platform } from "@/lib/game/platform";
import { GenericObject } from "@/lib/game/genericObject";
import { Enemy } from "@/lib/game/enemy";
import { Coin } from "@/lib/game/coin";
import { Particle } from "@/lib/game/particle";
import { Flag } from "@/lib/game/flag";
import * as Audio from "@/lib/game/audio";
import { Heart, Coins } from "lucide-react";

interface PixelJumperGameProps {
  onGameOver: (score: number) => void;
  onWin: (score: number) => void;
  isPaused: boolean;
  onPause: () => void;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;
const WORLD_WIDTH = 8000;

const PixelJumperGame: React.FC<PixelJumperGameProps> = ({ onGameOver, onWin, isPaused, onPause }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [coinCount, setCoinCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const gravity = 1.5;

    let player: Player;
    let platforms: Platform[];
    let genericObjects: GenericObject[];
    let enemies: Enemy[];
    let coins: Coin[];
    let particles: Particle[];
    let flag: Flag;
    let scrollOffset: number;
    let keys: { right: { pressed: boolean }; left: { pressed: boolean } };
    let animationFrameId: number;

    const init = () => {
      scrollOffset = 0;
      setScore(0);
      setLives(3);
      setCoinCount(0);
      player = new Player(c, gravity);
      keys = {
        right: { pressed: false },
        left: { pressed: false },
      };
      particles = [];

      // Level Creation
      platforms = [
        // Ground
        new Platform(c, { x: 0, y: 470 }, 500),
        new Platform(c, { x: 500, y: 470 }, 1000),
        new Platform(c, { x: 1800, y: 470 }, 800),
        new Platform(c, { x: 2800, y: 470 }, 500),
        new Platform(c, { x: 3500, y: 470 }, 2000),
        new Platform(c, { x: 5800, y: 470 }, 2200),
        
        // Floating platforms
        new Platform(c, { x: 800, y: 350 }, 200),
        new Platform(c, { x: 1200, y: 250 }, 300),
        new Platform(c, { x: 2000, y: 300 }, 400),
        new Platform(c, { x: 3700, y: 300 }, 200),
        new Platform(c, { x: 4100, y: 200 }, 200),
        new Platform(c, { x: 4400, y: 350 }, 200),
        new Platform(c, { x: 6000, y: 350 }, 300),
        new Platform(c, { x: 6500, y: 250 }, 200),
        new Platform(c, { x: 7000, y: 150 }, 150),
      ];
      
      enemies = [
        new Enemy(c, { x: 600, y: 420 }, 100, {x: -2, y: 0}),
        new Enemy(c, { x: 2200, y: 420 }, 100, {x: -2, y: 0}),
        new Enemy(c, { x: 4000, y: 420 }, 100, {x: -3, y: 0}),
        new Enemy(c, { x: 4800, y: 420 }, 100, {x: -3, y: 0}),
        new Enemy(c, { x: 6200, y: 420 }, 100, {x: -4, y: 0}),
      ];

      coins = [
        new Coin(c, { x: 850, y: 300 }),
        new Coin(c, { x: 1300, y: 200 }),
        new Coin(c, { x: 2100, y: 250 }),
        new Coin(c, { x: 2200, y: 250 }),
        new Coin(c, { x: 2300, y: 250 }),
        new Coin(c, { x: 3750, y: 250 }),
        new Coin(c, { x: 4150, y: 150 }),
        new Coin(c, { x: 6550, y: 200 }),
      ];

      flag = new Flag(c, {x: 7700, y: 320});

      genericObjects = [
        new GenericObject(c, { x: 0, y: 0 }, 0.3, 'rgba(173, 216, 230, 0.5)'),
        new GenericObject(c, { x: 0, y: 0 }, 0.5, 'rgba(135, 206, 250, 0.5)'),
      ];
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isPaused || !c) return;

      c.fillStyle = '#eaf8fd';
      c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      genericObjects.forEach(obj => obj.draw(scrollOffset));

      platforms.forEach((platform) => platform.draw(scrollOffset));
      coins.forEach((coin) => coin.draw(scrollOffset));
      enemies.forEach((enemy) => enemy.update(scrollOffset));
      flag.draw(scrollOffset);

      particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          particle.update();
        }
      });
      
      player.update(keys, scrollOffset, platforms);
      
      // Horizontal movement and camera scroll
      if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed;
      } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -player.speed;
      } else {
        player.velocity.x = 0;
        if (keys.right.pressed && scrollOffset < WORLD_WIDTH - CANVAS_WIDTH) {
          scrollOffset += player.speed;
        } else if (keys.left.pressed && scrollOffset > 0) {
          scrollOffset -= player.speed;
        }
      }

      // Enemy collision
      enemies.forEach((enemy, index) => {
        const dist = Math.hypot(player.position.x + player.width/2 - (enemy.position.x - scrollOffset + enemy.width / 2), player.position.y + player.height/2 - (enemy.position.y + enemy.height / 2));
        if (dist < player.width/2 + enemy.width/2) {
             // Stomp on enemy
            if (player.velocity.y > 0 && player.position.y + player.height <= enemy.position.y + 20) {
                enemies.splice(index, 1);
                Audio.playEnemyDefeatSound();
                setScore(prev => prev + 100);
                player.velocity.y = -20; // bounce
                for (let i = 0; i < 30; i++) {
                    particles.push(new Particle(c, { x: enemy.position.x - scrollOffset + enemy.width / 2, y: enemy.position.y + enemy.height / 2 }, { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 }, Math.random() * 3, 'orange'));
                }
            } else if (!isPaused) {
                // Player gets hit
                Audio.playHitSound();
                setLives(prev => prev - 1);
                init(); // Restart level
            }
        }
      });
      
      // Coin collection
      coins.forEach((coin, index) => {
        if (
          player.position.x < coin.position.x - scrollOffset + coin.radius &&
          player.position.x + player.width > coin.position.x - scrollOffset - coin.radius &&
          player.position.y < coin.position.y + coin.radius &&
          player.position.y + player.height > coin.position.y - coin.radius
        ) {
          coins.splice(index, 1);
          Audio.playCoinSound();
          setScore(prev => prev + 50);
          setCoinCount(prev => prev + 1);
          for (let i = 0; i < 15; i++) {
            particles.push(new Particle(c, { x: coin.position.x - scrollOffset, y: coin.position.y }, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }, Math.random() * 2, '#f5e342'));
          }
        }
      });

      // Win condition
      if (scrollOffset + player.position.x > flag.position.x) {
        onWin(score + coinCount * 50);
        cancelAnimationFrame(animationFrameId);
      }

      // Lose condition
      if (player.position.y > CANVAS_HEIGHT) {
        Audio.playHitSound();
        setLives(prev => prev - 1);
        init();
      }
      
      if(lives <= 1 && player.position.y > CANVAS_HEIGHT) {
        onGameOver(score);
        cancelAnimationFrame(animationFrameId);
      }
    };

    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if(isPaused && key !== "Escape") return;
      switch (key) {
        case "ArrowLeft":
          keys.left.pressed = true;
          break;
        case "ArrowRight":
          keys.right.pressed = true;
          break;
        case "ArrowUp":
        case " ":
          if(player.velocity.y === 0) {
            player.jump();
            Audio.playJumpSound();
          }
          break;
        case "Escape":
          onPause();
          break;
      }
    };

    const handleKeyUp = ({ key }: KeyboardEvent) => {
      switch (key) {
        case "ArrowLeft":
          keys.left.pressed = false;
          break;
        case "ArrowRight":
          keys.right.pressed = false;
          break;
      }
    };
    
    init();
    animate();
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [lives, onGameOver, onWin, onPause, isPaused]);

  return (
    <div className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-lg shadow-2xl overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
       <div className="absolute top-0 left-0 right-0 p-4 text-white font-bold text-2xl flex justify-between items-center pointer-events-none" style={{textShadow: '2px 2px 4px #00000080'}}>
        <div className="flex items-center gap-2">
            <span>SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Coins className="text-accent" />
                <span>{coinCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <Heart className="text-red-500" />
                <span>{lives}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PixelJumperGame;

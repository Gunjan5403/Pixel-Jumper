import type { Platform } from './platform';
import { rectCollision } from './utils';

export class Player {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    width: number;
    height: number;
    c: CanvasRenderingContext2D;
    gravity: number;
    speed: number;
    jumpStrength: number;
    facing: 'left' | 'right';
    
    constructor(c: CanvasRenderingContext2D, gravity: number) {
        this.c = c;
        this.speed = 7;
        this.jumpStrength = 25;
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.width = 40;
        this.height = 40;
        this.gravity = gravity;
        this.facing = 'right';
    }

    draw() {
        this.c.fillStyle = '#42cbf5';
        this.c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw an eye to show direction
        const eyeY = this.position.y + this.height * 0.4;
        const eyeX = this.facing === 'right' 
            ? this.position.x + this.width * 0.65
            : this.position.x + this.width * 0.35;
        const eyeRadius = 3;

        this.c.fillStyle = 'white';
        this.c.beginPath();
        this.c.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI);
        this.c.fill();

        this.c.fillStyle = 'black';
        this.c.beginPath();
        const pupilX = this.facing === 'right' ? eyeX + 1 : eyeX - 1;
        this.c.arc(pupilX, eyeY, eyeRadius/2, 0, 2 * Math.PI);
        this.c.fill();
    }
    
    jump() {
        this.velocity.y = -this.jumpStrength;
    }

    update(
      keys: { right: { pressed: boolean }, left: { pressed: boolean } },
      scrollOffset: number,
      platforms: Platform[]
    ) {
        if (keys.right.pressed) {
            this.facing = 'right';
        } else if (keys.left.pressed) {
            this.facing = 'left';
        }

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Apply gravity if player is not on the ground or has upward velocity
        if (this.position.y + this.height + this.velocity.y < this.c.canvas.height) {
            this.velocity.y += this.gravity;
        }

        // Platform collision detection
        platforms.forEach(platform => {
          if (rectCollision({ rect1: this, rect2: { ...platform, position: { x: platform.position.x - scrollOffset, y: platform.position.y } } })) {
            if (this.position.y + this.height <= platform.position.y + this.velocity.y) {
               this.velocity.y = 0;
               this.position.y = platform.position.y - this.height;
            }
          }
        });
    }
}

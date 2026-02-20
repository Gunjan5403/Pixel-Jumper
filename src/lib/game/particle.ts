export class Particle {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    radius: number;
    c: CanvasRenderingContext2D;
    color: string;
    alpha: number;
    
    constructor(c: CanvasRenderingContext2D, position: { x: number; y: number }, velocity: { x: number; y: number }, radius: number, color: string) {
        this.c = c;
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.alpha = 1;
    }

    draw() {
        this.c.save();
        this.c.globalAlpha = this.alpha;
        this.c.beginPath();
        this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.closePath();
        this.c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.alpha -= 0.02;
    }
}

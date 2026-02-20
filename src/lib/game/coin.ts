export class Coin {
    position: { x: number; y: number };
    radius: number;
    c: CanvasRenderingContext2D;
    
    constructor(c: CanvasRenderingContext2D, { x, y }: { x: number; y: number }) {
        this.c = c;
        this.position = { x, y };
        this.radius = 15;
    }

    draw(scrollOffset: number) {
        this.c.beginPath();
        this.c.arc(this.position.x - scrollOffset, this.position.y, this.radius, 0, Math.PI * 2);
        this.c.fillStyle = '#f5e342';
        this.c.fill();
        this.c.closePath();
    }
}

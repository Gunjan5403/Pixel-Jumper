export class Flag {
    position: { x: number, y: number };
    width: number;
    height: number;
    c: CanvasRenderingContext2D;

    constructor(c: CanvasRenderingContext2D, { x, y }: { x: number, y: number }) {
        this.c = c;
        this.position = { x, y };
        this.width = 10;
        this.height = 150;
    }

    draw(scrollOffset: number) {
        // Pole
        this.c.fillStyle = '#8B4513';
        this.c.fillRect(this.position.x - scrollOffset, this.position.y, this.width, this.height);
        
        // Flag
        this.c.fillStyle = '#42cbf5';
        this.c.beginPath();
        this.c.moveTo(this.position.x - scrollOffset + this.width, this.position.y);
        this.c.lineTo(this.position.x - scrollOffset + this.width + 60, this.position.y + 30);
        this.c.lineTo(this.position.x - scrollOffset + this.width, this.position.y + 60);
        this.c.closePath();
        this.c.fill();
    }
}

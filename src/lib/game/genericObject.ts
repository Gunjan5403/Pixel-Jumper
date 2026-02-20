export class GenericObject {
    position: { x: number; y: number };
    c: CanvasRenderingContext2D;
    width: number;
    height: number;
    parallaxFactor: number;
    color: string;
    
    constructor(c: CanvasRenderingContext2D, { x, y }: { x: number; y: number }, parallaxFactor: number, color: string) {
        this.c = c;
        this.position = { x, y };
        this.width = 3000;
        this.height = 200;
        this.parallaxFactor = parallaxFactor;
        this.color = color;
    }

    draw(scrollOffset: number) {
        const scrolledX = this.position.x - scrollOffset * this.parallaxFactor;
        
        // Draw multiple instances for infinite scroll effect
        for (let i = -1; i < 3; i++) {
             // Simple cloud/hill shape
            this.c.fillStyle = this.color;
            this.c.beginPath();
            this.c.moveTo(scrolledX + i * this.width, this.position.y + this.height);
            this.c.ellipse(scrolledX + i * this.width + this.width/2, this.position.y + this.height, this.width/2, 80, 0, Math.PI, 2 * Math.PI, false);
            this.c.closePath();
            this.c.fill();
        }
    }
}

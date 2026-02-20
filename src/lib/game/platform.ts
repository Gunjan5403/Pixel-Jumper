export class Platform {
    position: { x: number; y: number };
    width: number;
    height: number;
    c: CanvasRenderingContext2D;
    
    constructor(c: CanvasRenderingContext2D, { x, y }: { x: number; y: number }, width: number) {
        this.c = c;
        this.position = { x, y };
        this.width = width;
        this.height = 120;
    }

    draw(scrollOffset: number) {
        this.c.fillStyle = '#a8e6cf';
        this.c.fillRect(this.position.x - scrollOffset, this.position.y, this.width, this.height);
        // Add a "grass" top
        this.c.fillStyle = '#45b880';
        this.c.fillRect(this.position.x - scrollOffset, this.position.y, this.width, 20);
    }
}

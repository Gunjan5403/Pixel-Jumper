export class Enemy {
    position: { x: number; y: number };
    width: number;
    height: number;
    c: CanvasRenderingContext2D;
    velocity: {x: number, y: number};
    initialPos: { x: number, y: number };
    walkDistance: number;

    constructor(c: CanvasRenderingContext2D, { x, y }: { x: number; y: number }, walkDistance: number, velocity: {x: number, y: number}) {
        this.c = c;
        this.position = { x, y };
        this.initialPos = { x, y };
        this.width = 50;
        this.height = 50;
        this.velocity = velocity;
        this.walkDistance = walkDistance;
    }

    draw(scrollOffset: number) {
        this.c.fillStyle = '#f56a42';
        this.c.fillRect(this.position.x - scrollOffset, this.position.y, this.width, this.height);

        // Draw angry eyes
        const eyeY = this.position.y + 15;
        const eyeSpacing = 15;
        const eyeWidth = 10;
        const eyeHeight = 5;
        const centerX = this.position.x - scrollOffset + this.width / 2;
        
        this.c.fillStyle = 'white';

        const leftEyeX = centerX - eyeSpacing / 2 - eyeWidth;
        const rightEyeX = centerX + eyeSpacing / 2;

        this.c.fillRect(leftEyeX, eyeY, eyeWidth, eyeHeight);
        this.c.fillRect(rightEyeX, eyeY, eyeWidth, eyeHeight);

        // pupils
        this.c.fillStyle = 'black';
        const pupilSize = 3;
        const pupilOffsetY = 1;
        const pupilOffsetX = this.velocity.x > 0 ? 4 : 0;
        
        this.c.fillRect(leftEyeX + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, pupilSize);
        this.c.fillRect(rightEyeX + pupilOffsetX, eyeY + pupilOffsetY, pupilSize, pupilSize);
    }

    update(scrollOffset: number) {
        this.draw(scrollOffset);
        this.position.x += this.velocity.x;

        if (this.position.x <= this.initialPos.x - this.walkDistance || this.position.x >= this.initialPos.x + this.walkDistance) {
            this.velocity.x = -this.velocity.x;
        }
    }
}

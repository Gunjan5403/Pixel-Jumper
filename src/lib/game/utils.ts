interface Rect {
    position: { x: number; y: number };
    width: number;
    height: number;
}

export const rectCollision = ({ rect1, rect2 }: { rect1: Rect; rect2: Rect }): boolean => {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y + rect1.height >= rect2.position.y &&
        rect1.position.y <= rect2.position.y + rect2.height
    );
};

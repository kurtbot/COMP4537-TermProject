class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Collider {
    constructor() {
        if (this.collides === undefined)
            throw 'Collider#collides must be defined';
    }
}

class RectangleCollider {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    /**
     * @param {RectangleCollider} rect 
     */
    collides(col) {
        return this.x < col.x + col.width &&
            this.x + this.width > col.x &&
            this.y < col.y + col.height &&
            this.y + this.height > col.y;
    }
}
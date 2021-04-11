
var canvasOffsetX = 10;
var canvasOffsetY = 10;
let mColliderWidth = 1;
let mColliderHeight = 1;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Collider {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        if (this.collides === undefined)
            console.error('Collider#collides must be defined');
    }
}

class RectangleCollider extends Collider {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    collides(col) {
        return this.x < col.x + col.width &&
            this.x + this.width > col.x &&
            this.y < col.y + col.height &&
            this.y + this.height > col.y;
    }

    showCollider() {
        color('rgba(255,255,255, 0.25)');
        stroke('rgba(255,255,255, 0.25)');
        strokeWeight(4);
        rect(this.x, this.y, this.width, this.height);
        color('rgba(255,255,255, 1)');
    }
}

class RenderObject {
    constructor() {
        if (this.update === undefined)
            console.error('RenderObject#update must be defined');
        if (this.render === undefined)
            console.error('RenderObject#render must be defined');
    }

}


class Controller extends RenderObject {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.collider = new RectangleCollider(this.x, this.y, this.width, this.height)
        this.isHovering = false;
        this.isClicked = false;
        this.isPressed = false;
        this.isReleased = false;
        this.showCollider = false;

        /** @type {Function} */
        this.onMouseHover = () => {
            console.log('hover');
        };

        /** @type {Function} */
        this.onMouseLeave = function () {
            console.log('leave');
        };

        /** @type {Function} */
        this.onMouseClick = function () {
            console.log('clicked');
        }

        /** @type {Function} */
        this.onMousePress = function () {
            console.log('press');
        }

        /** @type {Function} */
        this.onMouseRelease = () => {
            console.log('release');
        }   
    }

    update() {
        if (this.collider.collides(
            new RectangleCollider(
                canvasOffsetX + mouseX - mColliderWidth / 2,
                canvasOffsetY + mouseY - mColliderHeight / 2,
                mColliderWidth,
                mColliderHeight
            )
        )) {
            this.isHovering = true;
        }
        else {
            this.isHovering = false;
        }

        if (this.isClicked && this.isHovering)
            this.onMouseClick();

        if (this.isPressed && this.isHovering)
            this.onMousePress();

        // if(this.isReleased)
        //     this.onMouseRelease();

        this.isClicked = false;
    }

    click() {
        this.isClicked = true;
        if(this.isHovering)
            this.onMouseClick();
    }

    press() {
        this.isPressed = true;
        if(this.isHovering)
            this.onMousePress();
    }

    release() {
        this.isReleased = true;
    }

    render() {
        if (this.showCollider)
            this.collider.showCollider();

        if (this.isHovering)
            this.onMouseHover();
        else
            this.onMouseLeave();
    }
}

class Tile extends Controller {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.showCollider = true;

        this.onMouseHover = () => {
            console.log('hovering', x, y);
            fill(color(100));
            rect(this.x, this.y, this.width, this.height);
            fill(color(100));
        }

        this.onMouseLeave = () => {
            fill(color(0));
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            fill(color(100));
        }

        this.onMouseClick = () => {
            fill(color(0));
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            fill(color(100));
        }

        this.onMousePress = () => {
            fill(color(0));
            noStroke();
            rect(this.x, this.y, this.width, this.height);
            fill(color(100));
        }
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    click() {
        super.click();
    }

    press() {
        super.press();
    }

    release(){
        super.release();
    }
}

class Grid extends RenderObject {
    constructor(pos = new Vector2(), dim = new Vector2(), tileDim = new Vector2(), tileSpacing = new Vector2()) {
        super();
        console.log(
            pos,
            dim,
            tileDim,
            tileSpacing
        );

        /** @type {Vector2} */
        this.pos = pos;
        /** @type {Vector2} */
        this.dim = dim;
        /** @type {Vector2} */
        this.tileDim = tileDim;
        /** @type {Vector2} */
        this.tileSpacing = tileSpacing;

        /** @type {Tile[][]} */
        this.tiles = [];

        // grid initialization
        for (let x = 0; x < dim.x; x++) {
            let row = [];
            for (let y = 0; y < dim.y; y++) {
                row.push(new Tile(this.pos.x + (x * (tileDim.x + tileSpacing.x)), this.pos.y + (y * (tileDim.y + tileSpacing.y)), tileDim.x, tileDim.y));
            }
            this.tiles.push(row);
        }

        console.log(this.tiles);
    }

    update() {
        for (let x = 0; x < this.dim.x; x++) {
            for (let y = 0; y < this.dim.y; y++) {
                this.tiles[x][y].update();
            }
        }
    }

    render() {
        for (let x = 0; x < this.dim.x; x++) {
            for (let y = 0; y < this.dim.y; y++) {
                this.tiles[x][y].render();
            }
        }
    }

    click() {
        for (let x = 0; x < this.dim.x; x++) {
            for (let y = 0; y < this.dim.y; y++) {
                this.tiles[x][y].click();
            }
        }
    }

    press() {
        for (let x = 0; x < this.dim.x; x++) {
            for (let y = 0; y < this.dim.y; y++) {
                this.tiles[x][y].press();
            }
        }
    }
}



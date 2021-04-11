class ControlObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.collider = new RectangleCollider(x, y, width, height);
        this.isHovering = false;

        this.onMouseClick = () => {
            console.log('click');
        };

        this.onMousePress = () => {
            console.log('press');
        };

        this.onMouseHover = () => {
            console.log('hover');
        };
    }

    update() {
        if (this.collider.collides(new RectangleCollider(mouseX, mouseY, mouseColliderWidth, mouseColliderHeight))) {
            this.onMouseHover();
            this.isHovering = true;
        }
        else {
            this.isHovering = false;
        }
    }
}

class Button extends ControlObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    update() {
        super.update();
    }

    render() {
        // draw
        fill(color(0));
        noStroke();
        rect(this.x, this.y, this.width, this.height);
        fill(color(255));
    }

    click() {
        if (this.isHovering)
            this.onMouseClick();
    }

    pressed() {
        if (this.isHovering)
            this.onMousePress();
    }
}

class TTTBoard {
    constructor(x, y, mapSizeX, mapSizeY, tileWidth, tileHeight, tileMarginX, tileMarginY) {
        this.x = x;
        this.y = y;
        this.mapSizeX = mapSizeX;
        this.mapSizeY = mapSizeY;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileMarginX = tileMarginX;
        this.tileMarginY = tileMarginY;

        this.tiles = [];

        for (let i = 0; i < mapSizeX; i++) {
            let row = [];
            for (let j = 0; j < mapSizeY; j++) {
                let button = new Button(x + ((tileMarginX + tileWidth) * i), y + ((tileMarginY + tileHeight) * j), tileWidth, tileHeight);

                button.onMouseClick = () => {
                    //  trigger server code
                    button.render = () => {
                        fill(color(255));
                        noStroke();
                        rect(button.x, button.y, button.width, button.height);
                        fill(color(255));
                    }
                };
                row.push(button);
            }
            this.tiles.push(row);
        }
    }

    update() {
        for (let i = 0; i < this.mapSizeX; i++) {
            for (let j = 0; j < this.mapSizeY; j++) {
                this.tiles[i][j].update();
            }
        }
    }

    render() {
        for (let i = 0; i < this.mapSizeX; i++) {
            for (let j = 0; j < this.mapSizeY; j++) {
                this.tiles[i][j].render();
            }
        }
    }

    click() {
        for (let i = 0; i < this.mapSizeX; i++) {
            for (let j = 0; j < this.mapSizeY; j++) {
                this.tiles[i][j].click();
            }
        }
    }

    pressed() {
        for (let i = 0; i < this.mapSizeX; i++) {
            for (let j = 0; j < this.mapSizeY; j++) {
                this.tiles[i][j].pressed();
            }
        }
    }
}
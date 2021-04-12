class Container {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Drawable extends Container {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}

class Tile extends Drawable {
    constructor(x, y, width, height) {
        super(x, y, width, height);

        this.collider = new RectangleCollider(x, y, width, height);
        this.isClicked = false;
        this.isHovering = false;

        this.color = color(100);
        this.type = '';

        this.onClick = () => {

        }
        this.onPress = () => {

        }
    }

    update() {
        if (this.collider.collides(new RectangleCollider(mouseX, mouseY, mouseCollider.x, mouseCollider.y)))
            this.isHovering = true;
        else
            this.isHovering = false;
    }

    click() {
        if (this.isHovering)
            this.onClick();
    }

    press() {
        if (this.isHovering)
            this.onPress();
    }

    render() {
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
        
        fill(color(255));
        textSize(100);
        text(this.type, this.x + 10, this.y + 85);
    }

    updateTile(state) {
        console.log('updating tile', state);
        // if (state == 'X') 
        //     this.color = color(100);
        // else if (state == 'O')
        //     this.color = color(0);
        // else
        //     this.color = color(255);

        this.type = state;
        
    }
}


class TileGrid extends Container {
    constructor(x, y, mapWidth, mapHeight, tileWidth, tileHeight, marginX, marginY) {
        super(x, y);
        this.mapDim = { x: mapWidth, y: mapHeight };
        this.tileDim = { x: tileWidth, y: tileHeight };
        this.margin = { x: marginX, y: marginY };
        this.tiles = [];

        for (let i = 0; i < this.mapDim.x; i++) {
            let row = [];
            for (let j = 0; j < this.mapDim.y; j++) {
                let tile = new Tile(
                    (i * (this.tileDim.x + this.margin.x)) + this.margin.x + this.x,
                    (j * (this.tileDim.y + this.margin.y)) + this.margin.y + this.y,
                    this.tileDim.x,
                    this.tileDim.y
                );

                tile.onClick = () => {
                    console.log('clicked at ', i, j);
                    console.log('sending to server');
                    isTurn = false;
                    socket.emit('send_move', {
                        id: sessionStorage.getItem('TTTuserId'),
                        move : {
                            x : i,
                            y : j
                        }
                    })
                }

                row.push(tile);
            }

            this.tiles.push(row);
        }
    }

    update() {
        for (let x = 0; x < this.mapDim.x; x++) {
            for (let y = 0; y < this.mapDim.y; y++) {
                this.tiles[x][y].update();
            }
        }
    }

    click() {
        for (let x = 0; x < this.mapDim.x; x++) {
            for (let y = 0; y < this.mapDim.y; y++) {
                this.tiles[x][y].click();
            }
        }
    }

    press() {
        for (let x = 0; x < this.mapDim.x; x++) {
            for (let y = 0; y < this.mapDim.y; y++) {
                this.tiles[x][y].press();
            }
        }
    }

    render() {
        for (let x = 0; x < this.mapDim.x; x++) {
            for (let y = 0; y < this.mapDim.y; y++) {
                this.tiles[x][y].render();
            }
        }
    }

    updateGrid(board) {
        for (let x = 0; x < this.mapDim.x; x++) {
            for (let y = 0; y < this.mapDim.y; y++) {
                this.tiles[x][y].updateTile(board[x][y]);
            }
        }
    }
}

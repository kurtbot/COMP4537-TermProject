let tiles = [];
let grid;
let timer = 0;

let board;
let cnv;

let showLeave = false;
let leaveButton;

function setup() {
    cnv = createCanvas(500, 500);
    // board = new Button(0, 0, 100, 100);
    board = new TileGrid(10, 10, 3, 3, 100, 100, 10, 10);
    leaveButton = new Tile(100, 100, 300, 100);
    leaveButton.onClick = () => {
        if (showLeave)
            window.location.href = 'index.html';
    }
    leaveButton.type = 'LEAVE';
}

function update() {
    camvasOffsetX = windowWidth / 2 - width / 2;
    canvasOffsetY = windowHeight / 2 - height / 2;
    cnv.position(canvasOffsetX, canvasOffsetY, 'fixed');

    board.update();
    leaveButton.update();
}

function render() {
    board.render();

    if (!isTurn) {
        fill(color('black'))
        text('waiting...', 250, 250)
    }

    if (showLeave) {
        leaveButton.render();
    }
}

function draw() {

    // background
    background(color(100, 149, 237));

    // update
    update();

    // render
    render();

}

function mouseClicked(e) {
    if (isTurn)
        board.click();

    leaveButton.click();
}

function mousePressed(e) {
    if (isTurn)
        board.press();

    leaveButton.press();
}
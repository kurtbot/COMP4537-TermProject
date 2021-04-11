let tiles = [];
let grid;
let timer = 0;

let board;
let cnv;
function setup() {
    cnv = createCanvas(500, 500);
    // board = new Button(0, 0, 100, 100);
    board = new TTTBoard(10, 10, 3, 3, 100, 100, 10, 10);
}

function update() {

    camvasOffsetX = windowWidth/2 - width/2;
    canvasOffsetY = windowHeight/2 - height/2;

    cnv.position(canvasOffsetX, canvasOffsetY, 'fixed');

    board.update();
}

function render() {
    board.render();
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
    board.click();
}

function mousePressed(e) {
    board.pressed();
}

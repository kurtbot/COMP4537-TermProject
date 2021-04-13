let tiles = [];
let grid;
let timer = 0;

let board;
let cnv;

let showLeave = false;
let leaveButton;
let quitGame;
let screenTxt = 'waiting for opponents';
let screenTxtSize = 20;

function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    // board = new Button(0, 0, 100, 100);
    board = new TileGrid(0, 0, 3, 3, 100, 100, 10, 10);
    leaveButton = new Tile(100, 100, 300, 40);
    leaveButton.onClick = () => {
        if (showLeave)
            window.location.href = 'index.html';
    }
    leaveButton.textSize = 40;
    leaveButton.textY = 35;
    leaveButton.type = 'LEAVE';

    quitGame = new Tile(30, 30, 100, 40);
    quitGame.onClick = () => {
        window.location.href = 'index.html';
    }
    quitGame.textSize = 40;
    quitGame.textY = 35;
    quitGame.type = 'QUIT';
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    leaveButton.x = windowWidth / 2 - leaveButton.width / 2
    leaveButton.y = windowHeight / 2 - leaveButton.height
    leaveButton.width = textWidth(leaveButton.type);
    board.center();
}

function update() {
    camvasOffsetX = windowWidth / 2 - width / 2;
    canvasOffsetY = windowHeight / 2 - height / 2;
    leaveButton.x = windowWidth / 2 - leaveButton.width / 2
    leaveButton.y = windowHeight / 2 + 40

    textSize(leaveButton.textSize);
    leaveButton.width = textWidth(leaveButton.type) + 10;
    cnv.position(canvasOffsetX, canvasOffsetY, 'fixed');

    board.update();
    leaveButton.update();
    quitGame.update();
}

function render() {
    if (showLeave) {
        leaveButton.render();
    } else
        board.render();

    if (!isTurn) {
        fill(color('white'))
        textSize(screenTxtSize);
        let txtWidth = textWidth(screenTxt);
        // let txtHeight = textHeight(txt);
        text(screenTxt, windowWidth / 2 - txtWidth / 2, windowHeight / 2)
    }

    if(!showLeave)
    quitGame.render();
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

    if (!showLeave)
        quitGame.click();
}

function mousePressed(e) {
    if (isTurn)
        board.press();

    leaveButton.press();

    if (!showLeave)
        quitGame.press();
}
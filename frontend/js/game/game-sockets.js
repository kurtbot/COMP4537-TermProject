

// join game

let userId = sessionStorage.getItem('TTTuserId'); // get user ID

if (userId == null) {
    window.location.href = 'index.html';
}

socket.emit('join game', { id: userId });

// assign type

socket.on('player_type', (msg) => {
    console.log(msg)
});


// wait for message

socket.on('waiting', (msg) => {
    if (msg.wait == 'player move') {
        console.log('waiting for player');
        screenTxt = 'waiting for opponent move'
    }
});

// your turn

socket.on('your_turn', (msg) => {
    console.log(msg);
    isTurn = true;
});

// update

socket.on('update', (msg) => {
    console.log(msg);
    board.updateGrid(msg.data);
});

// update

function leave() {
    screenTxtSize = 50;
    isTurn = false;
    showLeave = true;
    screenTxt = 'OPPONENT LEFT';
}

socket.on('end', (msg) => {
    console.log(msg);

    if (msg.end == 'win by leave') {
        // other player disconnected
        showLeave = true;
        screenTxt = 'OPPONENT LEFT';
    }

    if (msg.end == 'win') {
        screenTxt = 'you win'.toUpperCase();
    }

    if (msg.end == 'lose') {
        screenTxt = 'you lose'.toUpperCase();

    }

    if (msg.end == 'draw') {
        screenTxt = 'draw'.toUpperCase();

    }

    screenTxtSize = windowWidth/10;
    isTurn = false;
    showLeave = true;
});

// error

socket.on('error', msg => {
    console.log(msg);

    if (msg.err == 'invalid id') {
        console.error('user id is missing');
        sessionStorage.removeItem('TTTuserId');
    }

    if (msg.err == 'match not found')
        console.error('match not found');


})

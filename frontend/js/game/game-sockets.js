

// join game

let userId = sessionStorage.getItem('TTTuserId'); // get user ID

socket.emit('join game', { id: userId });

// assign type

socket.on('player_type', (msg) => {
    console.log(msg)
});


// wait for message

socket.on('waiting', (msg) => {
    if(msg.wait == 'player move')
        console.log('waiting for player');
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

socket.on('end', (msg) => {
    console.log(msg);
    
    if(msg.end == 'win by leave') {
        // other player disconnected
        showLeave = true;
    }
});

// error

socket.on('error', msg => {
    console.log(msg);
    
    if (msg.err == 'invalid id')
    console.error('user id is missing');
    
    if (msg.err == 'match not found')
        console.error('match not found');

    
})

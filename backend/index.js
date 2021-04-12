// ====================================
// EXPRESS
// ====================================

const express = require('express'); // get the express node module
const app = express(); // setup the http server

// setup app server
app.use(express.urlencoded({ extended: true })) // parses url data
app.use(express.json()); // parses request data in to json format


// allows communication with unknown clients
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
app.use(express.static('public'));

const endPointRoot = '';

// ====================================
// MYSQL DATABASE
// ====================================

const mysql = require('mysql');
const db = mysql.createConnection({ // pass in connection options
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fuckit'
});

/**
 * user for main server
 * user: "kmilanca_user1",
 * password: "ISFd?xp}ZbUK",
 * database : 'kmilanca_termproject-ships'
 */

// ====================================
// HELPER FUNCTION
// ====================================

function queryIncrement(uri, type) {
    let ret = new Promise((resolve, reject) => {
        let query = `insert into queries (uri, type, \`stat\`) values ("${uri}", "${type}", 1) on duplicate key update \`stat\` = \`stat\` + 1;`;
        db.query(query, (err, result) => {
            if (err) throw err;
            resolve('');
        });
    });

    return ret;
}


// ====================================
// EXPRESS EVENTS
// ====================================

// [GET]
// Gets admin stats
app.get(endPointRoot + '/queries', (req, res) => {
    let query = `select * from queries order by type asc;`
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


// ADMIN: Gets all users' information
app.get(endPointRoot + '/user', (req, res) => {
    let query;
    queryIncrement(endPointRoot + '/user', 'get').then((resp) => {
        query = `select * from users;`
        db.query(query, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

// Gets a specific user's information
app.get(endPointRoot + '/user/:userId', (req, res) => {
    let query;
    let userId = req.params.userId;
    queryIncrement(endPointRoot + '/user/:userId', 'get').then((resp) => {
        query = `select * from users where userId = "${userId}"`
        db.query(query, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
})

// TODO: Gets matches for a specific user
// app.get(endPointRoot + '/match/:userId', (req, res) => {
//     let query;
//     queryIncrement(endPointRoot + '/user/:userId', 'get').then((resp) => {

//     });
// })

// Get Request for leaderboard
app.get(endPointRoot + '/leaderboard', (req, res) => {
    let query;
    queryIncrement(endPointRoot + '/leaderboard', 'get').then((resp) => {
        query = `select * from users order by elo desc limit 25`
        db.query(query, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    });
})


// [POST]
// A user logs in
app.post(endPointRoot + '/login', (req, res) => {
    let query;
    // Updates queries for admin
    queryIncrement(endPointRoot + '/login', 'post').then((resp) => {
        let email = req.body.email;
        let password = req.body.password;
        query = `select * from users
                    where email = "${email}" and password = "${password}";`
        db.query(query, (err, result) => {
            if (err) throw err;

            if (result.length)
                res.json(result);
            else
                res.json({ status: 404 })
        });
    })
})

// Sign Up User
app.post(endPointRoot + '/user', (req, res) => {
    let query;
    queryIncrement(endPointRoot + '/user', 'post').then((resp) => {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        query = `insert into users (email, username, password) values ("${email}", "${username}", "${password}");`;
        let ret = {};
        db.query(query, (err, result) => {
            if (err) throw err;
            ret['insertId'] = result.insertId;
            ret['elo'] = 0;
            res.json(ret);
        });
    });
});


app.post(endPointRoot + '/match', (req, res) => {
    queryIncrement(endPointRoot + '/match', 'post').then((resp) => {
        let player1 = req.body.p1;
        let player2 = req.body.p2;
        let win = req.body.win;
        let query = `insert into matches (user1Id, user2Id, winner) values (${player1, player2, win})`;

    })
});

// [PUT]
// Updates a user
app.put(endPointRoot + '/user', (req, res) => {
    let query;
    console.log(req.body);
    let userId = req.body.userId;
    let username = req.body.username;
    let password = req.body.password;
    let isAdmin = req.body.isAdmin;
    queryIncrement(endPointRoot + '/user', 'put').then((resp) => {
        query = `UPDATE users SET username = "${username}", password = "${password}", isAdmin = "${isAdmin}" WHERE userId = ${userId};`;
        db.query(query, (err, result) => {
            if (err) throw err;
        })
        res.send('');
    })
});

// [DELETE]
// Deletes a user
app.delete(endPointRoot + '/user', (req, res) => {
    let query;
    let id = req.body.userId;
    queryIncrement(endPointRoot + '/user', 'delete').then((resp) => {
        query = `DELETE FROM users WHERE userId = ${id}`
        db.query(query, (err, result) => {
            if (err) throw err;
            res.json(result);
        })
    });
});

// ====================================
// LISTEN FOR CLIENTS
// ====================================

const port = process.env.PORT || 8888;


// ====================================
// SOCKET IO
// ====================================

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get(endPointRoot + '/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

function Player(id, socketId, socket) {
    this.id = id;
    this.socketId = socketId;
    this.socket = socket;
    this.playerType = '';
}

function Match(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.turn = 1;
    this.winner = -1;

    this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    this.sendBoard = () => {
        this.p1.socket.emit('update', { data: this.board });
        this.p2.socket.emit('update', { data: this.board });
    };

    this.verifyMove = (id, move) => {
        if (this.board[move.x][move.y] == '') {
            if (id == this.p1.id) {
                console.log('assign p1', this.p1.playerType);
                this.board[move.x][move.y] = this.p1.playerType
            } else if (id == this.p2.id) {
                console.log('assign p2', this.p2.playerType);
                this.board[move.x][move.y] = this.p2.playerType
            }
            this.changeTurn();
            return true;
        }
        else {
            this.tryAgain();
            return false;
        }
    };

    this.changeTurn = () => {
        this.turn = (this.turn == 1) ? 2 : 1;

        if (this.turn == 1) {
            this.p1.socket.emit('your_turn', {});
            this.p2.socket.emit('waiting', { wait: 'player move' });
        }
        else {
            this.p2.socket.emit('your_turn', {});
            this.p1.socket.emit('waiting', { wait: 'player move' });
        }
    }

    this.checkBoard = () => {

        // check row

        // check col

        // check diag



        return -1;
    };

    this.saveMatch = () => {

        // save the match data
        // update w/l/d for players
        // update elo for players

        let query = `insert into matches (user1Id, user2Id, winner) values (${this.p1.id}, ${this.p2.id}, ${this.winner})`;
        db.query(query, (err, result) => {
            if (err) throw err;
        })



    };

    this.tryAgain = () => {
        if (this.turn == 1) {
            this.p1.socket.emit('your_turn', {});
        }
        else {
            this.p2.socket.emit('your_turn', {});
        }
    }

    this.endGame = (chicken) => {
        if (this.p1.socketId == chicken) {
            this.winner = this.p2.id;
            this.p2.socket.emit('end', { end: 'win by leave' });
            this.p1.socket = null
        }
        else {
            this.winner = this.p1.id;
            this.p1.socket.emit('end', { end: 'win by leave' });
            this.p2.socket = null
        }
        this.saveMatch();
    }

    let rando = Math.floor(Math.random() * 2) + 1;
    if (rando == 1) {
        p1.socket.emit('player_type', { playerType: 'O' });
        p1.socket.emit('your_turn', {});
        p2.socket.emit('player_type', { playerType: 'X' });
        this.p1.playerType = 'O';
        this.p2.playerType = 'X';
        this.turn = 1;
    } else {
        p1.socket.emit('player_type', { playerType: 'X' });
        p2.socket.emit('your_turn', {});
        p2.socket.emit('player_type', { playerType: 'O' });
        this.p1.playerType = 'X';
        this.p2.playerType = 'O';
        this.turn = 2;
    }
}


/** @type {Match} */
let matches = [];
let userList = [];
let waiting = null;

function lookForMatch(id) {
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].p1.socketId == id || matches[i].p2.socketId == id)
            return matches[i];
    }
    return null;
}

function clearMatches() {
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].p1.socketId == null || matches[i].p2.socketId == null) {
            matches.splice(i, 1);
            i--;
        }
    }
    console.log(matches);
}

io.on('connection', (socket) => {
    socket.on('join game', msg => {
        userList.push(new Player(msg.id, socket.id, socket));
        console.log('join game', msg);
        if (msg.id == null) {
            socket.emit('error', { err: 422 })
        }
        else {
            if (waiting) {
                console.log(waiting.id);
                console.log('match create');
                matches.push(new Match(waiting, new Player(msg.id, socket.id, socket)))
                waiting = null;
            }
            else {
                waiting = new Player(msg.id, socket.id, socket);
            }
        }
    });

    socket.on('send_move', msg => {

        if (userList.includes(socket))
            console.log('receive', msg);

        if (!msg.id)
            console.log('changeGame', msg);

        let match = lookForMatch(socket.id);

        if (match != null) {
            if (match.verifyMove(msg.id, msg.move)) {
                let winner = match.checkBoard();

                console.log('board data', match.board);

                if (winner == 1) {
                    match.p1.socket.emit('end', { end: 'win' });   // end win p1
                    match.p2.socket.emit('end', { end: 'lose' });   // end lose p2
                }
                else if (winner == 2) {
                    match.p2.socket.emit('end', { end: 'win' });   // end win p2
                    match.p1.socket.emit('end', { end: 'lose' });   // end lose p1
                }
                else if (winner == 0) {
                    match.p1.socket.emit('end', { end: 'draw' });   // end draw p1
                    match.p2.socket.emit('end', { end: 'draw' });   // end draw p2
                }
                else if (winner == -1) {
                    match.sendBoard();
                    // socket.emit('update', { board: match.board });   // update
                }
            }
            else {
                socket.emit('try_again', { err: 'move exists in board' }); // try again
            }
        }
        else {
            socket.emit('error', { err: 'match not found' });
        }

    });

    socket.on('disconnect', msg => {
        console.log('disconnect', msg);

        let match = lookForMatch(socket.id);

        console.log(match);

        if (match.p1.socket && match.p2.socket)
            match.endGame(socket.id);

        // for (let i = 0; i < matches.length; i++) {
        //     if (matches[i].p1.socketId == socket.id || matches[i].p2.socketId == socket.id) {
        //         matches.splice(i, 1);
        //     }
        // }

        for (let i = 0; i < userList.length; i++) {
            if (userList[i].socketId == socket.id) {
                userList.splice(i, 1);
                break;
            }
        }

        clearMatches();

    });

});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Who are you?', name => {
    console.log(`Hey there ${name}!`);
    readline.close();
});

// both clients connect sending their username which are unique to the server
// client needs to know who their opponent is so the client can provide
// the data for the server's other target client]
// 

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
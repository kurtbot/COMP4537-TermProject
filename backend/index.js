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
    database: 'test'
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
app.get(endPointRoot + '/queries', (req, res) => {
    let query = `select * from queries;`
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
app.put(endPointRoot + '/user', (req, res) => {
    let query;
    console.log(req.body);
    let userId = req.body.userId;
    let username = req.body.username;
    let password = req.body.password;
    queryIncrement(endPointRoot + '/user', 'put').then((resp) => {
        query = `UPDATE users SET username = "${username}", password = "${password}" WHERE userId = ${userId};`;
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

function Player(id, socket) {
    this.id = id;
    this.socket = socket;
}

function Match(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.turn = 1;
    this.board = [[], [], []];

    this.sendBoard = () => {
        this.p1Socket.emit('update board', { data: this.board });
        this.p2Socket.emit('update board', { data: this.board });
    };

    this.verifyMove = (move) => {
        if (this.board.includes(move))
            return true;
        else
            return false;
    };

    this.checkBoard = () => {

    };

    this.saveMatch = () => {

        // save the match data

        // update w/l/d for players

        // update elo for players

    };
}


/** @type {Match} */
let matches = [];
let waiting = null;

function lookForMatch(id) {
    for (let i = 0; i < matches.length; i++) {
        if (matches[i].p1.id == id || matches[i].p2.id == id)
            return matches[i];
    }
    return null;
}

io.on('connection', (socket) => {
    socket.on('join game', msg => {
        console.log('join game', msg);
        if (msg.id == null) {
            socket.emit('error', { err: 422 })
        }
        else {
            if (waiting) {
                // matches.push(new Match())
                console.log('match create');
            }
            else {
                waiting = msg;
            }
        }
    });

    socket.on('move', msg => {

        if (!msg.id)
            console.log('changeGame');

        let match = lookForMatch(msg.id);

        if (match != null) {
            // if true update client else send error to client
            if (match.checkMove(msg.move))
                socket.emit('update', { board: match.board });   // update
            else
                socket.emit('error', { err: 9 });                // try again
        }
        else {
            socket.emit('error', { err: 423 });
        }

    });

    socket.on('disconnect', msg => {
        console.log('disconnect');
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
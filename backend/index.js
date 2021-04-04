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

const endPointRoot = '';

// ====================================
// MYSQL DATABASE
// ====================================

const mysql = require('mysql');
const db = mysql.createConnection({ // pass in connection options
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'battleships'
});

/**
 * user for main server
 * user: "kmilanca_user1",
 * password: "ISFd?xp}ZbUK",
 * database : 'kmilanca_termproject-ships'
 */

// ====================================
// EXPRESS EVENTS
// ====================================

app.get('/user', (req, res) => {

    let query = `select * from users;`;

    db.query(query, (err, result) => {
        if(err) throw err;
        // res.send() // usually sends a string data
        // res.json() // sends a json data
        res.json(result);
    });
});

app.post('/user', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    let query = `insert into users (username, password, elo) values ("${username}", "${password}", 0);`;

    let ret = {};
    db.query(query, (err, result) => {

        ret['insertId'] = result.insertId;
        ret['elo'] = 0;
        res.json(ret);
    });
});

app.put('/user', (req, res) => {
    res.send('');
});

app.delete('/user', (req, res) => {
    res.send('');
});

// ====================================
// LISTEN FOR CLIENTS
// ====================================

const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

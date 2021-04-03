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
    database : 'termproject-ships'
});

// ====================================
// EXPRESS EVENTS
// ====================================

/**
 * req - usually the client
 * res - server sending something to client
 */

app.get('/trigger', (req, res) => {
    
    let sqlCmd = 'select * from quotes';

    // do sql command in the database query
    db.query(sqlCmd, (err, result) => {
        if(err) throw err;
        // res.send() // usually sends a string data
        // res.json() // sends a json data
        // res.json(result);
        res.send(result);
    })

});

app.post('/trigger', (req, res) => {
    // let quoteBody = req.body['quote_body']
    let quoteBody = req.body.quote_body;
    let quoteSource = req.body.quote_source;

    // let sqlCmd = 'insert into quotes (quote_body, quote_source) values ("' + quoteBody + '","' + quoteSource + '");' ;

    // could use this format too that way we don't have to worry about "+" signs
    let sqlCmd2 = `insert into quotes (quote_body, quote_source) values ("${quoteBody}", "${quoteSource}");`;


    // `insert into table (value) values (value1), (value2), (value3); `

    // do sql command in the database query
    db.query(sqlCmd2, (err, result) => {
        if(err) throw err;
        // res.send() // usually sends a string data
        // res.json() // sends a json data
        res.json(result);
    })

});


// ====================================
// LISTEN FOR CLIENTS
// ====================================

const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

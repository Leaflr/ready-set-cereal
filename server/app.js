'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');

var socketIO = require('socket.io');

var mysql = require('mysql');

var connection = mysql.createConnection('mysql://rsc:g00dbyeworld!@leaflr.com/rsc?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');
// var connection = mysql.createConnection('mysql://root:root@localhost/root?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database: 'rsc',
//   port: 8889
// });
// init express
var app = express();

var server = http.createServer(app);

var io = socketIO.listen(server);

app.configure(function(){
    app.set('port', 9005);
    app.use(express.bodyParser());
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
});

// set logging
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

// mount static
app.use(express.static( path.join( __dirname, '../app') ));
app.use(express.static( path.join( __dirname, '../.tmp') ));

connection.connect(function(err) {
	console.log(err)
});

// connection.query('DROP TABLE users', function(err, result){
// 	console.log(result)
// })
// 

// connection.query('CREATE TABLE orders (id int(8) NOT NULL AUTO_INCREMENT, milk varchar(100) NOT NULL, c1 int(8) NOT NULL, c2 int(8) NOT NULL, c3 int(8) NOT NULL, spoon varchar(100) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, status varchar(100) NOT NULL, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });


// connection.query('CREATE TABLE status (id int(8) NOT NULL AUTO_INCREMENT, milk_temp varchar(100) NOT NULL, status varchar(100) NOT NULL, sensor varchar(100) NOT NULL, order_id int(8) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });


// connection.query('CREATE TABLE ranks (id int(8) NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });

// connection.query('CREATE TABLE users (user_id int(8) AUTO_INCREMENT NOT NULL, name varchar(100) NOT NULL, rank_name varchar(100) NOT NULL, rank int(8), bowls int(8) NOT NULL, active_order_id int(8) NOT NULL, PRIMARY KEY (user_id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });

// connection.end();

// route index.html
app.get('/', function(req, res){
  res.sendfile( path.join( __dirname, '../app/index.html' ) );
});

app.get('/machine', function(req, res){
  res.sendfile( path.join( __dirname, '../app/machine.html' ) );
});

// mysql updates

// check machine status/info
var interval;
var mockId = 10;

function checkStatus( type, res ){
	var data = {}

	connection.query('SELECT * FROM current_status', function( err, results ){
		// console.log('error', err);
		data.status = results;
		// mockId++;		
		// data.status[0]['order_id'] = mockId;
          connection.query('SELECT * FROM pending_orders WHERE status = ?', ['pending'] ,function( err, results ){
            // console.log('error', err);
            data.orders = results;

            if ( type == 'res' )
                res.send( data );
            else if ( type == 'socket' ){
                console.log(data)
                io.sockets.emit('status', data);
            }
                
        });
	});
	

	
}

interval = setInterval(function(){
	checkStatus('socket');
}, 5000);

app.get('/status', function( req, res ){
	checkStatus('res', res)
});

// gets all orders if no id is specified
app.get('/orders/:id', function( req, res ){
	connection.query('SELECT * FROM pending_orders WHERE id = ?', req.params.id, function( err, results ){
		// console.log('error', err);
		res.send( results )
	});
});

// gets all orders if no id is specified
app.get('/orders', function( req, res ){
	connection.query('SELECT * FROM pending_orders', function( err, results ){
		// console.log('error', err);
		res.send( results )
	});
});

// gets all orders if no id is specified
app.get('/completed_orders', function( req, res ){
	connection.query('SELECT * FROM completed_orders', function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// get leaderboard
app.get('/users', function( req, res ){
	connection.query('SELECT * FROM users order by bowls desc LIMIT 6', function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// get leaderboard
app.get('/users-list', function( req, res ){
    connection.query('SELECT COUNT(*) FROM users', function( err, results ){
        console.log('error', err);
        res.send( results )
    });
});

// get user info
app.get('/user/:id', function( req, res ){
	connection.query('SELECT * FROM users WHERE user_id = ?', req.params.id, function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

app.post('/user_name/:id', function( req ,res ){
	connection.query('UPDATE users SET name = ? , bowls = ? , rank = ? WHERE user_id = ?', [ req.body.name, req.body.bowls, req.body.rank, req.params.id ], function( err, results ){
		console.log('error users', err);
		console.log('users', results)
		res.send( results )
	});
});

app.post('/new_user', function( req, res ){
	
	connection.query('INSERT INTO users SET ?', req.body, function(err, result) {
  		console.log(req.body)
  		console.log( err, result)
  		res.send( {result:result, err: err, req: req.body} );
	});
});

// a new order is entered
app.post('/new_order', function( req, res ){
	connection.query('INSERT INTO pending_orders SET ?', req.body, function(err, result) {
  		res.send( result );
	});
});

// skips to next order if there is a wait
app.post('/skip_order', function( req, res ){
	connection.query('DELETE FROM pending_orders WHERE timestamp IS NOT NULL order by timestamp desc LIMIT 1', function( err, results ){
		
	});
});

// user cancels their order
app.post('/cancel_order/:id', function( req, res ){
	connection.query('DELETE * FROM pending_orders WHERE id=' + connection.escape(req.params.id), function( err, results ){
		
	});
});



// start server
server.listen(9005, function(){
    console.log('Express App started!');
});




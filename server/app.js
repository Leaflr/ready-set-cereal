'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');

var socketIO = require('socket.io');

var mysql = require('mysql');

var connection = mysql.createConnection('mysql://rsc:g00dbyeworld!@leaflr.com/rsc?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

// init express
var app = express();

var server = http.createServer(app);

var io = socketIO.listen(server);

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
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

});

// connection.query('DROP TABLE users', function(err, result){
// 	console.log(result)
// })
// create orders table
// connection.query('CREATE TABLE orders (id int(8) NOT NULL AUTO_INCREMENT, milk varchar(100) NOT NULL, c1 int(8) NOT NULL, c2 int(8) NOT NULL, c3 int(8) NOT NULL, spoon varchar(100) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, status varchar(100) NOT NULL, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });

// // create status table
// connection.query('CREATE TABLE status (id int(8) NOT NULL AUTO_INCREMENT, milk_temp varchar(100) NOT NULL, status varchar(100) NOT NULL, sensor varchar(100) NOT NULL, order_id int(8) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });

// // create ranks table
// connection.query('CREATE TABLE ranks (id int(8) NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
// 	console.log('error', err, 'results', results);
// });

// create ranks table
// connection.query('CREATE TABLE users (id int(8) NOT NULL AUTO_INCREMENT, name varchar(100) NOT NULL, rank_name varchar(100) NOT NULL, rank varchar(100) NOT NULL, active_order_id int(8) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
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

interval = setInterval(function(){
	connection.query('SELECT * FROM current_status', function( err, results ){
		console.log('error', err);
    	io.sockets.emit('status', results);
	});
}, 5000);

app.get('/status', function( req, res ){
	connection.query('SELECT * FROM current_status', function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// gets all orders if no id is specified
app.get('/orders/:id', function( req, res ){
	connection.query('SELECT * FROM pending_orders WHERE id = ?', req.params.id, function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// gets all orders if no id is specified
app.get('/orders', function( req, res ){
	connection.query('SELECT * FROM pending_orders', function( err, results ){
		console.log('error', err);
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
	connection.query('SELECT * FROM users order by rank desc LIMIT 6', function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// get user info
app.get('/user/:id', function( req, res ){
	connection.query('SELECT * FROM users WHERE id = ?', req.params.id, function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

app.post('/new_user', function( req, res ){
	connection.query('INSERT INTO users VALUES ?', req.body, function(err, result) {
  		console.log(req.body)
  		console.log( err, result)
  		// res.send( result );
	});
});

// a new order is entered
app.post('/new_order', function( req, res ){
	connection.query('INSERT INTO pending_orders VALUES (?)', req.body, function(err, result) {
  		console.log(err, result, req.body)
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




'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');

var socketIO = require('socket.io');

var mysql = require('mysql');

var connection = mysql.createConnection('mysql://rsc:g00byeworld!@leaflr.com/rsc?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

// init express
var app = express();

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

// // create ranks table
// connection.query('CREATE TABLE user (id int(8) NOT NULL AUTO_INCREMENT, rank varchar(100) NOT NULL, time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) )', function( err, results ){
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

// get ranks
app.get('/ranks/:id', function( req, res ){

	var query;

	if ( req.params.id )
		query = 'SELECT * FROM ranks WHERE id=' + connection.escape(req.params.id);
	else
		query = 'SELECT * FROM ranks';

	connection.query(query, function( err, results ){
		console.log('error', err);
		res.send( results )
	});

});

// check machine status/info
app.get('/status', function( req, res ){
	connection.query('SELECT * FROM current-status', function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// gets all orders if no id is specified
app.get('/orders/:id', function( req, res ){

	var query;

	if ( req.params.id )
		query = 'SELECT * FROM pending-orders WHERE id=' + connection.escape(req.params.id);
	else
		query = 'SELECT * FROM pending-orders';

	connection.query(query, function( err, results ){
		console.log('error', err);
		res.send( results )
	});

});

// gets all orders if no id is specified
app.get('/completed_orders/:id', function( req, res ){

	var query;

	if ( req.params.id )
		query = 'SELECT * FROM completed-orders WHERE id=' + connection.escape(req.params.id);
	else
		query = 'SELECT * FROM completed-orders';

	connection.query(query, function( err, results ){
		console.log('error', err);
		res.send( results )
	});

});

// get user info
app.get('/user/:id', function( req, res ){
	connection.query('SELECT * FROM users WHERE id=' + connection.escape(req.params.id), function( err, results ){
		console.log('error', err);
		res.send( results )
	});
});

// a new order is entered
app.post('/new_order', function( req, res ){
	connection.query('INSERT INTO pending-orders SET ?', req.body, function(err, result) {
  		
	});
});

// skips to next order if there is a wait
app.post('/skip_order', function( req, res ){
	connection.query('DELETE FROM pending-orders WHERE timestamp IS NOT NULL order by timestamp desc LIMIT 1', function( err, results ){
		
	});
});

// user cancels their order
app.post('/cancel_order/:id', function( req, res ){
	connection.query('DELETE * FROM pending-orders WHERE id=' + connection.escape(req.params.id), function( err, results ){
		
	});
});



// start server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express App started!');
});




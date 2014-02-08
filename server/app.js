'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
var hbs = require('express-hbs');

var socketIO = require('socket.io');

var mysql = require('mysql');

var connection = mysql.createConnection('mysql://root:root@127.0.0.1:8889/rsc?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');

// init express
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);

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

connection.end();

// route index.html
app.get('/', function(req, res){
  res.sendfile( path.join( __dirname, '../app/index.html' ) );
});

app.get('/machine', function(req, res){
  res.sendfile( path.join( __dirname, '../app/machine.html' ) );
});



// mysql updates

// check machine status/info
app.get('/status', function( req, res ){

});

// gets all orders if no id is specified
app.get('/orders/:id', function( req, res ){

});

// get user info
app.get('/user', function( req, res ){

});

// a new order is entered
app.post('/new_order', function( req, res ){

});

// skips to next order if there is a wait
app.post('/skip_order', function( req, res ){

});

// user cancels their order
app.post('/cancel_order/:id', function( req, res ){
	
});



// start server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express App started!');
});




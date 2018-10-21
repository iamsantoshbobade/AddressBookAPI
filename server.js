/**
 *  @author Santosh Bobade
 *  @file:  server.js
 * 
 *  This file serves as the entry point to the Address Book API.
 * 
 *  @see LICENSCE (ISC Licensce).
 */

var express    = require ('express');               // required for routing
var app        = express ();                        // application instance
var router     = express.Router ();                 // router instance
var constants  = require ('./constants/constants')  // constants module for application constants
var route      = require ('./routes/route');        // all the routes are mapped in this file
var bodyParser = require ('body-parser');           // body parser module for the incoming requests

app.use(bodyParser.urlencoded({ extended: true })); // configure app to use bodyParser() package
app.use(bodyParser.json());

var port = process.env.PORT || constants.DEFAULT_NODEJS_PORT_NUMBER;
app.use ('/',route);                                // set up the app to use route file
app.listen (port);                                  //start the server

console.log('Starting Address Book server on port ' + port);

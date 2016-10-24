// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan     = require('morgan'); 		// used to see requests
var path 	   = require('path');
var mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var apiRoutes = require('./routes/api')(app,express, io);

app.set('port', (process.env.PORT || 8080));

var connectedSockets = {};

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('user-connected', function (data) {
        socket.join(data._id);
        var room = io.nsps['/'].adapter.rooms[data._id];
        console.log(Object.keys(room).length + ' sessions currently in use for this user');
    })
});
// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database
//todo: random password
mongoose.connect('mongodb://moufee:asdf1132@ds055709.mongolab.com:55709/shopping-list');

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================


app.use('/api',apiRoutes);


// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
server.listen(app.get('port'));
console.log('Magic happens on port 8080' );
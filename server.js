// imports =====================================================================
var config   = require('./config'); 					 																 // load the config
var express  = require('express');																							// load express
var app 		 = express();																											 // create express app
var server   = require('http').createServer(app);															 // create webserver
var io			 = require('socket.io').listen(server);														 // create socket.io connection
var cookie   = require("cookie");
var connect  = require("connect");
var session  = require('express-session');
var MemoryStore = express.session.MemoryStore;

// configuration ===============================================================

var sessionStore = new MemoryStore();

app.configure(function() {
	app.use(express.favicon(__dirname + '/static/favicon.png'));
	app.use(express.static(__dirname + '/static')); 															// set the static files location /public/img will be /img for users
	if (config.devel) app.use(express.logger('dev')); 														// log every request to the console
	else app.use(express.logger());

	app.use(express.cookieParser(config.secret));
	app.use(session({
		store: sessionStore,
		key: config.sessIdName,
		secret: config.secret,
		cookie: { httpOnly: false, maxAge: 30*24*60*60*1000, domain: config.host }}
	));

});

io.set('authorization', function (handshakeData, accept) {
	if (handshakeData.headers.cookie) {
		handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
		if ( handshakeData.cookie[config.sessIdName] === undefined) return accept('Cookie is invalid.', false);
		handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie[config.sessIdName], config.secret);
		if (handshakeData.cookie[config.sessIdName] == handshakeData.sessionID) {
			return accept('Cookie is invalid.', false);
		}
	} else {
		return accept('No cookie transmitted.', false);
	}
	handshakeData.sessionStore = sessionStore;
	sessionStore.load(handshakeData.sessionID, function(err, sess){
		if (err || !sess || !sess.valid) {
			accept('Error when creating session: '+err, false);
		} else {
			handshakeData.session = sess;
			accept(null, true);
		}
	});
});

// Chargement de la page index.html
app.get('/', function (req, res) {
	req.session.valid = true;
	res.sendfile('static/home.html');
});

// En cas d'URL incorrecte on redirige sur la page d'accueil
app.get('*', function (req, res) {
	res.redirect("/");
});

// routes ======================================================================
require('./app/routes.js')(io);

// listen (start app with node server.js) ======================================
server.listen(config.port, config.ip);
console.log("App listening on " + config.ip + ":" + config.port);

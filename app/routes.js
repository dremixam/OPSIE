/*
var clientList = require('./models/user');
var messagesRoute = require("./routes/messages");
var messagesModel = require('./models/messages');
var fs = require('fs');
*/

module.exports = function(io) {

	io.sockets.on('connection', function (socket, pseudo) {

		// Gestion de la session
		var hs = socket.handshake;

		// setup an inteval that will keep our session fresh
		var intervalID = setInterval(function () {
			hs.session.reload( function () {
				hs.session.touch().save();
			});
		}, 60 * 1000);


		//messagesRoute(socket);





		socket.on('disconnect', function() {

			clearInterval(intervalID);
		});

	});
};

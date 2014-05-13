agenceModel = require("./routes/agence");
coproprieteModel = require("./routes/copropriete");


module.exports = function(io) {
	console.log("Chargement des routes");
	io.sockets.on('connection', function (socket, pseudo) {
		console.log("Connexion en cours, activation de la session et chargement des routes");
		// Gestion de la session
		var hs = socket.handshake;

		// setup an inteval that will keep our session fresh
		var intervalID = setInterval(function () {
			hs.session.reload( function () {
				hs.session.touch().save();
			});
		}, 60 * 1000);


		console.log("route agence");
		agenceModel(socket);
				console.log("route copropriete");
		coproprieteModel(socket);

		socket.on('disconnect', function() {
			clearInterval(intervalID);
		});

	});
};

var Agence = require('../models/agence');

module.exports = function(socket) {
  console.log("module agence chargé");
  socket.on('list-agence', function (message) {
    console.log("Cool on nous réclame la liste des agences");
    Agence.list(function(liste){
      socket.emit('list-agence', liste);
    })

  });
  socket.on('get-agence', function (message) {
    Agence.loadFromId(message, function(agence) {
      socket.emit('get-agence',agence);
    });
  });
  socket.on('add-agence', function (message) {
    console.log(message);
    agence = new Agence(null, message.nom, message.adresse, message.cp, message.ville, message.tel);
    console.log(agence);
    agence.save(function(id){
      socket.emit("inserted-agence", id);
    });
  });
};

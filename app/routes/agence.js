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
  socket.on('del-agence', function (message) {
    console.log("suppression de l'agence numéro "+message);
    Agence.deleteId(message, function(agence) {
      socket.emit('deleted-agence',message);
    });
  });
  socket.on('update-agence', function(newValues){
    Agence.loadObjectFromId(newValues.id, function(objectAgence){
      console.log("Objet chargé : "+objectAgence);
      console.log("Objet a sauvegarder : "+newValues);
      objectAgence.nom = newValues.nom;
      objectAgence.adresse = newValues.adresse;
      objectAgence.cp = newValues.cp;
      objectAgence.ville = newValues.ville;
      objectAgence.tel = newValues.tel;
      objectAgence.save(function() {
        console.log("sauvegarde");
        socket.emit('updated-agence');
      });
    });
  })
};

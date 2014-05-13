var path = require('path'),
appDir = path.dirname(require.main.filename);
var config   = require(appDir+'/config');
var oracle = require('oracle');

/*
ID_AGENCE: 0,
NOM_AGENCE: 'Menuires',
ADRESSE_AGENCE: 'rue des rues',
CP_AGENCE: '16666',
VILLE_AGENCE: 'Les Menuires',
TEL_AGENCE: '555-66666'
*/

// Constructor
function Agence(id, nom, adresse, cp, ville, tel) {
  this.id=id;
  this.nom=nom;
  this.adresse=adresse;
  this.cp=cp;
  this.ville=ville;
  this.tel=tel;
}
Agence.prototype.save = function(callbackSaved) {
  theAgence = this;
  oracle.connect(config.db, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }
    if ( theAgence.id == null ) {
      connection.execute(
        "INSERT INTO agence (NOM_AGENCE, ADRESSE_AGENCE, CP_AGENCE, VILLE_AGENCE, TEL_AGENCE) VALUES (:1, :2, :3, :4, :5) RETURNING id_agence INTO :6",
        [theAgence.nom, theAgence.adresse, theAgence.cp, theAgence.ville, theAgence.tel, new oracle.OutParam()],
        function(err, results) {
          if ( err ) { console.log(err); return; }
          // results.updateCount = 1
          // results.returnParam = the id of the person just inserted
          connection.close();
          callbackSaved(results.returnParam);
        }
      );
    } else {
      connection.execute(
        "UPDATE agence SET NOM_AGENCE=:1, ADRESSE_AGENCE=:2, CP_AGENCE=:3, VILLE_AGENCE=:4, TEL_AGENCE=:5 WHERE id_agence=:6",
        [theAgence.nom, theAgence.adresse, theAgence.cp, theAgence.ville, theAgence.tel, theAgence.id],
        function(err, results) {
          if ( err ) { console.log(err); return; }
          // results.updateCount = 1
          // results.returnParam = the id of the person just inserted
          connection.close();
          callbackSaved(results.returnParam);
        }
      );
    }

  });
}

Agence.loadObjectFromId = function(id, callback) {
  oracle.connect(config.db, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.execute("SELECT * FROM Agence WHERE id_agence=:1", [id], function(err, results) {
      if (err) { console.log("Error executing query:", err); return; }

      console.log(results[0]);

      elt = results[0];

      connection.close(); // call only when query is finished executing
      callback(new Agence(elt.ID_AGENCE, elt.NOM_AGENCE, elt.ADRESSE_AGENCE, elt.CP_AGENCE, elt.VILLE_AGENCE, elt.TEL_AGENCE));
    });
  });
}

Agence.deleteId = function(idAgence, callback) {
  oracle.connect(config.db, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.execute("DELETE FROM Agence WHERE id_agence=:1", [idAgence], function(err, results) {
      if (err) { console.log("Error executing query:", err); return; }

      console.log(results[0]);


      connection.close(); // call only when query is finished executing
      callback(results[0]);
    });
  });
}

Agence.loadFromId = function(idAgence, callback) {
  oracle.connect(config.db, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.execute("SELECT * FROM Agence WHERE id_agence=:1", [idAgence], function(err, results) {
      if (err) { console.log("Error executing query:", err); return; }

      console.log(results[0]);


      connection.close(); // call only when query is finished executing
      callback(results[0]);
    });
  });
}

Agence.list = function(callback) {
  list = [];
  oracle.connect(config.db, function(err, connection) {
    if (err) { console.log("Error connecting to db:", err); return; }

    connection.execute("SELECT * FROM Agence", [], function(err, results) {
      if (err) { console.log("Error executing query:", err); return; }

      console.log(results);
      results.forEach(function(elt){
        console.log(elt);
        list.push(new Agence(elt.ID_AGENCE, elt.NOM_AGENCE, elt.ADRESSE_AGENCE, elt.CP_AGENCE, elt.VILLE_AGENCE, elt.TEL_AGENCE));
      });

      connection.close(); // call only when query is finished executing
      callback(list);
    });
  });
}

// export the class
module.exports = Agence;

var path = require('path'),
    appDir = path.dirname(require.main.filename);
var config   = require(appDir+'/config');
var oracle = require('oracle');


// Constructor
function Copropriete() {
  this._id=null;
  this._nom=null;
  this._adresse=null;
  this._cp=null;
  this._ville=null;
}
// class methods
Copropriete.prototype.loadFromId = function(id) {
  oracle.connect(config.db, function(err, connection) {
      if (err) { console.log("Error connecting to db:", err); return; }

      connection.execute("SELECT * FROM copropriete WHERE id_copropriete=':1'", [id], function(err, results) {
          if (err) { console.log("Error executing query:", err); return; }

          console.log(results);
          connection.close(); // call only when query is finished executing
      });
  });
};

Copropriete.prototype.list = function() {
  oracle.connect(config.db, function(err, connection) {
      if (err) { console.log("Error connecting to db:", err); return; }

      connection.execute("SELECT * FROM copropriete", [], function(err, results) {
          if (err) { console.log("Error executing query:", err); return; }

          console.log(results);
          connection.close(); // call only when query is finished executing
      });
  });
}

// export the class
module.exports = Copropriete;

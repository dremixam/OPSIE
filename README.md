OPSIE
======

Code source du projet OPSIE de Maxime Mélinon et Soufiyan Yacoubi.

Il est nécéssaire d'avoir installé node.js et git avant toutes choses.

Il est également nécéssaire d'avoir installé instantclient de Oracle avec le SDK (dans /opt/instantclient dans les exemples ci dessous, à mettre où vous voulez en réalité)

Ensuite, à l'aide de npm (utilitaire d'installation de paquets node.js), il faut installer bower:

    npm install -g bower

Pour pouvoir lancer l'application en tâche de fond, il est nécéssaire d'installer le paquet forever (facultatif pour les tests)

    npm install -g forever

Déploiement :

On récupère le code source

    git clone git@github.com:dremixam/lou.lt.git
    cd lou.lt

npm va devoir compiler le driver oracle, il est nécéssaire pour cela de regler quelques variables d'environnement pour définir l'endroit où se trouve Oracle Instant Client.

    export OCI_INCLUDE_DIR=/opt/instantclient/sdk/include/
    export LD_LIBRARY_PATH=/opt/instantclient

Si vous êtes sous OSX, il est nécéssaire de définir le répertoire des librairies dynamiques.

    export DYLD_LIBRARY_PATH=/opt/instantclient

Tout devrait être bon, on installe les dépendances.

    npm install
    bower install

Ensuite, créer un fichier de configuration `config.js` avec le contenu suivant :

    module.exports = {
      // Port d'écoute de l'application
      port : 8099,
      // Titre de l'application
      title : 'OPSIE',
      // Mode debug
      devel : true,
      // Emplacement des fichiers de logs
      logfile : 'logs/access.log',
      // Interface d'écoute (mettre 127.0.0.1 pour que l'application ne soit disponible que localement, 0.0.0.0 sinon dans la plupart des cas)
      ip: '0.0.0.0',
      // Secret utilisé pour le chiffrement des sessions
      secret: 'monsecret',
      // Nom du cookie de session
      sessIdName : 'sessID',
      // Informations de la BDD Oracle (database correspond au SID)
      db : {
        hostname: 'localhost',
        port: 1521,
        user: 'user',
        password: 'password',
        database: 'sid'
      }
    }


lancement :

    node server.js

lancement en tâche de fond :

    forever start server.js


L'application est ensuite accessible à l'adresse [http://localhost:8099/] (avec la configuration par défaut).

La configuration se trouve dans config.js (ip/port d'écoute, infos database etc)

OPSIE
======

Code source du projet OPSIE de Maxime Mélinon et Soufiyan Yacoubi.

Il est nécéssaire d'avoir installé node.js et git avant toutes choses.

Ensuite, à l'aide de npm (utilitaire d'installation de paquets node.js), il faut installer bower:

    npm install -g bower

Pour pouvoir lancer l'application en tâche de fond, il est nécéssaire d'installer le paquet forever

    npm install -g forever

Déploiement :

    git clone git@github.com:dremixam/lou.lt.git
    cd lou.lt
    npm install
    bower install

lancement :
    node server.js

lancement en tâche de fond :

    forever start server.js


L'application est ensuite accessible à l'adresse [http://localhost:8099/] (avec la configuration par défaut).

La configuration se trouve dans config.js (ip/port d'écoute, infos database etc)

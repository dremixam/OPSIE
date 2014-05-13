var immoApp = angular.module('immoApp', ['ngRoute']);

immoApp.factory('socket', function ($rootScope) {
  var socket = io.connect('/');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    removeAllListeners: function() {
      socket.removeAllListeners();
    }
  };
});


//Define Routing for app
immoApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/ListAgences', {
    templateUrl: 'views/listAgence.html',
    controller: 'ListAgenceController'
  }).
  when('/EditerAgence/:agenceid', {
    templateUrl: 'views/editerAgence.html',
    controller: 'EditFormAgenceController'
  }).
  when('/ListCoproprietes', {
    templateUrl: 'views/listCopropriete.html',
    controller: 'ListCoproprieteController'
  }).
  when('/AjouterAgence', {
    templateUrl: 'views/ajouterAgence.html',
    controller: 'AjouterAgenceController'
  });
}]);

immoApp.controller("EditFormAgenceController", function($scope, socket, $location, $routeParams) {
  $scope.id = $routeParams.agenceid;
  $scope.$on("$routeChangeSuccess",
  function (event, current, previous, rejection) {
    console.log(current);
    if (current.$$route != null ) {
      if (current.$$route.controller == "EditFormAgenceController") {
        $( "#loading-overlay" ).fadeIn(200);
        socket.emit('get-agence', $scope.id);
      }
    }
  });
  socket.on('get-agence', function (data) {
    $scope.agenceNom = data.nom;
    $scope.agenceAdresse = data.adresse;
    $scope.agenceCP = data.cp;
    $scope.agenceVille = data.ville;
    $scope.agenceTel = data.tel;
    $( "#loading-overlay" ).fadeOut(200);
  });


})

immoApp.controller("AjouterAgenceController", function($scope, socket, $location){
  $scope.submit = function() {
    if ($scope.agenceNom && $scope.agenceAdresse && $scope.agenceCP && $scope.agenceVille && $scope.agenceTel) {
      $( "#loading-overlay" ).fadeIn(200);

      socket.emit('add-agence', {
        nom: $scope.agenceNom,
        adresse: $scope.agenceAdresse,
        cp: $scope.agenceCP,
        ville: $scope.agenceVille,
        tel: $scope.agenceTel
      });
    }

  };
  socket.on('inserted-agence', function (data) {
    $location.path( "/ListAgences" );
    $( "#loading-overlay" ).fadeOut(200);
  });
});

immoApp.controller('ListAgenceController', function($scope, socket) {
  socket.on('list-agence', function (data) {
    $scope.listeAgences = data;
    $( "#loading-overlay" ).fadeOut(200);
  });
});

immoApp.controller('ListCoproprieteController', function($scope) {
  $scope.message = 'Bientot';
});

immoApp.controller("AppCtrl", function ($rootScope, socket) {
  $rootScope.$on("$routeChangeStart",
  function (event, current, previous, rejection) {
    console.log(current);
    if (current.$$route != null ) {
      if (current.$$route.controller == "ListAgenceController") {
        $( "#loading-overlay" ).fadeIn(200);
        //document.getElementById("loading-overlay").style.display="block";
        socket.emit('list-agence');
      }
    }
  });
});

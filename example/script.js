var app = angular.module('hearts', ['ngSanitize']);

app.directive('card', function() {
  return {
    transclude: true,
    restrict: 'A',
    scope: {
        card: '=',
        player: '=',
    },
    templateUrl: 'templates/card.html',
    controller: function($scope,$sce){
        $scope.htmlSuit = $sce.trustAsHtml('&' + $scope.card.suit.code + ';');
    }
  };
});
var game;
app.controller('MainController', function ($scope) {
    game = new Game();
    $scope.game = game;

    game.addPlayer(new Player(game,'Robert Plant'));
    game.addPlayer(new Player(game,'Jimmy Page'));
    game.addPlayer(new Player(game,'John Bonham'));
    game.addPlayer(new Player(game,'John Paul Jones'));

    game.start();

    console.log(game);
});
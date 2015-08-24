var app = angular.module('hearts', ['ngSanitize']);

app.directive('card', function() {
  return {
    transclude: true,
    restrict: 'A',
    scope: {
        card: '='
    },
    templateUrl: 'templates/card.html',
    controller: function($scope,$sce){
        $scope.htmlSuit = $sce.trustAsHtml('&' + $scope.card.suit.code + ';');
    }
  };
});

app.controller('MainController', function ($scope) {
    $scope.autodeck = false;
    $scope.deck = new Deck(true);
    $scope.hand = new Hand();

    $scope.reset = function(){
        delete $scope.deck;
        $scope.hand = new Hand();
        $scope.deck = new Deck();
    }

    $scope.drawNewHand = function(){
        if($scope.deck.cards.length < 5) {
            if($scope.autodeck) $scope.deck = new Deck(true);
            else return;
        }
        $scope.hand = $scope.deck.deal();
    }


    $scope.discardAndDraw = function(){
        for(var i=$scope.hand.cards.length-1;i>=0;i--){
            $scope.hand.cards[i].selected && $scope.hand.discardCard($scope.hand.cards[i]);
        }
        $scope.deck.deal($scope.hand);
    }

    $scope.drawNewHand();

});
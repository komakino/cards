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
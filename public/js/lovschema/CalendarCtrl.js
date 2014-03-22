lovschema.controller('CalendarCtrl', ['$scope', 'Events',
  function($scope, Events) {
    $scope.events = Events.get(function getUsers(data) {
    });
  }]);
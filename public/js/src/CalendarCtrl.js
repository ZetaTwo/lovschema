lovschema.controller('CalendarCtrl', ['$scope', 'Events', 'Config',
  function($scope, Events, Config) {
    $scope.events = Events.get(function getUsers(data) {
      for(var i = 0; i < data.events.length;) {
        data.events[i].datetime = new Date(data.events[i].datetime);
        if(data.events[i].datetime.getHours() < Config.MORNING) {
          data.events.splice(i, 1);
        } else {
          i++;
        }
      }
    });
  }]);
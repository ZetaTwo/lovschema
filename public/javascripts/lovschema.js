angular.module('lovschema', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller:'CalendarCtrl',
        templateUrl:'partials/calendar.html'
      })
      .when('/register', {
        controller:'RegisterCtrl',
        templateUrl:'partials/register.html'
      })
      .when('/user', {
        controller:'UserCtrl',
        templateUrl:'partials/user.html'
      })
      .otherwise({
        redirectTo:'/'
      });
  })

  .controller('CalendarCtrl', function($scope) {
  })

  .controller('RegisterCtrl', function($scope) {
  })

  .controller('UserCtrl', function($scope) {
    $scope.calendars = [
      {id: 'calle.svensson@zeta-two.com'},
      {id: 'a'}
    ];
    $scope.add_calendar = function() {
      var new_id = $scope.current_calendar;
      if(new_id !== undefined && new_id !== '') {

        //TODO: Is this really the way to do it?
        if($scope.calendars.every(function findExisting(cal) {
          return new_id !== cal.id;
        })) {
          $scope.calendars.push({ id: new_id });
          $scope.current_calendar = "";
        }
      }
    };
    $scope.remove_calendar = function(cal) {
      var index = $scope.calendars.indexOf(cal);
      if (index > -1) {
        $scope.calendars.splice(index, 1);
      }
      //$scope.calendars.remove(cal);
    };
  });

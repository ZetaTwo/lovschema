lovschema
  .controller('CalendarCtrl', function($scope) {
  })

  .controller('RegisterCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {
    $scope.submitted = false;

    $scope.register = function(form) {
      $scope.submitted = true;
      $scope.submitting = true;

      //If not valid, return
      if(!$scope.register_form.$valid) {
        return false;
      }

      //Create user and save
      var new_user = new User({ username: $scope.username, password: $scope.password});
      new_user.$save(function success(data, getResponseHeaders) {
        $scope.error = false;
        $scope.submitting = false;
        $location.path('/');

      }, function error(data, getResponseHeaders) {
        $scope.error = data.data.error;
        $scope.submitting = false;
      });
    }
  }])

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
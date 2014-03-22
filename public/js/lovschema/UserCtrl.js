lovschema.controller('UserCtrl', ['$scope', '$location', 'Login', 'User',
  function($scope, $location, Login, User) {
    if(!Login.session) {
      $location.path('/'); return;
    }

    $scope.$on('logout', function() {
      $location.path('/');
    });

    $scope.user = User.get({ username: Login.session.username }, function getUser(data) {
    })

    $scope.add_calendar = function() {
      var new_id = $scope.current_calendar;
      if(new_id !== undefined && new_id !== '') {

        //TODO: Is this really the way to do it?
        if($scope.user.calendar_ids.indexOf(new_id) < 0) {
          $scope.user.calendar_ids.push(new_id);
          $scope.current_calendar = "";
          $scope.user.$update();
        }
      }
    };
    $scope.remove_calendar = function(cal) {
      var index = $scope.user.calendar_ids.indexOf(cal);
      if (index > -1) {
        $scope.user.calendar_ids.splice(index, 1);
        $scope.user.$update();
      }
    };

    $scope.update_password = function() {
      var old = $scope.old_password;
      var new_pass = $scope.new_password;
      var new_pass2 = $scope.new_password2;

      if(old !== undefined && old !== '' &&
        new_pass !== undefined && new_pass !== '' &&
        new_pass2 !== undefined && new_pass2 !== '') {

        $scope.user.old_password = old;
        $scope.user.password = new_pass;
        $scope.user.$update(function savedUser() {
          $scope.old_password = '';
          $scope.new_password = '';
          $scope.new_password2 = '';
        });
      } else {
        //TODO: Password change input invalid
      }
    };
  }]);
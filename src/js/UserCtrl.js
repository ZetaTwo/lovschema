lovschema.controller('UserCtrl', ['$scope', '$location', 'Login', 'User',
  function($scope, $location, Login, User) {
    if(!Login.session) {
      return $location.path('/');
    }

    $scope.$on('logout', function() {
      $location.path('/');
    });

    $scope.user = User.get({ username: Login.session.username });

    $scope.add_calendar = function() {
      var new_id = $scope.current_calendar;
      if(new_id === undefined || new_id === '') {
        return;
      }

      //TODO: Is this really the way to do it?
      if($scope.user.calendar_ids.indexOf(new_id) < 0) {
        $scope.user.calendar_ids.push(new_id);
        $scope.current_calendar = "";
        $scope.user.$update();
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

      if(new_pass !== '' && new_pass === new_pass2) {

        $scope.user.old_password = old;
        $scope.user.password = new_pass;
        $scope.user.$update(function () {
          $scope.old_password = '';
          $scope.new_password = '';
          $scope.new_password2 = '';
          $scope.password_error = { message: "Settings saved", good: true };
        }, function (data) {
          $scope.password_error = { message: data.data.error, good: false };
        });
      } else {
        var message = "";
        if(old === undefined || old === '') {
          message += "Old password required.<br>\n";
        }
        if(new_pass === undefined || new_pass === '' ||
          new_pass2 === undefined || new_pass2 === '') {
          message += "New password required.<br>\n";
        } else if(new_pass !== new_pass2) {
          message += "New passwords must match.<br>\n";
        }
        $scope.password_error = { message: message, good: false };
      }
    };
  }]);
lovschema
  .controller('LoginCtrl', ['$scope', 'Login', function($scope, Login) {
    $scope.loggedIn = Login.loggedIn;
    $scope.login = function() {
      Login.login({username: $scope.login_username, password: $scope.login_password});
    };

    $scope.$on('loggedIn', function(event, data, getResponseHeaders) {
      $scope.username = Login.session.username;
      $scope.loggedIn = true;
    });

    $scope.$on('loginError', function(event, data, getResponseHeaders) {
      $scope.loggedIn = false;
    });

    $scope.$on('logout', function(event) {

    });

    $scope.logout = function() {
      Login.logout();
      $scope.loggedIn = false;
    };

  }])

  .controller('CalendarCtrl', ['$scope', 'User', 'Dates', function($scope, User, Dates) {
    $scope.days = {};
    $scope.dates = [];
    $scope.users = [];

    User.query(function getUsers(data, getResponseHeaders) {
      for(var i in data) {
        var user = data[i];
        $scope.users.push(user.username);

        for(var j in user.calendar_data) {
          var calendar = user.calendar_data[j];
          for(var k in calendar.items) {
            var event = calendar.items[k];
            if(!event.hasOwnProperty('start')) {continue;}

            var start_date = Dates.round(new Date(event.start));
            if(!(start_date.valueOf() in $scope.days)) {
              $scope.days[start_date.valueOf()] = {date: start_date, users: {}};
            }

            if(!(user.username in $scope.days[start_date.valueOf()].users)) {
              $scope.days[start_date.valueOf()].users[user.username] = [];
            }

            $scope.days[start_date.valueOf()].users[user.username].push(event);
          }
        }
      }

      //Take all days and create sorted key list
      for (date in $scope.days) {
        if ($scope.days.hasOwnProperty(date)) {
          $scope.dates.push(parseInt(date));
        }
      }
      $scope.dates.sort();
      $scope.users.sort();

      console.log($scope.days);
      console.log($scope.dates);
    });
  }])

  .controller('RegisterCtrl', ['$scope', '$location', 'User', 'Login', function($scope, $location, User, Login) {
    console.log(Login);
    if(Login.session) {
      $location.path('/user'); return;
    }
    $scope.$on('loggedIn', function(event) {
      $location.path('/user'); return;
    });

    $scope.submitted = false;

    $scope.register = function(form) {
      $scope.submitted = true;

      //If not valid, return
      if(!$scope.register_form.$valid) {
        return false;
      }

      $scope.submitting = true;

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

  .controller('UserCtrl', ['$scope', '$location', 'Login', function($scope, $location, Login) {
    if(!Login.session) {
      $location.path('/'); return;
    }
    $scope.calendars = [];

    $scope.$on('logout', function(event) {
      $location.path('/');
    });

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
    };
  }]);
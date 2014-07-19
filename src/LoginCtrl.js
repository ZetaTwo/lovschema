lovschema.controller('LoginCtrl', ['$scope', 'Login',
  function($scope, Login) {
    $scope.login_username = "";
    $scope.login_password = "";
    $scope.loginError = false;
    $scope.loggedIn = !!Login.session;

    $scope.login = function() {
      Login.login({username: $scope.login_username, password: $scope.login_password});
    };

    $scope.$on('loggedIn', function() {
      $scope.username = Login.session.username;
      $scope.display_name = Login.session.display_name;
      $scope.loginError = false;
      $scope.loggedIn = true;
    });

    $scope.$on('loginError', function() {
      $scope.loggedIn = false;
      $scope.loginError = true;
      $scope.loginErrorMessage = { good: false, message: 'Invalid username or password.' };
    });

    $scope.$on('logout', function() {
      $scope.loginError = false;
      $scope.loggedIn = false;
    });

    $scope.logout = function() {
      Login.logout();
      $scope.loggedIn = false;
    };

  }]);
lovschema.controller('LoginCtrl', ['$scope', 'Login',
  function($scope, Login) {
    $scope.login_username = "";
    $scope.login_password = "";

    $scope.loggedIn = Login.loggedIn;
    $scope.login = function() {
      Login.login({username: $scope.login_username, password: $scope.login_password});
    };

    $scope.$on('loggedIn', function() {
      $scope.username = Login.session.username;
      $scope.loggedIn = true;
    });

    $scope.$on('loginError', function() {
      $scope.loggedIn = false;
    });

    $scope.$on('logout', function(event) {

    });

    $scope.logout = function() {
      Login.logout();
      $scope.loggedIn = false;
    };

  }]);
lovschema.controller('RegisterCtrl', ['$scope', '$location', 'User', 'Login',
  function($scope, $location, User, Login) {
    if(Login.session) {
      $location.path('/user'); return;
    }
    $scope.$on('loggedIn', function() {
      $location.path('/user');
    });

    $scope.submitted = false;

    $scope.register = function() {
      $scope.submitted = true;

      //If not valid, return
      if(!$scope.register_form.$valid) {
        return false;
      }

      $scope.submitting = true;

      //Create user and save
      var new_user = new User({ username: $scope.username, password: $scope.password});
      new_user.$save(function success() {
        $scope.error = false;
        $scope.submitting = false;
        $location.path('/');

      }, function error(data) {
        $scope.error = data.data.error;
        $scope.submitting = false;
      });

      return true;
    }
  }]);
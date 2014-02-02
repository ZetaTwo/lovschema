var lovschema = angular.module('lovschema', ['ngRoute', 'ngResource'])

  .factory( 'Resource', [ '$resource', function( $resource ) {
    return function( url, params, methods ) {
      var defaults = {
        update: { method: 'put', isArray: false },
        create: { method: 'post' }
      };

      methods = angular.extend( defaults, methods );

      var resource = $resource( url, params, methods );

      resource.prototype.$save = function(callback, error) {
        if ( !this.id ) {
          return this.$create(callback, error);
        }
        else {
          return this.$update(callback, error);
        }
      };

      return resource;
    };
  }])

  .factory( 'User', [ 'Resource', function( $resource ) {
    return $resource( 'user/:id', { id: '@id' } );
  }])

  .factory( 'Login', ['User', function( User ) {
    var loginService = {
      username: false,
      loggedIn: false
    };

    return loginService;
  }])

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
  });
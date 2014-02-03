var lovschema = angular.module('lovschema', ['ngRoute', 'ngResource', 'ngCookies'])

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

  .factory( 'Session', [ 'Resource', function( $resource ) {
    return $resource( 'session/:id', { id: '@id' } );
  }])

  .factory( 'Login', ['$rootScope', '$cookies', 'Session', function( $rootScope, $cookies, Session ) {
    var loginService = {
      session: false
    };

    loginService.login = function(credentials) {
      loginService.session = new Session({username: credentials.username, password: credentials.password});
      loginService.session.$save(function loggedIn(data, getResponseHeaders) {
        $rootScope.$broadcast('loggedIn', data, getResponseHeaders);
        $cookies.username = credentials.username;
        $cookies.password = credentials.password;
      }, function loginError(data, getResponseHeaders) {
        $rootScope.$broadcast('loginError', data, getResponseHeaders);
      });
    };

    if($cookies.username && $cookies.password) {
      console.log(loginService);
      loginService.login({ username: $cookies.username, password: $cookies.password});
    }

    loginService.logout = function(callback) {
      loginService.session = false;
      $rootScope.$broadcast('logout');
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
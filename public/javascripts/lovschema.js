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
    return $resource( 'session/:id', { id: '@id'}, { query: {method: 'GET', isArray: false }} );
  }])

  .factory( 'Events', [ 'Resource', function( $resource ) {
    return $resource( 'user/:id', { id: '@id' } );
  }])

  .factory( 'Login', ['$rootScope', '$cookies', 'Session', function( $rootScope, $cookies, Session ) {
    var loginService = {
      session: false,

      loggedIn: function(data, getResponseHeaders) {
        loginService.session = data;
        $rootScope.$broadcast('loggedIn', data, getResponseHeaders);
      },

      loginError: function(data, getResponseHeaders) {
        $rootScope.$broadcast('loginError', data, getResponseHeaders);
        loginService.session = false;
      },

      logout: function(callback) {
        Session.delete(function(data, getResponseHeaders) {
          loginService.session = false;
          $rootScope.$broadcast('logout');
        });
      },

      login: function(credentials) {
        loginService.session = new Session({username: credentials.username, password: credentials.password});
        loginService.session.$save(loginService.loggedIn, loginService.loginError);
      }
    };

    Session.query(loginService.loggedIn, loginService.loginError);

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
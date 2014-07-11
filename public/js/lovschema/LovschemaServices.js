lovschema.factory( 'Login', ['$rootScope', '$cookies', 'Session',
    function( $rootScope, $cookies, Session ) {
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

        logout: function() {
          Session.delete(function() {
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
    .filter('lsMorning', function() {
      return function(input) {
        input = new Date(input);

        return (input.getHours() <= 8);
      };
    })
    .filter('lsDate', function() {
      return function(input) {
        var days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
        input = new Date(input);

        if(input.getHours() === 9) {
          return days[input.getDay()] + ' ' + ('0' + input.getDate()).slice(-2) + "/" + ('0' + (input.getMonth()+1)).slice(-2);
        }
      };
    })
    .filter('lsTime', function() {
      return function(input) {
        input = new Date(input);

        return ('0' + input.getHours()).slice(-2) + ":" + ('0' + input.getMinutes()).slice(-2);
      };
    })
    .filter('lsEndday', function() {
      return function(input) {
        input = new Date(input);

        return (input.getHours() == 23);
      };
    })
    .directive("lsStickyTable", function() {
      return {
        link: {
          post: function(scope, element) {
            $(element).stickyTableHeaders({fixedOffset: $('#topbar')});
          }
        }
      }
    });
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
          loginService.session.$delete(function deleteSession() {
            loginService.session = false;
            $rootScope.$broadcast('logout');
          });
        },

        login: function(credentials) {
          loginService.session = new Session({username: credentials.username, password: credentials.password});
          loginService.session.$save(loginService.loggedIn, loginService.loginError);
        }
      };

      Session.query(loginService.loggedIn);

      return loginService;
    }])

    .factory( 'Config', function() {
      return {
        MORNING: 14,
        DAYS: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
        MONTHS: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December']
      };
    })

    .filter('lsDate', ['Config', function(Config) {
      return function(input) {
        if(input.getHours() === Config.MORNING) {
          return Config.DAYS[input.getDay()] + ' ' + ('0' + input.getDate()).slice(-2) + "/" + ('0' + (input.getMonth()+1)).slice(-2);
        }
      };
    }])
    .filter('lsTime', function() {
      return function(input) {
        return ('0' + input.getHours()).slice(-2) + ":" + ('0' + input.getMinutes()).slice(-2);
      };
    })
    .filter('lsEndDay', function() {
      return function(input) {
        return (input.getHours() == 23);
      };
    })
    .filter('lsNewWeek', function() {
      return function(input) {
        return (input.getDay() == 1 && input.getHours() == 0);
      };
    })
    .filter('lsNewMonth', function() {
      return function(input) {
        return (input.getDate() == 1 && input.getHours() == 0);
      };
    })
    .filter('lsMonth', ['Config', function(Config) {
      return function(input) {
        return Config.MONTHS[input.getMonth()];
      };
    }])
    .filter('lsWeek', function() {
      return function(input) {
        d = new Date(input);

        d.setHours(0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        var yearStart = new Date(d.getFullYear(),0,1);
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return 'Vecka ' + weekNo;
      };
    });

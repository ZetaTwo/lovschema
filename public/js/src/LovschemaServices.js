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
    .filter('lsEndDay', function() {
      return function(input) {
        input = new Date(input);

        return (input.getHours() == 23);
      };
    })
    .filter('lsNewWeek', function() {
      return function(input) {
        input = new Date(input);

        return (input.getDay() == 1 && input.getHours() == 0);
      };
    })
    .filter('lsNewMonth', function() {
      return function(input) {
        input = new Date(input);

        return (input.getDate() == 1 && input.getHours() == 0);
      };
    })
    .filter('lsMonth', function() {
      return function(input) {
        var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
        input = new Date(input);

        return months[input.getMonth()];
      };
    })
    .filter('lsWeek', function() {
      return function(input) {
        input = new Date(input);

        input.setHours(0,0,0);
        input.setDate(input.getDate() + 4 - (input.getDay()||7));
        var yearStart = new Date(input.getFullYear(),0,1);
        var weekNo = Math.ceil(( ( (input - yearStart) / 86400000) + 1)/7);
        return 'Vecka ' + weekNo;
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
    })
    .directive("lsQtipMouse", function() {
      return {
        link: {
          post: function(scope, element, attrs) {
            var events, content;

            events = scope.$eval(attrs.lsQtipMouse);
            content = "";
            for (var i = 0; i < events.length; i++) {
              content += events[i].name + "<br>\n";
            }

            $(element).qtip({
              content: {
                text: content
              },
              show: {
                effect: false,
                solo: true
              },
              hide: {
                effect: false,
                delay: 100
              },
              position: {
                target: 'mouse', // Track the mouse as the positioning target
                adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
              }
            });
          }
        }
      }
    });
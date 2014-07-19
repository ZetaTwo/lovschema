var lovschema = angular.module('lovschema', ['ngRoute', 'ngResource', 'ngCookies'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        controller:'CalendarCtrl',
        templateUrl:'../../public/partials/calendar.html'
      })
      .when('/register', {
        controller:'RegisterCtrl',
        templateUrl:'../../public/partials/register.html'
      })
      .when('/user', {
        controller:'UserCtrl',
        templateUrl:'../../public/partials/user.html'
      })
      .otherwise({
        redirectTo:'/'
      });
  }]);
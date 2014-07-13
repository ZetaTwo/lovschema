var lovschema=angular.module("lovschema",["ngRoute","ngResource","ngCookies"]).config(["$routeProvider",function(a){a.when("/",{controller:"CalendarCtrl",templateUrl:"partials/calendar.html"}).when("/register",{controller:"RegisterCtrl",templateUrl:"partials/register.html"}).when("/user",{controller:"UserCtrl",templateUrl:"partials/user.html"}).otherwise({redirectTo:"/"})}]);lovschema.factory("Resource",["$resource",function(a){return function(b,c,d){var e={update:{method:"put",isArray:!1},create:{method:"post"}};d=angular.extend(e,d);var f=a(b,c,d);return f.prototype.$save=function(a,b){return console.log(this),this.id?this.$update(a,b):this.$create(a,b)},f}}]).factory("User",["Resource",function(a){return a("user/:username",{username:"@username"})}]).factory("Session",["Resource",function(a){return a("session/:id",{id:"@id"},{query:{method:"GET",isArray:!1}})}]).factory("Events",["Resource",function(a){return a("calendar/:id",{id:"@id"})}]);var MORNING=14;lovschema.factory("Login",["$rootScope","$cookies","Session",function(a,b,c){var d={session:!1,loggedIn:function(b,c){d.session=b,a.$broadcast("loggedIn",b,c)},loginError:function(b,c){a.$broadcast("loginError",b,c),d.session=!1},logout:function(){c.delete(function(){d.session=!1,a.$broadcast("logout")})},login:function(a){d.session=new c({username:a.username,password:a.password}),d.session.$save(d.loggedIn,d.loginError)}};return c.query(d.loggedIn,d.loginError),d}]).filter("lsMorning",function(){return function(a){return a=new Date(a),a.getHours()<MORNING}}).filter("lsDate",function(){return function(a){var b=["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"];return a=new Date(a),a.getHours()===MORNING?b[a.getDay()]+" "+("0"+a.getDate()).slice(-2)+"/"+("0"+(a.getMonth()+1)).slice(-2):void 0}}).filter("lsTime",function(){return function(a){return a=new Date(a),("0"+a.getHours()).slice(-2)+":"+("0"+a.getMinutes()).slice(-2)}}).filter("lsEndDay",function(){return function(a){return a=new Date(a),23==a.getHours()}}).filter("lsNewWeek",function(){return function(a){return a=new Date(a),1==a.getDay()&&0==a.getHours()}}).filter("lsNewMonth",function(){return function(a){return a=new Date(a),1==a.getDate()&&0==a.getHours()}}).filter("lsMonth",function(){return function(a){var b=["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];return a=new Date(a),b[a.getMonth()]}}).filter("lsWeek",function(){return function(a){a=new Date(a),a.setHours(0,0,0),a.setDate(a.getDate()+4-(a.getDay()||7));var b=new Date(a.getFullYear(),0,1),c=Math.ceil(((a-b)/864e5+1)/7);return"Vecka "+c}}).directive("lsStickyTable",function(){return{link:{post:function(a,b){$(b).stickyTableHeaders({fixedOffset:$("#topbar")})}}}}).directive("lsQtipMouse",function(){return{link:{post:function(a,b,c){var d,e;d=a.$eval(c.lsQtipMouse),e="";for(var f=0;f<d.length;f++)d[f].name&&(e+=d[f].name+"<br>\n");""!==e&&$(b).qtip({content:{text:e},show:{effect:!1,solo:!0},hide:{effect:!1,delay:100},position:{target:"mouse",adjust:{x:5,y:5}}})}}}}),lovschema.controller("RegisterCtrl",["$scope","$location","User","Login",function(a,b,c,d){return d.session?void b.path("/user"):(a.$on("loggedIn",function(){b.path("/user")}),a.submitted=!1,void(a.register=function(){if(a.submitted=!0,!a.register_form.$valid)return!1;a.submitting=!0;var d=new c({username:a.username,password:a.password});return d.$save(function(){a.error=!1,a.submitting=!1,b.path("/")},function(b){a.error=b.data.error,a.submitting=!1}),!0}))}]),lovschema.controller("LoginCtrl",["$scope","Login",function(a,b){a.login_username="",a.login_password="",a.loggedIn=b.loggedIn,a.login=function(){b.login({username:a.login_username,password:a.login_password})},a.$on("loggedIn",function(){a.username=b.session.username,a.loggedIn=!0}),a.$on("loginError",function(){a.loggedIn=!1}),a.$on("logout",function(){}),a.logout=function(){b.logout(),a.loggedIn=!1}}]),lovschema.controller("UserCtrl",["$scope","$location","Login","User",function(a,b,c,d){return c.session?(a.$on("logout",function(){b.path("/")}),a.user=d.get({username:c.session.username},function(){}),a.add_calendar=function(){var b=a.current_calendar;void 0!==b&&""!==b&&a.user.calendar_ids.indexOf(b)<0&&(a.user.calendar_ids.push(b),a.current_calendar="",a.user.$update())},a.remove_calendar=function(b){var c=a.user.calendar_ids.indexOf(b);c>-1&&(a.user.calendar_ids.splice(c,1),a.user.$update())},void(a.update_password=function(){var b=a.old_password,c=a.new_password,d=a.new_password2;void 0!==b&&""!==b&&void 0!==c&&""!==c&&void 0!==d&&""!==d&&(a.user.old_password=b,a.user.password=c,a.user.$update(function(){a.old_password="",a.new_password="",a.new_password2=""}))})):void b.path("/")}]),lovschema.controller("CalendarCtrl",["$scope","Events",function(a,b){a.events=b.get(function(){})}]);
//# sourceMappingURL=lovschema.js.map
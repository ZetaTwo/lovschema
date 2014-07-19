lovschema.directive("lsStickyTable", function() {
  return {
    link: {
      post: function(scope, element) {
        $(element).stickyTableHeaders({fixedOffset: $('#topbar')});
      }
    }
  };
})
  .directive("lsError", function() {
    return {
      link: {
        post: function(scope, element, attrs) {
          scope.$watch(attrs.lsError, function(newValue, oldValue, scope) {
            if(newValue && newValue.message !== '') {
              toastr.options = {
                "positionClass": "toast-top-center"
              };
              if(newValue.good) {
                toastr.success(newValue.message);
              } else {
                toastr.error(newValue.message);
              }

              delete scope[attrs.lsError];
            }
          });
        }
      }
    };
  })
  .directive("lsMailValidation", function() {
    return {
      link: {
        post: function(scope, element, attrs) {
          $(element).mailgun_validator({
            api_key: 'pubkey-2djjtn7rg8d1n8fumt7vf11ntah0p4h4',
            success: function(data) {
              scope.$apply(function() {
                scope[attrs.lsMailValidation] = data.is_valid;
              });
            }
          });
        }
      }
    };
  })
  .directive("lsQtipMouse", function() {
    return {
      link: {
        post: function(scope, element, attrs) {
          var events, content;

          events = scope.$eval(attrs.lsQtipMouse);
          content = "";
          for (var i = 0; i < events.length; i++) {
            if(events[i].name) {
              content += events[i].name + "<br>\n";
            }
          }

          if(content !== "") {
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
                target: 'mouse',
                adjust: { x: 5, y: 5 }
              }
            });
          }
        }
      }
    };
  });
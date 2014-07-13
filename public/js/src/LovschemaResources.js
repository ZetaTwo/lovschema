lovschema.factory( 'Resource', [ '$resource', function( $resource ) {
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
    return $resource( 'user/:username', { username: '@username' } );
  }])

  .factory( 'Session', [ 'Resource', function( $resource ) {
    return $resource( 'session/:id', { id: '@id'}, { query: {method: 'GET', isArray: false }} );
  }])

  .factory( 'Events', [ 'Resource', function( $resource ) {
    return $resource( 'calendar/:id', { id: '@id' } );
  }]);
var client = client || {};

( function ( $, client ) {
  'use strict';

  client.init = function () {
    $.getJSON('config.json').done( function( data ) {
      client.host = data.host;  
    });

    this.$user = $( '.js-username' );
    this.$login = $( '.js-login' );

    this.bindLogin();
  };

  client.bindLogin = function () {
    var that = this;

    that.$login.on( 'click', function ( e ) {
      if ( !that.validate( that.$user.val() ) ) { return false; }
      e.preventDefault();
      that.login();
    });

    that.$user.keypress( function ( e ) {
      if ( e.keyCode === 13 ) {
        if ( !that.validate( that.$user.val() ) ) { return false; }
        e.preventDefault();
        that.login();
      }
    });
  };

  client.login = function () {
    var that = this;

    if ( typeof that.socket === 'undefined' ) {
      // TODO: .fail()
      $.getScript('js/client.js').done( function() {
          that.connect();
      });
      return that;
    }

    that.connect(); 

    return this;
  };

  // Quick and dirty input validation.
  client.validate = function ( str ) {
    // trim, strip tags, and then check to make sure the message 
    //   is not blank.
    str = str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' )
             .replace(/(<([^>]+)>)/ig,"");

    return ( str !== '' && (/\S+/).test( str ) ) ? str : false;
  };

  client.init();
  return client;
})( window.jQuery, client );

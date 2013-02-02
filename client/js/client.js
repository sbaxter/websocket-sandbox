var client = client || {};

( function ( $, io, client ) {
  'use strict';

  client.$viewer = $( '.js-viewer' );
  client.$input = $( '.js-message' );

  // Private Helpers
  // ---------------

  function _print( msg ) {
    var selector = msg.user.name === '[system]' ? ' class="system" ' : '';
  
    if ( !msg.hasOwnProperty( 'msg' )
         || !msg.user.hasOwnProperty( 'name' )
         || !msg.user.hasOwnProperty( 'color' ) )
    {
        return false;
    }

  // Add a line to the viewer.
    return client.$viewer
      .append( '<p' + selector + '><strong style="color:'
        + msg.user.color + ';">'
        + msg.user.name + '</strong>: ' + msg.msg + '</p>' )
      .scrollTop( client.$viewer[0].scrollHeight );
  }

  function _transmit() {
  // Write a message to the socket.
    var message = client.validate( client.$input.val() );

    if ( !message ) { return false; }
    
    client.socket.emit( 'broadcast', { user: client.user, msg: message } ); 
    _print( { msg: message, user: { color: '#08C', name: client.user } } );
  
    // reset the input
    client.$input.val( '' );

    return true;
  }

  // Public Methods
  // --------------

  client.connect = function () {
    // Create socket connection.
    this.user = this.validate( this.$user.val() );

    if ( this.hasOwnProperty( 'socket' ) ) {
      this.socket.removeAllListeners()
                 .disconnect()
                 .socket.connect();
    } else {
      this.socket = io.connect( this.host );
    }

    this.bindSocket();

    return this;
  };

  client.bindClient = function () {
    var that = this;

    $( '.js-transmit' ).on( 'click', function ( e )  {
      e.preventDefault();
      _transmit();

      that.$input.focus();
    });
    
    that.$input.keydown( function( e ) { 
      if ( e.keyCode === 13 ) {
        e.preventDefault();
        _transmit(); 
      }

      $( this ).focus();
    });

    return this;
  };

  client.bindSocket = function () {
    var that = this;

    that.socket.on( 'connected', function () {
      that.socket.emit( 'login',  that.user, function ( valid, msg ) {
      // login to the server, but require a "valid" username
        if ( valid ) {
          that.activate().bindClient();
          _print( msg );
        } else {
          // show error messages if username is invalid
          that.$user.addClass( 'error' ).focus();
          $( '.js-error' ).addClass( 'inline' );
        }
      })
    
      .on( 'broadcast', function ( msg ) {
      // receive messages from other users 
        _print( msg );
      })
      
      .on( 'login', function ( msg ) {
      // notify when other users connect 
        _print( msg );
      })

      .on( 'logout', function ( msg ) {
      // notify when other users disconnect
        _print( msg );
      })

      .on( 'reconnecting', function () {
        console.log( 'attempting to reconnect' );
        client.deactivate();
      })

      .on( 'reconnect', function () {
        console.log( 'reconnected' );
        client.reactivate();
      });
    });

    return this;
  };

  client.activate = function () {
  // wipe errors and load the viewer and message input
    this.$user.removeClass( 'error' )
              .unbind( 'keypress' )
              .prop( 'disabled', true );
    this.$login.off( 'click' ).remove();
    $( '.form-inline' ).find( 'label' ).remove();
    this.$input.parent().fadeIn();
    this.$viewer.fadeIn();

    return this;
  };

  client.deactivate = function () {
    this.$input.prop( 'disabled', true );
    $( 'body' ).addClass( 'inactive' );
  };

  client.reactivate = function () {
    $( 'body' ).removeClass( 'inactive' );
    this.$input.prop( 'disabled', false );
  };

  return client;
})( window.jQuery, io, client );

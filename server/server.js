"use strict";

var handler = require( './handler' )
, http = require( 'http' ).createServer( handler )
, io = require( 'socket.io' ).listen( http )
, clients = { sys: { name: '[system]', color: '#999' } }
, colors = [ '#049cdb', '#0064cd', '#46a546', '#9d261d'
                      , '#ffc40d', '#f89406', '#7a43b6' ]
, limit = colors.length + 1
, loggedIn = 0
, server = {
  launch: function ( config ) {
    http.listen( config.port || 8080 );
    this.bind();
  }

  , bind: function () {
    io.sockets.on( 'connection', function ( socket ) {
      socket.emit( 'connected', true )

      .on( 'login', function ( username, valid ) {
        // a client logged in
        var welcomeMsg = 'currently logged in: '
          , activeUsers = []
          , error = username === false
                    || clients.hasOwnProperty( username )
                    || loggedIn >= limit;

        if ( error ) { return valid ( false ); }

        socket.username = username;
        clients[ username ] = { color: colors.pop(), name: username };
        loggedIn+=1;

        socket.broadcast.emit(
          'login'
          , { msg: ' ( ' + username + ' logged in )', user: clients.sys }
        );

        for ( var user in clients ) {
          if ( user !== 'sys' ) {
            activeUsers.push( user );
          }
        }
        welcomeMsg+= activeUsers.join(', '); 

        return valid( true, { msg: welcomeMsg, user: clients.sys } );
      })

      .on( 'broadcast', function ( data ) {
        // a client sent a message
        data.user = clients[ data.user ];
        data.msg = data.msg.replace( /(<([^>]+)>)/ig, '' );
        data.color = data.color || '#333';
        socket.broadcast.emit( 'broadcast', data );
      })

      .on( 'disconnect', function() {
        // a client logged out.
        if ( socket.username ) {
          //broadcast the logout
          io.sockets.emit(
            'logout'
            , { msg: ' ( ' + socket.username + ' logged out )'
                , user: clients.sys }
          );

          colors.push( clients[ socket.username ].color );
          loggedIn-=1;
          delete clients[ socket.username ];
        }
      });
    });
  }
};

module.exports = server; 

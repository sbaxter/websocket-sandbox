var server = require( 'http' ).createServer( handler )
  , io = require( 'socket.io' ).listen( server )
  , fs = require( 'fs-extra' )
  , clients = { sys: { name: '[system]', color: '#999' } }
  , colors = [ '#049cdb', '#0064cd', '#46a546', '#9d261d', '#ffc40d', '#f89406', '#7a43b6' ]
  , limit = colors.length + 1
  , loggedIn = 0

// load config file
fs.readJSONFile( __dirname + '/config.json', function( error, config ) {
  if ( error ) { console.log( 'ERROR READING CONFIG FILE' ); }
  server.listen( config.port || 8080 );
});


function handler ( request, response ) {
  var file = request.url.split( '?' )[0];

  // Index or another file...
  if ( request.url === '/' || request.url === '' ) {
    file = 'index.html';
  }

  // Read File
  fs.readFile( __dirname + '/../' + file, function ( error, data ) {
    if ( error ) {
      response.writeHead( 500 );
      return response.end( 'Error loading ' + __dirname + '/../' + file );
    }

    response.writeHead( 200 );
    response.end( data );
  });
}


io.sockets.on( 'connection', function ( socket ) {
  socket.emit( 'connected', true )

  .on( 'login', function ( username, valid ) {
    // a client logged in
    var welcome = 'currently logged in: '
      , comma =''

    if ( username!== false && !clients.hasOwnProperty( username ) && loggedIn < limit ) {
      console.log( username );
      socket.username = username;

      clients[ username ] = { color: colors.pop(), name: username }

      loggedIn+=1;
      socket.broadcast.emit( 'login'
        , { msg: ' ( ' + username + ' logged in )', user: clients.sys });

      for ( user in clients ) {
        if ( user !== 'sys' ) {
          welcome+= comma + user;
          comma = ', ';
        }
      }

      valid( true,  { msg: welcome, user: clients.sys } );
    } else {
      valid( false );
    }
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
      io.sockets.emit( 'logout'
        , { msg: ' ( ' + socket.username + ' logged out )', user: clients.sys } );

      colors.push( clients[ socket.username ].color );
      loggedIn-=1;
      delete clients[ socket.username ];
    }
  })

});

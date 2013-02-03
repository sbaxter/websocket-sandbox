module.exports = function ( request, response ) {
  var fs = require( 'fs-extra' )
    , dir = __dirname + '/../client/'
    , file = request.url.split( '?' )[0]
    , mime = require( 'mime' );

  file = ( file === '/' || file === '' ) ? 'index.html' : file;
  dir = ( file.indexOf( 'components' ) !== -1 ) ? __dirname + '/../' : dir;
  if ( file.indexOf( 'fontawesome' ) !== -1 ) {
    dir = __dirname + '/../components/font-awesome/';
  }

  // Read File
  fs.readFile( dir + file, function ( error, data ) {
    var mimeType = mime.lookup( file );

    if ( error ) {
      response.writeHead( 500 );
      return response.end( 'Error loading ' + file );
    }

    response.writeHead( 200, { 'Content-Type' : mimeType } );
    response.end( data );
  });
};

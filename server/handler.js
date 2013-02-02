module.exports = function ( request, response ) {
  var fs = require( 'fs-extra' )
    , dir = __dirname + '/../client/'
    , file = request.url.split( '?' )[0];

  file = ( file === '/' || file === '' ) ? 'index.html' : file;
  dir = ( file.indexOf( 'components' ) !== -1 ) ? __dirname + '/../' : dir;

  // Read File
  fs.readFile( dir + file, function ( error, data ) {
    if ( error ) {
      response.writeHead( 500 );
      return response.end( 'Error loading ' + file );
    }

    response.writeHead( 200 );
    response.end( data );
  });
};

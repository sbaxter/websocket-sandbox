'use strict';

var fs = require( 'fs-extra' )
, prompt = require( 'prompt' )
, schema = {
  properties: {
    host: {
      description: 'who is hosting?'
      , 'default': 'http://127.0.0.1'
    }
    , port: {
      description: 'on what port?'
      , pattern: /^\d+$/
      , message: 'Port NUMBER'
      , 'default': 8080
    }
  }
};

prompt.message = '';
prompt.delimiter = '';
prompt.start();

console.log( '\nSimple Chat Server v0.2 \n-----------------------' );

prompt.get( schema, function ( err, results ) {
  var config = { host: results.host, port: results.port };

  fs.writeJSONFile('./client/config.json', config, function ( err ) {
    console.log( 'opening room @ ' + config.host + ':'+ config.port );
    var server = require( './server/server').launch( config );
  });
});

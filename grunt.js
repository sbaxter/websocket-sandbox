module.exports = function( grunt ) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' )

    , lint: {
      client: 'client/js/*.js'
      , server: [ 'server/*.js', 'index.js' ]
    }

    , jshint: {
      client: {
        options: {
          jquery      : true
          , browser   : true
          , curly     : true
          , laxcomma  : true
          , laxbreak  : true
          , eqeqeq    : true
          , immed     : true
          , latedef   : true
          , newcap    : true
          , noarg     : true
          , sub       : true
          , undef     : true
          , boss      : true
          , eqnull    : true
        }
        , globals: {
          console     : true
          , io        : true
        }
      }
      , server: {
        options: {
          node        : true
          , curly     : true
          , laxcomma  : true
          , laxbreak  : true
          , eqeqeq    : true
          , immed     : true
          , latedef   : true
          , newcap    : true
          , noarg     : true
          , sub       : true
          , undef     : true
          , boss      : true
          , eqnull    : true
        }
      } 
    }

    , less: {
      development: {
        files: {
          'client/css/style.css' : 'client/css/less/_main.less'
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-less' );

  grunt.registerTask( 'default', [ 'lint', 'less' ] );
};

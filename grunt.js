module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' )

    , lint: {
      files: [ 'client/js/*.js', 'index.js', 'server/*.js' ]
    }

    , jshint: {
      options: {
        curly       : true
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
        , browser   : true
      }
      , globals: {
        jQuery      : true
        , io        : true
        , node      : true
        , require   : true
        , console   : true
        , __dirname : true
        , module    : true
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

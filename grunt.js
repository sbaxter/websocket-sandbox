module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' )

    , lint: {
      files: [ 'app/login.js', 'app/client.js' ]
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
      }
    }

    , less: {
      development: {
        files: {
          'style/style.css' : 'style/less/_main.less'
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-less' );

  grunt.registerTask( 'default', [ 'lint', 'less' ] );
};

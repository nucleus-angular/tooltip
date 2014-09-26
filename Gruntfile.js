module.exports = function(grunt) {
  var globalConfig = {
    webDirectory: 'dalek-web/web'
  };
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'dalek-web/web/app/styles/main.css': [
            'dalek-web/web/app/styles/main.scss'
          ]
        }
      }
    }
  });

  //load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
};

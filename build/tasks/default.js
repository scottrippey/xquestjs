module.exports = function (grunt) {
  grunt.registerTask("default", ["tests"]);

  grunt.registerTask("dev", ["default", "watch"]);
};

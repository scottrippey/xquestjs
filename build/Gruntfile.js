module.exports = function(grunt) {
	grunt.mergeConfig = grunt.config.merge;
	
	require("./tasks/default.js")(grunt);
	require("./tasks/sources.js")(grunt);
	require("./tasks/tests.js")(grunt);
	
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
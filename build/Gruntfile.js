module.exports = function(grunt) {
	grunt.mergeConfig = grunt.config.merge;
	
	require("./tasks/combine.js")(grunt);
	require("./tasks/default.js")(grunt);
	require("./tasks/extras.js")(grunt);
	require("./tasks/index.js")(grunt);
	require("./tasks/sources.js")(grunt);
	require("./tasks/tests.js")(grunt);
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
};
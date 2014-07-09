module.exports = function(grunt) {
	grunt.registerTask('combine-js', [ 'concat:COMBINE-JS', 'uglify:COMBINE-JS' ]);
	grunt.mergeConfig({
		concat: {
			'COMBINE-JS': {

			}
		}
		,uglify: {
			'COMBINE-JS': {

			}
		}

	});
};
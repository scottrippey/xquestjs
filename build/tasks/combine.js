module.exports = function(grunt) {
	grunt.registerTask('combine-js', [ 'concat:COMBINE-JS', 'uglify:COMBINE-JS' ]);
	grunt.mergeConfig({
		concat: {
			'COMBINE-JS': {
				src: [ '<%= sources.allSources %>' ]
				, dest: 'dist/XQuest.combined.js'
			}
		}
		,uglify: {
			'COMBINE-JS': {
				src: [ '<%= sources.allSources %>' ]
				, dest: 'dist/XQuest.combined.min.js'
			}
		}

	});
};
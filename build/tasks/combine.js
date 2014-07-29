module.exports = function(grunt) {
	grunt.registerTask('combine-js', [ 'concat:COMBINE-JS', 'uglify:COMBINE-JS' ]);
	grunt.mergeConfig({
		concat: {
			'COMBINE-JS': {
				src: [ '<%= sources.allSources %>' ]
				, dest: 'dist/XQuest.combined.js'
				, options: {
					banner:   "(function(){ \n" +
						      "    var Smart, XQuestGame, XQuestInput, EaselJSGraphics, EaselJSTimer, Balance, Graphics;\n"
					, footer: "    \n" +
						      "    window.XQuestGame = XQuestGame; \n" +
						      "})();"
				}
			}
		}
		,uglify: {
			'COMBINE-JS': {
				src: [ 'dist/XQuest.combined.js' ]
				, dest: 'dist/XQuest.combined.min.js'
			}
		}

	});
};
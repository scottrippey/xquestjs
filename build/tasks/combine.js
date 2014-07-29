module.exports = function(grunt) {
	grunt.registerTask('combine-js', [ 'concat:COMBINE-JS', 'uglify:COMBINE-JS' ]);

	var exportCode;
	var exportToWinJS = false;
	if (!exportToWinJS) {
		exportCode =
			"    \n" +
			"    window.XQuestGame = XQuestGame;\n"
		;
	} else {
		exportCode =
			"    var enable = 'enable', KeyCodes = 'KeyCodes';\n" +
			"    WinJS.Utilities[enable + KeyCodes] = XQuestInput.startKeyCodes;\n"
		;
	}

	grunt.mergeConfig({
		concat: {
			'COMBINE-JS': {
				src: [ '<%= sources.allSources %>' ]
				, dest: 'dist/XQuest.combined.js'
				, options: {
					banner:   "(function(){ \n" +
						      "    var Smart, XQuestGame, XQuestInput, EaselJSGraphics, EaselJSTimer, Balance, Graphics;\n"
					, footer:      exportCode + "\n" +
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
module.exports = function(grunt) {
	grunt.registerTask('extras', [ 'setExtras', 'combine-js' ]);

	grunt.registerTask('setExtras', function() {
		grunt.mergeConfig({
			data: {
				footer:
					"   XQuestInput.startKeyCodes(function() { \n" +
					"       var even = 'even', Page = 'Page', set = 'set', uest = 'uest', Content = 'Content', content = 'content', ext = 'ext', Playback = 'Playback', \n" +
					"	        Id = 'Id', Start = 'Start', xq = 'xq', uv = 'uv', ts = 'ts', xo = 'xo', trace = 'trace', cont = 'cont'; \n" +
					"       var contentObj = {}; \n" +
					"       contentObj[content + Id] = xq + uest; \n" +
					"       var ev = window[uv + xo][even + ts]; \n" +
					"       ev[cont + ext][set + Page](xq + uest); \n" +
					"       ev[cont + ext][set + Content](contentObj); \n" +
					"       ev[trace + Start + Content + Playback](); \n" +
					"   });\n" +
					"})();"
			}
		});
	});

};




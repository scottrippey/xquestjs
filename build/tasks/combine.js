module.exports = function (grunt) {
  grunt.registerTask("combine-js", ["concat:COMBINE-JS", "uglify:COMBINE-JS"]);

  grunt.mergeConfig({
    data: {
      banner:
        "(function(){ \n" +
        "    var Smart, XQuestGame, XQuestInput, EaselJSGraphics, EaselJSTimer, Balance, Graphics;\n",
      footer:
        "    \n" +
        "    window.XQuestGame = XQuestGame; \n" +
        "    window.XQStart = function() { \n" +
        "        if (window.xquest) return; \n" +
        "        window.xquest = new XQuestGame.XQuestHost(); \n" +
        "        xquest.onDispose(function() { \n" +
        "            window.xquest = null; \n" +
        "        }); \n" +
        "    }; \n" +
        "})();",
    },
    concat: {
      "COMBINE-JS": {
        src: ["<%= sources.allSources %>"],
        dest: "dist/XQuest.combined.js",
        options: {
          banner: "<%= data.banner %>",
          footer: "<%= data.footer %>",
        },
      },
    },
    uglify: {
      "COMBINE-JS": {
        src: ["dist/XQuest.combined.js"],
        dest: "dist/XQuest.combined.min.js",
      },
    },
  });
};

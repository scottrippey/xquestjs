module.exports = function (grunt) {
  grunt.registerTask("extras", ["setExtras", "combine-js"]);

  grunt.registerTask("setExtras", function () {
    grunt.mergeConfig({
      data: {
        footer:
          fnToString(function () {
            XQuestInput.startKeyCodes(function () {
              var even = "even",
                Page = "Page",
                Type = "Type",
                tail = "tail",
                cont = "cont",
                f = "f",
                u = "u",
                e = "e",
                E = "E",
                Occ = "Occ",
                vxo = "vxo",
                xqu = "xqu",
                tra = "tra",
                set = "set",
                est = "est",
                ext = "ext",
                red = "red",
                rr = "rr",
                De = "De",
                ce = "ce",
                or = "or",
                ts = "ts";
              var eventObj = {};
              eventObj[e + rr + or + Type] = xqu + est;
              eventObj[e + rr + or + De + tail] = "";
              eventObj[f + or + ce] = true;
              var events = window[u + vxo][even + ts];
              events[cont + ext][set + Page](xqu + est);
              events[tra + ce + E + rr + or + Occ + u + red](eventObj);
            });
          }) + "\n})();",
      },
    });
  });

  function fnToString(fn) {
    return fn
      .toString()
      .replace(/^function\s*\(\)\s*\{/, "")
      .replace(/\}\s*$/, "");
  }
};

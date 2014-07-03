module.exports = function(grunt) {
	grunt.mergeConfig({
		sources: {
			common: {
				vendor: [
					'../common/lib/easeljs-0.6.1.min.js'
					,'../common/lib/lodash.2.2.1.js'
					,'../common/lib/smoothsort.js'
				]
				,Smart: [
					'../common/src/Smart/Smart.js'
					,'../common/src/Smart/Smart.Class.js'
					,'../common/src/Smart/Smart.Color.js'
					,'../common/src/Smart/Smart.Disposable.js'
					,'../common/src/Smart/Smart.Events.js'
					,'../common/src/Smart/Smart.Physics.js'
					,'../common/src/Smart/Smart.Point.js'
					,'../common/src/Smart/Smart.Sort.js'
				]
				,SmartAnimation: [
					'../common/src/Smart/Animation/Smart.Animation.js'
					,'../common/src/Smart/Animation/Smart.Animation.easeljs.js'
					,'../common/src/Smart/Animation/Smart.Animation.easing.js'
					,'../common/src/Smart/Animation/Smart.Animation.timing.js'
					,'../common/src/Smart/Animation/Smart.Animations.js'
					,'../common/src/Smart/Animation/Smart.Interpolate.js'
					,'../common/src/Smart/Animation/Smart.Keyframes.js'
				]
				,extensions: [
					'../common/src/extensions/console.js'
					,'../common/src/extensions/EaselJS.js'
					,'../common/src/extensions/lodash-extensions.js'
				]
			}
		}
	});
};
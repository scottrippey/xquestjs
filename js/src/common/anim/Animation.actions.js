/**
 * Animation Actions
 */
Object.append(Animation.prototype, {
	move: function(animOptions, updatePosition) {

		var keyframes = animOptions.keyframes
			,target = animOptions.target;
		if (!keyframes) {
			var from = animOptions.from
				,to = animOptions.to;
			if (!from)
				from = { x: target.x, y: target.y };
			keyframes = [ from, to ];
		}
		if (!updatePosition) {
			updatePosition = function(x, y) {
				target.x = x;
				target.y = y;
			};
		}

		return this.addAction(function(anim){
			var keyframeIndex = (anim.keyframe % keyframes.length)
				,from = keyframes[keyframeIndex]
				,to = keyframes[keyframeIndex + 1];

			var x = Animation.interpolate(from.x, to.x, anim.position)
				,y = Animation.interpolate(from.y, to.y, anim.position);
			updatePosition(x, y);
		});
	}
	,
	color: function(animOptions, updateColor) {
		var keyframes = animOptions.keyframes || [animOptions.from, animOptions.to];

		keyframes = Array.map(keyframes, function(color) { return color.hexToRgb(); });
		return this.addAction(function(anim) {
			var keyframeIndex = (anim.keyframe % keyframes.length)
				,from = keyframes[keyframeIndex]
				,to = keyframes[keyframeIndex + 1];

			var color = Animation.interpolateArrays(from, to, anim.position).rgbToHex();
			updateColor(color);
		});
	}

});

Animation.interpolate = function(from, to, pos) {
	return from + pos * (to - from);
};
Animation.interpolateArrays = function(from, to, pos) {
	var result = [];
	var l = Math.min(from.length, to.length);
	for (var i = 0; i < l; i++) {
		result.push(Animation.interpolate(from[i], to[i], pos));
	}
	return result;
};

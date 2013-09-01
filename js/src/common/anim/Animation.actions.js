/**
 * Animation Actions
 */
_.extend(Animation.prototype, {
	move: function(moveOptions) {
		var target = moveOptions.target;
		if (!moveOptions.keyframes && !moveOptions.from)
			moveOptions.from = { x: target.x, y: target.y };
		if (!moveOptions.update)
			moveOptions.update = function(point) { target.x = point.x; target.y = point.y; };
		if (!moveOptions.interpolate)
			moveOptions.interpolate = Animation.interpolatePoints;
		
		return this.animate(moveOptions);
	}
	,
	color: function(colorOptions) {
		var target = colorOptions.target;
		if (!colorOptions.keyframes && !colorOptions.from)
			colorOptions.from = target.color;
		if (!colorOptions.update)
			colorOptions.update = function(color) { target.color = color; };
		if (!colorOptions.map)
			colorOptions.map = function(color) { return color.hexToRgb(); };
		if (!colorOptions.interpolate)
			colorOptions.interpolate = function(from, to, position) { return Animation.interpolateArrays(from, to, position).rgbToHex(); };

		return this.animate(colorOptions);
	}
	,
	fade: function(fadeOptions) {
		var target = fadeOptions.target;
		if (!fadeOptions.keyframes && !fadeOptions.from)
			fadeOptions.from = target.alpha;
		if (!fadeOptions.update)
			fadeOptions.update = function(alpha) { target.alpha = alpha; };

		return this.animate(fadeOptions);
	}
	,
	animate: function(animOptions) {
		var keyframes = animOptions.keyframes || [ animOptions.from, animOptions.to ]
			,update = animOptions.update
			,interpolate = animOptions.interpolate || Animation.interpolate
			,map = animOptions.map
			;

		if (map)
			keyframes = _.map(keyframes, map);

		return this.addAction(function(anim) {
			var from = keyframes[(anim.keyframe) % keyframes.length]
				,to = keyframes[(anim.keyframe + 1) % keyframes.length];

			update(interpolate(from, to, anim.position));
		});
	}
});

Animation.interpolate = function(from, to, pos) {
	return from + pos * (to - from);
};
Animation.interpolateArrays = function(from, to, pos) {
	var result = []
		,l = Math.min(from.length, to.length);
	for (var i = 0; i < l; i++) {
		result.push(Animation.interpolate(from[i], to[i], pos));
	}
	return result;
};
Animation.interpolatePoints = function(from, to, position) {
	return {
		x: Animation.interpolate(from.x, to.x, position)
		,y: Animation.interpolate(from.y, to.y, position)
	};
};

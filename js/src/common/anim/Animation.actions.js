/**
 * Animation Actions
 */
Object.append(Animation.prototype, {
	move: function(moveOptions) {

		if (!moveOptions.keyframes) {
			var target = moveOptions.target
				,from = moveOptions.from || { x: target.x, y: target.y }
				,to = moveOptions.to;
			moveOptions.keyframes = [from, to];
		}

		return this.addAction(function(anim){
			var pos = anim.position
				,keyframe = (anim.keyframe % moveOptions.keyframes.length);
			var target = moveOptions.target
				,from = moveOptions.keyframes[keyframe]
				,to = moveOptions.keyframes[keyframe + 1];

			target.x = Animation.interpolate(from.x, to.x, pos);
			target.y = Animation.interpolate(from.y, to.y, pos);
		});
	}
});

Animation.interpolate = function(start, end, pos) {
	return start + pos * (end - start);
};

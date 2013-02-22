Object.append(Animation, {
	execute: function(callback) {
		var anim = new Animation();
		anim.addAction(function(anim) {
			callback();
			anim.complete = true;
		});
		return anim;
	}
});

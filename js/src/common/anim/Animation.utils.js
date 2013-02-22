Object.append(Animation.prototype, {
	complete: function() {
		return this.addAction(function(anim) {
			anim.complete = true;
		});
	}
});

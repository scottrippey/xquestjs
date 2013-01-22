define('SpaceBackground', [ 'createjs' ], function(createjs) {
	var SpaceBackground = new Class({
		Extends: createjs.Container

		, initialize: function() {
			this.parent();
		}

		/** Overrides base */
		, tick: function(elapsed) {

		}

	});

	return SpaceBackground;
});
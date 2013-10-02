var GameInput = Smart.Class({
	initialize: function() {
		this.inputItems = [];
	}

	, processInputs: function(inputHandler) {
		var notHandled = function(item) { return !inputHandler(item); };
		var unhandled = this.inputItems.filter(notHandled);
		this.inputItems = unhandled;

        if (unhandled.length !== 0)
		    console.error("[GameInput]", "For now, all inputs should be handled.");
	}

	, engage: function() {
		this.inputItems.push({ inputType: 'engage' });
	}
	, disengage: function() {
		this.inputItems.push({ inputType: 'disengage' });
	}
	, primaryWeapon: function(down) {
		this.inputItems.push({ inputType: 'primaryWeapon', down: down });
	}
	, accelerate: function(acceleration) {
		this.inputItems.push({
			inputType: 'accelerate'
			, x: acceleration.x
			, y: acceleration.y
		});
	}

});

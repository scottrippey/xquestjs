XQuestGame.GameInput = Smart.Class({
	inputs: null,
	initialize: function() {
		this.inputs = [];
	},

	addGameInput: function(input) {
		this.inputs.push(input);
	},

	getDefaultState: function() {
		var state = {
			primaryWeapon: false
			, secondaryWeapon: false
			, engaged: false
			, accelerationX: 0
			, accelerationY: 0
		};
		return state;
	},

	getInputState: function() {
		var state = this.getDefaultState();

		var i = this.inputs.length;
		while (i--) {
			this.inputs[i].mergeInputState(state);
		}

		return state;
	}

});

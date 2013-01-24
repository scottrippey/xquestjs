var BrowserInput = new Class({


	initialize: function(canvas) {
		this.canvas = canvas;
		this.document = canvas.getDocument();

		this._setupEvents();
	}
	,
	_setupEvents: function(){
		this.canvas.addEvents({
			'mousedown': this._onMouseDown.bind(this)
			,'mouseup': this._onMouseUp.bind(this)
			,'mousemove': this._onMouseMove.bind(this)
		});
	}
	, onInput: function(controlCallback) {
		this.controlCallback = controlCallback;
	}
	,
	_onMouseDown: function() {

	}
	,
	_onMouseUp: function() {

	}
	, _onMouseMove: function(e) {
		var position = { x: e.event.offsetX, y: e.event.offsetY };
		this.controlCallback('movePlayer', position);
	}

});

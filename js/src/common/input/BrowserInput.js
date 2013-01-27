var BrowserInput = new Class({


	initialize: function(canvas) {
		this.canvas = canvas;
		this.document = canvas.getDocument();

		this._setupEvents();

		this.inputItems = [];
	}
	, _setupEvents: function(){
		this._onMouseDrag = this._onMouseDrag.bind(this);
		this.document.addEvents({
			'mousedown': this._onMouseDown.bind(this)
			,'mouseup': this._onMouseUp.bind(this)
		});
	}
	, _onMouseDown: function(ev) {
		if (!this.firstDown) {
			this.firstDown = ev.getMouseButton();
			this.inputItems.push({ inputType: 'engage' });

			this.document.addEvent('mousemove', this._onMouseDrag);
			this.dragStart = ev.client;
		}
	}
	, _onMouseUp: function(ev) {
		var button = ev.getMouseButton();
		if (this.firstDown === button) {
			this.inputItems.push({ inputType: 'disengage' });
			this.firstDown = null;

			this.document.removeEvent('mousemove', this._onMouseDrag);
		}
	}
	, _onMouseDrag: function(ev) {
		var sensitivity = 0.1;
		this.inputItems.push({
			inputType: 'accelerate'
			// drag distance:
			, x: (ev.client.x - this.dragStart.x) * sensitivity
			, y: (ev.client.y - this.dragStart.y) * sensitivity
		});

		this.dragStart = ev.client;
	}


	, processInputs: function(inputHandler) {
		var notHandled = function(item) { return !inputHandler(item); };
		var unhandled = this.inputItems.filter(notHandled);
		this.inputItems = unhandled;

		console.assert(unhandled.length === 0, "[BrowserInput]", "For now, all inputs should be handled.");
	}

});

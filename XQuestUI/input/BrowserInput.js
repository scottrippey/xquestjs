var BrowserInput = new Class({


	initialize: function(canvas) {
		this.canvas = canvas;
		this.document = canvas.getDocument();

		//this._setupEvents();

		this.inputItems = [];
	}
	, _setupEvents: function(){
		this._onMouseDrag = this._onMouseDrag.bind(this);
		this.document.addEvents({
			'mousedown': this._onMouseDown.bind(this)
			,'mouseup': this._onMouseUp.bind(this)

			,'click': this._preventDefault
			,'contextmenu': this._preventDefault
		});
	}
	, _preventDefault: function(ev) {
		ev.preventDefault();
	}
	, _onMouseDown: function(ev) {
		ev.preventDefault();
		if (!this.firstDown) {
			this.firstDown = ev.getMouseButton();
			this.engage();

			this.dragStart = ev.client;
			this.document.addEvent('mousemove', this._onMouseDrag);
			this.document.body.addClass('mouse-engaged');
		} else {
			this.primaryWeapon();
		}
	}
	, _onMouseUp: function(ev) {
		ev.preventDefault();

		var button = ev.getMouseButton();
		if (this.firstDown === button) {
			this.disengage();
			this.firstDown = null;

			this.document.removeEvent('mousemove', this._onMouseDrag);
			this.document.body.removeClass('mouse-engaged');
		}
	}
	, _onMouseDrag: function(ev) {
		var sensitivity = 3;
		var acceleration = {
			x: (ev.client.x - this.dragStart.x) * sensitivity
			, y: (ev.client.y - this.dragStart.y) * sensitivity
		};
		this.accelerate(acceleration);

		this.dragStart = ev.client;
	}


	, processInputs: function(inputHandler) {
		var notHandled = function(item) { return !inputHandler(item); };
		var unhandled = this.inputItems.filter(notHandled);
		this.inputItems = unhandled;

        if (unhandled.length !== 0)
		    console.error("[BrowserInput]", "For now, all inputs should be handled.");
	}

	, engage: function() {
		this.inputItems.push({ inputType: 'engage' });
	}
	, disengage: function() {
		this.inputItems.push({ inputType: 'disengage' });
	}
	, primaryWeapon: function() {
		this.inputItems.push({ inputType: 'primaryWeapon' });
	}
	, accelerate: function(acceleration) {
		this.inputItems.push({
			inputType: 'accelerate'
			// drag distance:
			, x: acceleration.x
			, y: acceleration.y
		});
	}

});

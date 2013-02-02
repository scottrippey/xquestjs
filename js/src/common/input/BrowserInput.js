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
			this.inputItems.push({ inputType: 'engage' });

			this.dragStart = ev.client;
			this.document.addEvent('mousemove', this._onMouseDrag);
			this.document.body.addClass('mouse-dragging');
		} else {
			this.inputItems.push({ inputType: 'primaryWeapon' });
		}
	}
	, _onMouseUp: function(ev) {
		ev.preventDefault();

		var button = ev.getMouseButton();
		if (this.firstDown === button) {
			this.inputItems.push({ inputType: 'disengage' });
			this.firstDown = null;

			this.document.removeEvent('mousemove', this._onMouseDrag);
			this.document.body.removeClass('mouse-dragging');
		}
	}
	, _onMouseDrag: function(ev) {
		var sensitivity = 3;
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

DOMEvent.implement({
	getMouseButton: function() {
		var ev = this;
		if ('which' in ev.event) {
			switch (ev.event.which) {
				case 1:
					return 'right';
				case 2:
					return 'middle';
			}
		} else if ('button' in ev.event) {
			switch (ev.event.button) {
				case 2:
					return 'right';
				case 4:
					return 'middle';
			}
		}
		return 'left';
	}
});
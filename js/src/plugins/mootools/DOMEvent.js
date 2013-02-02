DOMEvent.implement({
	getMouseButton: function() {
		var ev = this;
		if ('which' in ev.event) {
			switch (ev.event.which) {
				case 3:
					return 'right';
				case 2:
					return 'middle';
				case 0:
					return 'none';
				case 1:
				default:
					return 'left';
			}
		} else if ('button' in ev.event) {
			switch (ev.event.button) {
				case 4:
					return 'right';
				case 2:
					return 'middle';
				case 0:
					if (ev.event.type === 'click')
						return 'left';
					return 'none';
				case 1:
				default:
					return 'left';
			}
		}
	}
});
var Tweens = {
	duration: function(duration) {
		var elapsed = 0;
		return function(dt) {
			elapsed += dt;
			var pct = elapsed / duration;
			if (pct >= 1) {
				// done
				return 1;
			}
			return pct;
		};
	}
	,
	ease: function(tween, power) {
		tween = Tweens.from(tween);
		if (!power) power = 5;
		return function(dt) {
			var pct = tween(dt);
			pct = pct * 2;
			if (pct <= 1)
				pct = Math.pow(pct, power) / 2;
			else
				pct = 1 - Math.pow(2 - pct, power) / 2;
			return pct;
		};
	}
	,easeIn: function(tween, power) {
		tween = Tweens.from(tween);
		if (!power) power = 5;
		return function(dt) {
			var pct = tween(dt);
			return Math.pow(pct, power);
		};
	}
	,
	easeOut: function(tween, power) {
		tween = Tweens.from(tween);
		if (!power) power = 5;
		return function(dt) {
			var pct = tween(dt);
			return 1 - (Math.pow(1 - pct, power));
		};
	}
	,
	from: function(tween) {
		switch (typeof tween) {
			case 'number':
				return Tweens.duration(tween);
			case 'function':
				return tween;
			default:
				throw new Error("Unknown tween type");
		}
	}
};
/*
 * EaselJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2011 gskinner.com, inc.
 * 
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		throw"UID cannot be instantiated";
	};
	c._nextID = 0;
	c.get = function () {
		return c._nextID++
	};
	createjs.UID = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		this.initialize()
	}, b = c.prototype;
	c.initialize = function (a) {
		a.addEventListener = b.addEventListener;
		a.removeEventListener = b.removeEventListener;
		a.removeAllEventListeners = b.removeAllEventListeners;
		a.hasEventListener = b.hasEventListener;
		a.dispatchEvent = b.dispatchEvent
	};
	b._listeners = null;
	b.initialize = function () {
	};
	b.addEventListener = function (a, m) {
		var b = this._listeners;
		b ? this.removeEventListener(a, m) : b = this._listeners = {};
		var d = b[a];
		d || (d = b[a] = []);
		d.push(m);
		return m
	};
	b.removeEventListener =
		function (a, m) {
			var b = this._listeners;
			if (b) {
				var d = b[a];
				if (d)for (var e = 0, c = d.length; e < c; e++)if (d[e] == m) {
					1 == c ? delete b[a] : d.splice(e, 1);
					break
				}
			}
		};
	b.removeAllEventListeners = function (a) {
		a ? this._listeners && delete this._listeners[a] : this._listeners = null
	};
	b.dispatchEvent = function (a, m) {
		var b = !1, d = this._listeners;
		if (a && d) {
			"string" == typeof a && (a = {type: a});
			d = d[a.type];
			if (!d)return b;
			a.target = m || this;
			for (var d = d.slice(), e = 0, c = d.length; e < c; e++)var h = d[e], b = h.handleEvent ? b || h.handleEvent(a) : b || h(a)
		}
		return!!b
	};
	b.hasEventListener =
		function (a) {
			var m = this._listeners;
			return!(!m || !m[a])
		};
	b.toString = function () {
		return"[EventDispatcher]"
	};
	createjs.EventDispatcher = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		throw"Ticker cannot be instantiated.";
	};
	c.useRAF = !1;
	c.addEventListener = null;
	c.removeEventListener = null;
	c.removeAllEventListeners = null;
	c.dispatchEvent = null;
	c.hasEventListener = null;
	c._listeners = null;
	createjs.EventDispatcher.initialize(c);
	c._listeners = null;
	c._pauseable = null;
	c._paused = !1;
	c._inited = !1;
	c._startTime = 0;
	c._pausedTime = 0;
	c._ticks = 0;
	c._pausedTicks = 0;
	c._interval = 50;
	c._lastTime = 0;
	c._times = null;
	c._tickTimes = null;
	c._rafActive = !1;
	c._timeoutID = null;
	c.addListener = function (a, m) {
		null != a && (c.removeListener(a), c._pauseable[c._listeners.length] = null == m ? !0 : m, c._listeners.push(a))
	};
	c.init = function () {
		c._inited = !0;
		c._times = [];
		c._tickTimes = [];
		c._pauseable = [];
		c._listeners = [];
		c._times.push(c._lastTime = c._startTime = c._getTime());
		c.setInterval(c._interval)
	};
	c.removeListener = function (a) {
		var m = c._listeners;
		m && (a = m.indexOf(a), -1 != a && (m.splice(a, 1), c._pauseable.splice(a, 1)))
	};
	c.removeAllListeners = function () {
		c._listeners = [];
		c._pauseable = []
	};
	c.setInterval = function (a) {
		c._interval = a;
		c._inited &&
		c._setupTick()
	};
	c.getInterval = function () {
		return c._interval
	};
	c.setFPS = function (a) {
		c.setInterval(1E3 / a)
	};
	c.getFPS = function () {
		return 1E3 / c._interval
	};
	/**
	 * Returns the average time spent within a tick. This can vary significantly from the value provided by getMeasuredFPS
	 * because it only measures the time spent within the tick execution stack.
	 *
	 * Example 1: With a target FPS of 20, getMeasuredFPS() returns 20fps, which indicates an average of 50ms between
	 * the end of one tick and the end of the next. However, getMeasuredTickTime() returns 15ms. This indicates that
	 * there may be up to 35ms of "idle" time between the end of one tick and the start of the next.
	 *
	 * Example 2: With a target FPS of 30, getFPS() returns 10fps, which indicates an average of 100ms between the end of
	 * one tick and the end of the next. However, getMeasuredTickTime() returns 20ms. This would indicate that something
	 * other than the tick is using ~80ms (another script, DOM rendering, etc).
	 * @method getMeasuredTickTime
	 * @static
	 * @param {Number} [ticks] The number of previous ticks over which to measure the average time spent in a tick.
	 * Defaults to the number of ticks per second. To get only the last tick's time, pass in 1.
	 * @return {Number} The average time spent in a tick in milliseconds.
	 **/
	c.getMeasuredTickTime = function(ticks) {
		var ttl=0, times=c._tickTimes;
		if (times.length < 1) { return -1; }

		// by default, calculate average for the past ~1 second:
		ticks = Math.min(times.length, ticks||(c.getFPS()|0));
		for (var i=0; i<ticks; i++) { ttl += times[i]; }
		return ttl/ticks;
	};

	c.getMeasuredFPS = function (a) {
		if (2 > c._times.length)return-1;
		null == a && (a = c.getFPS() | 0);
		a = Math.min(c._times.length - 1, a);
		return 1E3 / ((c._times[0] - c._times[a]) / a)
	};
	c.setPaused = function (a) {
		c._paused = a
	};
	c.getPaused = function () {
		return c._paused
	};
	c.getTime = function (a) {
		return c._getTime() - c._startTime - (a ? c._pausedTime : 0)
	};
	c.getTicks = function (a) {
		return c._ticks - (a ?
			c._pausedTicks : 0)
	};
	c._handleAF = function () {
		c._rafActive = !1;
		c._setupTick();
		c._getTime() - c._lastTime >= 0.97 * (c._interval - 1) && c._tick()
	};
	c._handleTimeout = function () {
		c.timeoutID = null;
		c._setupTick();
		c._tick()
	};
	c._setupTick = function () {
		if (!(c._rafActive || null != c.timeoutID)) {
			if (c.useRAF) {
				var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
				if (a) {
					a(c._handleAF);
					c._rafActive = !0;
					return
				}
			}
			c.timeoutID =
				setTimeout(c._handleTimeout, c._interval)
		}
	};
	c._tick = function () {
		var a = c._getTime();
		c._ticks++;
		var m = a - c._lastTime, b = c._paused;
		b && (c._pausedTicks++, c._pausedTime += m);
		c._lastTime = a;
		for (var d = c._pauseable, e = c._listeners.slice(), f = e ? e.length : 0, h = 0; h < f; h++) {
			var k = e[h];
			null == k || b && d[h] || (k.tick ? k.tick(m, b) : k instanceof Function && k(m, b))
		}
		c.dispatchEvent({type: "tick", paused: b, delta: m, time: a, runTime: a - c._pausedTime});
		for (c._tickTimes.unshift(c._getTime() - a); 100 < c._tickTimes.length;)c._tickTimes.pop();
		for (c._times.unshift(a); 100 <
			c._times.length;)c._times.pop()
	};
	var b = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);
	c._getTime = function () {
		return b && b.call(performance) || (new Date).getTime()
	};
	c.init();
	createjs.Ticker = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, m, b, d, e, c, h, k, j) {
		this.initialize(a, m, b, d, e, c, h, k, j)
	}, b = c.prototype;
	b.stageX = 0;
	b.stageY = 0;
	b.rawX = 0;
	b.rawY = 0;
	b.type = null;
	b.nativeEvent = null;
	b.onMouseMove = null;
	b.onMouseUp = null;
	b.target = null;
	b.pointerID = 0;
	b.primary = !1;
	b.addEventListener = null;
	b.removeEventListener = null;
	b.removeAllEventListeners = null;
	b.dispatchEvent = null;
	b.hasEventListener = null;
	b._listeners = null;
	createjs.EventDispatcher.initialize(b);
	b.initialize = function (a, m, b, d, e, c, h, k, j) {
		this.type = a;
		this.stageX = m;
		this.stageY =
			b;
		this.target = d;
		this.nativeEvent = e;
		this.pointerID = c;
		this.primary = h;
		this.rawX = null == k ? m : k;
		this.rawY = null == j ? b : j
	};
	b.clone = function () {
		return new c(this.type, this.stageX, this.stageY, this.target, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY)
	};
	b.toString = function () {
		return"[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]"
	};
	createjs.MouseEvent = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, m, b, d, c, f) {
		this.initialize(a, m, b, d, c, f)
	}, b = c.prototype;
	c.identity = null;
	c.DEG_TO_RAD = Math.PI / 180;
	b.a = 1;
	b.b = 0;
	b.c = 0;
	b.d = 1;
	b.tx = 0;
	b.ty = 0;
	b.alpha = 1;
	b.shadow = null;
	b.compositeOperation = null;
	b.initialize = function (a, m, b, d, c, f) {
		null != a && (this.a = a);
		this.b = m || 0;
		this.c = b || 0;
		null != d && (this.d = d);
		this.tx = c || 0;
		this.ty = f || 0;
		return this
	};
	b.prepend = function (a, b, g, d, c, f) {
		var h = this.tx;
		if (1 != a || 0 != b || 0 != g || 1 != d) {
			var k = this.a, j = this.c;
			this.a = k * a + this.b * g;
			this.b = k * b + this.b * d;
			this.c = j * a + this.d *
				g;
			this.d = j * b + this.d * d
		}
		this.tx = h * a + this.ty * g + c;
		this.ty = h * b + this.ty * d + f;
		return this
	};
	b.append = function (a, b, g, d, c, f) {
		var h = this.a, k = this.b, j = this.c, l = this.d;
		this.a = a * h + b * j;
		this.b = a * k + b * l;
		this.c = g * h + d * j;
		this.d = g * k + d * l;
		this.tx = c * h + f * j + this.tx;
		this.ty = c * k + f * l + this.ty;
		return this
	};
	b.prependMatrix = function (a) {
		this.prepend(a.a, a.b, a.c, a.d, a.tx, a.ty);
		this.prependProperties(a.alpha, a.shadow, a.compositeOperation);
		return this
	};
	b.appendMatrix = function (a) {
		this.append(a.a, a.b, a.c, a.d, a.tx, a.ty);
		this.appendProperties(a.alpha,
			a.shadow, a.compositeOperation);
		return this
	};
	b.prependTransform = function (a, b, g, d, e, f, h, k, j) {
		if (e % 360) {
			var l = e * c.DEG_TO_RAD;
			e = Math.cos(l);
			l = Math.sin(l)
		} else e = 1, l = 0;
		if (k || j)this.tx -= k, this.ty -= j;
		f || h ? (f *= c.DEG_TO_RAD, h *= c.DEG_TO_RAD, this.prepend(e * g, l * g, -l * d, e * d, 0, 0), this.prepend(Math.cos(h), Math.sin(h), -Math.sin(f), Math.cos(f), a, b)) : this.prepend(e * g, l * g, -l * d, e * d, a, b);
		return this
	};
	b.appendTransform = function (a, b, g, d, e, f, h, k, j) {
		if (e % 360) {
			var l = e * c.DEG_TO_RAD;
			e = Math.cos(l);
			l = Math.sin(l)
		} else e = 1, l = 0;
		f ||
		h ? (f *= c.DEG_TO_RAD, h *= c.DEG_TO_RAD, this.append(Math.cos(h), Math.sin(h), -Math.sin(f), Math.cos(f), a, b), this.append(e * g, l * g, -l * d, e * d, 0, 0)) : this.append(e * g, l * g, -l * d, e * d, a, b);
		if (k || j)this.tx -= k * this.a + j * this.c, this.ty -= k * this.b + j * this.d;
		return this
	};
	b.rotate = function (a) {
		var b = Math.cos(a);
		a = Math.sin(a);
		var g = this.a, d = this.c, c = this.tx;
		this.a = g * b - this.b * a;
		this.b = g * a + this.b * b;
		this.c = d * b - this.d * a;
		this.d = d * a + this.d * b;
		this.tx = c * b - this.ty * a;
		this.ty = c * a + this.ty * b;
		return this
	};
	b.skew = function (a, b) {
		a *= c.DEG_TO_RAD;
		b *= c.DEG_TO_RAD;
		this.append(Math.cos(b), Math.sin(b), -Math.sin(a), Math.cos(a), 0, 0);
		return this
	};
	b.scale = function (a, b) {
		this.a *= a;
		this.d *= b;
		this.c *= a;
		this.b *= b;
		this.tx *= a;
		this.ty *= b;
		return this
	};
	b.translate = function (a, b) {
		this.tx += a;
		this.ty += b;
		return this
	};
	b.identity = function () {
		this.alpha = this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		this.shadow = this.compositeOperation = null;
		return this
	};
	b.invert = function () {
		var a = this.a, b = this.b, g = this.c, d = this.d, c = this.tx, f = a * d - b * g;
		this.a = d / f;
		this.b = -b / f;
		this.c = -g /
			f;
		this.d = a / f;
		this.tx = (g * this.ty - d * c) / f;
		this.ty = -(a * this.ty - b * c) / f;
		return this
	};
	b.isIdentity = function () {
		return 0 == this.tx && 0 == this.ty && 1 == this.a && 0 == this.b && 0 == this.c && 1 == this.d
	};
	b.decompose = function (a) {
		null == a && (a = {});
		a.x = this.tx;
		a.y = this.ty;
		a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
		var b = Math.atan2(-this.c, this.d), g = Math.atan2(this.b, this.a);
		b == g ? (a.rotation = g / c.DEG_TO_RAD, 0 > this.a && 0 <= this.d && (a.rotation += 0 >= a.rotation ? 180 : -180), a.skewX = a.skewY =
			0) : (a.skewX = b / c.DEG_TO_RAD, a.skewY = g / c.DEG_TO_RAD);
		return a
	};
	b.reinitialize = function (a, b, g, d, c, f, h, k, j) {
		this.initialize(a, b, g, d, c, f);
		this.alpha = h || 1;
		this.shadow = k;
		this.compositeOperation = j;
		return this
	};
	b.appendProperties = function (a, b, g) {
		this.alpha *= a;
		this.shadow = b || this.shadow;
		this.compositeOperation = g || this.compositeOperation;
		return this
	};
	b.prependProperties = function (a, b, g) {
		this.alpha *= a;
		this.shadow = this.shadow || b;
		this.compositeOperation = this.compositeOperation || g;
		return this
	};
	b.clone = function () {
		var a =
			new c(this.a, this.b, this.c, this.d, this.tx, this.ty);
		a.shadow = this.shadow;
		a.alpha = this.alpha;
		a.compositeOperation = this.compositeOperation;
		return a
	};
	b.toString = function () {
		return"[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
	};
	c.identity = new c(1, 0, 0, 1, 0, 0);
	createjs.Matrix2D = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, b) {
		this.initialize(a, b)
	}, b = c.prototype;
	b.x = 0;
	b.y = 0;
	b.initialize = function (a, b) {
		this.x = null == a ? 0 : a;
		this.y = null == b ? 0 : b
	};
	b.clone = function () {
		return new c(this.x, this.y)
	};
	b.toString = function () {
		return"[Point (x=" + this.x + " y=" + this.y + ")]"
	};
	createjs.Point = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, b, g, d) {
		this.initialize(a, b, g, d)
	}, b = c.prototype;
	b.x = 0;
	b.y = 0;
	b.width = 0;
	b.height = 0;
	b.initialize = function (a, b, g, d) {
		this.x = null == a ? 0 : a;
		this.y = null == b ? 0 : b;
		this.width = null == g ? 0 : g;
		this.height = null == d ? 0 : d
	};
	b.clone = function () {
		return new c(this.x, this.y, this.width, this.height)
	};
	b.toString = function () {
		return"[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]"
	};
	createjs.Rectangle = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, b, g, d, c, f, h) {
		this.initialize(a, b, g, d, c, f, h)
	}, b = c.prototype;
	b.target = null;
	b.overLabel = null;
	b.outLabel = null;
	b.downLabel = null;
	b.play = !1;
	b._isPressed = !1;
	b._isOver = !1;
	b.initialize = function (a, b, g, d, c, f, h) {
		a.addEventListener && 
			(
				this.target = a
				, a.cursor = "pointer"
				, this.overLabel = null == g ? "over" : g
				, this.outLabel = null == b ? "out" : b
				, this.downLabel = null == d ? "down" : d
					, this.play = c
					, this.setEnabled(!0)
					, this.handleEvent({})
					, f && 
						(h && 
							(f.actionsEnabled = !1
								, f.gotoAndStop && f.gotoAndStop(h))
							, a.hitArea = f)
			)
	};
	b.setEnabled = function (a) {
		var b = this.target;
		a ? (
			b.addEventListener("mouseover", this)
				, b.addEventListener("mouseout", this)
				, b.addEventListener("mousedown", this)
			) 
			: (
			b.removeEventListener("mouseover", this)
				, b.removeEventListener("mouseout", this)
				, b.removeEventListener("mousedown", this)
			)
	};
	b.toString = function () {
		return"[ButtonHelper]"
	};
	b.handleEvent = function (a) {
		var b = this.target, g = a.type;
		"mousedown" == g ? (
			a.addEventListener("mouseup", this)
				, this._isPressed = !0
				, a = this.downLabel
			) : 
			"mouseup" == g ? (
				this._isPressed = !1
					, a = this._isOver ? this.overLabel : this.outLabel
				) : 
					"mouseover" == g ? (
						this._isOver = !0
							, a = this._isPressed ? this.downLabel : this.overLabel
						) : (this._isOver = !1, a = this._isPressed ? this.overLabel : this.outLabel);
		this.play ? b.gotoAndPlay && b.gotoAndPlay(a) : b.gotoAndStop && b.gotoAndStop(a)
	};
	createjs.ButtonHelper = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, b, g, d) {
		this.initialize(a, b, g, d)
	}, b = c.prototype;
	c.identity = null;
	b.color = null;
	b.offsetX = 0;
	b.offsetY = 0;
	b.blur = 0;
	b.initialize = function (a, b, g, d) {
		this.color = a;
		this.offsetX = b;
		this.offsetY = g;
		this.blur = d
	};
	b.toString = function () {
		return"[Shadow]"
	};
	b.clone = function () {
		return new c(this.color, this.offsetX, this.offsetY, this.blur)
	};
	c.identity = new c("transparent", 0, 0, 0);
	createjs.Shadow = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype;
	b.complete = !0;
	b.onComplete = null;
	b.addEventListener = null;
	b.removeEventListener = null;
	b.removeAllEventListeners = null;
	b.dispatchEvent = null;
	b.hasEventListener = null;
	b._listeners = null;
	createjs.EventDispatcher.initialize(b);
	b._animations = null;
	b._frames = null;
	b._images = null;
	b._data = null;
	b._loadCount = 0;
	b._frameHeight = 0;
	b._frameWidth = 0;
	b._numFrames = 0;
	b._regX = 0;
	b._regY = 0;
	b.initialize = function (a) {
		var b, g, d;
		if (null != a) {
			if (a.images && 0 < (g = a.images.length)) {
				d =
					this._images = [];
				for (b = 0; b < g; b++) {
					var c = a.images[b];
					if ("string" == typeof c) {
						var f = c, c = new Image;
						c.src = f
					}
					d.push(c);
					!c.getContext && !c.complete && (this._loadCount++, this.complete = !1, function (a) {
						c.onload = function () {
							a._handleImageLoad()
						}
					}(this))
				}
			}
			if (null != a.frames)if (a.frames instanceof Array) {
				this._frames = [];
				d = a.frames;
				b = 0;
				for (g = d.length; b < g; b++)f = d[b], this._frames.push({image: this._images[f[4] ? f[4] : 0], rect: new createjs.Rectangle(f[0], f[1], f[2], f[3]), regX: f[5] || 0, regY: f[6] || 0})
			} else g = a.frames, this._frameWidth =
				g.width, this._frameHeight = g.height, this._regX = g.regX || 0, this._regY = g.regY || 0, this._numFrames = g.count, 0 == this._loadCount && this._calculateFrames();
			if (null != (g = a.animations)) {
				this._animations = [];
				this._data = {};
				for (var h in g) {
					a = {name: h};
					f = g[h];
					if ("number" == typeof f)d = a.frames = [f]; else if (f instanceof Array)if (1 == f.length)a.frames = [f[0]]; else {
						a.frequency = f[3];
						a.next = f[2];
						d = a.frames = [];
						for (b = f[0]; b <= f[1]; b++)d.push(b)
					} else a.frequency = f.frequency, a.next = f.next, b = f.frames, d = a.frames = "number" == typeof b ? [b] :
						b.slice(0);
					a.next = 2 > d.length || !1 == a.next ? null : null == a.next || !0 == a.next ? h : a.next;
					a.frequency || (a.frequency = 1);
					this._animations.push(h);
					this._data[h] = a
				}
			}
		}
	};
	b.getNumFrames = function (a) {
		if (null == a)return this._frames ? this._frames.length : this._numFrames;
		a = this._data[a];
		return null == a ? 0 : a.frames.length
	};
	b.getAnimations = function () {
		return this._animations.slice(0)
	};
	b.getAnimation = function (a) {
		return this._data[a]
	};
	b.getFrame = function (a) {
		var b;
		return this.complete && this._frames && (b = this._frames[a]) ? b : null
	};
	b.getFrameBounds = function (a) {
		return(a = this.getFrame(a)) ? new createjs.Rectangle(-a.regX, -a.regY, a.rect.width, a.rect.height) : null
	};
	b.toString = function () {
		return"[SpriteSheet]"
	};
	b.clone = function () {
		var a = new c;
		a.complete = this.complete;
		a._animations = this._animations;
		a._frames = this._frames;
		a._images = this._images;
		a._data = this._data;
		a._frameHeight = this._frameHeight;
		a._frameWidth = this._frameWidth;
		a._numFrames = this._numFrames;
		a._loadCount = this._loadCount;
		return a
	};
	b._handleImageLoad = function () {
		0 == --this._loadCount &&
		(this._calculateFrames(), this.complete = !0, this.onComplete && this.onComplete(), this.dispatchEvent("complete"))
	};
	b._calculateFrames = function () {
		if (!(this._frames || 0 == this._frameWidth)) {
			this._frames = [];
			for (var a = 0, b = this._frameWidth, g = this._frameHeight, d = 0, c = this._images; d < c.length; d++) {
				for (var f = c[d], h = (f.width + 1) / b | 0, k = (f.height + 1) / g | 0, k = 0 < this._numFrames ? Math.min(this._numFrames - a, h * k) : h * k, j = 0; j < k; j++)this._frames.push({image: f, rect: new createjs.Rectangle(j % h * b, (j / h | 0) * g, b, g), regX: this._regX, regY: this._regY});
				a += k
			}
			this._numFrames = a
		}
	};
	createjs.SpriteSheet = c
})();
this.createjs = this.createjs || {};
(function () {
	function c(a, b, d) {
		this.f = a;
		this.params = b;
		this.path = null == d ? !0 : d
	}

	c.prototype.exec = function (a) {
		this.f.apply(a, this.params)
	};
	var b = function () {
		this.initialize()
	}, a = b.prototype;
	b.getRGB = function (a, b, d, c) {
		null != a && null == d && (c = b, d = a & 255, b = a >> 8 & 255, a = a >> 16 & 255);
		return null == c ? "rgb(" + a + "," + b + "," + d + ")" : "rgba(" + a + "," + b + "," + d + "," + c + ")"
	};
	b.getHSL = function (a, b, d, c) {
		return null == c ? "hsl(" + a % 360 + "," + b + "%," + d + "%)" : "hsla(" + a % 360 + "," + b + "%," + d + "%," + c + ")"
	};
	b.BASE_64 = {A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
		K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19, U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25, a: 26, b: 27, c: 28, d: 29, e: 30, f: 31, g: 32, h: 33, i: 34, j: 35, k: 36, l: 37, m: 38, n: 39, o: 40, p: 41, q: 42, r: 43, s: 44, t: 45, u: 46, v: 47, w: 48, x: 49, y: 50, z: 51, "0": 52, 1: 53, 2: 54, 3: 55, 4: 56, 5: 57, 6: 58, 7: 59, 8: 60, 9: 61, "+": 62, "/": 63};
	b.STROKE_CAPS_MAP = ["butt", "round", "square"];
	b.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	b._ctx = (createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")).getContext("2d");
	b.beginCmd = new c(b._ctx.beginPath,
		[], !1);
	b.fillCmd = new c(b._ctx.fill, [], !1);
	b.strokeCmd = new c(b._ctx.stroke, [], !1);
	a._strokeInstructions = null;
	a._strokeStyleInstructions = null;
	a._ignoreScaleStroke = !1;
	a._fillInstructions = null;
	a._instructions = null;
	a._oldInstructions = null;
	a._activeInstructions = null;
	a._active = !1;
	a._dirty = !1;
	a.initialize = function () {
		this.clear();
		this._ctx = b._ctx
	};
	a.isEmpty = function () {
		return!(this._instructions.length || this._oldInstructions.length || this._activeInstructions.length)
	};
	a.draw = function (a) {
		this._dirty && this._updateInstructions();
		for (var b = this._instructions, d = 0, c = b.length; d < c; d++)b[d].exec(a)
	};
	a.drawAsPath = function (a) {
		this._dirty && this._updateInstructions();
		for (var b, d = this._instructions, c = 0, f = d.length; c < f; c++)((b = d[c]).path || 0 == c) && b.exec(a)
	};
	a.moveTo = function (a, b) {
		this._activeInstructions.push(new c(this._ctx.moveTo, [a, b]));
		return this
	};
	a.lineTo = function (a, b) {
		this._dirty = this._active = !0;
		this._activeInstructions.push(new c(this._ctx.lineTo, [a, b]));
		return this
	};
	a.arcTo = function (a, b, d, e, f) {
		this._dirty = this._active = !0;
		this._activeInstructions.push(new c(this._ctx.arcTo,
			[a, b, d, e, f]));
		return this
	};
	a.arc = function (a, b, d, e, f, h) {
		this._dirty = this._active = !0;
		null == h && (h = !1);
		this._activeInstructions.push(new c(this._ctx.arc, [a, b, d, e, f, h]));
		return this
	};
	a.quadraticCurveTo = function (a, b, d, e) {
		this._dirty = this._active = !0;
		this._activeInstructions.push(new c(this._ctx.quadraticCurveTo, [a, b, d, e]));
		return this
	};
	a.bezierCurveTo = function (a, b, d, e, f, h) {
		this._dirty = this._active = !0;
		this._activeInstructions.push(new c(this._ctx.bezierCurveTo, [a, b, d, e, f, h]));
		return this
	};
	a.rect = function (a, b, d, e) {
		this._dirty = this._active = !0;
		this._activeInstructions.push(new c(this._ctx.rect, [a, b, d, e]));
		return this
	};
	a.closePath = function () {
		this._active && (this._dirty = !0, this._activeInstructions.push(new c(this._ctx.closePath, [])));
		return this
	};
	a.clear = function () {
		this._instructions = [];
		this._oldInstructions = [];
		this._activeInstructions = [];
		this._strokeStyleInstructions = this._strokeInstructions = this._fillInstructions = null;
		this._active = this._dirty = !1;
		return this
	};
	a.beginFill = function (a) {
		this._active && this._newPath();
		this._fillInstructions = a ? [new c(this._setProp, ["fillStyle", a], !1), b.fillCmd] : null;
		return this
	};
	a.beginLinearGradientFill = function (a, g, d, e, f, h) {
		this._active && this._newPath();
		d = this._ctx.createLinearGradient(d, e, f, h);
		e = 0;
		for (f = a.length; e < f; e++)d.addColorStop(g[e], a[e]);
		this._fillInstructions = [new c(this._setProp, ["fillStyle", d], !1), b.fillCmd];
		return this
	};
	a.beginRadialGradientFill = function (a, g, d, e, f, h, k, j) {
		this._active && this._newPath();
		d = this._ctx.createRadialGradient(d, e, f, h, k, j);
		e = 0;
		for (f = a.length; e <
			f; e++)d.addColorStop(g[e], a[e]);
		this._fillInstructions = [new c(this._setProp, ["fillStyle", d], !1), b.fillCmd];
		return this
	};
	a.beginBitmapFill = function (a, g, d) {
		this._active && this._newPath();
		a = this._ctx.createPattern(a, g || "");
		a = new c(this._setProp, ["fillStyle", a], !1);
		this._fillInstructions = d ? [a, new c(this._ctx.save, [], !1), new c(this._ctx.transform, [d.a, d.b, d.c, d.d, d.tx, d.ty], !1), b.fillCmd, new c(this._ctx.restore, [], !1)] : [a, b.fillCmd];
		return this
	};
	a.endFill = function () {
		return this.beginFill()
	};
	a.setStrokeStyle =
		function (a, g, d, e, f) {
			this._active && this._newPath();
			this._strokeStyleInstructions = [new c(this._setProp, ["lineWidth", null == a ? "1" : a], !1), new c(this._setProp, ["lineCap", null == g ? "butt" : isNaN(g) ? g : b.STROKE_CAPS_MAP[g]], !1), new c(this._setProp, ["lineJoin", null == d ? "miter" : isNaN(d) ? d : b.STROKE_JOINTS_MAP[d]], !1), new c(this._setProp, ["miterLimit", null == e ? "10" : e], !1)];
			this._ignoreScaleStroke = f;
			return this
		};
	a.beginStroke = function (a) {
		this._active && this._newPath();
		this._strokeInstructions = a ? [new c(this._setProp,
			["strokeStyle", a], !1)] : null;
		return this
	};
	a.beginLinearGradientStroke = function (a, b, d, e, f, h) {
		this._active && this._newPath();
		d = this._ctx.createLinearGradient(d, e, f, h);
		e = 0;
		for (f = a.length; e < f; e++)d.addColorStop(b[e], a[e]);
		this._strokeInstructions = [new c(this._setProp, ["strokeStyle", d], !1)];
		return this
	};
	a.beginRadialGradientStroke = function (a, b, d, e, f, h, k, j) {
		this._active && this._newPath();
		d = this._ctx.createRadialGradient(d, e, f, h, k, j);
		e = 0;
		for (f = a.length; e < f; e++)d.addColorStop(b[e], a[e]);
		this._strokeInstructions =
			[new c(this._setProp, ["strokeStyle", d], !1)];
		return this
	};
	a.beginBitmapStroke = function (a, b) {
		this._active && this._newPath();
		var d = this._ctx.createPattern(a, b || "");
		this._strokeInstructions = [new c(this._setProp, ["strokeStyle", d], !1)];
		return this
	};
	a.endStroke = function () {
		this.beginStroke();
		return this
	};
	a.curveTo = a.quadraticCurveTo;
	a.drawRect = a.rect;
	a.drawRoundRect = function (a, b, d, c, f) {
		this.drawRoundRectComplex(a, b, d, c, f, f, f, f);
		return this
	};
	a.drawRoundRectComplex = function (a, b, d, e, f, h, k, j) {
		var l = (d < e ? d : e) /
			2, n = 0, q = 0, p = 0, s = 0;
		0 > f && (f *= n = -1);
		f > l && (f = l);
		0 > h && (h *= q = -1);
		h > l && (h = l);
		0 > k && (k *= p = -1);
		k > l && (k = l);
		0 > j && (j *= s = -1);
		j > l && (j = l);
		this._dirty = this._active = !0;
		var l = this._ctx.arcTo, r = this._ctx.lineTo;
		this._activeInstructions.push(new c(this._ctx.moveTo, [a + d - h, b]), new c(l, [a + d + h * q, b - h * q, a + d, b + h, h]), new c(r, [a + d, b + e - k]), new c(l, [a + d + k * p, b + e + k * p, a + d - k, b + e, k]), new c(r, [a + j, b + e]), new c(l, [a - j * s, b + e + j * s, a, b + e - j, j]), new c(r, [a, b + f]), new c(l, [a - f * n, b - f * n, a + f, b, f]), new c(this._ctx.closePath));
		return this
	};
	a.drawCircle =
		function (a, b, d) {
			this.arc(a, b, d, 0, 2 * Math.PI);
			return this
		};
	a.drawEllipse = function (a, b, d, e) {
		this._dirty = this._active = !0;
		var f = 0.5522848 * (d / 2), h = 0.5522848 * (e / 2), k = a + d, j = b + e;
		d = a + d / 2;
		e = b + e / 2;
		this._activeInstructions.push(new c(this._ctx.moveTo, [a, e]), new c(this._ctx.bezierCurveTo, [a, e - h, d - f, b, d, b]), new c(this._ctx.bezierCurveTo, [d + f, b, k, e - h, k, e]), new c(this._ctx.bezierCurveTo, [k, e + h, d + f, j, d, j]), new c(this._ctx.bezierCurveTo, [d - f, j, a, e + h, a, e]));
		return this
	};
	a.drawPolyStar = function (a, b, d, e, f, h) {
		this._dirty =
			this._active = !0;
		null == f && (f = 0);
		f = 1 - f;
		h = null == h ? 0 : h / (180 / Math.PI);
		var k = Math.PI / e;
		this._activeInstructions.push(new c(this._ctx.moveTo, [a + Math.cos(h) * d, b + Math.sin(h) * d]));
		for (var j = 0; j < e; j++)h += k, 1 != f && this._activeInstructions.push(new c(this._ctx.lineTo, [a + Math.cos(h) * d * f, b + Math.sin(h) * d * f])), h += k, this._activeInstructions.push(new c(this._ctx.lineTo, [a + Math.cos(h) * d, b + Math.sin(h) * d]));
		return this
	};
	a.decodePath = function (a) {
		for (var g = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo,
			this.closePath], d = [2, 2, 4, 6, 0], c = 0, f = a.length, h = [], k = 0, j = 0, l = b.BASE_64; c < f;) {
			var n = a.charAt(c), q = l[n], p = q >> 3, s = g[p];
			if (!s || q & 3)throw"bad path data (@" + c + "): " + n;
			n = d[p];
			p || (k = j = 0);
			h.length = 0;
			c++;
			q = (q >> 2 & 1) + 2;
			for (p = 0; p < n; p++) {
				var r = l[a.charAt(c)], u = r >> 5 ? -1 : 1, r = (r & 31) << 6 | l[a.charAt(c + 1)];
				3 == q && (r = r << 6 | l[a.charAt(c + 2)]);
				r = u * r / 10;
				p % 2 ? k = r += k : j = r += j;
				h[p] = r;
				c += q
			}
			s.apply(this, h)
		}
		return this
	};
	a.clone = function () {
		var a = new b;
		a._instructions = this._instructions.slice();
		a._activeInstructions = this._activeInstructions.slice();
		a._oldInstructions = this._oldInstructions.slice();
		this._fillInstructions && (a._fillInstructions = this._fillInstructions.slice());
		this._strokeInstructions && (a._strokeInstructions = this._strokeInstructions.slice());
		this._strokeStyleInstructions && (a._strokeStyleInstructions = this._strokeStyleInstructions.slice());
		a._active = this._active;
		a._dirty = this._dirty;
		return a
	};
	a.toString = function () {
		return"[Graphics]"
	};
	a.mt = a.moveTo;
	a.lt = a.lineTo;
	a.at = a.arcTo;
	a.bt = a.bezierCurveTo;
	a.qt = a.quadraticCurveTo;
	a.a = a.arc;
	a.r =
		a.rect;
	a.cp = a.closePath;
	a.c = a.clear;
	a.f = a.beginFill;
	a.lf = a.beginLinearGradientFill;
	a.rf = a.beginRadialGradientFill;
	a.bf = a.beginBitmapFill;
	a.ef = a.endFill;
	a.ss = a.setStrokeStyle;
	a.s = a.beginStroke;
	a.ls = a.beginLinearGradientStroke;
	a.rs = a.beginRadialGradientStroke;
	a.bs = a.beginBitmapStroke;
	a.es = a.endStroke;
	a.dr = a.drawRect;
	a.rr = a.drawRoundRect;
	a.rc = a.drawRoundRectComplex;
	a.dc = a.drawCircle;
	a.de = a.drawEllipse;
	a.dp = a.drawPolyStar;
	a.p = a.decodePath;
	a._updateInstructions = function () {
		this._instructions = this._oldInstructions.slice();
		this._instructions.push(b.beginCmd);
		this._instructions.push.apply(this._instructions, this._activeInstructions);
		this._fillInstructions && this._instructions.push.apply(this._instructions, this._fillInstructions);
		this._strokeInstructions && (this._strokeStyleInstructions && this._instructions.push.apply(this._instructions, this._strokeStyleInstructions), this._instructions.push.apply(this._instructions, this._strokeInstructions), this._ignoreScaleStroke ? this._instructions.push(new c(this._ctx.save, [], !1), new c(this._ctx.setTransform,
			[1, 0, 0, 1, 0, 0], !1), b.strokeCmd, new c(this._ctx.restore, [], !1)) : this._instructions.push(b.strokeCmd))
	};
	a._newPath = function () {
		this._dirty && this._updateInstructions();
		this._oldInstructions = this._instructions;
		this._activeInstructions = [];
		this._active = this._dirty = !1
	};
	a._setProp = function (a, b) {
		this[a] = b
	};
	createjs.Graphics = b
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		this.initialize()
	}, b = c.prototype;
	c.suppressCrossDomainErrors = !1;
	c._hitTestCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	c._hitTestCanvas.width = c._hitTestCanvas.height = 1;
	c._hitTestContext = c._hitTestCanvas.getContext("2d");
	c._nextCacheID = 1;
	b.alpha = 1;
	b.cacheCanvas = null;
	b.id = -1;
	b.mouseEnabled = !0;
	b.name = null;
	b.parent = null;
	b.regX = 0;
	b.regY = 0;
	b.rotation = 0;
	b.scaleX = 1;
	b.scaleY = 1;
	b.skewX = 0;
	b.skewY = 0;
	b.shadow = null;
	b.visible = !0;
	b.x = 0;
	b.y = 0;
	b.compositeOperation =
		null;
	b.snapToPixel = !1;
	b.onPress = null;
	b.onClick = null;
	b.onDoubleClick = null;
	b.onMouseOver = null;
	b.onMouseOut = null;
	b.onTick = null;
	b.filters = null;
	b.cacheID = 0;
	b.mask = null;
	b.hitArea = null;
	b.cursor = null;
	b.addEventListener = null;
	b.removeEventListener = null;
	b.removeAllEventListeners = null;
	b.dispatchEvent = null;
	b.hasEventListener = null;
	b._listeners = null;
	createjs.EventDispatcher.initialize(b);
	b._cacheOffsetX = 0;
	b._cacheOffsetY = 0;
	b._cacheScale = 1;
	b._cacheDataURLID = 0;
	b._cacheDataURL = null;
	b._matrix = null;
	b.initialize = function () {
		this.id =
			createjs.UID.get();
		this._matrix = new createjs.Matrix2D
	};
	b.isVisible = function () {
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY))
	};
	b.draw = function (a, b) {
		var c = this.cacheCanvas;
		if (b || !c)return!1;
		var d = this._cacheScale;
		a.drawImage(c, this._cacheOffsetX, this._cacheOffsetY, c.width / d, c.height / d);
		return!0
	};
	b.updateContext = function (a) {
		var b, c = this.mask;
		c && (c.graphics && !c.graphics.isEmpty()) && (b = c.getMatrix(c._matrix), a.transform(b.a, b.b, b.c, b.d, b.tx, b.ty), c.graphics.drawAsPath(a), a.clip(),
			b.invert(), a.transform(b.a, b.b, b.c, b.d, b.tx, b.ty));
		b = this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
		createjs.Stage._snapToPixelEnabled && this.snapToPixel ? a.transform(b.a, b.b, b.c, b.d, b.tx + 0.5 | 0, b.ty + 0.5 | 0) : a.transform(b.a, b.b, b.c, b.d, b.tx, b.ty);
		a.globalAlpha *= this.alpha;
		this.compositeOperation && (a.globalCompositeOperation = this.compositeOperation);
		this.shadow && this._applyShadow(a, this.shadow)
	};
	b.cache = function (a, b, c, d, e) {
		e = e || 1;
		this.cacheCanvas || (this.cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"));
		this.cacheCanvas.width = Math.ceil(c * e);
		this.cacheCanvas.height = Math.ceil(d * e);
		this._cacheOffsetX = a;
		this._cacheOffsetY = b;
		this._cacheScale = e || 1;
		this.updateCache()
	};
	b.updateCache = function (a) {
		var b = this.cacheCanvas, g = this._cacheScale, d = this._cacheOffsetX * g, e = this._cacheOffsetY * g;
		if (!b)throw"cache() must be called before updateCache()";
		var f = b.getContext("2d");
		f.save();
		a ||
		f.clearRect(0, 0, b.width + 1, b.height + 1);
		f.globalCompositeOperation = a;
		f.setTransform(g, 0, 0, g, -d, -e);
		this.draw(f, !0);
		this._applyFilters();
		f.restore();
		this.cacheID = c._nextCacheID++
	};
	b.uncache = function () {
		this._cacheDataURL = this.cacheCanvas = null;
		this.cacheID = this._cacheOffsetX = this._cacheOffsetY = 0;
		this._cacheScale = 1
	};
	b.getCacheDataURL = function () {
		if (!this.cacheCanvas)return null;
		this.cacheID != this._cacheDataURLID && (this._cacheDataURL = this.cacheCanvas.toDataURL());
		return this._cacheDataURL
	};
	b.getStage = function () {
		for (var a =
			this; a.parent;)a = a.parent;
		return a instanceof createjs.Stage ? a : null
	};
	b.localToGlobal = function (a, b) {
		var c = this.getConcatenatedMatrix(this._matrix);
		if (null == c)return null;
		c.append(1, 0, 0, 1, a, b);
		return new createjs.Point(c.tx, c.ty)
	};
	b.globalToLocal = function (a, b) {
		var c = this.getConcatenatedMatrix(this._matrix);
		if (null == c)return null;
		c.invert();
		c.append(1, 0, 0, 1, a, b);
		return new createjs.Point(c.tx, c.ty)
	};
	b.localToLocal = function (a, b, c) {
		a = this.localToGlobal(a, b);
		return c.globalToLocal(a.x, a.y)
	};
	b.setTransform =
		function (a, b, c, d, e, f, h, k, j) {
			this.x = a || 0;
			this.y = b || 0;
			this.scaleX = null == c ? 1 : c;
			this.scaleY = null == d ? 1 : d;
			this.rotation = e || 0;
			this.skewX = f || 0;
			this.skewY = h || 0;
			this.regX = k || 0;
			this.regY = j || 0;
			return this
		};
	b.getMatrix = function (a) {
		return(a ? a.identity() : new createjs.Matrix2D).appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY).appendProperties(this.alpha, this.shadow, this.compositeOperation)
	};
	b.getConcatenatedMatrix = function (a) {
		a ? a.identity() : a = new createjs.Matrix2D;
		for (var b = this; null != b;)a.prependTransform(b.x, b.y, b.scaleX, b.scaleY, b.rotation, b.skewX, b.skewY, b.regX, b.regY).prependProperties(b.alpha, b.shadow, b.compositeOperation), b = b.parent;
		return a
	};
	b.hitTest = function (a, b) {
		var g = c._hitTestContext;
		g.setTransform(1, 0, 0, 1, -a, -b);
		this.draw(g);
		var d = this._testHit(g);
		g.setTransform(1, 0, 0, 1, 0, 0);
		g.clearRect(0, 0, 2, 2);
		return d
	};
	b.set = function (a) {
		for (var b in a)this[b] = a[b];
		return this
	};
	b.clone = function () {
		var a = new c;
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[DisplayObject (name=" +
			this.name + ")]"
	};
	b.cloneProps = function (a) {
		a.alpha = this.alpha;
		a.name = this.name;
		a.regX = this.regX;
		a.regY = this.regY;
		a.rotation = this.rotation;
		a.scaleX = this.scaleX;
		a.scaleY = this.scaleY;
		a.shadow = this.shadow;
		a.skewX = this.skewX;
		a.skewY = this.skewY;
		a.visible = this.visible;
		a.x = this.x;
		a.y = this.y;
		a.mouseEnabled = this.mouseEnabled;
		a.compositeOperation = this.compositeOperation;
		this.cacheCanvas && (a.cacheCanvas = this.cacheCanvas.cloneNode(!0), a.cacheCanvas.getContext("2d").putImageData(this.cacheCanvas.getContext("2d").getImageData(0,
			0, this.cacheCanvas.width, this.cacheCanvas.height), 0, 0))
	};
	b._applyShadow = function (a, b) {
		b = b || Shadow.identity;
		a.shadowColor = b.color;
		a.shadowOffsetX = b.offsetX;
		a.shadowOffsetY = b.offsetY;
		a.shadowBlur = b.blur
	};
	b._tick = function (a) {
		this.onTick && this.onTick.apply(this, a);
		var b = this._listeners;
		b && b.tick && this.dispatchEvent({type: "tick", params: a})
	};
	b._testHit = function (a) {
		try {
			var b = 1 < a.getImageData(0, 0, 1, 1).data[3]
		} catch (g) {
			if (!c.suppressCrossDomainErrors)throw"An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
		}
		return b
	};
	b._applyFilters = function () {
		if (this.filters && 0 != this.filters.length && this.cacheCanvas)for (var a = this.filters.length, b = this.cacheCanvas.getContext("2d"), c = this.cacheCanvas.width, d = this.cacheCanvas.height, e = 0; e < a; e++)this.filters[e].applyFilter(b, 0, 0, c, d)
	};
	b._hasMouseHandler = function (a) {
		var b = this._listeners;
		return!!(a & 1 && (this.onPress || this.onClick || this.onDoubleClick || b && (this.hasEventListener("mousedown") || this.hasEventListener("click") || this.hasEventListener("dblclick"))) || a & 2 && (this.onMouseOver ||
			this.onMouseOut || this.cursor || b && (this.hasEventListener("mouseover") || this.hasEventListener("mouseout"))))
	};
	createjs.DisplayObject = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		this.initialize()
	}, b = c.prototype = new createjs.DisplayObject;
	b.children = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize = function () {
		this.DisplayObject_initialize();
		this.children = []
	};
	b.isVisible = function () {
		var a = this.cacheCanvas || this.children.length;
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && a))
	};
	b.DisplayObject_draw = b.draw;
	b.draw = function (a, b) {
		if (this.DisplayObject_draw(a, b))return!0;
		for (var c = this.children.slice(0), d = 0, e = c.length; d <
			e; d++) {
			var f = c[d];
			f.isVisible() && (a.save(), f.updateContext(a), f.draw(a), a.restore())
		}
		return!0
	};
	b.addChild = function (a) {
		if (null == a)return a;
		var b = arguments.length;
		if (1 < b) {
			for (var c = 0; c < b; c++)this.addChild(arguments[c]);
			return arguments[b - 1]
		}
		a.parent && a.parent.removeChild(a);
		a.parent = this;
		this.children.push(a);
		return a
	};
	b.addChildAt = function (a, b) {
		var c = arguments.length, d = arguments[c - 1];
		if (0 > d || d > this.children.length)return arguments[c - 2];
		if (2 < c) {
			for (var e = 0; e < c - 1; e++)this.addChildAt(arguments[e], d + e);
			return arguments[c - 2]
		}
		a.parent && a.parent.removeChild(a);
		a.parent = this;
		this.children.splice(b, 0, a);
		return a
	};
	b.removeChild = function (a) {
		var b = arguments.length;
		if (1 < b) {
			for (var c = !0, d = 0; d < b; d++)c = c && this.removeChild(arguments[d]);
			return c
		}
		return this.removeChildAt(this.children.indexOf(a))
	};
	b.removeChildAt = function (a) {
		var b = arguments.length;
		if (1 < b) {
			for (var c = [], d = 0; d < b; d++)c[d] = arguments[d];
			c.sort(function (a, b) {
				return b - a
			});
			for (var e = !0, d = 0; d < b; d++)e = e && this.removeChildAt(c[d]);
			return e
		}
		if (0 > a || a > this.children.length -
			1)return!1;
		if (b = this.children[a])b.parent = null;
		this.children.splice(a, 1);
		return!0
	};
	b.removeAllChildren = function () {
		for (var a = this.children; a.length;)a.pop().parent = null
	};
	b.getChildAt = function (a) {
		return this.children[a]
	};
	b.getChildByName = function (a) {
		for (var b = this.children, c = 0, d = b.length; c < d; c++)if (b[c].name == a)return b[c];
		return null
	};
	b.sortChildren = function (a) {
		this.children.sort(a)
	};
	b.getChildIndex = function (a) {
		return this.children.indexOf(a)
	};
	b.getNumChildren = function () {
		return this.children.length
	};
	b.swapChildrenAt = function (a, b) {
		var c = this.children, d = c[a], e = c[b];
		d && e && (c[a] = e, c[b] = d)
	};
	b.swapChildren = function (a, b) {
		for (var c = this.children, d, e, f = 0, h = c.length; f < h && !(c[f] == a && (d = f), c[f] == b && (e = f), null != d && null != e); f++);
		f != h && (c[d] = b, c[e] = a)
	};
	b.setChildIndex = function (a, b) {
		var c = this.children, d = c.length;
		if (!(a.parent != this || 0 > b || b >= d)) {
			for (var e = 0; e < d && c[e] != a; e++);
			e == d || e == b || (c.splice(e, 1), b < e && b--, c.splice(b, 0, a))
		}
	};
	b.contains = function (a) {
		for (; a;) {
			if (a == this)return!0;
			a = a.parent
		}
		return!1
	};
	b.hitTest =
		function (a, b) {
			return null != this.getObjectUnderPoint(a, b)
		};
	b.getObjectsUnderPoint = function (a, b) {
		var c = [], d = this.localToGlobal(a, b);
		this._getObjectsUnderPoint(d.x, d.y, c);
		return c
	};
	b.getObjectUnderPoint = function (a, b) {
		var c = this.localToGlobal(a, b);
		return this._getObjectsUnderPoint(c.x, c.y)
	};
	b.clone = function (a) {
		var b = new c;
		this.cloneProps(b);
		if (a)for (var g = b.children = [], d = 0, e = this.children.length; d < e; d++) {
			var f = this.children[d].clone(a);
			f.parent = b;
			g.push(f)
		}
		return b
	};
	b.toString = function () {
		return"[Container (name=" +
			this.name + ")]"
	};
	b.DisplayObject__tick = b._tick;
	b._tick = function (a) {
		for (var b = this.children.length - 1; 0 <= b; b--) {
			var c = this.children[b];
			c._tick && c._tick(a)
		}
		this.DisplayObject__tick(a)
	};
	b._getObjectsUnderPoint = function (a, b, g, d) {
		var e = createjs.DisplayObject._hitTestContext, f = this._matrix, h = this._hasMouseHandler(d);
		if (!this.hitArea
			&& (this.cacheCanvas && h)
			&& (this.getConcatenatedMatrix(f)
				,e.setTransform(f.a, f.b, f.c, f.d, f.tx - a, f.ty - b)
				, e.globalAlpha = f.alpha
				, this.draw(e)
				, this._testHit(e)
				))
			return e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, 2, 2), this;

		for (var k = this.children.length - 1; 0 <= k; k--) {
			var j = this.children[k], l = j.hitArea;
			if (j.visible && !(!l && !j.isVisible() || d && !j.mouseEnabled)) {
				var n = d && j._hasMouseHandler(d);
				if (j instanceof c && (!l || !n))if (h) {
					if (j = j._getObjectsUnderPoint(a, b))return this
				} else {
					if (j = j._getObjectsUnderPoint(a, b, g, d), !g && j)return j
				} else if (!d || h || n)
					if (j.getConcatenatedMatrix(f)
						, l && (f.appendTransform(l.x, l.y, l.scaleX, l.scaleY, l.rotation, l.skewX, l.skewY, l.regX, l.regY), f.alpha = l.alpha)
						, e.globalAlpha = f.alpha
						, e.setTransform(f.a, f.b, f.c, f.d, f.tx - a, f.ty - b)
						, (l || j).draw(e)
						, this._testHit(e)
						) {
					e.setTransform(1, 0, 0, 1, 0, 0);
					e.clearRect(0, 0, 2, 2);
					if (h)return this;
					if (g)g.push(j); else return j
				}
			}
		}
		return null
	};
	createjs.Container = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype = new createjs.Container;
	c._snapToPixelEnabled = !1;
	b.autoClear = !0;
	b.canvas = null;
	b.mouseX = 0;
	b.mouseY = 0;
	b.onMouseMove = null;
	b.onMouseUp = null;
	b.onMouseDown = null;
	b.snapToPixelEnabled = !1;
	b.mouseInBounds = !1;
	b.tickOnUpdate = !0;
	b.mouseMoveOutside = !1;
	b._pointerData = null;
	b._pointerCount = 0;
	b._primaryPointerID = null;
	b._mouseOverIntervalID = null;
	b.Container_initialize = b.initialize;
	b.initialize = function (a) {
		this.Container_initialize();
		this.canvas = "string" == typeof a ? document.getElementById(a) : a;
		this._pointerData = {};
		this.enableDOMEvents(!0)
	};
	b.update = function () {
		if (this.canvas) {
			this.autoClear && this.clear();
			c._snapToPixelEnabled = this.snapToPixelEnabled;
			this.tickOnUpdate && this._tick(arguments.length ? arguments : null);
			var a = this.canvas.getContext("2d");
			a.save();
			this.updateContext(a);
			this.draw(a, !1);
			a.restore()
		}
	};
	b.tick = b.update;
	b.handleEvent = function (a) {
		"tick" == a.type && this.update(a)
	};
	b.clear = function () {
		if (this.canvas) {
			var a = this.canvas.getContext("2d");
			a.setTransform(1,
				0, 0, 1, 0, 0);
			a.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1)
		}
	};
	b.toDataURL = function (a, b) {
		b || (b = "image/png");
		var c = this.canvas.getContext("2d"), d = this.canvas.width, e = this.canvas.height, f;
		if (a) {
			f = c.getImageData(0, 0, d, e);
			var h = c.globalCompositeOperation;
			c.globalCompositeOperation = "destination-over";
			c.fillStyle = a;
			c.fillRect(0, 0, d, e)
		}
		var k = this.canvas.toDataURL(b);
		a && (c.clearRect(0, 0, d + 1, e + 1), c.putImageData(f, 0, 0), c.globalCompositeOperation = h);
		return k
	};
	b.enableMouseOver = function (a) {
		this._mouseOverIntervalID &&
		(clearInterval(this._mouseOverIntervalID), this._mouseOverIntervalID = null);
		if (null == a)a = 20; else if (0 >= a)return;
		var b = this;
		this._mouseOverIntervalID = setInterval(function () {
			b._testMouseOver()
		}, 1E3 / Math.min(50, a))
	};
	b.enableDOMEvents = function (a) {
		null == a && (a = !0);
		var b, c = this._eventListeners;
		if (!a && c) {
			for (b in c)a = c[b], a.t.removeEventListener(b, a.f);
			this._eventListeners = null
		} else if (a && !c && this.canvas) {
			a = window.addEventListener ? window : document;
			var d = this, c = this._eventListeners = {};
			c.mouseup = {t: a, f: function (a) {
				d._handleMouseUp(a)
			}};
			c.mousemove = {t: a, f: function (a) {
				d._handleMouseMove(a)
			}};
			c.dblclick = {t: a, f: function (a) {
				d._handleDoubleClick(a)
			}};
			c.mousedown = {t: this.canvas, f: function (a) {
				d._handleMouseDown(a)
			}};
			for (b in c)a = c[b], a.t.addEventListener(b, a.f)
		}
	};
	b.clone = function () {
		var a = new c(null);
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[Stage (name=" + this.name + ")]"
	};
	b._getPointerData = function (a) {
		var b = this._pointerData[a];
		if (!b && (b = this._pointerData[a] = {x: 0, y: 0}, null == this._primaryPointerID || -1 == this._primaryPointerID))this._primaryPointerID =
			a;
		return b
	};
	b._handleMouseMove = function (a) {
		a || (a = window.event);
		this._handlePointerMove(-1, a, a.pageX, a.pageY)
	};
	b._handlePointerMove = function (a, b, c, d) {
		if (this.canvas) {
			var e = this._getPointerData(a), f = e.inBounds;
			this._updatePointerPosition(a, c, d);
			if (f || e.inBounds || this.mouseMoveOutside) {
				if (this.onMouseMove || this.hasEventListener("stagemousemove"))c = new createjs.MouseEvent("stagemousemove", e.x, e.y, this, b, a, a == this._primaryPointerID, e.rawX, e.rawY), this.onMouseMove && this.onMouseMove(c), this.dispatchEvent(c);
				if ((d = e.event) && (d.onMouseMove || d.hasEventListener("mousemove")))c = new createjs.MouseEvent("mousemove", e.x, e.y, d.target, b, a, a == this._primaryPointerID, e.rawX, e.rawY), d.onMouseMove && d.onMouseMove(c), d.dispatchEvent(c, d.target)
			}
		}
	};
	b._updatePointerPosition = function (a, b, c) {
		var d = this._getElementRect(this.canvas);
		b -= d.left;
		c -= d.top;
		var e = this.canvas.width, f = this.canvas.height;
		b /= (d.right - d.left) / e;
		c /= (d.bottom - d.top) / f;
		d = this._getPointerData(a);
		(d.inBounds = 0 <= b && 0 <= c && b <= e - 1 && c <= f - 1) ? (d.x = b, d.y = c) : this.mouseMoveOutside &&
			(d.x = 0 > b ? 0 : b > e - 1 ? e - 1 : b, d.y = 0 > c ? 0 : c > f - 1 ? f - 1 : c);
		d.rawX = b;
		d.rawY = c;
		a == this._primaryPointerID && (this.mouseX = d.x, this.mouseY = d.y, this.mouseInBounds = d.inBounds)
	};
	b._getElementRect = function (a) {
		var b;
		try {
			b = a.getBoundingClientRect()
		} catch (c) {
			b = {top: a.offsetTop, left: a.offsetLeft, width: a.offsetWidth, height: a.offsetHeight}
		}
		var d = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0), e = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop ||
			0), f = window.getComputedStyle ? getComputedStyle(a) : a.currentStyle;
		a = parseInt(f.paddingLeft) + parseInt(f.borderLeftWidth);
		var h = parseInt(f.paddingTop) + parseInt(f.borderTopWidth), k = parseInt(f.paddingRight) + parseInt(f.borderRightWidth), f = parseInt(f.paddingBottom) + parseInt(f.borderBottomWidth);
		return{left: b.left + d + a, right: b.right + d - k, top: b.top + e + h, bottom: b.bottom + e - f}
	};
	b._handleMouseUp = function (a) {
		this._handlePointerUp(-1, a, !1)
	};
	b._handlePointerUp = function (a, b, c) {
		var d = this._getPointerData(a), e;
		if (this.onMouseMove ||
			this.hasEventListener("stagemouseup"))e = new createjs.MouseEvent("stagemouseup", d.x, d.y, this, b, a, a == this._primaryPointerID, d.rawX, d.rawY), this.onMouseUp && this.onMouseUp(e), this.dispatchEvent(e);
		var f = d.event;
		if (f && (f.onMouseUp || f.hasEventListener("mouseup")))e = new createjs.MouseEvent("mouseup", d.x, d.y, f.target, b, a, a == this._primaryPointerID, d.rawX, d.rawY), f.onMouseUp && f.onMouseUp(e), f.dispatchEvent(e, f.target);
		if ((f = d.target)
			&& (f.onClick || f.hasEventListener("click"))
			&& this._getObjectsUnderPoint(d.x, d.y, null, !0, this._mouseOverIntervalID ? 3 : 1) == f)
			e = new createjs.MouseEvent("click", d.x, d.y, f, b, a, a == this._primaryPointerID, d.rawX, d.rawY), f.onClick && f.onClick(e), f.dispatchEvent(e);
		c ? (a == this._primaryPointerID && (this._primaryPointerID = null), delete this._pointerData[a]) : d.event = d.target = null
	};
	b._handleMouseDown = function (a) {
		this._handlePointerDown(-1, a, !1)
	};
	b._handlePointerDown = function (a, b, c, d) {
		var e = this._getPointerData(a);
		null != d && this._updatePointerPosition(a, c, d);
		if (this.onMouseDown || this.hasEventListener("stagemousedown"))c =
			new createjs.MouseEvent("stagemousedown", e.x, e.y, this, b, a, a == this._primaryPointerID, e.rawX, e.rawY), this.onMouseDown && this.onMouseDown(c), this.dispatchEvent(c);
		if (d = this._getObjectsUnderPoint(e.x, e.y, null, this._mouseOverIntervalID ? 3 : 1))if (e.target = d, d.onPress || d.hasEventListener("mousedown"))if (c = new createjs.MouseEvent("mousedown", e.x, e.y, d, b, a, a == this._primaryPointerID, e.rawX, e.rawY), d.onPress && d.onPress(c), d.dispatchEvent(c), c.onMouseMove || c.onMouseUp || c.hasEventListener("mousemove") || c.hasEventListener("mouseup"))e.event =
			c
	};
	b._testMouseOver = function () {
		if (-1 == this._primaryPointerID && !(this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds)) {
			var a = null;
			this.mouseInBounds && (a = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, 3), this._mouseOverX = this.mouseX, this._mouseOverY = this.mouseY);
			var b = this._mouseOverTarget;
			if (b != a) {
				var c = this._getPointerData(-1);
				if (b && (b.onMouseOut || b.hasEventListener("mouseout"))) {
					var d = new createjs.MouseEvent("mouseout", c.x, c.y, b, null, -1, c.rawX, c.rawY);
					b.onMouseOut &&
					b.onMouseOut(d);
					b.dispatchEvent(d)
				}
				b && (this.canvas.style.cursor = "");
				if (a && (a.onMouseOver || a.hasEventListener("mouseover")))d = new createjs.MouseEvent("mouseover", c.x, c.y, a, null, -1, c.rawX, c.rawY), a.onMouseOver && a.onMouseOver(d), a.dispatchEvent(d);
				a && (this.canvas.style.cursor = a.cursor || "");
				this._mouseOverTarget = a
			}
		}
	};
	b._handleDoubleClick = function (a) {
		var b = this._getPointerData(-1), c = this._getObjectsUnderPoint(b.x, b.y, null, this._mouseOverIntervalID ? 3 : 1);
		if (c && (c.onDoubleClick || c.hasEventListener("dblclick")))evt =
			new createjs.MouseEvent("dblclick", b.x, b.y, c, a, -1, !0, b.rawX, b.rawY), c.onDoubleClick && c.onDoubleClick(evt), c.dispatchEvent(evt)
	};
	createjs.Stage = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype = new createjs.DisplayObject;
	b.image = null;
	b.snapToPixel = !0;
	b.sourceRect = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize = function (a) {
		this.DisplayObject_initialize();
		"string" == typeof a ? (this.image = new Image, this.image.src = a) : this.image = a
	};
	b.isVisible = function () {
		var a = this.cacheCanvas || this.image && (this.image.complete || this.image.getContext || 2 <= this.image.readyState);
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY &&
			a))
	};
	b.DisplayObject_draw = b.draw;
	b.draw = function (a, b) {
		if (this.DisplayObject_draw(a, b))return!0;
		var c = this.sourceRect;
		c ? a.drawImage(this.image, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height) : a.drawImage(this.image, 0, 0);
		return!0
	};
	b.clone = function () {
		var a = new c(this.image);
		this.sourceRect && (a.sourceRect = this.sourceRect.clone());
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[Bitmap (name=" + this.name + ")]"
	};
	createjs.Bitmap = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype = new createjs.DisplayObject;
	b.onAnimationEnd = null;
	b.currentFrame = -1;
	b.currentAnimation = null;
	b.paused = !0;
	b.spriteSheet = null;
	b.snapToPixel = !0;
	b.offset = 0;
	b.currentAnimationFrame = 0;
	b.addEventListener = null;
	b.removeEventListener = null;
	b.removeAllEventListeners = null;
	b.dispatchEvent = null;
	b.hasEventListener = null;
	b._listeners = null;
	createjs.EventDispatcher.initialize(b);
	b._advanceCount = 0;
	b._animation = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize =
		function (a) {
			this.DisplayObject_initialize();
			this.spriteSheet = a
		};
	b.isVisible = function () {
		var a = this.cacheCanvas || this.spriteSheet.complete && 0 <= this.currentFrame;
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && a))
	};
	b.DisplayObject_draw = b.draw;
	b.draw = function (a, b) {
		if (this.DisplayObject_draw(a, b))return!0;
		this._normalizeFrame();
		var c = this.spriteSheet.getFrame(this.currentFrame);
		if (c) {
			var d = c.rect;
			a.drawImage(c.image, d.x, d.y, d.width, d.height, -c.regX, -c.regY, d.width, d.height);
			return!0
		}
	};
	b.play = function () {
		this.paused = !1
	};
	b.stop = function () {
		this.paused = !0
	};
	b.gotoAndPlay = function (a) {
		this.paused = !1;
		this._goto(a)
	};
	b.gotoAndStop = function (a) {
		this.paused = !0;
		this._goto(a)
	};
	b.advance = function () {
		this._animation ? this.currentAnimationFrame++ : this.currentFrame++;
		this._normalizeFrame()
	};
	b.getBounds = function () {
		return this.spriteSheet.getFrameBounds(this.currentFrame)
	};
	b.clone = function () {
		var a = new c(this.spriteSheet);
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[BitmapAnimation (name=" +
			this.name + ")]"
	};
	b.DisplayObject__tick = b._tick;
	b._tick = function (a) {
		var b = this._animation ? this._animation.frequency : 1;
		!this.paused && 0 == (++this._advanceCount + this.offset) % b && this.advance();
		this.DisplayObject__tick(a)
	};
	b._normalizeFrame = function () {
		var a = this._animation, b = this.currentFrame, c = this.paused, d;
		if (a)if (d = a.frames.length, this.currentAnimationFrame >= d) {
			var e = a.next;
			this._dispatchAnimationEnd(a, b, c, e, d - 1) || (e ? this._goto(e) : (this.paused = !0, this.currentAnimationFrame = a.frames.length - 1, this.currentFrame =
				a.frames[this.currentAnimationFrame]))
		} else this.currentFrame = a.frames[this.currentAnimationFrame]; else d = this.spriteSheet.getNumFrames(), b >= d && !this._dispatchAnimationEnd(a, b, c, d - 1) && (this.currentFrame = 0)
	};
	b._dispatchAnimationEnd = function (a, b, c, d, e) {
		var f = a ? a.name : null;
		this.onAnimationEnd && this.onAnimationEnd(this, f, d);
		this.dispatchEvent({type: "animationend", name: f, next: d});
		!c && this.paused && (this.currentAnimationFrame = e);
		return this.paused != c || this._animation != a || this.currentFrame != b
	};
	b.DisplayObject_cloneProps =
		b.cloneProps;
	b.cloneProps = function (a) {
		this.DisplayObject_cloneProps(a);
		a.onAnimationEnd = this.onAnimationEnd;
		a.currentFrame = this.currentFrame;
		a.currentAnimation = this.currentAnimation;
		a.paused = this.paused;
		a.offset = this.offset;
		a._animation = this._animation;
		a.currentAnimationFrame = this.currentAnimationFrame
	};
	b._goto = function (a) {
		if (isNaN(a)) {
			var b = this.spriteSheet.getAnimation(a);
			b && (this.currentAnimationFrame = 0, this._animation = b, this.currentAnimation = a, this._normalizeFrame())
		} else this.currentAnimation =
			this._animation = null, this.currentFrame = a
	};
	createjs.BitmapAnimation = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype = new createjs.DisplayObject;
	b.graphics = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize = function (a) {
		this.DisplayObject_initialize();
		this.graphics = a ? a : new createjs.Graphics
	};
	b.isVisible = function () {
		var a = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && a))
	};
	b.DisplayObject_draw = b.draw;
	b.draw = function (a, b) {
		if (this.DisplayObject_draw(a, b))return!0;
		this.graphics.draw(a);
		return!0
	};
	b.clone = function (a) {
		a = new c(a && this.graphics ? this.graphics.clone() : this.graphics);
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[Shape (name=" + this.name + ")]"
	};
	createjs.Shape = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a, b, c) {
		this.initialize(a, b, c)
	}, b = c.prototype = new createjs.DisplayObject;
	c._workingContext = (createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas")).getContext("2d");
	b.text = "";
	b.font = null;
	b.color = "#000";
	b.textAlign = "left";
	b.textBaseline = "top";
	b.maxWidth = null;
	b.outline = !1;
	b.lineHeight = 0;
	b.lineWidth = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize = function (a, b, c) {
		this.DisplayObject_initialize();
		this.text = a;
		this.font = b;
		this.color = c ? c : "#000"
	};
	b.isVisible = function () {
		var a = this.cacheCanvas || null != this.text && "" !== this.text;
		return!(!this.visible || !(0 < this.alpha && 0 != this.scaleX && 0 != this.scaleY && a))
	};
	b.DisplayObject_draw = b.draw;
	b.draw = function (a, b) {
		if (this.DisplayObject_draw(a, b))return!0;
		this.outline ? a.strokeStyle = this.color : a.fillStyle = this.color;
		a.font = this.font;
		a.textAlign = this.textAlign || "start";
		a.textBaseline = this.textBaseline || "alphabetic";
		this._drawText(a);
		return!0
	};
	b.getMeasuredWidth = function () {
		return this._getWorkingContext().measureText(this.text).width
	};
	b.getMeasuredLineHeight = function () {
		return 1.2 * this._getWorkingContext().measureText("M").width
	};
	b.getMeasuredHeight = function () {
		return this._drawText() * (this.lineHeight || this.getMeasuredLineHeight())
	};
	b.clone = function () {
		var a = new c(this.text, this.font, this.color);
		this.cloneProps(a);
		return a
	};
	b.toString = function () {
		return"[Text (text=" + (20 < this.text.length ? this.text.substr(0, 17) + "..." : this.text) + ")]"
	};
	b.DisplayObject_cloneProps = b.cloneProps;
	b.cloneProps = function (a) {
		this.DisplayObject_cloneProps(a);
		a.textAlign =
			this.textAlign;
		a.textBaseline = this.textBaseline;
		a.maxWidth = this.maxWidth;
		a.outline = this.outline;
		a.lineHeight = this.lineHeight;
		a.lineWidth = this.lineWidth
	};
	b._getWorkingContext = function () {
		var a = c._workingContext;
		a.font = this.font;
		a.textAlign = this.textAlign || "start";
		a.textBaseline = this.textBaseline || "alphabetic";
		return a
	};
	b._drawText = function (a) {
		var b = !!a;
		b || (a = this._getWorkingContext());
		for (var c = String(this.text).split(/(?:\r\n|\r|\n)/), d = this.lineHeight || this.getMeasuredLineHeight(), e = 0, f = 0, h = c.length; f <
			h; f++) {
			var k = a.measureText(c[f]).width;
			if (null == this.lineWidth || k < this.lineWidth)b && this._drawTextLine(a, c[f], e * d); else {
				for (var k = c[f].split(/(\s)/), j = k[0], l = 1, n = k.length; l < n; l += 2)
					a.measureText(j + k[l] + k[l + 1]).width > this.lineWidth
						? (b && this._drawTextLine(a, j, e * d), e++, j = k[l + 1])
						: j += k[l] + k[l + 1];
				b && this._drawTextLine(a, j, e * d)
			}
			e++
		}
		return e
	};
	b._drawTextLine = function (a, b, c) {
		this.outline ? a.strokeText(b, 0, c, this.maxWidth || 65535) : a.fillText(b, 0, c, this.maxWidth || 65535)
	};
	createjs.Text = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		throw"SpriteSheetUtils cannot be instantiated";
	};
	c._workingCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
	c._workingContext = c._workingCanvas.getContext("2d");
	c.addFlippedFrames = function (b, a, m, g) {
		if (a || m || g) {
			var d = 0;
			a && c._flip(b, ++d, !0, !1);
			m && c._flip(b, ++d, !1, !0);
			g && c._flip(b, ++d, !0, !0)
		}
	};
	c.extractFrame = function (b, a) {
		isNaN(a) && (a = b.getAnimation(a).frames[0]);
		var m = b.getFrame(a);
		if (!m)return null;
		var g = m.rect, d = c._workingCanvas;
		d.width =
			g.width;
		d.height = g.height;
		c._workingContext.drawImage(m.image, g.x, g.y, g.width, g.height, 0, 0, g.width, g.height);
		m = new Image;
		m.src = d.toDataURL("image/png");
		return m
	};
	c.mergeAlpha = function (b, a, c) {
		c || (c = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas"));
		c.width = Math.max(a.width, b.width);
		c.height = Math.max(a.height, b.height);
		var g = c.getContext("2d");
		g.save();
		g.drawImage(b, 0, 0);
		g.globalCompositeOperation = "destination-in";
		g.drawImage(a, 0, 0);
		g.restore();
		return c
	};
	c._flip = function (b, a, m, g) {
		for (var d = b._images, e = c._workingCanvas, f = c._workingContext, h = d.length / a, k = 0; k < h; k++) {
			var j = d[k];
			j.__tmp = k;
			f.setTransform(1, 0, 0, 1, 0, 0);
			f.clearRect(0, 0, e.width + 1, e.height + 1);
			e.width = j.width;
			e.height = j.height;
			f.setTransform(m ? -1 : 1, 0, 0, g ? -1 : 1, m ? j.width : 0, g ? j.height : 0);
			f.drawImage(j, 0, 0);
			var l = new Image;
			l.src = e.toDataURL("image/png");
			l.width = j.width;
			l.height = j.height;
			d.push(l)
		}
		f = b._frames;
		e = f.length / a;
		for (k = 0; k < e; k++) {
			var j = f[k], n = j.rect.clone(), l = d[j.image.__tmp + h * a], q = {image: l, rect: n, regX: j.regX,
				regY: j.regY};
			m && (n.x = l.width - n.x - n.width, q.regX = n.width - j.regX);
			g && (n.y = l.height - n.y - n.height, q.regY = n.height - j.regY);
			f.push(q)
		}
		m = "_" + (m ? "h" : "") + (g ? "v" : "");
		g = b._animations;
		b = b._data;
		d = g.length / a;
		for (k = 0; k < d; k++) {
			f = g[k];
			j = b[f];
			h = {name: f + m, frequency: j.frequency, next: j.next, frames: []};
			j.next && (h.next += m);
			f = j.frames;
			j = 0;
			for (l = f.length; j < l; j++)h.frames.push(f[j] + e * a);
			b[h.name] = h;
			g.push(h.name)
		}
	};
	createjs.SpriteSheetUtils = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		this.initialize()
	}, b = c.prototype;
	c.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
	c.ERR_RUNNING = "a build is already running";
	b.maxWidth = 2048;
	b.maxHeight = 2048;
	b.spriteSheet = null;
	b.scale = 1;
	b.padding = 1;
	b.timeSlice = 0.3;
	b.progress = -1;
	b.onComplete = null;
	b.onProgress = null;
	b.addEventListener = null;
	b.removeEventListener = null;
	b.removeAllEventListeners = null;
	b.dispatchEvent = null;
	b.hasEventListener = null;
	b._listeners = null;
	createjs.EventDispatcher.initialize(b);
	b._frames =
		null;
	b._animations = null;
	b._data = null;
	b._nextFrameIndex = 0;
	b._index = 0;
	b._timerID = null;
	b._scale = 1;
	b.initialize = function () {
		this._frames = [];
		this._animations = {}
	};
	b.addFrame = function (a, b, g, d, e, f) {
		if (this._data)throw c.ERR_RUNNING;
		b = b || a.bounds || a.nominalBounds;
		!b && a.getBounds && (b = a.getBounds());
		if (!b)return null;
		g = g || 1;
		return this._frames.push({source: a, sourceRect: b, scale: g, funct: d, params: e, scope: f, index: this._frames.length, height: b.height * g}) - 1
	};
	b.addAnimation = function (a, b, g, d) {
		if (this._data)throw c.ERR_RUNNING;
		this._animations[a] = {frames: b, next: g, frequency: d}
	};
	b.addMovieClip = function (a, b, g) {
		if (this._data)throw c.ERR_RUNNING;
		var d = a.frameBounds, e = b || a.bounds || a.nominalBounds;
		!e && a.getBounds && (e = a.getBounds());
		if (!e && !d)return null;
		b = this._frames.length;
		for (var f = a.timeline.duration, h = 0; h < f; h++)this.addFrame(a, d && d[h] ? d[h] : e, g, function (a) {
			var b = this.actionsEnabled;
			this.actionsEnabled = !1;
			this.gotoAndStop(a);
			this.actionsEnabled = b
		}, [h], a);
		h = a.timeline._labels;
		a = [];
		for (var k in h)a.push({index: h[k], label: k});
		if (a.length) {
			a.sort(function (a, b) {
				return a.index - b.index
			});
			h = 0;
			for (k = a.length; h < k; h++) {
				g = a[h].label;
				for (var d = b + (h == k - 1 ? f : a[h + 1].index), e = [], j = b + a[h].index; j < d; j++)e.push(j);
				this.addAnimation(g, e, !0)
			}
		}
	};
	b.build = function () {
		if (this._data)throw c.ERR_RUNNING;
		for (this._startBuild(); this._drawNext(););
		this._endBuild();
		return this.spriteSheet
	};
	b.buildAsync = function (a) {
		if (this._data)throw c.ERR_RUNNING;
		this.timeSlice = a;
		this._startBuild();
		var b = this;
		this._timerID = setTimeout(function () {
			b._run()
		}, 50 - 50 * Math.max(0.01,
			Math.min(0.99, this.timeSlice || 0.3)))
	};
	b.stopAsync = function () {
		clearTimeout(this._timerID);
		this._data = null
	};
	b.clone = function () {
		throw"SpriteSheetBuilder cannot be cloned.";
	};
	b.toString = function () {
		return"[SpriteSheetBuilder]"
	};
	b._startBuild = function () {
		var a = this.padding || 0;
		this.progress = 0;
		this.spriteSheet = null;
		this._index = 0;
		this._scale = this.scale;
		var b = [];
		this._data = {images: [], frames: b, animations: this._animations};
		var g = this._frames.slice();
		g.sort(function (a, b) {
			return a.height <= b.height ? -1 : 1
		});
		if (g[g.length -
			1].height + 2 * a > this.maxHeight)throw c.ERR_DIMENSIONS;
		for (var d = 0, e = 0, f = 0; g.length;) {
			var h = this._fillRow(g, d, f, b, a);
			h.w > e && (e = h.w);
			d += h.h;
			if (!h.h || !g.length) {
				var k = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
				k.width = this._getSize(e, this.maxWidth);
				k.height = this._getSize(d, this.maxHeight);
				this._data.images[f] = k;
				h.h || (e = d = 0, f++)
			}
		}
	};
	b._getSize = function (a, b) {
		for (var c = 4; Math.pow(2, ++c) < a;);
		return Math.min(b, Math.pow(2, c))
	};
	b._fillRow = function (a, b, g, d, e) {
		var f = this.maxWidth,
			h = this.maxHeight;
		b += e;
		for (var h = h - b, k = e, j = 0, l = a.length - 1; 0 <= l; l--) {
			var n = a[l], q = this._scale * n.scale, p = n.sourceRect, s = n.source, r = Math.floor(q * p.x - e), u = Math.floor(q * p.y - e), t = Math.ceil(q * p.height + 2 * e), p = Math.ceil(q * p.width + 2 * e);
			if (p > f)throw c.ERR_DIMENSIONS;
			t > h || k + p > f || (n.img = g, n.rect = new createjs.Rectangle(k, b, p, t), j = j || t, a.splice(l, 1), d[n.index] = [k, b, p, t, g, Math.round(-r + q * s.regX - e), Math.round(-u + q * s.regY - e)], k += p)
		}
		return{w: k, h: j}
	};
	b._endBuild = function () {
		this.spriteSheet = new createjs.SpriteSheet(this._data);
		this._data = null;
		this.progress = 1;
		this.onComplete && this.onComplete(this);
		this.dispatchEvent("complete")
	};
	b._run = function () {
		for (var a = 50 * Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)), b = (new Date).getTime() + a, c = !1; b > (new Date).getTime();)if (!this._drawNext()) {
			c = !0;
			break
		}
		if (c)this._endBuild(); else {
			var d = this;
			this._timerID = setTimeout(function () {
				d._run()
			}, 50 - a)
		}
		a = this.progress = this._index / this._frames.length;
		this.onProgress && this.onProgress(this, a);
		this.dispatchEvent({type: "progress", progress: a})
	};
	b._drawNext =
		function () {
			var a = this._frames[this._index], b = a.scale * this._scale, c = a.rect, d = a.sourceRect, e = this._data.images[a.img].getContext("2d");
			a.funct && a.funct.apply(a.scope, a.params);
			e.save();
			e.beginPath();
			e.rect(c.x, c.y, c.width, c.height);
			e.clip();
			e.translate(Math.ceil(c.x - d.x * b), Math.ceil(c.y - d.y * b));
			e.scale(b, b);
			a.source.draw(e);
			e.restore();
			return++this._index < this._frames.length
		};
	createjs.SpriteSheetBuilder = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function (a) {
		this.initialize(a)
	}, b = c.prototype = new createjs.DisplayObject;
	b.htmlElement = null;
	b._oldMtx = null;
	b.DisplayObject_initialize = b.initialize;
	b.initialize = function (a) {
		"string" == typeof a && (a = document.getElementById(a));
		this.DisplayObject_initialize();
		this.mouseEnabled = !1;
		this.htmlElement = a;
		a = a.style;
		a.position = "absolute";
		a.transformOrigin = a.WebkitTransformOrigin = a.msTransformOrigin = a.MozTransformOrigin = a.OTransformOrigin = "0% 0%"
	};
	b.isVisible = function () {
		return null != this.htmlElement
	};
	b.draw = function () {
		if (null != this.htmlElement) {
			var a = this.getConcatenatedMatrix(this._matrix), b = this.htmlElement.style;
			if (this.visible)b.visibility = "visible"; else return!0;
			var c = this._oldMtx || {};
			c.alpha != a.alpha && (b.opacity = "" + a.alpha, c.alpha = a.alpha);
			if (c.tx != a.tx || c.ty != a.ty || c.a != a.a || c.b != a.b || c.c != a.c || c.d != a.d)b.transform = b.WebkitTransform = b.OTransform = b.msTransform = ["matrix(" + a.a, a.b, a.c, a.d, a.tx + 0.5 | 0, (a.ty + 0.5 | 0) + ")"].join(), b.MozTransform = ["matrix(" + a.a, a.b, a.c, a.d, (a.tx + 0.5 | 0) + "px", (a.ty +
				0.5 | 0) + "px)"].join(), this._oldMtx = a.clone();
			return!0
		}
	};
	b.cache = function () {
	};
	b.uncache = function () {
	};
	b.updateCache = function () {
	};
	b.hitTest = function () {
	};
	b.localToGlobal = function () {
	};
	b.globalToLocal = function () {
	};
	b.localToLocal = function () {
	};
	b.clone = function () {
		throw"DOMElement cannot be cloned.";
	};
	b.toString = function () {
		return"[DOMElement (name=" + this.name + ")]"
	};
	b.DisplayObject__tick = b._tick;
	b._tick = function (a) {
		this.htmlElement.style.visibility = "hidden";
		this.DisplayObject__tick(a)
	};
	createjs.DOMElement = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		this.initialize()
	}, b = c.prototype;
	b.initialize = function () {
	};
	b.getBounds = function () {
		return new createjs.Rectangle(0, 0, 0, 0)
	};
	b.applyFilter = function () {
	};
	b.toString = function () {
		return"[Filter]"
	};
	b.clone = function () {
		return new c
	};
	createjs.Filter = c
})();
this.createjs = this.createjs || {};
(function () {
	var c = function () {
		throw"Touch cannot be instantiated";
	};
	c.isSupported = function () {
		return"ontouchstart"in window || window.navigator.msPointerEnabled
	};
	c.enable = function (b, a, m) {
		if (!b || !b.canvas || !c.isSupported())return!1;
		b.__touch = {pointers: {}, multitouch: !a, preventDefault: !m, count: 0};
		"ontouchstart"in window ? c._IOS_enable(b) : window.navigator.msPointerEnabled && c._IE_enable(b);
		return!0
	};
	c.disable = function (b) {
		b && ("ontouchstart"in window ? c._IOS_disable(b) : window.navigator.msPointerEnabled && c._IE_disable(b))
	};
	c._IOS_enable = function (b) {
		var a = b.canvas, m = b.__touch.f = function (a) {
			c._IOS_handleEvent(b, a)
		};
		a.addEventListener("touchstart", m, !1);
		a.addEventListener("touchmove", m, !1);
		a.addEventListener("touchend", m, !1);
		a.addEventListener("touchcancel", m, !1)
	};
	c._IOS_disable = function (b) {
		var a = b.canvas;
		a && (b = b.__touch.f, a.removeEventListener("touchstart", b, !1), a.removeEventListener("touchmove", b, !1), a.removeEventListener("touchend", b, !1), a.removeEventListener("touchcancel", b, !1))
	};
	c._IOS_handleEvent = function (b, a) {
		if (b) {
			b.__touch.preventDefault &&
			a.preventDefault && a.preventDefault();
			for (var c = a.changedTouches, g = a.type, d = 0, e = c.length; d < e; d++) {
				var f = c[d], h = f.identifier;
				f.target == b.canvas && ("touchstart" == g ? this._handleStart(b, h, a, f.pageX, f.pageY) : "touchmove" == g ? this._handleMove(b, h, a, f.pageX, f.pageY) : ("touchend" == g || "touchcancel" == g) && this._handleEnd(b, h, a))
			}
		}
	};
	c._IE_enable = function (b) {
		var a = b.canvas, m = b.__touch.f = function (a) {
			c._IE_handleEvent(b, a)
		};
		a.addEventListener("MSPointerDown", m, !1);
		window.addEventListener("MSPointerMove", m, !1);
		window.addEventListener("MSPointerUp",
			m, !1);
		window.addEventListener("MSPointerCancel", m, !1);
		b.__touch.preventDefault && (a.style.msTouchAction = "none");
		b.__touch.activeIDs = {}
	};
	c._IE_disable = function (b) {
		var a = b.__touch.f;
		window.removeEventListener("MSPointerMove", a, !1);
		window.removeEventListener("MSPointerUp", a, !1);
		window.removeEventListener("MSPointerCancel", a, !1);
		b.canvas && b.canvas.removeEventListener("MSPointerDown", a, !1)
	};
	c._IE_handleEvent = function (b, a) {
		if (b) {
			b.__touch.preventDefault && a.preventDefault && a.preventDefault();
			var c = a.type,
				g = a.pointerId, d = b.__touch.activeIDs;
			if ("MSPointerDown" == c)a.srcElement == b.canvas && (d[g] = !0, this._handleStart(b, g, a, a.pageX, a.pageY)); else if (d[g])if ("MSPointerMove" == c)this._handleMove(b, g, a, a.pageX, a.pageY); else if ("MSPointerUp" == c || "MSPointerCancel" == c)delete d[g], this._handleEnd(b, g, a)
		}
	};
	c._handleStart = function (b, a, c, g, d) {
		var e = b.__touch;
		if (e.multitouch || !e.count) {
			var f = e.pointers;
			f[a] || (f[a] = !0, e.count++, b._handlePointerDown(a, c, g, d))
		}
	};
	c._handleMove = function (b, a, c, g, d) {
		b.__touch.pointers[a] &&
		b._handlePointerMove(a, c, g, d)
	};
	c._handleEnd = function (b, a, c) {
		var g = b.__touch, d = g.pointers;
		d[a] && (g.count--, b._handlePointerUp(a, c, !0), delete d[a])
	};
	createjs.Touch = c
})();
(function () {
	var c = this.createjs = this.createjs || {}, c = c.EaselJS = c.EaselJS || {};
	c.version = "0.6.1";
	c.buildDate = "Tue, 14 May 2013 21:43:02 GMT"
})();

/**
 * @license
 * Lo-Dash 2.2.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-7.8.6
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setImmediate', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria;

    // ensure a stable sort in V8 and other engines
    // http://code.google.com/p/v8/issues/detail?id=90
    if (ac !== bc) {
      if (ac > bc || typeof ac == 'undefined') {
        return 1;
      }
      if (ac < bc || typeof bc == 'undefined') {
        return -1;
      }
    }
    // The JS engine embedded in Adobe applications like InDesign has a buggy
    // `Array#sort` implementation that causes it, under certain circumstances,
    // to return the same value for `a` and `b`.
    // See https://github.com/jashkenas/underscore/pull/1247
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * A no-operation function.
   *
   * @private
   */
  function noop() {
    // no operation performed
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(objectProto.valueOf)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/valueOf|for [^\]]+/g, '.+?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        now = reNative.test(now = Date.now) && now || function() { return +new Date; },
        push = arrayRef.push,
        setImmediate = context.setImmediate,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        toString = objectProto.toString,
        unshift = arrayRef.unshift;

    var defineProperty = (function() {
      try {
        var o = {},
            func = reNative.test(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeBind = reNative.test(nativeBind = toString.bind) && nativeBind,
        nativeCreate = reNative.test(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeSlice = arrayRef.slice;

    /** Detect various environments */
    var isIeOpera = reNative.test(context.attachEvent),
        isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `createCallback`, `curry`, `debounce`,
     * `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`, `forEach`,
     * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
     * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
     * `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`, `once`, `pairs`,
     * `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`, `range`, `reject`,
     * `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`, `sortBy`, `splice`,
     * `tap`, `throttle`, `times`, `toArray`, `transform`, `union`, `uniq`, `unshift`,
     * `unzip`, `values`, `where`, `without`, `wrap`, and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if `Function#bind` exists and is inferred to be fast (all but V8).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.fastBind = nativeBind && !isV8;

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !reNative.test(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [deep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, deep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (deep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!deep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, deep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early if there is no `thisArg`
      if (typeof thisArg == 'undefined') {
        return func;
      }
      var bindData = func.__bindData__ || (support.funcNames && !func.name);
      if (typeof bindData == 'undefined') {
        var source = reThis && fnToString.call(func);
        if (!support.funcNames && source && !reFuncName.test(source)) {
          bindData = true;
        }
        if (support.funcNames || !bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = !support.funcDecomp || reThis.test(source);
          setBindData(func, bindData);
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData !== true && (bindData && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isArgArrays=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isArgArrays, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isArgArrays);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isArgArrays) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        if (hasOwnProperty.call(a, '__wrapped__ ') || hasOwnProperty.call(b, '__wrapped__')) {
          return baseIsEqual(a.__wrapped__ || a, b.__wrapped__ || b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB && !(
              isFunction(ctorA) && ctorA instanceof ctorA &&
              isFunction(ctorB) && ctorB instanceof ctorB
            )) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        length = a.length;
        size = b.length;

        // compare lengths to determine if a deep comparison is necessary
        result = size == a.length;
        if (!result && !isWhere) {
          return result;
        }
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];

          if (isWhere) {
            while (index--) {
              if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                break;
              }
            }
          } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
            break;
          }
        }
        return result;
      }
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
        }
      });

      if (result && !isWhere) {
        // ensure both objects have the same number of properties
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        if (cache) {
          indexOf = cacheIndexOf;
          seen = cache;
        } else {
          isLarge = false;
          seen = callback ? seen : (releaseArray(seen), result);
        }
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBound(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32,
          key = func;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData) {
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        if (isPartialRight) {
          push.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        bindData[1] |= bitmask;
        return createBound.apply(null, bindData);
      }
      // use `Function#bind` if it exists and is fast
      // (in V8 `Function#bind` is slower except when partially applied)
      if (isBind && !(isBindKey || isCurry || isPartialRight) &&
          (support.fastBind || (nativeBind && isPartial))) {
        if (isPartial) {
          var args = [thisArg];
          push.apply(args, partialArgs);
        }
        var bound = isPartial
          ? nativeBind.apply(func, args)
          : nativeBind.call(func, thisArg);
      }
      else {
        bound = function() {
          // `Function#bind` spec
          // http://es5.github.io/#x15.3.4.5
          var args = arguments,
              thisBinding = isBind ? thisArg : this;

          if (isCurry || isPartial || isPartialRight) {
            args = nativeSlice.call(args);
            if (isPartial) {
              unshift.apply(args, partialArgs);
            }
            if (isPartialRight) {
              push.apply(args, partialRightArgs);
            }
            if (isCurry && args.length < arity) {
              bitmask |= 16 & ~32;
              return createBound(func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity);
            }
          }
          if (isBindKey) {
            func = thisBinding[key];
          }
          if (this instanceof bound) {
            // ensure `new bound` is an instance of `func`
            thisBinding = createObject(func.prototype);

            // mimic the constructor's `return` behavior
            // http://es5.github.io/#x13.2.2
            var result = func.apply(thisBinding, args);
            return isObject(result) ? result : thisBinding;
          }
          return func.apply(thisBinding, args);
        };
      }
      setBindData(bound, nativeSlice.call(arguments));
      return bound;
    }

    /**
     * Creates a new object with the specified `prototype`.
     *
     * @private
     * @param {Object} prototype The prototype object.
     * @returns {Object} Returns the new object.
     */
    function createObject(prototype) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      createObject = function(prototype) {
        if (isObject(prototype)) {
          noop.prototype = prototype;
          var result = new noop;
          noop.prototype = null;
        }
        return result || {};
      };
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {*} value The value to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'moe' }, { 'age': 40 });
     * // => { 'name': 'moe', 'age': 40 }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var food = { 'name': 'apple' };
     * defaults(food, { 'name': 'banana', 'type': 'fruit' });
     * // => { 'name': 'apple', 'type': 'fruit' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `deep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [deep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * var shallow = _.clone(stooges);
     * shallow[0] === stooges[0];
     * // => true
     *
     * var deep = _.clone(stooges, true);
     * deep[0] === stooges[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, deep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `deep` and `callback`
      if (typeof deep != 'boolean' && deep != null) {
        thisArg = callback;
        callback = deep;
        deep = false;
      }
      return baseClone(value, deep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * var deep = _.cloneDeep(stooges);
     * deep[0] === stooges[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var food = { 'name': 'apple' };
     * _.defaults(food, { 'name': 'banana', 'type': 'fruit' });
     * // => { 'name': 'apple', 'type': 'fruit' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * _.findKey({ 'a': 1, 'b': 2, 'c': 3, 'd': 4 }, function(num) {
     *   return num % 2 == 0;
     * });
     * // => 'b' (property order is not guaranteed across environments)
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * _.findLastKey({ 'a': 1, 'b': 2, 'c': 3, 'd': 4 }, function(num) {
     *   return num % 2 == 1;
     * });
     * // => returns `c`, assuming `_.findKey` returns `a`
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Dog(name) {
     *   this.name = name;
     * }
     *
     * Dog.prototype.bark = function() {
     *   console.log('Woof, woof!');
     * };
     *
     * _.forIn(new Dog('Dagny'), function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'bark' and 'name' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Dog(name) {
     *   this.name = name;
     * }
     *
     * Dog.prototype.bark = function() {
     *   console.log('Woof, woof!');
     * };
     *
     * _.forInRight(new Dog('Dagny'), function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'name' and 'bark' assuming `_.forIn ` logs 'bark' and 'name'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified object `property` exists and is a direct property,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to check.
     * @param {string} property The property to check for.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, property) {
      return object ? hasOwnProperty.call(object, property) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     *  _.invert({ 'first': 'moe', 'second': 'larry' });
     * // => { 'moe': 'first', 'larry': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || toString.call(value) == boolClass;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value ? (typeof value == 'object' && toString.call(value) == dateClass) : false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value ? value.nodeType === 1 : false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var moe = { 'name': 'moe', 'age': 40 };
     * var copy = { 'name': 'moe', 'age': 40 };
     *
     * moe == copy;
     * // => false
     *
     * _.isEqual(moe, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' || toString.call(value) == numberClass;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Stooge(name, age) {
     *   this.name = name;
     *   this.age = age;
     * }
     *
     * _.isPlainObject(new Stooge('moe', 40));
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'name': 'moe', 'age': 40 });
     * // => true
     */
    var isPlainObject = function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = typeof valueOf == 'function' && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/moe/);
     * // => true
     */
    function isRegExp(value) {
      return value ? (typeof value == 'object' && toString.call(value) == regexpClass) : false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('moe');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' || toString.call(value) == stringClass;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'stooges': [
     *     { 'name': 'moe' },
     *     { 'name': 'larry' }
     *   ]
     * };
     *
     * var ages = {
     *   'stooges': [
     *     { 'age': 40 },
     *     { 'age': 50 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'stooges': [{ 'name': 'moe', 'age': 40 }, { 'name': 'larry', 'age': 50 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = nativeSlice.call(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'moe', 'age': 40 }, 'age');
     * // => { 'name': 'moe' }
     *
     * _.omit({ 'name': 'moe', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'moe' }
     */
    function omit(object, callback, thisArg) {
      var indexOf = getIndexOf(),
          isFunc = typeof callback == 'function',
          result = {};

      if (isFunc) {
        callback = lodash.createCallback(callback, thisArg, 3);
      } else {
        var props = baseFlatten(arguments, true, false, 1);
      }
      forIn(object, function(value, key, object) {
        if (isFunc
              ? !callback(value, key, object)
              : indexOf(props, key) < 0
            ) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'moe': 30, 'larry': 40 });
     * // => [['moe', 30], ['larry', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'moe', '_userid': 'moe1' }, 'name');
     * // => { 'name': 'moe' }
     *
     * _.pick({ 'name': 'moe', '_userid': 'moe1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'moe' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its elements
     * through a callback, with each callback execution potentially mutating
     * the `accumulator` object. The callback is bound to `thisArg` and invoked
     * with four arguments; (accumulator, value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      callback = baseCreateCallback(callback, thisArg, 4);

      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = createObject(proto);
        }
      }
      (isArr ? forEach : forOwn)(object, function(value, index, object) {
        return callback(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['moe', 'larry', 'curly'], 0, 2);
     * // => ['moe', 'curly']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'moe', 'age': 40 }, 'moe');
     * // => true
     *
     * _.contains('curly', 'ur');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(stooges, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(stooges, { 'age': 50 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(food, 'organic');
     * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
     *
     * // using "_.where" callback shorthand
     * _.filter(food, { 'type': 'fruit' });
     * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.find([1, 2, 3, 4], function(num) {
     *   return num % 2 == 0;
     * });
     * // => 2
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'banana', 'organic': true,  'type': 'fruit' },
     *   { 'name': 'beet',   'organic': false, 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.find(food, { 'type': 'vegetable' });
     * // => { 'name': 'beet', 'organic': false, 'type': 'vegetable' }
     *
     * // using "_.pluck" callback shorthand
     * _.find(food, 'organic');
     * // => { 'name': 'banana', 'organic': true, 'type': 'fruit' }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(stooges, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = nativeSlice.call(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(stooges, 'name');
     * // => ['moe', 'larry']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.max(stooges, function(stooge) { return stooge.age; });
     * // => { 'name': 'larry', 'age': 50 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(stooges, 'age');
     * // => { 'name': 'larry', 'age': 50 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (!callback && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.min(stooges, function(stooge) { return stooge.age; });
     * // => { 'name': 'moe', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(stooges, 'age');
     * // => { 'name': 'moe', 'age': 40 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (!callback && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the `collection`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * _.pluck(stooges, 'name');
     * // => ['moe', 'larry']
     */
    function pluck(collection, property) {
      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = collection[index][property];
        }
      }
      return result || map(collection, property);
    }

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = baseCreateCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = baseCreateCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(food, 'organic');
     * // => [{ 'name': 'apple', 'organic': false, 'type': 'fruit' }]
     *
     * // using "_.where" callback shorthand
     * _.reject(food, { 'type': 'fruit' });
     * // => [{ 'name': 'carrot', 'organic': true, 'type': 'vegetable' }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions, like `_.map`,
     *  without using their `key` and `object` arguments as sources.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      var length = collection ? collection.length : 0;
      if (typeof length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[random(length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = random(++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('curly');
     * // => 5
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var food = [
     *   { 'name': 'apple',  'organic': false, 'type': 'fruit' },
     *   { 'name': 'carrot', 'organic': true,  'type': 'vegetable' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(food, 'organic');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(food, { 'type': 'meat' });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * // using "_.pluck" callback shorthand
     * _.sortBy(['banana', 'strawberry', 'apple'], 'length');
     * // => ['apple', 'banana', 'strawberry']
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      callback = lodash.createCallback(callback, thisArg, 3);
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        object.criteria = callback(value, key, collection);
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} properties The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var stooges = [
     *   { 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] },
     *   { 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }
     * ];
     *
     * _.where(stooges, { 'age': 40 });
     * // => [{ 'name': 'moe', 'age': 40, 'quotes': ['Spread out!', 'You knucklehead!'] }]
     *
     * _.where(stooges, { 'quotes': ['Poifect!'] });
     * // => [{ 'name': 'curly', 'age': 30, 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [array] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          seen = baseFlatten(arguments, true, true, 1),
          result = [];

      var isLarge = length >= largeArraySize && indexOf === baseIndexOf;

      if (isLarge) {
        var cache = createCache(seen);
        if (cache) {
          indexOf = cacheIndexOf;
          seen = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(seen, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(seen);
      }
      return result;
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * _.findIndex(['apple', 'banana', 'beet'], function(food) {
     *   return /^b/.test(food);
     * });
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * _.findLastIndex(['apple', 'banana', 'beet'], function(food) {
     *   return /^b/.test(food);
     * });
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var food = [
     *   { 'name': 'banana', 'organic': true },
     *   { 'name': 'beet',   'organic': false },
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(food, 'organic');
     * // => [{ 'name': 'banana', 'organic': true }]
     *
     * var food = [
     *   { 'name': 'apple',  'type': 'fruit' },
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.first(food, { 'type': 'fruit' });
     * // => [{ 'name': 'apple', 'type': 'fruit' }, { 'name': 'banana', 'type': 'fruit' }]
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var stooges = [
     *   { 'name': 'curly', 'quotes': ['Oh, a wise guy, eh?', 'Poifect!'] },
     *   { 'name': 'moe', 'quotes': ['Spread out!', 'You knucklehead!'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(stooges, 'quotes');
     * // => ['Oh, a wise guy, eh?', 'Poifect!', 'Spread out!', 'You knucklehead!']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = !(thisArg && thisArg[isShallow] === array) ? isShallow : null;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var food = [
     *   { 'name': 'beet',   'organic': false },
     *   { 'name': 'carrot', 'organic': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(food, 'organic');
     * // => [{ 'name': 'beet',   'organic': false }]
     *
     * var food = [
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' },
     *   { 'name': 'carrot', 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.initial(food, { 'type': 'vegetable' });
     * // => [{ 'name': 'banana', 'type': 'fruit' }]
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of composite values.
     * @example
     *
     * _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     * // => [1, 2]
     */
    function intersection(array) {
      var args = arguments,
          argsLength = args.length,
          argsIndex = -1,
          caches = getArray(),
          index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [],
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = args[argsIndex];
        caches[argsIndex] = indexOf === baseIndexOf &&
          (value ? value.length : 0) >= largeArraySize &&
          createCache(argsIndex ? args[argsIndex] : seen);
      }
      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var food = [
     *   { 'name': 'beet',   'organic': false },
     *   { 'name': 'carrot', 'organic': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.last(food, 'organic');
     * // => [{ 'name': 'carrot', 'organic': true }]
     *
     * var food = [
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' },
     *   { 'name': 'carrot', 'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.last(food, { 'type': 'vegetable' });
     * // => [{ 'name': 'beet', 'type': 'vegetable' }, { 'name': 'carrot', 'type': 'vegetable' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(10);
     * // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     *
     * _.range(1, 11);
     * // => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     *
     * _.range(0, 30, 5);
     * // => [0, 5, 10, 15, 20, 25]
     *
     * _.range(0, -10, -1);
     * // => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines, like Chakra and V8, avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var food = [
     *   { 'name': 'banana', 'organic': true },
     *   { 'name': 'beet',   'organic': false },
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.rest(food, 'organic');
     * // => [{ 'name': 'beet', 'organic': false }]
     *
     * var food = [
     *   { 'name': 'apple',  'type': 'fruit' },
     *   { 'name': 'banana', 'type': 'fruit' },
     *   { 'name': 'beet',   'type': 'vegetable' }
     * ];
     *
     * // using "_.where" callback shorthand
     * _.rest(food, { 'type': 'fruit' });
     * // => [{ 'name': 'beet', 'type': 'vegetable' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of composite values.
     * @example
     *
     * _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     * // => [1, 2, 3, 101, 10]
     */
    function union(array) {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = !(thisArg && thisArg[isSorted] === array) ? isSorted : null;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return difference(array, nativeSlice.call(arguments, 1));
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['moe', 'larry'], [30, 40], [true, false]);
     * // => [['moe', 30, true], ['larry', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['moe', 'larry'], [30, 40]);
     * // => { 'moe': 30, 'larry': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'moe' }, 'hi');
     * func();
     * // => 'hi moe'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createBound(func, 17, nativeSlice.call(arguments, 2), null, thisArg)
        : createBound(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *  'label': 'docs',
     *  'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createBound(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'moe',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi moe'
     *
     * object.greet = function(greeting) {
     *   return greeting + ', ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hi, moe!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createBound(key, 19, nativeSlice.call(arguments, 2), null, object)
        : createBound(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'curly': 'jerome'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('curly');
     * // => 'Hiya Jerome!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(stooges, 'age__gt45');
     * // => [{ 'name': 'larry', 'age': 50 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return function(object) {
          return object[func];
        };
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createBound(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled);
          if (remaining <= 0) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          result = func.apply(thisArg, args);
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function() { console.log('deferred'); });
     * // returns from the function before 'deferred' is logged
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = nativeSlice.call(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }
    // use `setImmediate` if available in Node.js
    if (isV8 && moduleExports && typeof setImmediate == 'function') {
      defer = function(func) {
        if (!isFunction(func)) {
          throw new TypeError;
        }
        return setImmediate.apply(context, arguments);
      };
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * var log = _.bind(console.log, console);
     * _.delay(log, 1000, 'logged later');
     * // => 'logged later' (Appears after one second.)
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = nativeSlice.call(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * var data = {
     *   'moe': { 'name': 'moe', 'age': 40 },
     *   'curly': { 'name': 'curly', 'age': 60 }
     * };
     *
     * // modifying the result cache
     * var stooge = _.memoize(function(name) { return data[name]; }, _.identity);
     * stooge('curly');
     * // => { 'name': 'curly', 'age': 60 }
     *
     * stooge.cache.curly.name = 'jerome';
     * stooge('curly');
     * // => { 'name': 'jerome', 'age': 60 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('moe');
     * // => 'hi moe'
     */
    function partial(func) {
      return createBound(func, 16, nativeSlice.call(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createBound(func, 32, null, nativeSlice.call(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      var result = debounce(func, wait, debounceOptions);
      return result;
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var hello = function(name) { return 'hello ' + name; };
     * hello = _.wrap(hello, function(func) {
     *   return 'before, ' + func('moe') + ', after';
     * });
     * hello();
     * // => 'before, hello moe, after'
     */
    function wrap(value, wrapper) {
      if (!isFunction(wrapper)) {
        throw new TypeError;
      }
      return function() {
        var args = [value];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
      };
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Moe, Larry & Curly');
     * // => 'Moe, Larry &amp; Curly'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var moe = { 'name': 'moe' };
     * moe === _.identity(moe);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the `lodash` function and
     * chainable wrapper.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object of function properties to add to `lodash`.
     * @param {Object} object The object of function properties to add to `lodash`.
     * @example
     *
     * _.mixin({
     *   'capitalize': function(string) {
     *     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     *   }
     * });
     *
     * _.capitalize('moe');
     * // => 'Moe'
     *
     * _('moe').capitalize();
     * // => 'Moe'
     */
    function mixin(object, source) {
      var ctor = object,
          isFunc = !source || isFunction(ctor);

      if (!source) {
        ctor = lodashWrapper;
        source = object;
        object = lodash;
      }
      forEach(functions(source), function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (value && typeof value == 'object' && value === result) {
              return this;
            }
            result = new ctor(result);
            result.__chain__ = this.__chain__;
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox and Opera still follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      var rand = nativeRandom();
      return (floating || min % 1 || max % 1)
        ? nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max)
        : min + floor(rand * (max - min + 1));
    }

    /**
     * Resolves the value of `property` on `object`. If `property` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} property The property to get the value of.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, property) {
      if (object) {
        var value = object[property];
        return isFunction(value) ? object[property]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/#custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'moe' });
     * // => 'hello moe'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['moe', 'larry'] });
     * // => '<li>moe</li><li>larry</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'curly' });
     * // => 'hello curly'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'larry' });
     * // => 'hello larry!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% $.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['moe', 'larry'] }, { 'imports': { '$': jQuery } });
     * // => '<li>moe</li><li>larry</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text || (text = '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Moe, Larry &amp; Curly');
     * // => 'Moe, Larry & Curly'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 },
     *   { 'name': 'curly', 'age': 60 }
     * ];
     *
     * var youngest = _.chain(stooges)
     *     .sortBy('age')
     *     .map(function(stooge) { return stooge.name + ' is ' + stooge.age; })
     *     .first()
     *     .value();
     * // => 'moe is 40'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .filter(function(num) { return num % 2 == 0; })
     *  .tap(function(array) { console.log(array); })
     *  .map(function(num) { return num * num; })
     *  .value();
     * // => // [2, 4] (logged)
     * // => [4, 16]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var stooges = [
     *   { 'name': 'moe', 'age': 40 },
     *   { 'name': 'larry', 'age': 50 }
     * ];
     *
     * // without explicit chaining
     * _(stooges).first();
     * // => { 'name': 'moe', 'age': 40 }
     *
     * // with explicit chaining
     * _(stooges).chain()
     *   .first()
     *   .pick('age')
     *   .value()
     * // => { 'age': 40 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.countBy = countBy;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    forOwn(lodash, function(func, methodName) {
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName] = function() {
          var args = [this.__wrapped__],
              chainAll = this.__chain__;

          push.apply(args, arguments);
          var result = func.apply(lodash, args);
          return chainAll
            ? new lodashWrapper(result, chainAll)
            : result;
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.2.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash was injected by a third-party script and not intended to be
    // loaded as a module. The global assignment can be reverted in the Lo-Dash
    // module by its `noConflict()` method.
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

// https://github.com/jasondavies/smoothsort.js
// Based on implementation in http://en.wikipedia.org/wiki/Smoothsort
(function(exports) {
  // Leonardo numbers.
  var LP = [
    1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753, 
    1219, 1973, 3193, 5167, 8361, 13529, 21891, 35421, 57313, 92735,
    150049, 242785, 392835, 635621, 1028457, 1664079, 2692537, 
    4356617, 7049155, 11405773, 18454929, 29860703, 48315633, 78176337,
    126491971, 204668309, 331160281, 535828591, 866988873
  ];

  exports.smoothsort = function() {
    var compare = ascending;

    function sort(m, lo, hi) {
      if (arguments.length === 1) {
        lo = 0;
        hi = m.length - 1;
      }
      if (hi > LP[32]) {
        throw {error: "Maximum length exceeded for smoothsort implementation."};
      }
      var head = lo,
          p = 1,
          pshift = 1,
          trail;

      while (head < hi) {
        if ((p & 3) === 3) {
          sift(m, pshift, head);
          p >>>= 2;
          pshift += 2;
        } else {
          if (LP[pshift - 1] >= hi - head) trinkle(m, p, pshift, head, false);
          else sift(m, pshift, head);
          if (pshift === 1) {
            p <<= 1;
            pshift--;
          } else {
            p <<= (pshift - 1);
            pshift = 1;
          }
        }
        p |= 1;
        head++;
      }
      trinkle(m, p, pshift, head, false);

      while (pshift !== 1 || p !== 1) {
        if (pshift <= 1) {
          trail = trailingzeroes(p & ~1);
          p >>>= trail;
          pshift += trail;
        } else {
          p <<= 2;
          p ^= 7;
          pshift -= 2;

          trinkle(m, p >>> 1, pshift + 1, head - LP[pshift] - 1, true);
          trinkle(m, p, pshift, head - 1, true);
        }

        head--;
      }
    }

    function trinkle(m, p, pshift, head, trusty) {
      var val = m[head],
          stepson,
          mstepson,
          rt,
          lf,
          trail;

      while (p !== 1) {
        stepson = head - LP[pshift];

        if (compare(mstepson = m[stepson], val) <= 0) break;

        if (!trusty && pshift > 1) {
          rt = head - 1;
          lf = head - 1 - LP[pshift - 2];
          if (compare(m[rt], mstepson) >= 0 || compare(m[lf], mstepson) >= 0) {
            break;
          }
        }

        m[head] = mstepson;

        head = stepson;
        trail = trailingzeroes(p & ~1);
        p >>>= trail;
        pshift += trail;
        trusty = false;
      }
      if (!trusty) {
        m[head] = val;
        sift(m, pshift, head);
      }
    }

    function sift(m, pshift, head) {
      var rt,
          lf,
          mrt,
          mlf,
          val = m[head];
      while (pshift > 1) {
        rt = head - 1;
        lf = head - 1 - LP[pshift - 2];
        mrt = m[rt];
        mlf = m[lf];

        if (compare(val, mlf) >= 0 && compare(val, mrt) >= 0) break;

        if (compare(mlf, mrt) >= 0) {
          m[head] = mlf;
          head = lf;
          pshift--;
        } else {
          m[head] = mrt;
          head = rt;
          pshift -= 2;
        }
      }
      m[head] = val;
    }

    sort.compare = function(x) {
      if (!arguments.length) return compare;
      compare = x;
      return sort;
    };

    return sort;
  };

  // Solution for determining number of trailing zeroes of a number's binary representation.
  // Taken from http://www.0xe3.com/text/ntz/ComputingTrailingZerosHOWTO.html
  var MultiplyDeBruijnBitPosition = [
     0,  1, 28,  2, 29, 14, 24, 3,
    30, 22, 20, 15, 25, 17,  4, 8,
    31, 27, 13, 23, 21, 19, 16, 7,
    26, 12, 18,  6, 11,  5, 10, 9];

  function trailingzeroes(v) {
    return MultiplyDeBruijnBitPosition[(((v & -v) * 0x077CB531) >> 27) & 0x1f];
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

})(typeof exports !== "undefined" ? exports : window);

/**
 * Smart is a library of simple utilities and classes
 *
 * @global
 * @namespace
 */
Smart = {};


(function() {

	Smart.Class = function(base, implement) {
		if (!implement) implement = base;
		var constructor = implement.hasOwnProperty('initialize') && implement['initialize'];
		if (!constructor) {
			constructor = function Class() {
				if (this.initialize) this.initialize.apply(this, arguments);
			};
		}

		constructor.prototype = base;

		constructor.extend = extendThis;
		constructor.implement = function(implement) { return extendThis.call(this.prototype, implement); };

		if (implement !== base) {
			constructor.implement(implement);
		}

		return constructor;
	};

	function extendThis(extend) {
		for (var key in extend) {
			// Takes the place of checking hasOwnProperty:
			if (this[key] === extend[key]) continue;
			this[key] = extend[key];
		}
		return this;
	}

})();

(function() {
	
	Smart.Color = {
		parseRGB: function(color) {
			if (typeof color !== 'string') return null;
			
			color = color.replace(/\s+/g, "");
			
			var hex6 = color.match(/^#?([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})$/);
			if (hex6)
				return hex6.slice(1).map(function(h) { return parseInt(h, 16); });
			
			var hex3 = color.match(/^#?([A-Fa-f0-9])([A-Fa-f0-9])([A-Fa-f0-9])$/);
			if (hex3)
				return hex3.slice(1).map(function(h) { return parseInt(h, 16); });
			
			var rgba = color.match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d?\.?\d*))?\)$/);
			if (rgba)
				return rgba.slice(1, (rgba[4] ? 5 : 4)).map(function(d) { return parseFloat(d); });
			
			return null;
		}
		,
		toRGB: function(array){
			if (array.length === 4)
				return "rgba(" + str(array[0], 0, 255, 0) 
						+ "," + str(array[1], 0, 255, 0) 
						+ "," + str(array[2], 0, 255, 0) 
						+ "," + str(array[3], 0, 1, 2) + ")";
			if (array.length === 3)
				return "rgb(" + str(array[0], 0, 255, 0) 
						+ "," + str(array[1], 0, 255, 0) 
						+ "," + str(array[2], 0, 255, 0) + ")";

			return null;
		}
		,
		parseHSL: function(color) {
			if (typeof color !== 'string') return null;
			
			color = color.replace(/\s+/g, "");
			
			var hsla = color.match(/^hsla?\((\d{1,3}),(\d{1,3})%,(\d{1,3})%(?:,(\d?\.?\d*))?\)$/);
			if (hsla)
				return hsla.slice(1, (hsla[4] ? 5 : 4)).map(function(d) { return parseFloat(d); });
			
			return null;
		}
		,
		toHSL: function(array) {
			var hue = array[0];
			if (hue < 0)
				hue = 360 - (-hue % 360);
			else if (hue >= 360)
				hue = hue % 360;
			
			if (array.length === 4)
				return "hsla(" + hue.toFixed(0)
						+ "," + str(array[1], 0, 100, 0)
						+ "%," + str(array[2], 0, 100, 0)
						+ "%," + str(array[3], 0, 1, 2)
						+ ")";
			if (array.length === 3)
				return "hsl(" + hue.toFixed(0)
						+ "," + str(array[1], 0, 100, 0)
						+ "%," + str(array[2], 0, 100, 0)
						+ "%)";
			
			return null;
		}
	};
	
	_.extend(Smart.Color, {
		_shift: function(hslColor, amount, hslaIndex) {
			hslColor = Smart.Color.parseHSL(hslColor);
			hslColor[hslaIndex] += amount;
			return Smart.Color.toHSL(hslColor);
		},
		darken: function(hslColor, darkenPct) {
			return this._shift(hslColor, -darkenPct, 2);
		}
		,
		lighten: function(hslColor, lightenPct) {
			return this._shift(hslColor, lightenPct, 2);
		}
		,
		spin: function(hslColor, spinAmt) {
			return this._shift(hslColor, spinAmt, 0);
		}
		,
		saturate: function(hslColor, saturateAmt) {
			return this._shift(hslColor, saturateAmt, 1);
		}
		,
		desaturate: function(hslColor, desaturateAmt) {
			return this._shift(hslColor, -desaturateAmt, 1);
		}
	});
	
	function str(number, min, max, decimalPoints) {
		if (number < min) number = min;
		else if (number > max) number = max;
		return number.toFixed(decimalPoints);
	}
	
})();
	
Smart.Disposable = Smart.Class({
	/**
	 * Adds a "cleanup" handler that will be called when `dispose` is called.
	 * @param {Function} callback
	 */
	onDispose: function(callback) {
		if (this._onDispose === null) throw new Error("Object is already disposed!");

		if (this._onDispose === undefined)
			this._onDispose = [ callback ];
		else
			this._onDispose.push(callback);
	}
	,
	/**
	 * Calls all "cleanup" handlers that were added via `onDispose`
	 */
	dispose: function() {
		if (this._onDispose === null) 
			throw new Error("Object is already disposed!");

		if (this._onDispose) {
			this._onDispose.forEach(function(callback) {
				callback.call(this);
			}, this);
			this._onDispose = null;
		}
	}
});
/**
 * Smart.Drawing
 * 
 * A wrapper around a CanvasRenderingContext2D,
 * providing a chainable syntax and shape helper methods.
 * 
 */
Smart.Drawing = Smart.Class({
	addCommand: null // Must be overridden
});

(function Drawing_native_canvas() {
	/**
	 * The following is a list of native canvas context methods.
	 * We will create chainable proxies for each method.
	 *
	 * Note: None of these methods have return values; we do not want things like "measureText" to appear here.
	 */
	var canvasMethods = [
		'moveTo', 'lineTo', 'arc', 'arcTo', 'quadraticCurveTo', 'bezierCurveTo'
		, 'beginPath', 'closePath'
		, 'fill', 'stroke'
		, 'rect', 'fillRect', 'strokeRect', 'clearRect'
		, 'fillText', 'strokeText'
		, 'scale', 'rotate', 'translate', 'transform'
		, 'drawImage'
		, 'save', 'restore'
	];
	/**
	 * The following is a list of native canvas properties.
	 * We will create chainable setters for each property:
	 */
	var canvasProperties = [
		'strokeStyle', 'fillStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit'
	];
	canvasMethods.forEach(function(methodName) {
		Smart.Drawing.prototype[methodName] = function _canvas_method_() {
			var methodArgs = arguments;
			this.addCommand(function(context) {
				context[methodName].apply(context, methodArgs);
			});
			return this;
		}
	});

	canvasProperties.forEach(function(propName) {
		Smart.Drawing.prototype[propName] = function _canvas_property_setter_(value) {
			this.addCommand(function(context) {
				context[propName] = value;
			});
			return this;
		}
	});
})();

(function Drawing_custom_methods() {
	/**
	 * Custom drawing helper methods, for drawing shapes and patterns
	 */
	_.extend(Smart.Drawing.prototype, {
		endPath: function(drawStyle) {
			if (drawStyle.fillStyle) {
				this.fillStyle(drawStyle.fillStyle);
				this.fill();
			}
			if (drawStyle.strokeStyle) {
				this.strokeStyle(drawStyle.strokeStyle);
				this.lineWidth(drawStyle.lineWidth || 1);
				if (drawStyle.lineCap) this.lineCap(drawStyle.lineCap); // "butt", "round", "square"
				if (drawStyle.lineJoin) this.lineJoin(drawStyle.lineJoin); // "miter", "round", "bevel"
				if (drawStyle.miterLimit) this.miterLimit(drawStyle.miterLimit);
				this.stroke();
			}
			return this;
		}
		,roundRect: function(x, y, width, height, radius) {

			var halfPI = Math.PI / 2
				,angle_top = halfPI * 3
				,angle_right = 0
				,angle_bottom = halfPI
				,angle_left = Math.PI;

			var arc_left = x + radius
				,arc_right = x + width - radius
				,arc_top = y + radius
				,arc_bottom = y + height - radius;

			this
				.arc(arc_right, arc_top, radius, angle_top, angle_right)
				.arc(arc_right, arc_bottom, radius, angle_right, angle_bottom)
				.arc(arc_left, arc_bottom, radius, angle_bottom, angle_left)
				.arc(arc_left, arc_top, radius, angle_left, angle_top)
				.lineTo(arc_right, y)
			;

			return this;
		}
		,circle: function(x, y, radius) {
			this.arc(x, y, radius, 0, 2 * Math.PI);
			return this;
		}
		,star: function(x, y, radius, sides, pointSize, angle) {
			var starPolygon = Smart.Drawing.createStarPolygon(x, y, radius, sides, pointSize, angle);
			this.polygon(starPolygon, false);
			return this;
		}
		,polygon: function(points) {
			var start = points[0];
			this.moveTo(start[0], start[1]);
			for (var i = 1, l = points.length; i < l; i++) {
				var point = points[i];
				this.lineTo(point[0], point[1]);
			}
			return this;
		}
		,drawingQueue: function(drawingQueue) {
			this.addCommand(function(context) {
				drawingQueue.draw(context);
			});
			return this;
		}
		,fillPattern: function(pattern, x, y, width, height, patternOffsetX, patternOffsetY) {
			if (patternOffsetX && patternOffsetY) {
				this.save()
					.translate(patternOffsetX, patternOffsetY)
					.fillStyle(pattern)
					.fillRect(x - patternOffsetX, y - patternOffsetY, width, height)
					.restore();
			} else {
				this.fillStyle(pattern)
					.fillRect(x, y, width, height);
			}
			return this;
		}
	});

})();

(function Drawing_static_methods() {
	_.extend(Smart.Drawing, {
		/**
		 * Creates a star with the specified number of sides.
		 * 
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radius
		 * @param {Number} sides
		 * @param {Number} pointSize
		 * @param {Number} angle
		 * @returns {Array}
		 */
		createStarPolygon: function(x, y, radius, sides, pointSize, angle) {
			if (typeof x === 'object') {
				var options = x;
				x = options.x;
				y = options.y;
				radius = options.radius;
				sides = options.sides;
				pointSize = options.pointSize;
				angle = options.angle;
			}
			if (!radius || !sides) return null;
			if (!x) x = 0;
			if (!y) y = 0;
			if (!pointSize) pointSize = 0;
			if (!angle) angle = 0;

			pointSize = 1-pointSize;
			 
			angle /= 180/Math.PI;
			
			var a = Math.PI/sides;

			var starPolygon = [];
			for (var i=0; i<sides; i++) {
				angle += a;
				if (pointSize != 1) {
					starPolygon.push([ x+Math.cos(angle)*radius*pointSize, y+Math.sin(angle)*radius*pointSize ]);
				}
				angle += a;
				starPolygon.push([ x+Math.cos(angle)*radius, y+Math.sin(angle)*radius ]);
			}
			return starPolygon;
		}
		,
		/**
		 * Creates a polygon around the edges of a circle, connecting the specified angles.
		 * For example, [ 0, 120, 240 ] would create an equilateral triangle,
		 * and [ 0, 20, 180, 340 ] would create a kite-like shape.
		 * 
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} radius
		 * @param {Number[]} angles
		 * @returns {Array}
		 */
		polygonFromAngles: function(x, y, radius, angles) {
			var polygon = [];
			var ANGLE_ADJUST = 90,
				RAD_PER_DEG = Math.PI / -180;
			for (var i = 0, l = angles.length; i < l; i++) {
				var angle = (angles[i] + ANGLE_ADJUST) * RAD_PER_DEG
					, px = Math.cos(angle) * radius
					, py = Math.sin(angle) * radius;
				polygon.push([ px + x, py + y ]);
			}
			return polygon;
		}
		,
		createImage: function(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new Smart.DrawingContext(context);

			drawingCallback(drawing);

			return canvas;
		}
		,
		createPattern: function(width, height, drawingCallback) {
			var canvas = this._createCanvas(width, height);
			var context = canvas.getContext('2d');
			var drawing = new Smart.DrawingContext(context);

			drawingCallback(drawing);

			var pattern = context.createPattern(canvas, 'repeat');
			return pattern;
		}
		,
		_createCanvas: function(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas;
		}
	});
})();


/**
 * A Drawing Helper that immediately draws to the supplied canvas context.
 */
Smart.DrawingContext = Smart.Class(new Smart.Drawing(), {
	initialize: function Drawing(context) {
		this.context = context;
	}
	,addCommand: function(command) {
		command(this.context);
	}
	,setContext: function(context) {
		this.context = context;
	}
});

/**
 * A Drawing Helper that queues and caches the shapes, to be drawn
 */
Smart.DrawingQueue = Smart.Class(new Smart.Drawing(), {
	initialize: function DrawingQueue() {
		this._commands = [];
	}
	,addCommand: function(command) {
		this._commands.push(command);
	}
	,draw: function(context) {
		this._commands.forEach(function(command) {
			command(context);
		});
	}
	,clear: function() {
		this._commands.length = 0;
	}
});

Smart.Events = Smart.Class({
	addEvent: function(eventName, callback) {
		if (!this.$events) this.$events = {};
		if (!this.$events[eventName]) this.$events[eventName] = [];

		this.$events[eventName].push(callback);
	}
	,
	fireEvent: function(eventName, eventArgs) {
		var callbacks = this.$events && this.$events[eventName];
		if (!callbacks) return;
		if (!eventArgs) eventArgs = [];

		for (var i = 0, l = callbacks.length; i < l; i++) {
			callbacks[i].apply(null, eventArgs);
		}
	}
	,
	implementEvents: function(events) {
		_.forOwn(events, function(eventName, eventMethodName) {
			this[eventMethodName] = function(eventHandler) {
				this.addEvent(eventName, eventHandler);
			};
		}, this);
		return this;
	}
});

Smart.Physics = {
	applyVelocity: function(point, velocity, elapsedSeconds) {
		if (velocity.x) {
			point.x += velocity.x * elapsedSeconds;
		}
		if (velocity.y) {
			point.y += velocity.y * elapsedSeconds;
		}
	}
	,
	applyAcceleration: function(point, acceleration, elapsedSeconds) {
		if (acceleration.x || acceleration.y) {
			var oneHalfTSquared = elapsedSeconds * elapsedSeconds / 2;
			if (acceleration.x)
				point.x += acceleration.x * oneHalfTSquared;
			if (acceleration.y)
				point.y += acceleration.y * oneHalfTSquared;
		}
	}
	,
	applyAccelerationToVelocity: function(velocity, acceleration) {
		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
	}
	,
	applyFrictionToVelocity: function(velocity, friction, elapsedSeconds) {
		var threshold = 0.5;
		var remainingPercent = Math.pow(1 - friction, elapsedSeconds);

		if (velocity.x < threshold && velocity.x > -threshold)
			velocity.x = 0;
		else
			velocity.x *= remainingPercent;

		if (velocity.y < threshold && velocity.y > -threshold)
			velocity.y = 0;
		else
			velocity.y *= remainingPercent;

	}
	,
	/**
	 * Inverts the velocity and position when the location hits the bounds.
	 */
	bounceOffWalls: function(location, radius, velocity, bounds, dampening) {
		var wall = this.checkBounds(location, radius, bounds);
		if (wall) {
			this.bounceOffWall(wall, location, velocity, dampening);
		}
		return wall;
	}
	,
	checkBounds: function(location, radius, bounds) {
		var leftEdge = (location.x - radius) - (bounds.x);
		if (leftEdge < 0) {
			return { edge: 'left', distance: leftEdge };
		}

		var rightEdge = (location.x + radius) - (bounds.x + bounds.width);
		if (rightEdge > 0) {
			return { edge: 'right', distance: rightEdge };
		}

		var topEdge = (location.y - radius) - (bounds.y);
		if (topEdge < 0) {
			return { edge: 'top', distance: topEdge };
		}

		var bottomEdge = (location.y + radius) - (bounds.y + bounds.height);
		if (bottomEdge > 0) {
			return { edge: 'bottom', distance: bottomEdge };
		}

		return null;
	}
	,
	bounceOffWall: function(wall, location, velocity, dampening) {
		switch (wall.edge) {
			case 'left':
				location.x -= wall.distance * 2;
				velocity.x *= -1;
				break;
			case 'right':
				location.x -= wall.distance * 2;
				velocity.x *= -1;
				break;
			case 'top':
				location.y -= wall.distance * 2;
				velocity.y *= -1;
				break;
			case 'bottom':
				location.y -= wall.distance * 2;
				velocity.y *= -1;
				break;
		}
		if (dampening) {
			velocity.x *= (1 - dampening);
			velocity.y *= (1 - dampening);
		}
	}


	,
	bounceOffPoint: function(location, velocity, bouncePoint, radius, dampening) {
		// This algorithm is not too accurate.
		// It bounces straight away from the bouncePoint,
		// not taking into account the angle of collision.

		var diff = {
			x: location.x - bouncePoint.x
			,y: location.y - bouncePoint.y
		};

		var hv = Smart.Point.hypotenuse(velocity)
			,hd = Smart.Point.hypotenuse(diff)
			,vScale = hv/hd
			,lScale = radius/hd;

		velocity.x = diff.x * vScale;
		velocity.y = diff.y * vScale;

		location.x = bouncePoint.x + diff.x * lScale;
		location.y = bouncePoint.y + diff.y * lScale;

		if (dampening) {
			velocity.x *= (1 - dampening);
			velocity.y *= (1 - dampening);
		}
	}


	,
	sortByLocation: function(points) {
		return Smart.Sort.smoothSort(points, Smart.Physics._compareLocations);
	}
	,
	_compareLocations: function(a, b) {
		// Compare horizontally:
		return (a.location.x - b.location.x);
	}
	,
	detectCollisions: function(sortedPointsA, sortedPointsB, maxDistance, collisionCallback) {

		var aIndex = sortedPointsA.length - 1
			,bIndex = sortedPointsB.length - 1
			,pointA = sortedPointsA[aIndex]
			,pointB = sortedPointsB[bIndex]
			;

		while (aIndex >= 0 && bIndex >= 0) {
			// Rough-compare X:
			var dx = pointA.location.x - pointB.location.x;
			if (maxDistance < dx) {
				aIndex--;
				pointA = sortedPointsA[aIndex];
			} else if (dx < -maxDistance) {
				bIndex--;
				pointB = sortedPointsB[bIndex];
			} else {
				var bLookAhead = bIndex;
				while (bLookAhead >= 0) {
					dx = pointA.location.x - pointB.location.x;
					if (dx < -maxDistance) {
						break;
					}
					// Rough-compare Y:
					var dy = pointA.location.y - pointB.location.y;
					if (-maxDistance <= dy && dy <= maxDistance) {
						// Deep-compare:
						var distance = Math.sqrt(dx * dx + dy * dy);
						if (distance <= maxDistance) {
							collisionCallback(pointA, pointB, aIndex, bLookAhead, distance);
						}
					}
					bLookAhead--;
					pointB = sortedPointsB[bLookAhead];
				}
				pointB = sortedPointsB[bIndex];

				aIndex--;
				pointA = sortedPointsA[aIndex];
			}

		}
	}

	,
	findClosestPoint: function(target, points) {
		var closestPointIndex = -1, distance = Number.MAX_VALUE;

		var i = points.length;
		while (i--) {
			var point = points[i];

			// Let's do rough comparisons, and short-circuit when possible:
			var dx = point.x - target.x;
			if (Math.abs(dx) >= distance) continue;
			var dy = point.y - target.y;
			if (Math.abs(dy) >= distance) continue;

			// Now do a precise comparison:
			var actualDistance = Smart.Point.hypotenuseXY(dx, dy);
			if (actualDistance < distance) {
				distance = actualDistance;
				closestPointIndex = i;
			}
		}
		return closestPointIndex;
	}

	,
	/**
	 * Determines the required trajectory in order to hit a moving target
	 *
	 * @param {Point} playerLocation
	 * @param {Point} targetLocation
	 * @param {Point} targetVelocity
	 * @param {Number} bulletSpeed
	 * @returns {Point}
	 *
	 * For reference, see http://stackoverflow.com/a/4750162/272072 - "shoot projectile (straight trajectory) at moving target in 3 dimensions"
	 */
	trajectory: function(playerLocation, targetLocation, targetVelocity, bulletSpeed) {
		// We've got some crazy equations coming up,
		// so let's create some shorthand variables:
		var v = targetVelocity
			, bs = bulletSpeed
			, e = targetLocation
			, p = playerLocation
			, d = { x: e.x - p.x, y: e.y - p.y }
			, sqr = function(x) { return x * x; };

		// Solve for t by using the quadratic trajectory equation:
		var a = sqr(v.x) + sqr(v.y) - sqr(bs)
			,b = 2 * (v.x * d.x + v.y * d.y)
			,c = sqr(d.x) + sqr(d.y);

		var solutions = Smart.Physics.solveQuadratic(a, b, c);
		var t;
		if (solutions.length === 0 || (solutions[0] <= 0 && solutions[1] <= 0)) {
			// It's just not possible to hit the target using the given bulletSpeed.
			// So let's just fire in the approximate direction:
			t = 1;
		} else {
			// Pick the shortest positive solution:
			if (solutions[0] > 0 && solutions[0] < solutions[1])
				t = solutions[0];
			else
				t = solutions[1];
		}

		var trajectory = {
			x: (d.x + v.x * t)
			,y: (d.y + v.y * t)
		};
		return Smart.Point.scaleVector(trajectory, bulletSpeed);
	}

	,
	/**
	 * Solves a quadratic equation by using the quadratic formula.
	 *
	 * Quadratic equations: ax² + bx + c = 0
	 * Quadratic formula: (-b ± sqrt(b^2 - 4ac)) / 2a
	 *
	 * @param a
	 * @param b
	 * @param c
	 * @returns {[ number, number ]|[]} Returns either 2 solutions or no solutions.
	 */
	solveQuadratic: function(a, b, c) {
		var bSquaredMinus4AC = (b * b - 4 * a * c);
		if (bSquaredMinus4AC < 0)
			return []; // No possible solutions

		var twoA = (2 * a)
			,negativeBOver2A = (-b / twoA)
			,sqrtOfBSquaredMinus4ACOver2A = Math.sqrt(bSquaredMinus4AC) / twoA;

		return [ negativeBOver2A + sqrtOfBSquaredMinus4ACOver2A, negativeBOver2A - sqrtOfBSquaredMinus4ACOver2A ];
	}
};

(function() {
	var RadiansPerDegree = Math.PI / 180;

	Smart.Point = {
		subtract: function(pointA, pointB) {
			return { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
		},
		multiply: function(point, factor) {
			return { x: point.x * factor, y: point.y * factor };
		},
		clonePoint: function(point) {
			return { x: point.x, y: point.y };
		},
		hypotenuse: function(point) {
			return Math.sqrt(point.x * point.x + point.y * point.y);
		},
		hypotenuseXY: function(x, y) {
			return Math.sqrt(x * x + y * y);
		},
		pointIsInBounds: function(point, bounds) {
			return (bounds.x <= point.x) &&
				(point.x <= (bounds.x + bounds.width)) &&
				(bounds.y <= point.y) &&
				(point.y <= (bounds.y + bounds.height));
		},
		distanceTest: function(pointA, pointB, testDistance) {
			var dx, dy;
			dx = (pointA.x - pointB.x);
			if (Math.abs(dx) <= testDistance) {
				dy = (pointA.y - pointB.y);
				if (Math.abs(dy) <= testDistance) {
					var delta = { x: dx, y: dy };
					delta.distance = Smart.Point.hypotenuse(delta);
					if (delta.distance <= testDistance)
						return delta;
				}
			}
			return null;
		},
		rotate: function(point, degrees) {
			var radians = (degrees * RadiansPerDegree);
			var cos = Math.cos(radians), sin = Math.sin(radians);

			var rx = point.x * cos - point.y * sin
				,ry = point.x * sin + point.y * cos;
			point.x = rx;
			point.y = ry;
		},
		fromAngle: function(degrees, scale) {
			var radians = (degrees * RadiansPerDegree);
			return {
				x: Math.cos(radians) * scale
				,y: Math.sin(radians) * scale
			};
		},
		scaleVector: function(vector, scale) {
			var vectorScale = scale / Smart.Point.hypotenuse(vector);
			return {
				x: vector.x * vectorScale
				, y: vector.y * vectorScale
			}
		},
		/**
		 * Returns the angle of a vector
		 *
		 * @param {object} vector
		 * @param {number} vector.x
		 * @param {number} vector.y
		 * @returns {number}
		 */
		angleFromVector: function(vector) {
			return 180 - Math.atan2(vector.x, vector.y) / RadiansPerDegree;
		}
	};

})();

Smart.Sort = {
	/**
	 * Sorts the array, using a custom comparer.
	 *
	 * Performs especially well for nearly-sorted arrays - O(n).
	 * And for unsorted arrays, performs very well - O(n lg n).
	 *
	 * @param {Array} array - The array that will be sorted.  The original array WILL be modified.
	 * @param {Function} compare(a, b) - A custom comparison function
	 * @returns {Array} Returns the original, modified array.
	 */
	smoothSort: function(array, compare) {
		if (!this._smoothsort) {

			this._smoothsort = new window.smoothsort();
		}
		// Set the compare function:
		this._smoothsort.compare(compare);
		this._smoothsort(array);

		return array;
	}
	,
	/**
	 * Sorts the array, comparing based on a property.
	 *
	 * @param {Array} array
	 * @param {String} property
	 */
	smoothSortByProperty: function(array, property) {
		var compare = function(a, b) {
			a = a[property]; b = b[property];
			return (a < b) ? -1 : (a > b) ? 1 : 0;
		};
		return Smart.Sort.smoothSort(array, compare);
	}

};

/**
 * Animation Core
 */
Smart.Animation = Smart.Class({
	initialize: function Animation() {
		this._actions = [];
		this._position = 0;

		/**
		 * @name AnimationEvent
		 * @type {Object}
		 */
		this._animEvent = {
			position: 0
			,
			loops: 0
			,
			keyframe: 0
			,
			/** Indicates that the animation is still running */
			stillRunning: false
			,
			/** Dequeues the current actions */
			clearCurrentActions: function(value) { this._clearCurrentActions = (value === undefined) || value; }
			,
			_clearCurrentActions: false
			,
			/** Prevents the rest of the queue from executing */
			stopUpdate: function(value) { this._stopUpdate = (value === undefined) || value; }
			,
			_stopUpdate: false
		};

	}
	,
	/**
	 * Updates the animation with the elapsed time.
	 * @param {Number} deltaSeconds
	 * @returns {AnimationEvent}
	 */
	update: function(deltaSeconds) {
		this._position += deltaSeconds;

		var animEvent = this._animEvent;
		animEvent.position = this._position;
		animEvent.stillRunning = false;

		for (var i = 0; i < this._actions.length; i++) {
			this._actions[i](animEvent, this);

			if (animEvent._clearCurrentActions) {
				animEvent._clearCurrentActions = false;
				animEvent.position = this._position = 0;
				this._actions.splice(0, i + 1);
				i = -1;
			}
			if (animEvent._stopUpdate) {
				animEvent._stopUpdate = false;
				break;
			}
		}
		if (animEvent.stillRunning === false && this._actions.length) {
			this._actions.length = 0;
		}

		return animEvent;
	}
	,
	/**
	 * Adds an action to the animation queue.
	 * @param {function(AnimationEvent)} actionFunction
	 * @returns {Animation} this
	 */
	addAction: function(actionFunction) {
		this._actions.push(actionFunction);
		return this;
	}
	,
	/**
	 * Waits for the current animations to complete, before continuing the chain.
	 * If supplied, the callback will be executed.
	 * @param {function(AnimationEvent)} [callback]
	 * @returns {Animation} this
	 */
	queue: function(callback) {
		return this.addAction(function _queue_(animEvent) {
			if (animEvent.stillRunning === true) {
				animEvent.stopUpdate();
			} else if (callback && callback(animEvent) === false) {
				animEvent.stopUpdate();
				animEvent.stillRunning = true;
			} else {
				animEvent.clearCurrentActions();
			}
		});
	}
	,
	/**
	 * Cancels the animation queue and removes the animation
	 */
	cancelAnimation: function() {
		this._actions.length = 0;
	}
});

/**
 * Animation Actions
 * These actions animate certain object properties that are used by EaselJS,
 * such as x, y, alpha, color, scaleX, scaleY, and rotation.
 */
_.extend(Smart.Animation.prototype, {

	/**
	 * Animates the `x` and `y` properties of the target.
	 * @param {Point} target
	 * @param {Function|Point[]|Point} keyframes
	 * @returns {Animation} this
	 */
	move: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromPoints(keyframes)
				|| Smart.Keyframes.fromPoints([ Smart.Point.clonePoint(target), keyframes ]);
			return interpolate(position);
		};
		return this.addAction(function _move_(animEvent) {
			var p = interpolate(animEvent.position);
			target.x = p.x; target.y = p.y;
		});

	}

	,
	/**
	 * Animates the `alpha` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Animation} this
	 */
	fade: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.alpha !== undefined ? target.alpha : 1, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _fade_(animEvent) {
			target.alpha = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `color` property of the target.
	 * @param {Object} target
	 * @param {Function|String[]|String} keyframes
	 * @returns {Animation} this
	 */
	color: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromColors(keyframes)
				|| Smart.Keyframes.fromColors([ target.color, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _color_(animEvent) {
			target.color = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `scale` properties (scaleX, scaleY) of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Animation} this
	 */
	scale: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.scaleX !== undefined ? target.scaleX : 1, keyframes ]);
			return interpolate(position);
		};
		return this.addAction(function _scale_(animEvent) {
			target.scaleX = target.scaleY = interpolate(animEvent.position);
		});
	}

	,
	/**
	 * Animates the `rotation` property of the target.
	 * @param {Object} target
	 * @param {Function|Number[]|Number} keyframes
	 * @returns {Animation} this
	 */
	rotate: function(target, keyframes) {
		var interpolate = function(position) {
			interpolate =
				Smart.Keyframes.fromFunction(keyframes)
				|| Smart.Keyframes.fromNumbers(keyframes)
				|| Smart.Keyframes.fromNumbers([ target.rotation !== undefined ? target.rotation : 1, keyframes ]);
			return interpolate(position);
		};

		return this.addAction(function _rotate_(animEvent) {
			target.rotation = interpolate(animEvent.position);
		});
	}
	,
	/**
	 * Animates by calling `update` with the interpolated keyframe values.
	 * @param {function(pct:Number)} update
	 * @param {Function|Number[]} keyframes
	 * @returns {Animation} this
	 */
	tween: function(update, keyframes) {
		var interpolate =
			Smart.Keyframes.fromFunction(keyframes)
			|| Smart.Keyframes.fromNumbers(keyframes)
			|| Smart.Keyframes.fromNumbers([ keyframes ]);

		return this.addAction(function _tween_(animEvent) {
			update(interpolate(animEvent.position));
		});
	}

	,
	/**
	 * Disposes the object once animations are finished
	 * @param disposable - Any object -- must have a `dispose` method
	 * @returns {Animation} this
	 */
	queueDispose: function(disposable) {
		return this.queue(function() { disposable.dispose(); });
	}
});


/**
 * Animation Easing functions
 */
_.extend(Smart.Animation.prototype, {
	defaultEasing: 'swing'
	,
	/**
	 * Applies an ease-in-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Animation} this
	 */
	ease: function(easing) {
		easing = Smart.Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function _ease_(animEvent){
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else if (pos <= 0.5) {
				animEvent.position = easing(pos * 2) / 2;
			} else {
				animEvent.position = 1 - easing((1 - pos) * 2) / 2;
			}
		});
	}
	,
	/**
	 * Applies an ease-in function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Animation} this
	 */
	easeIn: function(easing) {
		easing = Smart.Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function _easeIn_(animEvent){
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else {
				animEvent.position = easing(pos);
			}
		});
	}
	,
	/**
	 * Applies an ease-out function to the current animation.
	 *
	 * @param {Easing|Function|string} [easing]
	 * @returns {Animation} this
	 */
	easeOut: function(easing) {
		easing = Smart.Animation.Easing.from(easing || this.defaultEasing);
		return this.addAction(function _easeOut_(animEvent) {
			var pos = animEvent.position;
			if (pos <= 0){
				animEvent.position = 0;
			} else if (pos >= 1) {
				animEvent.position = 1;
			} else {
				animEvent.position = 1 - easing(1 - pos);
			}
		});
	}
});

Smart.Animation.Easing = {
	/**
	 * Returns an easing function from the specified string.
	 * Alternatively, a custom function can be supplied.
	 *
	 * @param {String|Function} easing
	 * @return {Function}
	 */
	from: function(easing) {
		if (typeof easing === 'function') {
			return easing;
		} else {
			return Smart.Animation.Easing[easing];
		}
	}
	,
	linear: function(position) {
		return position;
	}
	,
	quad: function(position) {
		return (position * position);
	}
	,
	cube: function(position) {
		return Math.pow(position, 3);
	}
	,
	quart: function(position) {
		return Math.pow(position, 4);
	}
	,
	quint: function(position) {
		return Math.pow(position, 5);
	}
	,
	sine: function(position) {
		return (Math.cos(position * Math.PI) - 1) / -2;
	}
	,
	swing: function(position) {
		return position - Math.sin(position * Math.PI) / Math.PI;
	}
};

/**
 * Animation Tweens
 */
_.extend(Smart.Animation.prototype, {
	/**
	 * Specifies the duration of the animation.
	 * Animation will stop after the duration.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	duration: function(duration) {
		return this.addAction(function _duration_(animEvent){
			if (animEvent.position >= duration) {
				animEvent.position = 1;
			} else {
				animEvent.position = animEvent.position / duration;
				animEvent.stillRunning = true;
			}
		});
	}
	,
	/**
	 * Loops the animation over the specified duration.
	 *
	 * @param {Number} duration
	 * @param {Number} [maxLoops] - defaults to Number.MAX_VALUE
	 * @returns {Animation} this
	 */
	loop: function(duration, maxLoops) {
		if (maxLoops === undefined)
			maxLoops = Number.MAX_VALUE;
		return this.addAction(function _loop_(animEvent) {
			while (animEvent.position >= duration) {
				animEvent.position -= duration;
				animEvent.loops++;
			}
			if (animEvent.loops >= maxLoops) {
				animEvent.loops = maxLoops;
				animEvent.position = 1;
			} else {
				animEvent.position = animEvent.position / duration;
				animEvent.stillRunning = true;
			}
		});
	}
	,
	/**
	 * Specifies the duration of the animation.
	 * Animation will continue after the duration.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	continuous: function(duration) {
		return this.addAction(function _continuous_(animEvent) {
			animEvent.position = animEvent.position / duration;
			animEvent.stillRunning = true;
		});
	}
	,
	/**
	 * Waits the duration before starting animation.
	 * @param {Number} duration
	 * @returns {Animation} this
	 */
	delay: function(duration) {
		return this.queue(function _delay_(animEvent) {
			return (animEvent.position >= duration);
		});
	}
	,
	/**
	 * Stores the current position, so it can be restored later.
	 * This allows for multiple synchronized animations.
	 * @returns {Animation} this
	 */
	savePosition: function() {
		return this.addAction(function _savePosition_(animEvent) {
			animEvent.savedPosition = animEvent.position;
		});
	}
	,
	/**
	 * Restores the saved position.
	 * This allows for multiple synchronized animations.
	 * @returns {Animation} this
	 */
	restorePosition: function() {
		return this.addAction(function _restorePosition_(animEvent) {
			animEvent.position = animEvent.savedPosition;
		});
	}
});

Smart.Animations = Smart.Class({
	/**
	 * Adds or creates an animation to the list.
	 *
	 * @param {Animation} [animation]
	 * @returns {Animation}
	 */
	addAnimation: function(animation) {
		if (!animation) animation = new Smart.Animation();
		if (!this.animations)
			this.animations = [ animation ];
		else
			this.animations.push(animation);
		return animation;
	}
	,
	/**
	 * Updates all animations in the list.
	 * Automatically removes finished animations.
	 *
	 * @param {Number} deltaSeconds
	 */
	update: function(deltaSeconds) {
		if (!this.animations) return;
		var i = this.animations.length;
		while (i--) {
			var animEvent = this.animations[i].update(deltaSeconds);
			if (!animEvent.stillRunning) {
				// Remove the animation, by swapping in the last one:
				var lastAnimation = this.animations.pop();
				if (i < this.animations.length)
					this.animations[i] = lastAnimation;
			}
		}
	}
});

/**
 * Interpolate between numbers, colors, points, and shapes.
 * Does so as efficiently as possible, by pre-processing the interpolation
 */
Smart.Interpolate = {
	/**
	 * Determines the type of the values, and interpolates between them
	 * @param {Number|Color|Point|Array} from
	 * @param {Number|Color|Point|Array} to
	 * @returns {interpolate}
	 */
	from: function(from, to) {
		var fromType = (typeof from);
		if (fromType !== typeof to) return null;
		
		if (fromType === 'number')
			return Smart.Interpolate.numbers(from, to);
		
		if (fromType === 'string')
			return Smart.Interpolate.colors(from, to);
		
		if (fromType === 'object') {
			if (typeof fromType.length === 'number')
				return Smart.Interpolate.arrays(from, to);
			if ('x' in fromType && 'y' in fromType)
				return Smart.Interpolate.points(from, to);
		}
			
	}
	
	,
	/**
	 * Interpolates between two numbers	 
	 * @param {Number} from
	 * @param {Number} to
	 * @returns {interpolateNumbers}
	 */
	numbers: function(from, to) {
		var difference = (to - from);
		/**
		 * @callback interpolateNumbers
		 * @param {number} pct
		 * @returns {number}
		 */
		return function(pct) {
			return from + pct * difference;
		};
	}
	
	,
	/**
	 * @type Point
	 * @property {Number} x
	 * @property {Number} y
	 */
	/**
	 * Interpolates between two points.
	 * @param {Point} from
	 * @param {Point} to
	 * @returns {interpolatePoints}
	 */
	points: function(from, to) {
		/**
		 * @callback interpolatePoints
		 * @param {number} pct
		 * @returns {Point}
		 */
		return function(pct) {
			return {
				x: from.x + pct * (to.x - from.x)
				,y: from.y + pct * (to.y - from.y)
			};
		};
	}
	
	,
	/**
	 * Interpolates between two colors.
	 * @param {String} from
	 * @param {String} to
	 * @returns {interpolateColors}
	 */
	colors: function(from, to) {
		/**
		 * @callback interpolateColors
		 * @param {Number} pct
		 * @returns {String}
		 */
			
		var fromHSL = Smart.Color.parseHSL(from);
		if (fromHSL) {
			var toHSL = Smart.Color.parseHSL(to);
			var interpolateHSL = Smart.Interpolate.arrays(fromHSL, toHSL);
			return function(pct) {
				return Smart.Color.toHSL(interpolateHSL(pct));
			};
		}
		var fromRGB = Smart.Color.parseRGB(from);
		if (fromRGB) {
			var toRGB = Smart.Color.parseRGB(to);
			var interpolateRGB = Smart.Interpolate.arrays(fromRGB, toRGB);
			return function(pct) {
				return Smart.Color.toRGB(interpolateRGB(pct));
			};
		}
		return null;
	}
	
	,
	/**
	 * Interpolates all numbers between two arrays.
	 * @param {Number[]} from
	 * @param {Number[]} to
	 * @returns {interpolateArrays}
	 */
	arrays: function(from, to) {
		var length = Math.min(from.length, to.length);
		var interpolate = new Array(length);
		var i = length;
		while (i--) {
			interpolate[i] = Smart.Interpolate.from(from[i], to[i]);
		}
		/**
		 * @callback interpolateArrays
		 * @param {number} pct
		 * @returns {Number[]}
		 */
		return function(pct) {
			var results = new Array(length);
			var i = length;
			while (i--) {
				results[i] = interpolate[i](pct);
			}
			return results;
		};
	}
	
	,
	/**
	 * Interpolates smoothly between keyframes.
	 *
	 * @param {*[]} keyframes
	 * @param {function({*} from, {*} to)} interpolateMethod
	 * @returns {interpolateKeyframes}
	 */
	keyframes: function(keyframes, interpolateMethod) {
		/**
		 * @callback interpolateKeyframes
		 * @param {number} pct
		 * @returns {*}
		 */

		var segments = keyframes.length - 1;
		if (segments === 1 && interpolateMethod)
			return interpolateMethod(keyframes[0], keyframes[1]);
		
		var lastIndex = -1, lastInterpolate;
		return function(pct) {
			// Min / max:
			if (pct <= 0) 
				return keyframes[0];
			else if (pct >= 1)
				return keyframes[segments + 1];
			
			// Current Index & Next Index:
			var pctSegments = pct * segments
				, index = Math.floor(pctSegments);
			
			if (!interpolateMethod)
				return keyframes[index];
			
			if (lastIndex !== index) {
				lastIndex = index;
				lastInterpolate = interpolateMethod(keyframes[index], keyframes[index + 1]);
			}
			
			// Interpolate:
			var subPct = (pctSegments - index);
			return lastInterpolate(subPct);
		};
	}
	
};


Smart.Keyframes = {
	fromFunction: function(keyframes) {
		if (!_.isFunction(keyframes)) return null;

		return keyframes;
	}
	,
	fromNumbers: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.numbers);
	}
	,
	fromPoints: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.points);
	}
	,
	fromColors: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, Smart.Interpolate.colors);
	}
	,
	step: function(keyframes) {
		if (!_.isArray(keyframes)) return null;

		return Smart.Interpolate.keyframes(keyframes, false);
	}
};

(function() {

	if (!window.console) console = {};

	var noop = function(){};
	_.forEach([ 'log','debug','warn','error','assert' ], function(consoleMethod) {
		if (!consoleMethod in console) {
			console[consoleMethod] = noop;
		}
	});

})();


_.extend(createjs.Graphics.prototype, {
	beginStyle: function(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.beginFill(styles.fillColor);
		if (styles.strokeColor)
			gfx.beginStroke(styles.strokeColor);

		if (styles.strokeWidth)
			gfx.setStrokeStyle(styles.strokeWidth, styles.strokeCaps, styles.strokeJoints, styles.strokeMiter);

		return this;
	}
	, endStyle: function(styles) {
		var gfx = this;
		if (styles.fillColor)
			gfx.endFill();
		if (styles.strokeColor)
			gfx.endStroke();

		return this;
	}
	, drawPolygon: function(points) {
		var gfx = this;
		var startX = points[0][0], startY = points[0][1];
		gfx.moveTo(startX, startY);
		for (var i = 1, l = points.length; i < l; i++) {
			var x = points[i][0], y = points[i][1];
			gfx.lineTo(x, y);
		}
		gfx.lineTo(startX, startY);

		return this;
	}
});

_.extend(createjs.DisplayObject.prototype, Smart.Disposable.prototype);
_.extend(createjs.DisplayObject.prototype, {
	moveTo: function(x, y) {
		this.x = x; this.y = y;
	}
	, scaleTo: function(x, y) {
		if (y === undefined) y = x;
		this.scaleX = x;
		this.scaleY = y;
	}
	, toggleVisible: function(force) {
		if (force === undefined) force = !this.visible;
		this.visible = force;
	}
});


_.mixin({
	eliminate: function(array, item) {
		var index = array.indexOf(item);
		if (index !== -1) {
			array.splice(index, 1);
		}
	}
});

if (!_.forEachRight) {
	_.mixin({
		forEachRight: function forEachRight(collection, callback, thisArg) {
			var length = collection ? collection.length : 0;
			while (length--) {
				if (callback(collection[length], length, collection) === false) {
					break;
				}
			}
			return collection;
		}

	})
}
// Global Namespace:
XQuestGame = {};
XQuestGame.BaseScene = Smart.Class(new Smart.Disposable(), {
	initialize: function BaseScene() { }
	,BaseScene_initialize: function() {
		this.debugStats = { sceneItems: [] };
		this._setupEvents();
		this._setupPhases();
	}
	,_setupEvents: function() {
		this._events = new Smart.Events();
	}
	,_setupPhases: function() {
		this.phases = {
			input: []
			, move: []
			, act: []
			, draw: []
		};
	}
	,updateScene: function(tickEvent) {
		// Iterate right-to-left, because items could get removed
		if (!this.scenePaused) {
			var inputState = (this.getDefaultInputState && this.getDefaultInputState()) || {};
			_.forEachRight(this.phases.input, function(gameItem) { gameItem.onInput(tickEvent, inputState); });
			_.forEachRight(this.phases.move, function(gameItem) { gameItem.onMove(tickEvent, inputState); });
			_.forEachRight(this.phases.act, function(gameItem) { gameItem.onAct(tickEvent); });
		}
		_.forEachRight(this.phases.draw, function(gameItem) { gameItem.onDraw(tickEvent); });
	}
	,addSceneItem: function(sceneItem) {
		// Determine which methods the sceneItem implements,
		// and add them to the appropriate phase:
		if (sceneItem.onInput)
			this.phases.input.push(sceneItem);
		if (sceneItem.onMove)
			this.phases.move.push(sceneItem);
		if (sceneItem.onAct)
			this.phases.act.push(sceneItem);
		if (sceneItem.onDraw)
			this.phases.draw.push(sceneItem);

		this.debugStats.sceneItems.push(sceneItem);
	}
	,removeSceneItem: function(sceneItem) {
		if (sceneItem.onInput)
			_.eliminate(this.phases.input, sceneItem);
		if (sceneItem.onMove)
			_.eliminate(this.phases.move, sceneItem);
		if (sceneItem.onAct)
			_.eliminate(this.phases.act, sceneItem);
		if (sceneItem.onDraw)
			_.eliminate(this.phases.draw, sceneItem);

		_.eliminate(this.debugStats.sceneItems, sceneItem);
	}
	,
	/**
	 * Creates utility methods for adding event handlers.
	 * This makes it easier to add events and harder to have typos.
	 *
	 * Example:
	 *  game.onGamePaused(function(paused) { ... });
	 * instead of
	 *  game.addEvent('GamePaused', function(paused) { ... });
	 *
	 * @param {Object.<method,{string} event>} SceneEvents
	 */
	implementSceneEvents: function(SceneEvents) {
		_.forOwn(SceneEvents, function(eventName, onEventName) {
			this[onEventName] = function(eventHandler) {
				this._events.addEvent(eventName, eventHandler);
			};
		}, this);
	}
	,
	/**
	 * @protected
	 * @param {string} eventName
	 * @param {array} [args]
	 */
	fireSceneEvent: function(eventName, args) {
		this._events.fireEvent(eventName, args);
	}

});

(function() {
	var GameEvents = {
		onNewGame: 'NewGame'
		,onNewLevel: 'NewLevel'
		,onPlayerKilled: 'PlayerKilled'
		,onGameOver: 'GameOver'
		,onNextLevel: 'NextLevel'
		,onAllCrystalsGathered: 'AllCrystalsGathered'
		,onGamePaused: 'GamePaused'
		,onPowerupChanged: 'PowerupChanged'
	};

	XQuestGame.ArcadeGame = Smart.Class(new XQuestGame.BaseScene(), {
		player: null
		, levelGraphics: null
		, activePowerups: null
		, scenePaused: false
		, stats: null
		, powerCrystals: null
		
		, initialize: function _ArcadeGame(graphics) {
			this.BaseScene_initialize();
			this.addSceneItem(this);
			this.gfx = graphics;
			this.addSceneItem(this.gfx);
			
			// Since all other classes use 'this.game', this will provide consistency:
			this.game = this;
			this._events = new Smart.Events();
	
	
			this.stats = {};
			this._setupLevelGraphics();
			this._setupPlayer();
			this._setupEnemyFactory();
			this._setupCrystals();
			this._setupPowerCrystals();
			this._setupProjectiles();
			this._setupHUD();

			this.activePowerups = {};

		}
		, _setupLevelGraphics: function() {
			this.levelGraphics = this.game.gfx.createLevelGraphics();
		}
		, _setupPlayer: function() {
			this.player = new XQuestGame.Player(this.game);
			this.game.addSceneItem(this.player);
		}
		, _setupEnemyFactory: function() {
			this.enemies = new XQuestGame.EnemyFactory(this.game);
			this.addSceneItem(this.enemies);
		}
		, _setupCrystals: function() {
			this.crystals = new XQuestGame.CrystalFactory(this.game);
		}
		, _setupPowerCrystals: function() {
			this.powerCrystals = new XQuestGame.PowerupFactory(this.game);
		}
		, _setupProjectiles: function() {
			this.projectiles = new XQuestGame.Projectiles(this.game);
		}
		, _setupHUD: function() {
			this.hud = new XQuestGame.Hud(this.game);
			this.addSceneItem(this.hud);
		}
		
		, debug: function() {
			var debug = new XQuestGame.GameDebugger(this.game);
			this.debug = function() { return debug; };
			return this.debug();
		}

		, startArcadeGame: function() {
			this.currentLevel = 1;
			this.stats.lives = Balance.player.lives;
			this.stats.bombs = Balance.bombs.startCount;
	
			this._events.fireEvent(GameEvents.onNewGame);
			
			this._showLevelNumber();
			this._arrangeNewLevel();
			this._startLevel();
		}
		, _showLevelNumber: function() {
			var level = "Level " + this.currentLevel;
	
			var textGfx = this.game.gfx.addText(level, { textBaseline: 'top' });
			textGfx.flyIn(1.5).flyOut(2);
		}
		, _arrangeNewLevel: function() {
			this.game.levelGraphics.closeGate();
			this.game.levelGraphics.setGateWidth(Balance.level.gateWidth);
	
			this._events.fireEvent(GameEvents.onNewLevel);
			this.game.crystals.startLevel();
			this.game.enemies.startLevel();
			this.game.powerCrystals.startLevel();
		}
		, _startLevel: function() {
			var middleOfGame = this.game.gfx.getGamePoint('middle');
			this.game.player.movePlayerTo(middleOfGame.x, middleOfGame.y);
			this.game.player.cancelVelocity();
			this.game.player.showPlayer(true);
	
			this.followPlayer = true;
			this.game.gfx.followPlayer(this.game.player.location);
		}
	
		, onAct: function(tickEvent) {
			this._updateActivePowerups(tickEvent);
	
			if (this.followPlayer)
				this.game.gfx.followPlayer(this.game.player.location);
	
		}
	
		, getDefaultInputState: function() {
			var state = {
				primaryWeapon: false
				, secondaryWeapon: false
				, engaged: false
				, accelerationX: 0
				, accelerationY: 0
			};
			return state;
		}
	
		, killPlayer: function() {
			this.game.player.killPlayer();
			this._events.fireEvent(GameEvents.onPlayerKilled);
			this.game.enemies.clearAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
	
			if (this.game.stats.lives === 0) {
				this._gameOver();
			} else {
				this._loseALife();
			}
		}
		, _loseALife: function() {
			this.game.stats.lives--;
			this._animateBackToCenter().queue(function() {
				this._startLevel();
			}.bind(this));
		}
		, _gameOver: function() {
			// bew wew wew wew wew
			this._animateBackToCenter();
			
			this._events.fireEvent(GameEvents.onGameOver);
	
			this.game.gfx.addAnimation(new Smart.Animation()
				.queue(function() {
					this.game.gfx.addText("Game Over").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.game.gfx.addText("Highest Level: " + this.currentLevel).flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.game.gfx.addText("Starting a new game in 5 seconds...").flyIn(2).delay(2).flyOut(2);
				}.bind(this)).delay(5)
				.queue(function() {
					this.startArcadeGame();
				}.bind(this))
			);
	
		}
	
		, levelUp: function() {
			this.game.player.showPlayer(false);
						
			// Let's kill all enemies:
			this.game.enemies.killAllEnemies();
			this.game.powerCrystals.clearAllPowerCrystals();
	
			this.currentLevel++;
	
			this._showLevelNumber();
			this._arrangeNewLevel();
			this._animateBackToCenter().queue(function() {
				this._startLevel();
			}.bind(this));
			
			this._events.fireEvent(GameEvents.onNextLevel);
		}
		, _animateBackToCenter: function() {
			var visibleMiddle = this.game.gfx.getGamePoint('visibleMiddle')
				, middleOfGame = this.game.gfx.getGamePoint('middle');
	
			this.followPlayer = false;
			var animation = new Smart.Animation()
				.duration(2).ease()
				.tween(function(p) {
					this.game.gfx.followPlayer(p);
				}.bind(this), Smart.Keyframes.fromPoints([ visibleMiddle, middleOfGame ]));
			this.game.gfx.addAnimation(animation);
			return animation;
		}
	
		, crystalsGathered: function(remainingCrystals, gatheredCrystals) {
			if (remainingCrystals === 0) {
				this.game.levelGraphics.openGate();
				this._events.fireEvent(GameEvents.onAllCrystalsGathered);
			}
		}
	
		, pauseGame: function(paused) {
			paused = (paused !== undefined) ? paused : !this.scenePaused;
			
			if (this.scenePaused === paused) return;
			this.scenePaused = paused;
			
			this.game.player.cancelVelocity();
			
			this._events.fireEvent(GameEvents.onGamePaused, [ this.scenePaused ]);
		}
	
		, activatePowerup: function(powerupName) {
			this.game.activePowerups[powerupName] = 'newPowerup';
	
			var powerupDisplayName = powerupName + "!";
			var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupActive');
			textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
			
			this._events.fireEvent(GameEvents.onPowerupChanged, [ powerupName, true ]);
		}
		, powerupDeactivated: function(powerupName) {
			this._events.fireEvent(GameEvents.onPowerupChanged, [ powerupName, false ]);
			var powerupDisplayName = powerupName + " inactive";
			var textGfx = this.game.gfx.addText(powerupDisplayName, 'powerupDeactive');
			return textGfx.start('left').flyIn(1.5, 'middle').flyOut(2, 'right');
		}
		, _updateActivePowerups: function(tickEvent) {
			var B = Balance.powerups;
			var updatedValues = {};
			var deactivating = 'deactivating';
			
			// Update new and old powerups: (never make changes to an object while iterating)
			_.forOwn(this.game.activePowerups, function(powerupValue, powerupName) {
				if (powerupValue === 'newPowerup') {
					// New
					var powerupExpires = tickEvent.runTime + B[powerupName].duration * 1000;
					updatedValues[powerupName] = powerupExpires;
				} else if (powerupValue === deactivating) {
					// Old
				} else if (powerupValue <= tickEvent.runTime) {
					// Expired
					updatedValues[powerupName] = deactivating;
				}
			});
			_.forOwn(updatedValues, function(updatedValue, powerupName) {
				if (updatedValue === deactivating) {
					this.game.powerupDeactivated(powerupName).queue(function() {
						delete this.game.activePowerups[powerupName];
					}.bind(this));
				}
				this.game.activePowerups[powerupName] = updatedValue;
			}, this);
	
		}

		, toggleFPS: function() {
			if (this.fpsText) {
				this.fpsText.dispose();
				this.fpsText = null;
			} else {
				var textStyle = { color: 'red', fontSize: "40px", textAlign: 'left', textBaseline: 'top' };
				this.fpsText = this.game.gfx.addText("FPS", textStyle);
				this.fpsText.moveTo(0, 0);
				this.fpsText.onTick = function(tickEvent) {
					var actualFPS = createjs.Ticker.getMeasuredFPS()
						,potentialFPS = 1000 / createjs.Ticker.getMeasuredTickTime();

					this.text = "FPS: " + potentialFPS.toFixed(2) + " [" + actualFPS.toFixed(2) + "]";
				};
			}
		}
		, toggleDebugStats: function() {
			if (this.debugStatsText) {
				this.debugStatsText.dispose();
				this.debugStatsText = null;
			} else {
				var textStyle = { color: 'red', fontSize: "40px", textAlign: 'right', textBaseline: 'top' };
				this.debugStatsText = this.game.gfx.addText("FPS", textStyle);

				var bounds = Balance.level.bounds;
				this.debugStatsText.moveTo(bounds.visibleWidth, 0);


				var gameItems = this.game.debugStats.gameItems
					,allGraphics = this.game.gfx.debugStats.allGraphics;
				this.debugStatsText.onTick = function(tickEvent) {
					this.text = "Game Items: " + gameItems.length + "\nGraphics: " + allGraphics.length;
				};
			}
		}

	});
	
	// Add event handler functions to ArcadeGame, so that we don't use addEvent / fireEvent directly
	_.forOwn(GameEvents, function(eventName, onEventName) {
		XQuestGame.ArcadeGame.prototype[onEventName] = function(eventHandler) {
			this._events.addEvent(eventName, eventHandler);
		};
	});
	
})();

XQuestGame.BombCrystal = Smart.Class({
	initialize: function BombCrystal(game) {
		this.game = game;
		this.location = this.game.gfx.createBombCrystalGraphic();
		this.radius = Balance.bombCrystals.radius;
	}
	, spawnBomb: function(location) {
		this.location.moveTo(location.x, location.y);
	}
	, gatherBombCrystal: function() {
		this.location.gatherBombCrystal(this.game.gfx, this.game.player.location);
	}
});

XQuestGame.Player = Smart.Class({
	location: null
	, radius: null
	
	, initialize: function(game) {
		this.game = game;
		this.velocity = { x: 0, y: 0 };
		this.engaged = false;
		this.previousState = {};

		this._setupPlayerGraphics();
	}
	, _setupPlayerGraphics: function() {
		this.playerGraphics = this.game.gfx.createPlayerGraphics();
		this.location = this.playerGraphics;
		this.radius = Balance.player.radius;
	}
	
	, movePlayerTo: function(x, y) {
		this.playerGraphics.moveTo(x, y);
	}
	, cancelVelocity: function() {
		this.velocity.x = 0;
		this.velocity.y = 0;
	}

	, _handleInputs: function(tickEvent, inputState) {

		var previousState = this.previousState;

		if (!this.playerActive) return;

		this.previousState = inputState;

		if (inputState.accelerationX || inputState.accelerationY) {
			var acceleration = {
				x: inputState.accelerationX || 0,
				y: inputState.accelerationY || 0
			};

			// Increase the sensitivity when decelerating
			var neutralizingFactor = 2.0;
			var isSameDirectionX = (this.velocity.x <= 0) === (inputState.accelerationX <= 0),
				isSameDirectionY = (this.velocity.y <= 0) === (inputState.accelerationY <= 0);
			if (!isSameDirectionX)
				acceleration.x *= neutralizingFactor;
			if (!isSameDirectionY)
				acceleration.y *= neutralizingFactor;
			
			Smart.Physics.applyAcceleration(this.playerGraphics, acceleration, tickEvent.deltaSeconds);
			Smart.Physics.applyAccelerationToVelocity(this.velocity, acceleration);
		}

		this.engaged = inputState.engaged;

		if (inputState.primaryWeapon) {
			var isFirstDown = (previousState.primaryWeapon === false);
			if (isFirstDown) {
				this.primaryWeaponDownTime = tickEvent.runTime;

				if (this.game.activePowerups.tripleShot) {
					this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
				} else {
					this.game.projectiles.addBullet();
				}
			} else {

			}
		}

		if (inputState.primaryWeapon) {
			var shotsPerSecond;
			if (this.game.activePowerups.rapidFire) {
				shotsPerSecond = Balance.powerups.rapidFire.shotsPerSecond;
			} else {
				shotsPerSecond = Balance.bullets.shotsPerSecond;
			}
			var period = 1000 / shotsPerSecond;
			if (!this.nextRapidFire) {
				this.nextRapidFire = tickEvent.runTime + period;
			} else if (this.nextRapidFire <= tickEvent.runTime) {
				this.nextRapidFire += period;
				if (this.game.activePowerups.tripleShot) {
					this.game.projectiles.addTripleShot(Balance.powerups.tripleShot);
				} else {
					this.game.projectiles.addBullet();
				}
			}
		} else {
			this.nextRapidFire = null;
		}
		
		if (inputState.secondaryWeapon) {
			var isFirstDown = (previousState.secondaryWeapon === false);
			if (isFirstDown) {
				this.game.projectiles.releaseABomb();
				this.cancelVelocity();
			}
		}

	}

	, onMove: function(tickEvent, inputState) {
		this._handleInputs(tickEvent, inputState);
		this._movePlayer(tickEvent);
	}
	, _movePlayer: function(tickEvent) {

		Smart.Physics.applyVelocity(this.playerGraphics, this.velocity, tickEvent.deltaSeconds);

		if (!this.playerActive) return;

//		if (this.inputResults.acceleration) {
//			Physics.applyAcceleration(this.playerGraphics, this.inputResults.acceleration, tickEvent.deltaSeconds);
//			Physics.applyAccelerationToVelocity(this.velocity, this.inputResults.acceleration);
//		}
		if (!this.engaged) {
			Smart.Physics.applyFrictionToVelocity(this.velocity, Balance.player.looseFriction, tickEvent.deltaSeconds);
		}

		var wallCollision = this.game.levelGraphics.levelCollision(this.location, this.radius);
		if (wallCollision) {
			if (wallCollision.insideGate) {
				if (wallCollision.insideGateDistance >= this.radius * 2) {
					this.cancelVelocity();
					this.game.levelUp();
				} else if (wallCollision.touchingGate) {
					Smart.Physics.bounceOffPoint(this.location, this.velocity, wallCollision.touchingGate, this.radius, Balance.player.bounceDampening);
				}
			} else {
				if (this.game.activePowerups.invincible) {
					Smart.Physics.bounceOffWall(wallCollision, this.location, this.velocity, Balance.player.bounceDampening);
				} else {
					this.game.killPlayer();
				}
			}
		}
	}


	, onAct: function(tickEvent) {
		if (!this.playerActive) return;


		var killPlayer = false;
		this.game.enemies.killEnemiesOnCollision([ this ], this.radius, function(enemy, player, ei, pi, distance) {
			if (this.game.activePowerups.invincible) return;

			killPlayer = true;
		}.bind(this));

		if (killPlayer)
			this.game.killPlayer();

	}

	, killPlayer: function() {
		this.playerActive = false;
		this.playerGraphics.killPlayerGraphics(this.game.gfx, this.velocity);
	}

	, showPlayer: function(show) {
		this.playerActive = show;
		if (show) {
			this.playerGraphics.restorePlayerGraphics();
			this.game.gfx.addAnimation(new Smart.Animation()
				.duration(1).easeOut()
				.scale(this.playerGraphics, [0,1])
			).update(0);
		} else {
			this.game.gfx.addAnimation(new Smart.Animation()
				.duration(0.5).easeOut()
				.scale(this.playerGraphics, [1,0])
				.queue(function() {
					this.playerGraphics.toggleVisible(false);
				}.bind(this))
			);
		}
	}

	, getKickBack: function(enemy, distance) {
		return Smart.Point.multiply(this.velocity, Balance.player.kickBack);
	}
});

XQuestGame.PowerCrystal = Smart.Class({
	initialize: function(game) {
		var B = Balance.powerCrystals;
		this.game = game;
		this.game.addSceneItem(this);

		this.location = this.game.gfx.createPowerCrystalGraphic();
		this.radius = B.radius;


		this.turnSpeed = B.turnSpeed();
	}
	,
	spawn: function(spawnInfo) {
		var B = Balance.powerCrystals;

		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = { x: B.speed, y: 0 };
		Smart.Point.rotate(this.velocity, B.spawnAngle());
		if (spawnInfo.side === 2) {
			this.velocity.x *= -1;
		}
	}
	,
	onMove: function(tickEvent) {
		var powerCrystal = this;

		// Turn:
		Smart.Point.rotate(powerCrystal.velocity, powerCrystal.turnSpeed * tickEvent.deltaSeconds);

		Smart.Physics.applyVelocity(powerCrystal.location, powerCrystal.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(powerCrystal.location, powerCrystal.radius, powerCrystal.velocity, Balance.level.bounds);

	}
	,
	gatherPowerCrystal: function() {
		this.location.gatherPowerCrystal(this.game.gfx, this.game.player.location)
			.queue(function() {
				this.game.removeSceneItem(this);
			}.bind(this))
		;
	}
	,
	clearPowerCrystal: function() {
		this.location.clearPowerCrystal(this.game.gfx)
			.queue(function() {
				this.game.removeSceneItem(this);
			}.bind(this))
		;
	}
});

XQuestGame.BaseEnemy = Smart.Class({
	game: null
	, enemyGraphics: null
	, location: null
	, radius: null
	, velocity: null
	,
	/* @protected */
	setupBaseEnemyGraphics: function(game, enemyName, radius) {
		this.game = game;
		this.game.addSceneItem(this);
		this.enemyGraphics = this.game.gfx.createEnemyGraphics(enemyName);
		this.location = this.enemyGraphics;
		this.radius = radius;
	}
	,
	/* @protected */
	applyVelocityAndBounce: function(tickEvent) {
		Smart.Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	/* @protected */
	shouldChangeDirection: function(tickEvent, movementInterval) {
		var isFirstRun = (this.nextChange === undefined);
		if (isFirstRun || this.nextChange <= tickEvent.runTime) {
			this.nextChange = tickEvent.runTime + movementInterval() * 1000;
			return !isFirstRun;
		}
		return false;
	}
	,
	/** @public @overridable */
	takeDamage: function(hitPoints, kickBack) {

		// Apply the kickback:
		if (kickBack) {
			this.velocity.x += kickBack.x;
			this.velocity.y += kickBack.y;
		}

		// Apply the damage:
		if (hitPoints >= 1) {
			this.enemyGraphics.killEnemy(this.game.gfx, this.velocity);
			this.game.removeSceneItem(this);
		}
	}
	,
	/* @public */
	clearEnemy: function() {
		this.game.gfx.addAnimation(new Smart.Animation()
			.duration(2).easeIn()
			.scale(this.enemyGraphics, 0)

			.queue(function() {
				this.enemyGraphics.dispose();
				this.game.removeSceneItem(this);
			}.bind(this))
		);
	}
});

XQuestGame.Locust = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Locust(game) {
		var B = Balance.enemies.locust;
		this.setupBaseEnemyGraphics(game, 'Locust', B.radius);
	}
	,
	spawn: function(spawnInfo) {
		var B = Balance.enemies.locust;
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this.velocity = Smart.Point.fromAngle((spawnInfo.side === 2 ? 180 : 0) + _.random(-20, 20), B.speed);
		this._changeTurnSpeed();
	}
	,
	_changeTurnSpeed: function() {
		var B = Balance.enemies.locust;
		this.turnSpeed = B.turnSpeed();
	}
	,
	onMove: function(tickEvent) {
		var rotation = tickEvent.deltaSeconds * this.turnSpeed;
		Smart.Point.rotate(this.velocity, rotation);

		Smart.Physics.applyVelocity(this.location, this.velocity, tickEvent.deltaSeconds);
		Smart.Physics.bounceOffWalls(this.location, this.radius, this.velocity, Balance.level.bounds);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.locust;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeTurnSpeed();
		}

		this.enemyGraphics.rotation = Smart.Point.angleFromVector(this.velocity);
	}
});

XQuestGame.Mantis = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Mantis(game) {
		var B = Balance.enemies.mantis;
		this.setupBaseEnemyGraphics(game, 'Mantis', B.radius);
	}
	,
	spawn: function(spawnInfo) {
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this._changeDirection();
	}
	,
	onMove: function(tickEvent) {
		this.applyVelocityAndBounce(tickEvent);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.mantis;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection: function() {
		var B = Balance.enemies.mantis;
		this.velocity = Smart.Point.fromAngle(Math.random() * 360, B.speed);
	}
});

XQuestGame.Slug = Smart.Class(new XQuestGame.BaseEnemy(), {
	initialize: function Slug(game) {
		var B = Balance.enemies.slug;
		this.setupBaseEnemyGraphics(game, 'Slug', B.radius);
	}
	,
	spawn: function(spawnInfo) {
		this.location.moveTo(spawnInfo.x, spawnInfo.y);
		this._changeDirection();
	}
	,
	onMove: function(tickEvent) {
		this.applyVelocityAndBounce(tickEvent);
	}
	,
	onAct: function(tickEvent) {
		var B = Balance.enemies.slug;
		if (this.shouldChangeDirection(tickEvent, B.movementInterval)) {
			this._changeDirection();
		}
	}
	,
	_changeDirection: function() {
		var B = Balance.enemies.slug;
		this.velocity = Smart.Point.fromAngle(Math.random() * 360, B.speed);
	}
});

XQuestGame.CrystalFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addSceneItem(this);
		this.crystals = [];
	}
	,
	startLevel: function() {
		// Clean up:
		this.crystals.forEach(function(crystal) {
			crystal.dispose();
		}, this);
		this.crystals = [];

		var spawnQuantity = Balance.crystals.spawnQuantity(this.game);
		var radius = Balance.crystals.radius;

		this.game.stats.crystalCount = spawnQuantity;

		while (spawnQuantity--) {
			var crystal = this.game.gfx.createCrystalGraphic();
			var spawnPoint = this.game.gfx.getSafeSpawn(radius);
			crystal.moveTo(spawnPoint.x, spawnPoint.y);
			crystal.location = crystal;
			this.crystals.push(crystal);
		}

		Smart.Physics.sortByLocation(this.crystals);
	}
	,
	onAct: function(tickEvent) {

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);
	}
	,
	_gatherOnCollision: function(collisionPoints, maxRadius) {

		var maxDistance = maxRadius + Balance.crystals.radius;

		var crystalsGathered = 0;
		Smart.Physics.detectCollisions(this.crystals, collisionPoints, maxDistance, function(crystal, point, crystalIndex, pi, distance) {
			crystal.gatherCrystal(this.game.gfx, this.game.player.location);
			this.crystals.splice(crystalIndex, 1);
			crystalsGathered++;
		}.bind(this));

		if (crystalsGathered) {
			this.game.crystalsGathered(this.crystals.length, crystalsGathered);
			this.game.stats.crystalCount -= crystalsGathered;
		}
	}
	,
	gatherClosestCrystal: function(location) {
		if (!this.crystals.length) return;

		var crystalIndex = Smart.Physics.findClosestPoint(location, this.crystals)
			,crystal = this.crystals[crystalIndex];

		crystal.gatherCrystal(this.game.gfx, this.game.player.location);
		this.crystals.splice(crystalIndex, 1);

		this.game.crystalsGathered(this.crystals.length, 1);

		this.game.stats.crystalCount -= 1;
	}
});

XQuestGame.EnemyFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.enemies = [];
	}
	,
	startLevel: function() {
		var currentLevel = this.game.currentLevel;
		var currentEnemyLineupIndex = Math.floor(currentLevel / 2);

		var enemyLineup = Balance.enemies.roster;

		if (currentEnemyLineupIndex >= enemyLineup.length) {
			// Very high levels include all enemies:
			this.enemyPool = enemyLineup;
		} else if ((currentLevel % 2) === 0) {
			// Even levels only include the current enemy:
			this.enemyPool = [ enemyLineup[currentEnemyLineupIndex] ];
		} else {
			// Odd levels include a variety of enemies, up to the current level index:
			this.enemyPool = enemyLineup.slice(0, currentEnemyLineupIndex + 1);
		}
	}
	,
	onAct: function(tickEvent) {
		if (this.nextEnemySpawn == null) {
			this._calculateNextEnemySpawn(tickEvent.runTime);
		} else if (this.nextEnemySpawn <= tickEvent.runTime) {
			this.spawnNextEnemy();
			this._calculateNextEnemySpawn(tickEvent.runTime);
		}
		if (this.enemies.length >= 2) {
			Smart.Physics.sortByLocation(this.enemies);
		}
	}
	,
	_calculateNextEnemySpawn: function(runTime) {
		var spawnRate = Balance.enemies.spawnRate();
		this.nextEnemySpawn = runTime + spawnRate * 1000;
	}
	,
	spawnNextEnemy: function() {

		var randomEnemyIndex;
		if (this.enemyPool.length === 1) {
			randomEnemyIndex = 0;
		} else {
			// Prefer to spawn more difficult enemies:
			var weightedRandom = (1 - Math.pow(Math.random(), Balance.enemies.spawnDifficulty));
			randomEnemyIndex = Math.floor(weightedRandom * this.enemyPool.length);
		}

		var enemyCtor = this.enemyPool[randomEnemyIndex];

		var enemy = new enemyCtor(this.game);
		this.enemies.push(enemy);

		var spawnInfo = this.getRandomSpawn(enemy.radius);
 		enemy.spawn(spawnInfo);
		this.game.gfx.addAnimation(new Smart.Animation()
			.duration(1).easeOut('quint')
			.scale(enemy.location, [0, 1])
		).update(0);
	}
	,
	getRandomSpawn: function(enemyRadius) {
		var bounds = Balance.level.bounds
			, spawnSide = Math.floor(Math.random() * 2) ? 1 : 2
			, spawnInfo = {
				x: (spawnSide === 1) ? (bounds.x + enemyRadius) : (bounds.x + bounds.width - enemyRadius)
				,y: bounds.y + (bounds.height / 2)
				,side: spawnSide
			};
		return spawnInfo;
	}
	,
	killEnemiesOnCollision: function(sortedItems, maxItemRadius, collisionCallback) {
		var enemies = this.enemies;
		var maxDistance = maxItemRadius + Balance.enemies.maxRadius;
		Smart.Physics.detectCollisions(enemies, sortedItems, maxDistance, function(enemy, item, ei, ii, distance){
			if (enemy.isDead) return;

			var theseSpecificItemsDidCollide = (distance <= enemy.radius + item.radius);
			if (theseSpecificItemsDidCollide) {
				var hitPoints = item.hitPoints || 1,
					kickBack = (item.getKickBack && item.getKickBack(enemy, distance)) || null,
					stayAlive = enemy.takeDamage(hitPoints, kickBack);
				if (!stayAlive)
					enemy.isDead = true;

				if (collisionCallback)
					collisionCallback(enemy, item, ei, ii, distance);
			}
		}.bind(this));

		// Remove dead enemies:
		var i = enemies.length;
		while (i--) {
			if (enemies[i].isDead) {
				this.enemies.splice(i, 1);
			}
		}
	}
	,
	killAllEnemies: function() {
		this.enemies.forEach(function(enemy) {
			enemy.takeDamage(Number.POSITIVE_INFINITY, null);
		}, this);
		this.enemies.length = 0;
	}
	,
	clearAllEnemies: function() {
		this.enemies.forEach(function(enemy) {
			enemy.clearEnemy();
		});
		this.enemies.length = 0;
	}
	,
	findClosestEnemy: function(location) {
		var enemyLocations = this.enemies.map(function(enemy) { return enemy.location; }); // Perhaps this could be improved, but it's not mission-critical
		var enemyIndex = Smart.Physics.findClosestPoint(location, enemyLocations);

		return this.enemies[enemyIndex];
	}
});

XQuestGame.GameDebugger = Smart.Class({
	initialize: function(game) {
		this.game = game;
	}

	, gatherClosestCrystal: function() {
		this.game.crystals.gatherClosestCrystal(this.game.player.location);
	}
	, spawnEnemy: function() {
		this.game.enemies.spawnNextEnemy();
	}
	, activatePowerup: function(powerupName) {
		this.game.activatePowerup(powerupName);
	}
	, addBomb: function() {
		this.game.stats.bombs++;
	}
	, killPlayer: function() {
		this.game.killPlayer();
	}
	, spawnPowerCrystal: function() {
		this.game.powerCrystals.createPowerCrystal();
	}
	, toggleFPS: function() {
		this.game.toggleFPS();
	}
	, toggleDebugStats: function() {
		this.game.toggleDebugStats();
	}
});

XQuestGame.Hud = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this._setupGraphics();
		this._layout();
	}
	, _setupGraphics: function() {

		this.game.gfx.enableTouchClicks();

		this.hudOverlay = this.game.gfx.createHUDOverlay();

		this.hudLivesIcon = this.game.gfx.createPlayerHUDIcon();
		this.hudLivesText = this.game.gfx.addText("", 'hudText');

		this.hudCrystalsIcon = this.game.gfx.createCrystalHUDIcon();
		this.hudCrystalsText = this.game.gfx.addText("", 'hudText');

		this.hudBombsIcon = this.game.gfx.createBombCrystalHUDIcon();
		this.hudBombsText = this.game.gfx.addText("", 'hudText');
		
		this.hudPauseButton = this.game.gfx.createPauseButtonHUD();
		this.hudPauseButton.addEventListener('click', function() { this.game.pauseGame(); }.bind(this));
	}
	, _layout: function() {
		var bounds = Balance.level.bounds, middle = bounds.hudHeight / 2;
		var spacer = 50;

		var leftPos = spacer;

		leftPos += this.hudLivesIcon.visibleRadius;
		this.hudLivesIcon.moveTo(leftPos, middle);
		leftPos += this.hudLivesIcon.visibleRadius;
		this.hudLivesText.moveTo(leftPos, middle);

		leftPos += spacer;

		leftPos += this.hudBombsIcon.visibleRadius;
		this.hudBombsIcon.moveTo(leftPos, middle);
		leftPos += this.hudBombsIcon.visibleRadius;
		this.hudBombsText.moveTo(leftPos, middle);

		leftPos += spacer;

		leftPos += this.hudCrystalsIcon.visibleRadius;
		this.hudCrystalsIcon.moveTo(leftPos, middle);
		leftPos += this.hudCrystalsIcon.visibleRadius;
		this.hudCrystalsText.moveTo(leftPos, middle);

		leftPos += spacer;

		
		var center = bounds.visibleWidth / 2;
		this.hudPauseButton.moveTo(center - this.hudPauseButton.width / 2, middle - this.hudPauseButton.height / 2);

	}
	, onAct: function(tickEvent) {
		this.hudLivesText.text = ' x ' + this.game.stats.lives;
		this.hudCrystalsText.text = ' x ' + this.game.stats.crystalCount;
		this.hudBombsText.text = ' x ' + this.game.stats.bombs;
	}

});
XQuestGame.PowerupFactory = Smart.Class({
	initialize: function(game) {
		this.game = game;
		this.game.addSceneItem(this);
		this.powerCrystals = [];
	}
	,
	onMove: function(tickEvent) {
		if (this._shouldSpawn(tickEvent)) {
			this.createPowerCrystal();
		}
	}
	,
	_shouldSpawn: function(tickEvent) {
		var B = Balance.powerCrystals;

		// TODO: Make this performance-based instead of time-based:
		var isFirstRun = (this.nextSpawn === undefined);
		var shouldSpawn = !isFirstRun && (this.nextSpawn <= tickEvent.runTime);
		if (isFirstRun || shouldSpawn) {
			this.nextSpawn = tickEvent.runTime + B.spawnRate() * 1000;
		}
		return shouldSpawn;
	}
	,
	onAct: function(tickEvent) {
		if (this.powerCrystals.length >= 2) {
			Smart.Physics.sortByLocation(this.powerCrystals);
		}

		// Check for bullet-collisions:

		// Check for player-collisions:
		var player = this.game.player;
		this._gatherOnCollision([ player ], player.radius);

		if (this.bombCrystals && this.bombCrystals.length) {
			if (this.bombCrystals.length >= 2) {
				Smart.Physics.sortByLocation(this.bombCrystals);
			}

			var maxDistance = Balance.player.radius + Balance.bombCrystals.radius;

			Smart.Physics.detectCollisions(this.bombCrystals, [ this.game.player ], maxDistance, function(bombCrystal, player, bombIndex, pi, distance) {
				this.bombCrystals.splice(bombIndex, 1);
				bombCrystal.gatherBombCrystal();
				this.game.stats.bombs++;
			}.bind(this));


		}

	}
	,
	createPowerCrystal: function() {
		var powerCrystal = new XQuestGame.PowerCrystal(this.game);
		var spawnInfo = this.game.enemies.getRandomSpawn(powerCrystal.radius);
		powerCrystal.spawn(spawnInfo);
		this.powerCrystals.push(powerCrystal);
	}
	,
	_nextPowerup: function() {
		var B = Balance.powerups;
		var totalFrequency = 0;
		_.forOwn(B, function(p, powerupName) {
			if (powerupName in this.game.activePowerups) return;
			totalFrequency += p.frequency;
		}, this);
		var result;
		if (totalFrequency !== 0) {
			// Choose from the available powerups:
			var randomPowerupIndex = (Math.random() * totalFrequency);
			_.forOwn(B, function (powerup, powerupName) {
				if (powerupName in this.game.activePowerups) return;
				randomPowerupIndex -= powerup.frequency;
				if (randomPowerupIndex <= 0) {
					result = powerupName;
					return false;
				}
			}, this);
		} else {
			// All powerups already gained, so start renewing some:
			result = null;
			var resultTime = null;
			_.forOwn(B, function(powerup, powerupName) {
				var activeTime = this.game.activePowerups[powerupName];

				if (resultTime === null || activeTime < resultTime) {
					resultTime = activeTime;
					result = powerupName;
				}
			}, this);
		}
		return result;
	}
	,
	_gatherOnCollision: function(collisionPoints, maxRadius) {
		var maxDistance = maxRadius + Balance.powerCrystals.radius;

		Smart.Physics.detectCollisions(this.powerCrystals, collisionPoints, maxDistance, function(powerCrystal, point, crystalIndex, pi, distance) {
			this.powerCrystals.splice(crystalIndex, 1);
			powerCrystal.gatherPowerCrystal();
			var powerupName = this._nextPowerup();
			this.game.activatePowerup(powerupName);
		}.bind(this));

	}

	,
	startLevel: function() {
		var bombCrystalQuantity = Balance.bombCrystals.spawnQuantity(this.game);
		while (bombCrystalQuantity--) {
			this.createBombCrystal();
		}
	}
	,
	createBombCrystal: function() {
		var bombCrystal = new XQuestGame.BombCrystal(this.game);
		var randomSpawnLocation = this.game.gfx.getSafeSpawn(bombCrystal.radius);
		bombCrystal.spawnBomb(randomSpawnLocation);

		if (!this.bombCrystals)
			this.bombCrystals = [];
		this.bombCrystals.push(bombCrystal);
	}

	,
	clearAllPowerCrystals: function() {
		_.forEach(this.powerCrystals, function(powerCrystal) {
			powerCrystal.clearPowerCrystal();
		}, this);
		this.powerCrystals.length = 0;
	}

});

XQuestGame.Projectiles = Smart.Class({
	initialize: function Projectiles(game) {
		this.game = game;
		this.game.addSceneItem(this);

		this.bullets = [];
		this.bomb = null;

	}
	, onMove: function(tickEvent) {
		this._moveBullets(tickEvent);
	}

	, onAct: function(tickEvent) {
		this._bulletsKillEnemies();
		this._bombsKillEnemies();
	}
	
	, addTripleShot: function(powerup) {
		var angle = powerup.angle;
		
		this.addBullet();
		this.addBullet(angle);
		this.addBullet(-angle);
	}
	, addBullet: function(angle) {
		var bulletGfx = this.game.gfx.createPlayerBullet();
		var player = this.game.player;
		bulletGfx.moveTo(player.location.x, player.location.y);
		var velocity;
		if (this.game.activePowerups.autoAim) {
			var autoAim = Balance.powerups.autoAim;
			var targetEnemy = this.game.enemies.findClosestEnemy(player.location);
			if (targetEnemy) {
				velocity = Smart.Physics.trajectory(player.location, targetEnemy.location, targetEnemy.velocity, autoAim.bulletSpeed);
			}
		}
		if (!velocity) {
			velocity = {
				x: player.velocity.x * Balance.bullets.speed
				, y: player.velocity.y * Balance.bullets.speed
			};
		}
		bulletGfx.velocity = velocity;
		if (angle) {
			Smart.Point.rotate(bulletGfx.velocity, angle);
		}
		bulletGfx.location = bulletGfx;
		bulletGfx.radius = Balance.bullets.radius;
		this.bullets.push(bulletGfx);
	}
	, _moveBullets: function(tickEvent) {
		var bounds = Balance.level.bounds, i = this.bullets.length;
		while (i--) {
			var bulletGfx = this.bullets[i];
			Smart.Physics.applyVelocity(bulletGfx, bulletGfx.velocity, tickEvent.deltaSeconds);
			if (!Smart.Point.pointIsInBounds(bulletGfx, bounds)) {
				bulletGfx.dispose();
				this.bullets.splice(i, 1);
			}
		}
	}
	, _bulletsKillEnemies: function() {
		if (this.bullets.length) {
			if (this.bullets.length >= 2) {
				Smart.Physics.sortByLocation(this.bullets);
			}
			this.game.enemies.killEnemiesOnCollision(this.bullets, Balance.bullets.radius, function(enemy, bullet, ei, bi, distance){
				bullet.shouldDisappear = true;
			});

			// Remove bullets:
			var i = this.bullets.length;
			while (i--) {
				var bulletGfx = this.bullets[i];
				if (bulletGfx.shouldDisappear) {
					bulletGfx.dispose();
					this.bullets.splice(i, 1);
				}
			}
		}
		
	}
	

	
	, releaseABomb: function() {
		var canBomb = (this.game.stats.bombs > 0 && this.bomb === null);

		if (canBomb) {
			this.game.stats.bombs--;
			this._createBomb();
		}

		return canBomb;
	}
	, _createBomb: function() {
		var player = this.game.player;
		var bomb = this.game.gfx.createBombGraphic();
		this.bomb = bomb;
		bomb.onDispose(function(){
			this.bomb = null;
		}.bind(this));

		bomb.location.moveTo(player.location.x, player.location.y);
		return bomb;
	}
	, _bombsKillEnemies: function() {
		if (this.bomb) {
			this.game.enemies.killEnemiesOnCollision([ this.bomb ], this.bomb.radius);
		}
	}

});

/**
 * `Balance` defines all the variables that affect game play.
 * This includes everything from size, speed, timing, and quantity.
 * The values may differ depending on game mode or difficulty settings.
 */
var Balance = {
	merge: function(values) {
		_.merge(Balance, values);
	}
};

// Helpers:
Balance.merge({
	/** @return {Function} that returns a random integer between min and max (inclusively) */
	randomBetween: function(min, max) {
		return function() {
			return Math.floor(min + Math.random() * (max - min + 1));
		};
	}
	,
	/** @return {Function} that returns a random integer between min and max (inclusive, exclusive) */
	randomFloatBetween: function(min, max) {
		return function() {
			return (min + Math.random() * (max - min));
		};
	}
});

// Here are all the game's options:
Balance.merge({
	gameModeOverrides: {
		'arcade': { }
		,
		'test': {
			fullView: true
			,enemySpawnRate: Balance.randomBetween(1, 1)
			,bombCrystalsSpawnQuantity: function(game) { return 3; }
			,powerupSpawnRate: Balance.randomBetween(5, 5)
		}
	}
	,
	setGameMode: function(gameMode) {
		var gameOptions = (typeof gameMode === 'object') ? gameMode : Balance.gameModeOverrides[gameMode] || {};

		Balance.merge({
			level: {
				bounds: (function(){
					var hudHeight = 40
						, padding = 40
						, levelWidth = 1200, levelHeight = 675
						, visibleWidth = 800, visibleHeight = 450
						;
					if (gameOptions.fullView) {
						visibleWidth = padding + levelWidth + padding;
						visibleHeight = hudHeight + padding + levelHeight + padding;
					}
					return {
						hudHeight: hudHeight
						, padding: padding
						, x: padding, y: hudHeight + padding
						, visibleWidth: visibleWidth
						, visibleHeight: visibleHeight
						, width: levelWidth
						, height: levelHeight
						, totalWidth: padding + levelWidth + padding
						, totalHeight: hudHeight + padding + levelHeight + padding
					};
				})()
				, gateWidth: 200
			}
			,player: {
				radius: 12
				,kickBack: 2
				,looseFriction: 0.8
				,bounceDampening : 0.0
				,lives: 5
			}
			,bullets: {
				radius: 2
				,kickBack: 0.5
				,speed: 3 // * player speed
				,shotsPerSecond: 1.0
			}
			,bombs: {
				startCount: 3
				, speed: 1300
				, kickBack: 0.3
			}
			,crystals: {
				radius: 10
				,spawnQuantity: function(game) { return Math.min(12 + game.currentLevel, 40); }
			}
			,powerCrystals: {
				radius: 15
				, speed: 300
				, spawnAngle: Balance.randomBetween(-70, 70)
				, turnSpeed: Balance.randomBetween(-40, 40)
				, spawnRate: gameOptions.powerupSpawnRate || Balance.randomBetween(20, 40)
			}
			,bombCrystals: {
				radius: 10
				, spawnQuantity: gameOptions.bombCrystalsSpawnQuantity || function(game) { return ((game.currentLevel + 1) % 2); }
			}
			,powerups: {
				rapidFire: {
					duration: 60
					, frequency: 20
					, shotsPerSecond: 10
				}
				,
				tripleShot: {
					duration: 60
					, frequency: 20
					, angle: 10
				}
				,
				autoAim: {
					duration: 30
					, frequency: 20
					, bulletSpeed: 500
				}
				,
				invincible: {
					duration: 20
					, frequency: 10
				}
			}
			,enemies: {
				maxRadius: 13
				,safeSpawnDistance: 13*10
				,spawnRate: gameOptions.enemySpawnRate || Balance.randomBetween(1, 2)
				,spawnDifficulty: 1.5 // Causes more difficult enemies to spawn more frequently
				,roster: gameOptions.enemyRoster || [ XQuestGame.Slug, XQuestGame.Locust, XQuestGame.Mantis ]
				,slug: {
					radius: 13
					,speed: 80
					,movementInterval: Balance.randomBetween(3, 10)
				}
				,locust: {
					radius: 11
					,speed: 150
					,movementInterval: Balance.randomBetween(3, 5)
					,turnSpeed: Balance.randomBetween(-100, 100)
				}
				,mantis: {
					radius: 12
					,speed: 50
					,movementInterval: Balance.randomBetween(3, 6)
				}
			}
		});

		this._fireUpdate(gameOptions);
	}
});

// Events:
Balance.merge({
	onUpdate: function(callback) {
		if (!this._onUpdate) {
			this._onUpdate = [ callback ];
		} else {
			this._onUpdate.push(callback);
		}
	}
	,
	_fireUpdate: function(gameOptions) {
		if (this._onUpdate) {
			_.forEach(this._onUpdate, function(callback) {
				callback(gameOptions);
			});
		}
	}
});


(function init_MenuScene() {
	var MenuSceneEvents = {
		onMenuExit: 'MenuExit'
	};
	
	XQuestGame.MenuSceneInputs = {
		menuUp: 'menuUp',
		menuDown: 'menuDown',
		menuLeft: 'menuLeft',
		menuRight: 'menuRight',
		menuInvoke: 'menuInvoke',
		menuBack: 'menuBack'
	};
	
	XQuestGame.MenuScene = Smart.Class(new XQuestGame.BaseScene(), {
		initialize: function(gfx, host) {
			this.MenuScene_initialize(gfx, host);
		}
		,MenuScene_initialize: function (gfx, host) {
			this.BaseScene_initialize();
			this.menuScene = this; // For consistency
			this.menuScene.host = host;
			this.addSceneItem(this);
			this.gfx = gfx;
			this.addSceneItem(this.gfx);

			this.menuStack = [];
			
			var middle = this.gfx.getGamePoint('middle');
			this.gfx.followPlayer(middle);
			//this._setupBackButton(); // Too ugly for now
		}
		
		,_setupBackButton: function() {
			var backButton = this.menuScene.gfx.createMenuButton("Back");
			backButton.addButtonEvents({
				invoke: this.goBack.bind(this)
			});
			var top = this.menuScene.gfx.getHudPoint('top');
			backButton.moveTo(top.x, top.y + backButton.visibleHeight);

			this.backButton = backButton;
			this.backButton.visible = false;
		}
		,_updateBackButton: function() {
			if (!this.backButton) return;
			
			this.backButton.visible = (this.menuStack.length >= 2);
		}
		
		,addMenu: function(menu) {
			if (this.currentMenu)
				this.currentMenu.menuLeave(false);
			
			this.menuStack.push(menu);
			this.currentMenu = menu;

			this._updateBackButton();
			this.currentMenu.menuEnter(false);
			this.scenePaused = false;
		}
		,goBack: function() {
			if (this.menuStack.length <= 1) return;
			
			this.menuStack.pop().menuLeave(true);
			
			this.currentMenu = this.menuStack[this.menuStack.length - 1];
			this.currentMenu.menuEnter(true);
			
			this._updateBackButton();
		}
		,exitMenu: function(callback) {
			this.menuStack.length = 0;
			this.currentMenu.menuLeave(true).queue(function() {
				this.fireSceneEvent(MenuSceneEvents.onMenuExit);
				callback();
				this.dispose();
				this.scenePaused = true;
			}.bind(this));
		}

		,onMove: function(tickEvent, inputState) {
			this.currentMenu.menuInput(inputState);
			
			if (inputState.menuBack && this.menuStack.length >= 2) {
				this.goBack();
			}
		}

	});
	
	XQuestGame.MenuScene.prototype.implementSceneEvents(MenuSceneEvents);
})();
	
(function init_BaseMenu() {
	XQuestGame.BaseMenu = Smart.Class(new Smart.Events(), {
		initialize: function(menuScene) {
			this.BaseMenu_initialize(menuScene);
		}
		,BaseMenu_initialize: function(menuScene) {
			this.menuScene = menuScene;
			this.activeRowIndex = 0;
			this.rows = this.getRows();
			this._setActiveRowIndex(this.activeRowIndex);
		}
		,
		/** @protected @mustOverride */
		getRows: function() {
			return [];
		}
		,createMenuButton: function(text, onInvoke) {
			var buttonRow = this.menuScene.gfx.createMenuButton(text);
			buttonRow.addButtonEvents({
				invoke: onInvoke
				, hoverEnter: this._setActiveRow.bind(this, buttonRow)
				, hoverLeave: this._setActiveRowIndex.bind(this, -1)
			});
			buttonRow.invoke = onInvoke;
			return buttonRow;
		}
	
		,menuEnter: function(isBackNavigation) {
			this._enterRows(this.rows, isBackNavigation);
		}
		,menuLeave: function(isBackNavigation) {
			return this._leaveRows(this.rows, isBackNavigation);
		}
		,_enterRows: function(rows, isBackNavigation) {
			var layoutMargin = 20
				, animRotation = 30
				, animStagger = 0.25
				, animDuration = 1
				;
			
			var rowHeight = rows[0].visibleHeight;
	
			var fromTop = isBackNavigation;
	
			var entrance = this.menuScene.gfx.getHudPoint(fromTop ? 'top' : 'bottom');
			entrance.y += rowHeight * (fromTop ? -2 : 2);
	
			var middle = this.menuScene.gfx.getHudPoint('middle');
			var stackedRowsHeight = (rows.length - 1) * (rowHeight + layoutMargin);
			var currentTop = middle.y - stackedRowsHeight / 2;
	
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				var rowX = middle.x
					,rowY = currentTop;
				
				row.moveTo(entrance.x, entrance.y);
				row.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animStagger * (fromTop ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(row, { x: rowX, y: rowY })
					.rotate(row, 0)
				;
				
				currentTop += row.visibleHeight + layoutMargin;
			}
		}
		,_leaveRows: function(rows, isBackNavigation) {
			var animRotation = 30
				,animStagger = 0.1
				,animDuration = 0.5
				;
			var toBottom = isBackNavigation;
	
			var rowHeight = rows[0].visibleHeight;
			var exit = this.menuScene.gfx.getHudPoint(toBottom ? 'bottom' : 'top');
				exit.y += rowHeight * (toBottom ? 2 : -2);
	
			var lastAnimation;
			
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				if (row.animation) 
					row.animation.cancelAnimation();
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animStagger * (toBottom ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(row, exit)
					.rotate(animRotation)
				;
				if (isBackNavigation)
					row.animation.queueDispose(row);
				
				lastAnimation = row.animation;
			}
			return lastAnimation;
		}
	
		,menuInput: function(inputState) {
			if (inputState.menuUp || inputState.menuLeft)
				this._moveActiveRowIndex(-1);
			else if (inputState.menuDown || inputState.menuRight)
				this._moveActiveRowIndex(1);
			
			if (inputState.menuInvoke)
				this._invokeActiveRow();
			
		}
		,_moveActiveRowIndex: function(offset) {
			var activeRowIndex = this.activeRowIndex + offset;
			// Loop:
			if (activeRowIndex < 0) activeRowIndex += this.rows.length;
			if (activeRowIndex >= this.rows.length) activeRowIndex -= this.rows.length;
			
			this._setActiveRowIndex(activeRowIndex);
		}
		
		,_setActiveRow: function(activeRow) {
			var activeRowIndex = this.rows.indexOf(activeRow);
			this._setActiveRowIndex(activeRowIndex);
		}
		,_setActiveRowIndex: function(activeRowIndex) {
			var rows = this.rows;
			for (var i = 0, l = rows.length; i < l; i++) {
				rows[i].setActive(i === activeRowIndex);
			}
			this.activeRowIndex = activeRowIndex;
		}
		,_getActiveRow: function() {
			return this.rows[this.activeRowIndex] || null;
		}
		,_invokeActiveRow: function() {
			var activeRow = this._getActiveRow();
			if (activeRow)
				activeRow.invoke();
			
		}
	
		
	});
})();
	
(function init_CommonMenus() {
	var StartMenuEvents = { onStartGame: 'onStartGame' };
	var PauseMenuEvents = { onResumeGame: 'onResumeGame' };
	
	XQuestGame.CommonMenus = {
		StartMenu: Smart.Class(new XQuestGame.BaseMenu().implementEvents(StartMenuEvents), {
			getRows: function() {
				return [
					this.createMenuButton("Start Game", this._onStartGame.bind(this))
//					,this.createMenuButton("Game Options", this._showGameOptions.bind(this))
					,this.createMenuButton("Graphics Test", this._showGraphicsTest.bind(this))
				];
			}
			,_onStartGame: function() {
				this.menuScene.exitMenu(function() {
					this.fireEvent(StartMenuEvents.onStartGame);
				}.bind(this));
			}
			,_showGameOptions: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GameOptions(this.menuScene));
			}
			,_showGraphicsTest: function() {
				this.menuScene.addMenu(new XQuestGame.CommonMenus.GraphicsTestMenu(this.menuScene));
			}
		})
		,
		PauseMenu: Smart.Class(new XQuestGame.BaseMenu().implementEvents(PauseMenuEvents), {
			getRows: function() {
				return [
					this.createMenuButton("Resume Game", this._onResumeGame.bind(this))
				];
			}
			,
			_onResumeGame: function() {
				this.menuScene.exitMenu(function() {
					this.fireEvent(PauseMenuEvents.onResumeGame);
				}.bind(this));
			}
		})
		,
		GameOptions: Smart.Class(new XQuestGame.BaseMenu(), {
			getRows: function() {
				return [
					this.createMenuButton("Option 1", function() {})
					,this.createMenuButton("Option 2", function() {})
					,this.createMenuButton("Option 3", function() {})
					,this.createMenuButton("Option 4", function() {})
				];
			}
		})
	};
})();
	
XQuestGame.CommonMenus.GraphicsTestMenu = Smart.Class(new XQuestGame.BaseMenu(), {
	getRows: function() {
		var goBack = this.menuScene.goBack.bind(this.menuScene);
		var player = this.createMenuButton("Player", goBack),
			objects = this.createMenuButton("Objects", goBack),
			enemies = this.createMenuButton("Enemies", goBack);
		
		var halfButtonHeight = player.visibleHeight / 2;
		
		player.addChild(this.menuScene.gfx.createPlayerGraphics()).moveTo(-halfButtonHeight, halfButtonHeight);
		
		objects.addChild(this.menuScene.gfx.createCrystalGraphic()).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createPowerCrystalGraphic()).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		objects.addChild(this.menuScene.gfx.createBombCrystalGraphic()).moveTo(-halfButtonHeight, halfButtonHeight);
		
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Slug")).moveTo(-halfButtonHeight * 3, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Locust")).moveTo(-halfButtonHeight * 2, halfButtonHeight);
		enemies.addChild(this.menuScene.gfx.createEnemyGraphics("Mantis")).moveTo(-halfButtonHeight, halfButtonHeight);
		
		return [
			player
			,objects
			,enemies
		];
	}
});
var EaselJSGraphics = Smart.Class({
	initialize: function(canvas) {
		this.canvas = canvas;

		this.debugStats = {
			allGraphics: []
		};

		this._setupLayers();
		this._setupAnimations();
	}
	,
	_setupLayers: function() {
		this.layers = {
			background: new createjs.Stage(this.canvas)
			, objects: new createjs.Stage(this.canvas)
			, characters: new createjs.Stage(this.canvas)
			, hud: new createjs.Stage(this.canvas)
		};

		var allGraphics = this.debugStats.allGraphics;
		function trackChildren(stage) {
			var addChild = stage.addChild, removeChild = stage.removeChild;
			stage.addChild = function(child) {
				addChild.apply(this, arguments);
				allGraphics.push(child);
			};
			stage.removeChild = function(child) {
				removeChild.apply(this, arguments);
				_.eliminate(allGraphics, child);
			};
		}
		_.forOwn(this.layers, function(stage) {
			trackChildren(stage);
			stage.autoClear = false;
		});
		this.layers.hud.enableMouseOver();
	}
	,showBackgroundStars: function(visible) {
		if (visible) {
			if (!this.backgroundStars) {
				this.backgroundStars = new EaselJSGraphics.BackgroundGraphics();
			}
			this.layers.background.addChild(this.backgroundStars);
		} else {
			if (this.backgroundStars) {
				this.layers.background.removeChild(this.backgroundStars);
			}
		}
	}
	,
	_setupAnimations: function() {
		this.animations = new Smart.Animations();
	}
	,
	onMove: function(tickEvent) {
		this.animations.update(tickEvent.deltaSeconds);
	}
	,
	onDraw: function(tickEvent) {
		this.layers.background.update(tickEvent);
		this.layers.objects.update(tickEvent);
		this.layers.characters.update(tickEvent);
		this.layers.hud.update(tickEvent);
	}
	,
	followPlayer: function(playerLocation) {

		var bounds = Balance.level.bounds;

		if (!this._maxOffset) {
			this._maxOffset = {
				x: bounds.totalWidth - bounds.visibleWidth
				,y: bounds.totalHeight - bounds.visibleHeight
			};
		}

		this._offset = {
			x: Math.min(Math.max(0, playerLocation.x - bounds.visibleWidth/2), this._maxOffset.x)
			,y: Math.min(Math.max(0, playerLocation.y - bounds.visibleHeight/2), this._maxOffset.y)
		};

		this.layers.background.x = -this._offset.x;
		this.layers.objects.x = -this._offset.x;
		this.layers.characters.x = -this._offset.x;

		this.layers.background.y = -this._offset.y;
		this.layers.objects.y = -this._offset.y;
		this.layers.characters.y = -this._offset.y;

	}
	,
	getSafeSpawn: function(radius) {
		var leftEnemySpawn = this.getGamePoint('left')
			, rightEnemySpawn = this.getGamePoint('right')
			, safeDistance = Balance.enemies.safeSpawnDistance;
		var randomSpot, isSafe;
		do {
			randomSpot = this.getGamePoint('random', radius);
			isSafe = !(Smart.Point.distanceTest(leftEnemySpawn, randomSpot, safeDistance)) && !(Smart.Point.distanceTest(rightEnemySpawn, randomSpot, safeDistance));
		} while (!isSafe);
		return randomSpot;
	}
	,
	getGamePoint: function(gamePoint, radius) {
		if (typeof gamePoint !== 'string') return gamePoint;
		if (radius == undefined) radius = 0;
		var bounds = Balance.level.bounds;
		switch (gamePoint) {
			case 'random':
				return {
					x: bounds.x + radius + (bounds.width - radius - radius) * Math.random()
					, y: bounds.y + radius + (bounds.height - radius - radius) * Math.random()
				};
			case 'visibleMiddle':
				return {
					x: this._offset.x + bounds.visibleWidth / 2
					,y: this._offset.y + bounds.visibleHeight / 2
				};
			case 'middle':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + bounds.height / 2
				};
			case 'top':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + radius
				};
			case 'bottom':
				return {
					x: bounds.x + bounds.width / 2
					,y: bounds.y + bounds.height - radius
				};
			case 'left':
				return {
					x: bounds.x + radius
					, y: bounds.y + bounds.height / 2
				};
			case 'right':
				return {
					x: bounds.x + bounds.width - radius
					, y: bounds.y + bounds.height / 2
				};
			default:
				throw "Invalid gamePoint: " + gamePoint;
		}
	}
	,
	getHudPoint: function(hudPoint) {
		if (typeof hudPoint !== 'string') return hudPoint;
		var bounds = Balance.level.bounds;
		switch (hudPoint) {
			case 'middle':
				return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight / 2 };
			case 'top':
				return { x: bounds.visibleWidth / 2, y: 0 };
			case 'bottom':
				return { x: bounds.visibleWidth / 2, y: bounds.visibleHeight };
			case 'left':
				return { x: 0, y: bounds.visibleHeight / 2 };
			case 'right':
				return {x: bounds.visibleWidth, y: bounds.visibleHeight / 2 };
		}
		return null;
	}
	,
	createLevelGraphics: function() {
		var levelGraphics = new EaselJSGraphics.LevelGraphics();
		this.layers.background.addChild(levelGraphics);
		return levelGraphics;
	}
	,
	createPlayerGraphics: function() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		this.layers.characters.addChild(playerGraphics);
		return playerGraphics;
	}
	,
	createPlayerHUDIcon: function() {
		var playerGraphics = new EaselJSGraphics.PlayerGraphics();
		var scale = 0.7;
		playerGraphics.scaleTo(scale);
		playerGraphics.visibleRadius *= scale;
		this.layers.hud.addChild(playerGraphics);
		return playerGraphics;
	}
	,
	createPlayerBullet: function() {
		var bulletGfx = new EaselJSGraphics.BulletGraphics();
		this.layers.objects.addChild(bulletGfx);
		bulletGfx.onDispose(function() {
			this.layers.objects.removeChild(bulletGfx);
		}.bind(this));
		return bulletGfx;
	}
	,
	createEnemyGraphics: function(enemyName) {
		var enemyGraphics = null;
		switch (enemyName) {
			case 'Slug':
				enemyGraphics = new EaselJSGraphics.SlugGraphics();
				break;
			case 'Locust':
				enemyGraphics = new EaselJSGraphics.LocustGraphics();
				break;
			case 'Mantis':
				enemyGraphics = new EaselJSGraphics.MantisGraphics();
				break;
		}

		if (enemyGraphics == null)
			throw new Error("Unknown enemy: " + enemyName);

		this.layers.characters.addChild(enemyGraphics);
		enemyGraphics.onDispose(function() {
			this.layers.characters.removeChild(enemyGraphics);
		}.bind(this));

		return enemyGraphics;
	}
	,
	createCrystalGraphic: function() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		this.layers.objects.addChild(crystal);
		crystal.onDispose(function() {
			this.layers.objects.removeChild(crystal);
		}.bind(this));
		return crystal;
	}
	,
	createCrystalHUDIcon: function() {
		var crystal = new EaselJSGraphics.CrystalGraphic();
		var scale = 0.7;
		crystal.scaleTo(scale);
		crystal.visibleRadius *= scale;
		this.layers.hud.addChild(crystal);
		return crystal;
	}
	,
	createPowerCrystalGraphic: function() {
		var powerCrystal = new EaselJSGraphics.PowerCrystalGraphic();
		this.layers.characters.addChild(powerCrystal);
		powerCrystal.onDispose(function() {
			this.layers.characters.removeChild(powerCrystal);
		}.bind(this));
		return powerCrystal;
	}
	,
	createBombCrystalGraphic: function() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		this.layers.objects.addChild(bombCrystal);
		bombCrystal.onDispose(function() {
			this.layers.objects.removeChild(bombCrystal);
		}.bind(this));
		return bombCrystal;
	}
	,
	createBombCrystalHUDIcon: function() {
		var bombCrystal = new EaselJSGraphics.BombCrystalGraphic();
		var scale = 0.7;
		bombCrystal.scaleTo(scale);
		bombCrystal.visibleRadius *= scale;
		this.layers.hud.addChild(bombCrystal);
		bombCrystal.onDispose(function() {
			this.layers.hud.removeChild(bombCrystal);
		}.bind(this));
		return bombCrystal;
	}
	,
	createBombGraphic: function() {
		var bomb = new EaselJSGraphics.BombGraphic();
		this.layers.objects.addChild(bomb);
		bomb.onDispose(function() {
			this.layers.objects.removeChild(bomb);
		}.bind(this));
		return bomb;
	}
	,
	createExplosion: function(position, velocity, explosionOptions) {
		var explosion = new EaselJSGraphics.ExplosionGraphic(position, velocity, explosionOptions);
		this.layers.objects.addChild(explosion);
		explosion.onDispose(function() {
			this.layers.objects.removeChild(explosion);
		}.bind(this));
	}
	,
	addAnimation: function(animation) {
		return this.animations.addAnimation(animation);
	}

	,
	addText: function(text, textStyle) {
		var textGfx = new EaselJSGraphics.TextGraphic();
		textGfx.setGfx(this);
		textGfx.setText(text, textStyle);

		this.layers.hud.addChild(textGfx);
		textGfx.onDispose(function() {
			this.layers.hud.removeChild(textGfx);
		}.bind(this));

		return textGfx;
	}

	,
	enableTouchClicks: function() {
		createjs.Touch.enable(this.layers.hud);
	}
	,
	createHUDOverlay: function() {
		var hudOverlay = new EaselJSGraphics.HudGraphics.HudOverlay();
		this.layers.hud.addChild(hudOverlay);
		hudOverlay.onDispose(function() {
			this.layers.hud.removeChild(hudOverlay);
		}.bind(this));
		return hudOverlay;
	}
	,
	createPauseButtonHUD: function() {
		var pauseButton = new EaselJSGraphics.HudGraphics.HudPauseButton(this);
		this.layers.hud.addChild(pauseButton);
		pauseButton.onDispose(function() {
			this.layers.hud.removeChild(pauseButton);
		}.bind(this));
		return pauseButton;
	}
	,
	createMenuButton: function(text) {
		var buttonGfx = new EaselJSGraphics.MenuGraphics.MenuButton(this);
		buttonGfx.setText(text);
		buttonGfx.addButtonEvents = function(events) {
			if (events.invoke)
				this.addEventListener('click', events.invoke);
			if (events.hoverEnter)
				this.addEventListener('mouseover', events.hoverEnter);
			if (events.hoverLeave)
				this.addEventListener('mouseout', events.hoverLeave);
		};

		this.layers.hud.addChild(buttonGfx);
		buttonGfx.onDispose(function() {
			this.layers.hud.removeChild(buttonGfx);
		}.bind(this));

		return buttonGfx;
	}
});

/**
 * This is a wrapper around createjs.Ticker
 * @constructor
 */
var EaselJSTimer = Smart.Class({
	addTickHandler: function(tickHandler) {
		// Configuration:
		createjs.Ticker.useRAF = true;
		createjs.Ticker.setFPS(60);

		createjs.Ticker.addEventListener('tick', function(tickEvent) {
			// Augment the tickEvent:
			tickEvent.deltaSeconds = tickEvent.delta / 1000;

			tickHandler(tickEvent);
		});
	}
	,
	dispose: function() {
		createjs.Ticker.removeAllEventListeners();
	}
});

EaselJSGraphics.Drawing = Smart.Class(new createjs.DisplayObject(), {
	/**
	 * When overridden, allows you to perform initialization tasks.
	 * Constructor arguments will be passed.
	 * @function
	 * @param {*...} args
	 */
	setup: null
	,
	/**
	 * When overridden, creates a DrawingQueue to create a static drawing. 
	 * @function
	 * @param {DrawingQueue} drawing
	 */
	drawStatic: null
	,
	/**
	 * When overridden, this is called each tick, with a DrawingContext and a tickEvent.
	 * @function
	 * @param {DrawingContext} drawing
	 * @param {TickEvent} tickEvent
	 */
	drawEffects: null


	,DisplayObject_initialize: createjs.DisplayObject.prototype.initialize
	,DisplayObject_draw: createjs.DisplayObject.prototype.draw
	,sharedDrawingContext: new Smart.DrawingContext(null)
	,initialize: function(args_) {
		this.Drawing_initialize.apply(this, arguments);
	}
	,Drawing_initialize: function(args_) {
		this.DisplayObject_initialize();

		if (this.setup) {
			this.setup.apply(this, arguments);
		}
		
		if (this.drawStatic) {
			this.drawingQueue = new Smart.DrawingQueue();
			this.drawStatic(this.drawingQueue);
		}
	}
	,onTick: function(tickEvent) {
		this.tickEvent = tickEvent;
	}
	,draw: function(ctx, ignoreCache) {
		// Render if cached:
		var DisplayObject_handled = this.DisplayObject_draw(ctx, ignoreCache);
		if (!DisplayObject_handled && this.drawingQueue) {
			this.drawingQueue.draw(ctx);
		}
		if (this._anim) {
			this._anim.update(this.tickEvent.deltaSeconds);
		}
		if (this.drawEffects && !ignoreCache && this.tickEvent) {
			this.sharedDrawingContext.setContext(ctx);
			this.drawEffects(this.sharedDrawingContext, this.tickEvent);
		}

		return true;
	}
	
	,addAnimation: function() {
		var anim = new Smart.Animation();
		if (!this._anim) {
			this._anim = anim;
		} else {
			// TODO: What if we need multiple animations?
			throw "Multiple animations not yet supported";
		}
		return anim;
	}
	
});

var Graphics;
Balance.onUpdate(function(mode) {
	Graphics = {
		merge: function(newGraphics) {
			_.merge(Graphics, newGraphics);
		}
	};
	Graphics.merge({
		player: {
			radius: Balance.player.radius
			, outerStrokeStyle: {
				lineWidth: Balance.player.radius * 0.25
				, strokeStyle: 'white'
			}
			, innerRadius: Balance.player.radius - 2
			, innerStyle: {
				fillStyle: 'hsl(60, 100%, 50%)'
			}
			, innerStarPoints: 3
			, innerStarSize: 0.7
			, spinRate: 0.3 * 360
			, explosionOptions: {
				count: 200
				,speed: 800
				,style: {
					fillStyle: 'hsl(60, 100%, 50%)'
				}
				,radius: 6
			}
		}
		,bullets: {
			radius: Balance.bullets.radius
			, strokeStyle: {
				strokeWidth: 2
				, strokeColor: 'white'
			}
		}
		,crystals: {
			radius: Balance.crystals.radius
			,style: {
				fillColor: 'yellow'
			}
			,sides: 6
			,pointSize: 0.5
			,spinRate: -0.1 * 360
			,spinRateGathered: 1 * 360
			,gatherDuration: 1 //s
		}
		,powerCrystals: {
			radius: Balance.powerCrystals.radius
			,style: {
				strokeColor: 'white'
				,strokeWidth: 2
			}
			,radiusInner: Balance.powerCrystals.radius * 0.5
			,styleInner: {
				fillColor: 'yellow'
				,strokeWidth: 2
			}
			,sides: 5
			,pointSize: 0.3
			,spinRate: 0.3 * 360
			,gatherDuration: 2
		}
		,bombCrystals: {
			radius: Balance.bombCrystals.radius
			,style: {
				strokeColor: 'yellow'
				,strokeWidth: 2
			}
			,radiusInner: Balance.bombCrystals.radius * 0.5
			,styleInner: {
				fillColor: 'white'
				,strokeWidth: 2
			}
			,sides: 3
			,pointSize: 0.3
			,spinRate: 0.3 * 360
			,gatherDuration: 2
		}
		,bombs: {
			style:{
				fillColor: 'white'
			}
		}
		,level: {
			cornerRadius: 16
			, strokeStyle: {
				strokeWidth: 8
				, strokeColor: '#999999'
			}
			, gateElectricityFrequency: 1000 / 30
		}
		,gate: {
			strokeStyle: {
				strokeWidth: 2.5
				, strokeColor: '#FF0000'
			}
			, segments: 9
			, deviation: 0.2
		}
		,background: {
			backgroundColor: 'black'
			, starColors: ['#FFFFFF','#666666','#999999', '#CCCCCC']
			, starCount: 500
		}
	});
});

EaselJSGraphics.PlayerGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.player;
		this.radius = G.radius;

		drawing.beginPath()
			.circle(0, 0, G.radius)
			.endPath(G.outerStrokeStyle);

		drawing.beginPath()
			.star(0, 0, G.innerRadius, G.innerStarPoints, G.innerStarSize, 0)
			.endPath(G.innerStyle);

	}
	,drawEffects: function(drawing, tickEvent){
		var G = Graphics.player;

		this.rotation += (G.spinRate * tickEvent.deltaSeconds);
	}
	,killPlayerGraphics: function(gfx, velocity) {
		var G = Graphics.player;
		this.toggleVisible(false);
		gfx.createExplosion(this, velocity, G.explosionOptions);
	}
	,restorePlayerGraphics: function() {
		this.toggleVisible(true);
	}
});

EaselJSGraphics.BaseEnemyGraphics = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawCircleCircle: function(drawing, G) {
		var outerRadius = G.outerRadius,
			outerStyle = G.outerStyle,
			innerRadius = G.innerRadius,
			innerStyle = G.innerStyle;
		
		drawing
			.beginPath()
			.circle(0, 0, outerRadius)
			.endPath(outerStyle)
		
			.beginPath()
			.circle(0, 0, innerRadius)
			.endPath(innerStyle)
		;
		
	}
	,drawTriangleTriangle: function(drawing, G) {
		var outerTriangle = G.outerTriangle,
			outerStyle = G.outerStyle,
			innerTriangle = G.innerTriangle,
			innerStyle = G.innerStyle;
		
		drawing
			.beginPath()
			.polygon(outerTriangle)
			.closePath()
			.endPath(outerStyle)
			
			.beginPath()
			.polygon(innerTriangle)
			.closePath()
			.endPath(innerStyle)
		;
	}
	,killEnemy: function(gfx, velocity) {
		var enemyGraphics = this;
		enemyGraphics.dispose();

		var explosionOptions = this.getExplosionOptions();
		gfx.createExplosion(enemyGraphics, velocity, explosionOptions);
	}
});

Balance.onUpdate(function(mode) {
	var outerRadius = Balance.enemies.locust.radius
		, outerOffset = 0
		, innerRadius = outerRadius * 6 / 11
		, innerOffset = outerRadius * 3 / 11;
	var orange = 'hsl(40, 100%, 50%)', red = 'hsl(0, 100%, 30%)';

	_.merge(Graphics, {
		enemies: {
			locust: {
				visibleRadius: Balance.enemies.locust.radius + 1
				,triangleTriangle: {
					outerTriangle: Smart.Drawing.polygonFromAngles(0, outerOffset, outerRadius, [ 0, 130, 230 ])
					,outerStyle: { fillStyle: orange }
					
					,innerTriangle: Smart.Drawing.polygonFromAngles(0, innerOffset, innerRadius, [ 0, 130, 230 ])
					,innerStyle: { fillStyle: red, strokeStyle: 'black' }
				}
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: 'hsl(40, 100%, 50%)'
					}
				}
			}
		}
	});
});

EaselJSGraphics.LocustGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function(){
		var G = Graphics.enemies.locust;
		this.visibleRadius = G.visibleRadius; 
	}
	,drawEffects: function(drawing) {
		var G = Graphics.enemies.locust;
		this.drawTriangleTriangle(drawing, G.triangleTriangle);
	}
	,getExplosionOptions: function() {
		var G = Graphics.enemies.locust;
		return G.explosionOptions;
	}
});

Balance.onUpdate(function(gameMode) {
	var radius = Balance.enemies.mantis.radius;
	var red = 'hsl(10, 100%, 50%)', yellow = 'hsl(60, 100%, 50%)';
	Graphics.merge({
		enemies: {
			mantis: {
				radius: radius
				, star1: { radius: radius, sides: 7, pointSize: 0.5, color: yellow }
				, star2: { radius: radius, sides: 7, pointSize: 0.7, angle: 360 / 7 * .5, color: red }
				, pulse: 4
				,explosionOptions: {
					count: 20
					,speed: 500
					,style: {
						fillStyle: red
					}
				}
			}
			
		}
	});
});

EaselJSGraphics.MantisGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function() {
		var G = Graphics.enemies.mantis;

		this.visibleRadius = G.radius;
		
		var star1 = Smart.Drawing.createStarPolygon(0, 0, G.star1.radius, G.star1.sides, G.star1.pointSize, 0);
		var star2 = Smart.Drawing.createStarPolygon(0, 0, G.star2.radius, G.star2.sides, G.star2.pointSize, G.star2.angle);
		
		star2.push(star2.shift());
		
		this.getStar = Smart.Interpolate.arrays(star1, star2);
		this.getStarColor = Smart.Interpolate.colors(G.star1.color, G.star2.color);
		this.star1 = star1;
		this.star2 = star2;
		
		this.time = 0;
	}
	, drawEffects: function(drawing, tickEvent) {
		var G = Graphics.enemies.mantis;
		this.time += tickEvent.deltaSeconds;
		var pulse = (Math.sin(this.time * Math.PI * 2 / G.pulse) + 1) / 2;
		
		this.starColor = this.getStarColor(pulse);
		
		drawing
			.beginPath()
			.polygon(this.getStar(pulse))
			.closePath()
			.fillStyle(this.starColor)
			.fill()
		;
	}
	, getExplosionOptions: function() {
		var G = Graphics.enemies.mantis;
		var explosionOptions = _.defaults({ style: { fillStyle: this.starColor } }, G.explosionOptions);
		return explosionOptions;
	}
});

Balance.onUpdate(function(mode) {
	var green = 'hsl(100, 100%, 50%)';
	var darkGreen = Smart.Color.darken(green, 30);
	var black = 'black';
	
	_.merge(Graphics, {
		enemies: {
			slug: {
				radius: Balance.enemies.slug.radius + 1
				, circleCircle: {
					outerRadius: Balance.enemies.slug.radius + 1
					, outerStyle: { fillStyle: darkGreen }
					, innerRadius: Balance.enemies.slug.radius * 0.7
					, innerStyle: { fillStyle: green, strokeStyle: black }
				}
				, explosionOptions: {
					count: 20
					,speed: 300
					,style: {
						fillStyle: 'hsl(100, 100%, 50%)'
					}
				}
			}
		}
	});
});

EaselJSGraphics.SlugGraphics = Smart.Class(new EaselJSGraphics.BaseEnemyGraphics(), {
	setup: function() {
		var G = Graphics.enemies.slug;
		this.visibleRadius = G.radius;		
	},
	drawStatic: function(drawing, tickEvent) {
		var G = Graphics.enemies.slug;

		this.drawCircleCircle(drawing, G.circleCircle);
	}
	,
	getExplosionOptions: function() {
		var G = Graphics.enemies.slug;
		return G.explosionOptions;
	}
});


EaselJSGraphics.BulletGraphics = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.bullets;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawCircle(0, 0, Graphics.bullets.radius)
		 .endStroke();

	}
	,
	getKickBack: function(enemy, distance) {
		return Smart.Point.multiply(this.velocity, Balance.bullets.kickBack);
	}
});

Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		explosionOptions: {
			count: 200
			,speed: 800
			,style: {
				fillColor: 'hsl(60, 100%, 50%)'
			}
			,radius: 4
			,friction: 0.9
			,duration: 3
		}
	});
});

EaselJSGraphics.ExplosionGraphic = Smart.Class(new EaselJSGraphics.Drawing(), {
	setup: function(position, velocity, explosionOptions) {
		this.explosionOptions = _.defaults(explosionOptions, Graphics.explosionOptions);

		var random = function() { return 1 - Math.random() - Math.random(); }; // provides a more even spread than just Math.random()
		
		this.particles = new Array(explosionOptions.count);
		for (var i = 0, l = explosionOptions.count; i < l; i++) {
			
			var vx = velocity.x + explosionOptions.speed * random(), 
				vy = velocity.y + explosionOptions.speed * random();
			
			this.particles[i] = {
				x: position.x, y: position.y
				, velocity: { x: vx, y: vy }
			};
		}
		
		this.addAnimation()
			.duration(explosionOptions.duration).easeOut().fade(this, 0).queueDispose(this);
		
	}
	,drawEffects: function(drawing, tickEvent) {
		var explosionOptions = this.explosionOptions,
			particles = this.particles,
			deltaSeconds = tickEvent.deltaSeconds,
			levelBounds = Balance.level.bounds;

		drawing.beginPath();
		for (var i = 0, l = particles.length; i < l; i++) {
			var particle = particles[i];
			Smart.Physics.applyVelocity(particle, particle.velocity, deltaSeconds);
			Smart.Physics.applyFrictionToVelocity(particle.velocity, explosionOptions.friction, deltaSeconds);
			Smart.Physics.bounceOffWalls(particle, explosionOptions.radius, particle.velocity, levelBounds, 0);
			
			drawing
				.moveTo(particle.x, particle.y)
				.circle(particle.x, particle.y, explosionOptions.radius);
		}
		drawing.endPath(explosionOptions.style);
	}
});
EaselJSGraphics.SpecialEffects = {
	drawElectricLineTo: function(drawing, lineStart, lineEnd, segments, maxDeviation) {
		
		var diff = {
			x: (lineEnd.x - lineStart.x)
			,y: (lineEnd.y - lineStart.y)
		};
		var interpolate = Smart.Interpolate.points(lineStart, lineEnd);
		
		for (var i = 1; i <= segments; i++) {
			var pos = interpolate(i / segments);
			var dist = Math.min(segments - i, i) / segments
				,deviation = dist * maxDeviation * (Math.random() - 0.5);
			if (diff.y)
				pos.x += -diff.y * deviation;
			if (diff.x)
				pos.y += diff.x * deviation;
			drawing.lineTo(pos.x, pos.y);
		}

	}
	,
	drawElectricRectangle: function(drawing, rectangle, electricOptions) {
		var left = rectangle.x || 0, top = rectangle.y || 0, right = left + rectangle.width, bottom = top + rectangle.height;
		var segmentsH = electricOptions.segmentsH, devH = electricOptions.deviationH;
		var segmentsV = electricOptions.segmentsV, devV = electricOptions.deviationV;
		
		drawing.moveTo(left, top);
		this.drawElectricLineTo(drawing, { x: left, y: top }, { x: right, y: top }, segmentsH, devH);
		this.drawElectricLineTo(drawing, { x: right, y: top }, { x: right, y: bottom }, segmentsV, devV);
		this.drawElectricLineTo(drawing, { x: right, y: bottom }, { x: left, y: bottom }, segmentsH, devH);
		this.drawElectricLineTo(drawing, { x: left, y: bottom }, { x: left, y: top }, segmentsV, devV);
		drawing.closePath();
		
	}
};
Balance.onUpdate(function(gameMode){
	Graphics.merge({
		textStyles: {
			default: {
				fontWeight: 'normal'
				, fontSize: '48px'
				, fontFamily: '"Segoe UI"'
				, color: 'white'
				, textAlign: 'center'
				, textBaseline: 'middle'
			}
			,
			powerupActive: {
				fontSize: '30px'
				, color: 'hsl(120, 100%, 80%)'
				, textBaseline: 'bottom'
			}
			,
			powerupDeactive: {
				fontSize: '24px'
				, color: 'hsl(0, 100%, 80%)'
				, textBaseline: 'bottom'
			}
			,
			hudText: {
				fontSize: '12px'
				, color: 'white'
				, textBaseline: 'middle'
				, textAlign: 'left'
			}
			,
			menuButton: {
				fontSize: '40px'
				, color: 'white'
				, textBaseline: 'middle'
				, textAlign: 'center'
			}
		}
	});
});
EaselJSGraphics.TextGraphic = Smart.Class(new createjs.Text(), {
	setGfx: function(gfx) {
		this.gfx = gfx;
		this.animation = gfx.addAnimation(new Smart.Animation());
		this.start('top');
	}
	,
	setText: function(text, textStyle) {

		var textStyles = Graphics.textStyles;

		this.text = text;

		if (typeof textStyle === 'string') {
			textStyle = textStyles[textStyle];
		}

		textStyle = textStyle ? _.defaults({}, textStyle, textStyles.default) : textStyles.default;
		this.font = [ textStyle.fontWeight, textStyle.fontSize, textStyle.fontFamily ].join(" ");
		this.color = textStyle.color;

		this.textAlign = textStyle.textAlign;
		this.textBaseline = textStyle.textBaseline;
	}
	,
	start: function(gamePoint) {
		var location = this.gfx.getHudPoint(gamePoint);
		this.moveTo(location.x, location.y);
		return this;
	}
	,
	flyIn: function(duration, to) {
		var toLocation = this.gfx.getHudPoint(to || 'middle');

		var txt = this;
		this.animation
			.duration(duration)
			.easeOut()
			.fade(txt, [0, 1])
			.move(txt, toLocation)
			.rotate(txt, [30, 0])
			.queue()
			.update(0)
		;

		return this;
	}
	,
	flyOut: function(duration, to) {
		var toLocation = this.gfx.getHudPoint(to || 'bottom');

		var txt = this;
		this.animation
			.duration(duration)
			.easeIn()
			.fade(txt, [1, 0])
			.move(txt, toLocation )
			.rotate(txt, [0, 30])
			.queueDispose(txt)
		;

		return this;
	}
	,
	queue: function(callback) {
		this.animation.queue(callback);
		return this;
	}
	,
	delay: function(duration) {
		this.animation.delay(duration);

		return this;
	}
	
});

EaselJSGraphics.BackgroundGraphicsBase = Smart.Class(new createjs.Shape(), {
	BackgroundGraphicsBase_initialize: function() {
		var bounds = Balance.level.bounds;
		this._size = {
			width: bounds.x*2 + bounds.width
			,height: bounds.y*2 + bounds.height
		};
		this._setupBackground();
		this._setupStars();

		this.cache(0, 0, this._size.width, this._size.height);
	}
	,
	_setupBackground: function(){
		var g = this.graphics
			,v = Graphics.background
			,size = this._size;

		g.clear();

		g.beginFill(v.backgroundColor)
		 .drawRect(0, 0, size.width, size.height);

	}
	,
	_setupStars: function() {
		var g = this.graphics
			,v = Graphics.background
			,size = this._size;
		var starColors = v.starColors;

		for (var colorIndex = 0, colorCount = starColors.length; colorIndex < colorCount; colorIndex++) {
			var starColor = starColors[colorIndex % colorCount];

			g.beginStroke(starColor);

			var starCount = Math.floor(v.starCount / colorCount);
			while (starCount--) {
				var x = Math.floor(Math.random() * size.width)
					,y = Math.floor(Math.random() * size.height);
				g.moveTo(x, y).lineTo(x+1,y+1);
			}
		}

		g.endStroke();
	}
});
EaselJSGraphics.BackgroundGraphics = Smart.Class(new EaselJSGraphics.BackgroundGraphicsBase(), {
	initialize: function() {
		if (!this.initialized) {
			// Using a prototype ensures the stars will be the same between the menu and game
			EaselJSGraphics.BackgroundGraphics.prototype.initialized = true;
			EaselJSGraphics.BackgroundGraphics.prototype.BackgroundGraphicsBase_initialize();
		} 
	}
});
EaselJSGraphics.BombCrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function BombCrystalGraphic() {
		this._setupGraphics();
	}
	, _setupGraphics: function() {
		var G = Graphics.bombCrystals;

		this.visibleRadius = G.radius;

		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
			.closePath()
			.endStyle(G.style)

			.beginStyle(G.styleInner)
			.drawPolyStar(0, 0, G.radiusInner, G.sides, G.pointSize, 0)
			.closePath()
			.endStyle(G.styleInner)
		;
		this.rotation = 360 * Math.random();

		this.spinRate = G.spinRate;
	}
	
	, onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}

	, gatherBombCrystal: function(gfx, playerLocation) {
		var bombCrystal = this;
		return gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.bombCrystals.gatherDuration)
			.savePosition()

			.easeOut('quint')
			.move(bombCrystal, playerLocation)

			.restorePosition()
			.easeOut('quint')
			.scale(bombCrystal, [1, 2, 2.5, 2, 1, 0])

			.queueDispose(bombCrystal)
		);
	}
});

EaselJSGraphics.BombGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function BombGraphic() {
		this.location = this;
		this.radius = Balance.player.radius;
	}
	,
	_setupGraphics: function() {
		var G = Graphics.bombs;
		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawCircle(0, 0, this.radius)
			.endStyle(G.style)
		;
	}
	,
	onTick: function(tickEvent) {
		var B = Balance.bombs, bounds = Balance.level.bounds;
		this.radius += (B.speed * tickEvent.deltaSeconds);
		this.alpha = 1 - (this.radius / bounds.totalWidth);
		if (this.alpha <= 0) {
			this.dispose();
		}
		this._setupGraphics();
	}
	,
	getKickBack: function(enemy, distance) {
		var impactVector = Smart.Point.subtract(enemy.location, this.location);
		return Smart.Point.scaleVector(impactVector, Balance.bombs.speed * Balance.bombs.kickBack);
	}
});

EaselJSGraphics.CrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function CrystalGraphic() {
		this._setupCrystalGraphic();
	}
	,
	_setupCrystalGraphic: function() {
		var G = Graphics.crystals;
		this.visibleRadius = G.radius;

		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
			.endStyle(G.style);
		this.rotation = 360 * Math.random();

		this.spinRate = G.spinRate;
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}
	,
	gatherCrystal: function(gfx, playerLocation) {
		var crystal = this;
		gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.crystals.gatherDuration)

			.savePosition()
			.easeIn('quint')
			.move(crystal, playerLocation)

			.restorePosition()
			.scale(crystal, [0.9, 0.3])


			.restorePosition()
			.easeOut('quint')

			.tween(function(s) { crystal.spinRate = s; }, [ crystal.spinRate, Graphics.crystals.spinRateGathered ])

			.queueDispose(crystal)
		);
	}
});

EaselJSGraphics.LevelGraphics = Smart.Class(new createjs.Shape(), {
	gateStart: null, gateEnd: null, gateOpen: false
	,
	initialize: function() {
		this.nextChange = 0;
	}
	,
	setGateWidth: function(gateWidth) {
		var bounds = Balance.level.bounds;
		this.gateStart = {
			x: bounds.x + (bounds.width - gateWidth) / 2
			,y: bounds.y
		};
		this.gateEnd = {
			x: this.gateStart.x + gateWidth
			,y: bounds.y
		};
		this.gateOpen = false;
	}
	,
	openGate: function() {
		this.gateOpen = true;
	}
	,
	closeGate: function() {
		this.gateOpen = false;
	}

	,
	onTick: function(tickEvent){
		
		if (this.nextChange <= tickEvent.time) {
			var G = Graphics.level;
			this.nextChange = tickEvent.time + G.gateElectricityFrequency;
			this.graphics.clear();
			this._drawWalls();
			this._drawGate();
		}
	}
	,
	_drawWalls: function() {
		var g = this.graphics
			, level = Graphics.level
			, bounds = Balance.level.bounds
			, strokeWidth = Graphics.level.strokeStyle.strokeWidth - 2
			, gateStart = this.gateStart
			, gateEnd = this.gateEnd;

		// Draw a rounded rectangle with a "gap" for the gate:
		// TODO: Cache these calculated values:
		var halfPI = Math.PI / 2
			,angles = {
				top: halfPI * 3
				,right: 0
				,bottom: halfPI
				,left: Math.PI
			}
			,arcCorners = {
				left: bounds.x + level.cornerRadius - strokeWidth / 2
				,right: bounds.x + bounds.width - level.cornerRadius + strokeWidth
				,top: bounds.y + level.cornerRadius - strokeWidth / 2
				,bottom: bounds.y + bounds.height - level.cornerRadius + strokeWidth
			};

		g.beginStyle(level.strokeStyle)
			.moveTo(gateEnd.x, gateEnd.y)
			.arc(arcCorners.right, arcCorners.top, level.cornerRadius, angles.top, angles.right)
			.arc(arcCorners.right, arcCorners.bottom, level.cornerRadius, angles.right, angles.bottom)
			.arc(arcCorners.left, arcCorners.bottom, level.cornerRadius, angles.bottom, angles.left)
			.arc(arcCorners.left, arcCorners.top, level.cornerRadius, angles.left, angles.top)
			.lineTo(gateStart.x, gateStart.y)
			.endStroke();

	}
	,
	_drawGate: function() {
		if (this.gateOpen) return;

		var g = this.graphics
			, gate = Graphics.gate
			, gateStart = this.gateStart
			, gateEnd = this.gateEnd;

		this._drawElectricLine(g, gate, gateStart, gateEnd);
	}
	,
	_drawElectricLine: function(graphics, gate, gateStart, gateEnd) {
		var segments = gate.segments;
		
		graphics.beginStyle(gate.strokeStyle)
			.moveTo(gateStart.x, gateStart.y);

		var diff = {
			x: (gateEnd.x - gateStart.x)
			,y: (gateEnd.y - gateStart.y)
		};

		var interpolate = Smart.Interpolate.points(gateStart, gateEnd);

		for (var i = 1; i <= segments; i++) {
			var pos = interpolate(i / segments);
			var dist = Math.min(segments - i, i) / segments
				,deviation = dist * gate.deviation * (Math.random() - 0.5);
			if (diff.y)
				pos.x += -diff.y * deviation;
			if (diff.x)
				pos.y += diff.x * deviation;
			graphics.lineTo(pos.x, pos.y);
		}
		graphics.endStroke();
	}

	,
	/**
	 * Detects if the location is outside the level's bounds, or if it's inside the gate.
	 * @param location
	 * @param radius
	 * @returns String - Either: null, 'level-wall', 'open-gate', or 'closed-gate'
	 */
	levelCollision: function(location, radius) {
		var bounds = Balance.level.bounds;
		var wall = Smart.Physics.checkBounds(location, radius, bounds);

		if (!wall) return null;

		// Detect collision with the gate:
		var insideGate = (wall.edge === 'top' && (location.x >= this.gateStart.x) && (location.x <= this.gateEnd.x));
		if (insideGate) {
			if (this.gateOpen) {
				wall.insideGate = true;
				wall.insideGateDistance = -wall.distance;

				if (Smart.Point.distanceTest(location, this.gateStart, radius)) {
					wall.touchingGate = this.gateStart;
				} else if (Smart.Point.distanceTest(location, this.gateEnd, radius)) {
					wall.touchingGate = this.gateEnd;
				}
			}

		}

		return wall;

	}

});

EaselJSGraphics.PowerCrystalGraphic = Smart.Class(new createjs.Shape(), {
	initialize: function PowerCrystalGraphic() {
		this._setupGraphics();
	}
	,
	_setupGraphics: function() {
		var G = Graphics.powerCrystals;
		this.graphics
			.clear()
			.beginStyle(G.style)
			.drawPolyStar(0, 0, G.radius, G.sides, G.pointSize, 0)
			.endStyle(G.style)

			.beginStyle(G.styleInner)
			.drawPolyStar(0, 0, G.radiusInner, G.sides, G.pointSize, 0)
			.endStyle(G.styleInner)
		;
		this.rotation = 360 * Math.random();

		this.spinRate = G.spinRate;
	}
	,
	onTick: function(tickEvent) {
		this.rotation += (this.spinRate * tickEvent.deltaSeconds);
	}
	,
	gatherPowerCrystal: function(gfx, playerLocation) {
		var powerCrystal = this;
		return gfx.addAnimation(new Smart.Animation()
			.duration(Graphics.powerCrystals.gatherDuration)
			.savePosition()

			.easeOut('quint')
			.move(powerCrystal, playerLocation)

			.restorePosition()
			.easeOut('quint')
			.scale(powerCrystal, [1, 2, 2.5, 2, 1, 0])

			.queueDispose(powerCrystal)
		);
	}

	,
	clearPowerCrystal: function(gfx) {
		var powerCrystal = this;
		return gfx.addAnimation(new Smart.Animation()
			.duration(2).easeIn()
			.scale(powerCrystal, 0)

			.queueDispose(powerCrystal)
		);

	}
});

// Create namespace:
EaselJSGraphics.HudGraphics = {};
Balance.onUpdate(function(mode) {
	_.merge(Graphics, {
		hudGraphics: {
			backgroundStyle: {
				fillColor: 'hsla(0, 100%, 100%, 0.1)'
			}
		}
	});
});

EaselJSGraphics.HudGraphics.HudOverlay = Smart.Class(new createjs.Shape(), {
	initialize: function() {
		this._setupGraphics();
	}
	, _setupGraphics: function() {
		var G = Graphics.hudGraphics, bounds = Balance.level.bounds;

		this.graphics.clear()
			.beginStyle(G.backgroundStyle)
			.drawRect(0, 0, bounds.visibleWidth, bounds.hudHeight)
			.endStyle(G.backgroundStyle)
		;

	}
});
Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		hudGraphics: {
			button: {
				padding: 5
				, cornerRadius: 4
				, style: {
					strokeWidth: 1, strokeColor: 'hsla(0, 100%, 100%, 0.3)',
					fillColor: 'hsla(0, 100%, 100%, 0.1)'
				}
			}
			, pauseButton: { width: 50 + 22 + 8, height: 20 + 8 }
			, pauseIcon: {
				style: { fillColor: 'hsla(0, 100%, 100%, 0.2)' },
				rectWidth: 8, rectHeight: 20, iconWidth: 22, rectRadius: 2
			}
			, sandwichIcon: {
				style: { fillColor: 'hsla(0, 100%, 100%, 0.2)' },
				rectWidth: 20, rectHeight: 4, iconHeight: 15, rectRadius: 2
			}
		}
	});
});

EaselJSGraphics.HudGraphics.HudButton = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	, 
	HudButton_initialize: function(gfx, width, height) {
		this.gfx = gfx;
		this.Container_initialize();
		this.width = width;
		this.height = height;
		this._setupButtonBackground();
	}
	,
	_setupButtonBackground: function() {
		var button = Graphics.hudGraphics.button;
		
		var background = new createjs.Shape();
		background.graphics.clear()
			.beginStyle(button.style)
			.drawRoundRect(0, 0, this.width, this.height, button.cornerRadius)
			.endStyle(button.style)
		;
		
		
		this.addChild(background);
	}
});

EaselJSGraphics.HudGraphics.HudPauseButton = Smart.Class(new EaselJSGraphics.HudGraphics.HudButton(), {
	initialize: function(gfx) {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		this.HudButton_initialize(gfx, pauseButton.width, pauseButton.height);
		
		this._setupGraphics();
	}
	, _setupGraphics: function() {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		
		var text = this._createText();
		text.textAlign = 'right';
		text.moveTo(pauseButton.width / 2, pauseButton.height / 2);
		this.addChild(text);
		
		var icon = this._createSandwichIcon();
		var padding = (pauseButton.height - icon.height) / 2;
		icon.moveTo((pauseButton.width - icon.width) - padding, padding);
		this.addChild(icon);
		
	}
	, _createText: function() {
		var pauseButton = Graphics.hudGraphics.pauseButton;
		var pauseText = new EaselJSGraphics.TextGraphic();
		pauseText.setText("Pause", 'hudText');
		
		this.addChild(pauseText);
		return pauseText;
	}
	, _createPauseIcon: function() {
		var pauseIcon = Graphics.hudGraphics.pauseIcon;
		var icon = new createjs.Shape();
		icon.graphics
			.beginStyle(pauseIcon.style)
			.drawRoundRect(0, 0, pauseIcon.rectWidth, pauseIcon.rectHeight, pauseIcon.rectRadius)
			.drawRoundRect(pauseIcon.iconWidth - pauseIcon.rectWidth, 0, pauseIcon.rectWidth, pauseIcon.rectHeight, pauseIcon.rectRadius)
			.endStyle(pauseIcon.style)
		;
		
		this.addChild(icon);
		return icon;
	}
	, _createSandwichIcon: function() {
		var sandwichIcon = Graphics.hudGraphics.sandwichIcon;
		var bottomRow = (sandwichIcon.iconHeight - sandwichIcon.rectHeight),
			middleRow = (sandwichIcon.iconHeight - sandwichIcon.rectHeight) / 2;
		var icon = new createjs.Shape();
		icon.graphics
			.beginStyle(sandwichIcon.style)
			.drawRoundRect(0, 0, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.drawRoundRect(0, middleRow, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.drawRoundRect(0, bottomRow, sandwichIcon.rectWidth, sandwichIcon.rectHeight, sandwichIcon.rectRadius)
			.endStyle(sandwichIcon.style)
		;
		icon.width = sandwichIcon.rectWidth;
		icon.height = sandwichIcon.iconHeight;
		
		this.addChild(icon);
		return icon;
	}
});
// Create namespace:
EaselJSGraphics.MenuGraphics = {};
Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		menuButton: {
			width: 300
			,height: 60
			,borderRadius: 6
			,buttonStyle: {
				lineWidth: 3,
				strokeStyle: 'hsla(60, 100%, 100%, 0.3)',
				fillStyle: 'hsla(60, 100%, 100%, 0.2)'
			}
			,buttonActiveStyle: {
				lineWidth: 4,
				strokeStyle: 'hsla(60, 100%, 100%, 0.7)',
				fillStyle: 'hsla(60, 100%, 100%, 0.5)'
			}
			,backgroundShape: {
				changeFrequency: 1000 / 30,
				segmentsH: 20, deviationH: 0.05,
				segmentsV: 5, deviationV: 0.5
			}
		}
	});
});
EaselJSGraphics.MenuGraphics.MenuButton = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	,initialize: function(gfx) {
		this.Container_initialize();
		this.gfx = gfx;

		this.background = new EaselJSGraphics.MenuGraphics.MenuButtonBackground();
		this.addChild(this.background);

		var G = Graphics.menuButton;
		this.visibleWidth = G.width;
		this.visibleHeight = G.height;
		this.regX = G.width / 2;
		this.regY = G.height / 2;
	}
	,setText: function(text) {
		var textGfx = this.gfx.addText(text, 'menuButton');
		this.addChild(textGfx);

		textGfx.moveTo(this.visibleWidth / 2, this.visibleHeight / 2);
	}
	,setActive: function(isActive) {
		if (this.isActive === isActive) return;
		this.isActive = isActive;
		this.background.isActive = isActive;
	}
});
EaselJSGraphics.MenuGraphics.MenuButtonBackground = Smart.Class(new EaselJSGraphics.Drawing(), {
	isActive: false
	,drawEffects: function(drawing, tickEvent) {
		if (!this.shape || this.nextChange <= tickEvent.time) {
			var G = Graphics.menuButton;
			var backgroundShape = this.shape = new Smart.DrawingQueue();
			this.nextChange = tickEvent.time + G.backgroundShape.changeFrequency;
			
			backgroundShape.beginPath();
			EaselJSGraphics.SpecialEffects.drawElectricRectangle(backgroundShape, G, G.backgroundShape);
			backgroundShape.endPath(this.isActive ? G.buttonActiveStyle : G.buttonStyle);
		}
		drawing.drawingQueue(this.shape);
	}
});
var XQuestInput = {};

(function() {
	
	var menuKeyMap = {
		up: XQuestGame.MenuSceneInputs.menuUp,
		down: XQuestGame.MenuSceneInputs.menuDown,
		left: XQuestGame.MenuSceneInputs.menuLeft,
		right: XQuestGame.MenuSceneInputs.menuRight,
		enter: XQuestGame.MenuSceneInputs.menuInvoke,
		escape: XQuestGame.MenuSceneInputs.menuBack,
		backspace: XQuestGame.MenuSceneInputs.menuBack
	};
	
	XQuestInput.MenuInputKeyboard = Smart.Class({
		initialize: function(element) {
			this.element = element || document;
			this.actionsQueue = [];
			this._setupKeyMap();
			
			
			this.keyMapper.setKeyMap(menuKeyMap);
		}
		,_setupKeyMap: function() {
			this.keyMapper = new XQuestInput.KeyMapper(this.element, this._onActionDown.bind(this));
		}
		,_onActionDown: function(actionName) {
			this.actionsQueue.push(actionName);
		}
		,onInput: function(tickEvent, inputState) {
			for (var i = 0, l = this.actionsQueue.length; i < l; i++) {
				var actionName = this.actionsQueue[i];
				inputState[actionName] = true;
			}
			this.actionsQueue.length = 0;
		}
	});
})();
(function() {

	var UserSettings = {
		keyboardSensitivity: 5
	};

	// Available actions:
	var playerActions = {
		accelerateUp: 'accelerateUp'
		,accelerateDown: 'accelerateDown'
		,accelerateLeft: 'accelerateLeft'
		,accelerateRight: 'accelerateRight'
		,primaryWeapon: 'primaryWeapon'
		,secondaryWeapon: 'secondaryWeapon'
		,pauseGame: 'pauseGame'
	};

	var debugActions = {
		gatherClosestCrystal: 'gatherClosestCrystal'
		, spawnEnemy: 'spawnEnemy'
		, killPlayer: 'killPlayer'
		, toggleFPS: 'toggleFPS'
		, toggleDebugStats: 'toggleDebugStats'
		, activateInvincible: 'activateInvincible'
		, activateRapidFire: 'activateRapidFire'
		, activateTripleShot: 'activateTripleShot'
		, activateAutoAim: 'activateAutoAim'
		, addBomb: 'addBomb'
		, spawnPowerCrystal: 'spawnPowerCrystal'
	};
	
	var keyMap = {
		escape: playerActions.pauseGame,
		contextMenu: playerActions.pauseGame,

		up: playerActions.accelerateUp,
		down: playerActions.accelerateDown,
		left: playerActions.accelerateLeft,
		right: playerActions.accelerateRight,
		space: playerActions.primaryWeapon,
		enter: playerActions.secondaryWeapon,

		numpad8: playerActions.accelerateUp,
		numpad2: playerActions.accelerateDown,
		numpad4: playerActions.accelerateLeft,
		numpad6: playerActions.accelerateRight,
		numpadadd: playerActions.primaryWeapon,
		numpadenter: playerActions.secondaryWeapon,


		c: debugActions.gatherClosestCrystal,
		s: debugActions.spawnEnemy,
		d: debugActions.killPlayer,
		
		p: debugActions.toggleFPS,
		//i: debugActions.toggleDebugStats,
		
		1: debugActions.activateInvincible,
		2: debugActions.activateRapidFire,
		3: debugActions.activateTripleShot,
		4: debugActions.activateAutoAim,
		5: debugActions.addBomb,
		0: debugActions.spawnPowerCrystal
	};

	XQuestInput.PlayerInputKeyboard = Smart.Class({
		initialize: function(game, element) {
			this.game = game;

			if (!element) {
				element = document;
			}
			this.keyMapper = new XQuestInput.KeyMapper(element, this._onActionDown.bind(this));
			this.keyMapper.disableContextMenu();

			this.setKeyMap(keyMap);
		},
		setKeyMap: function(keyMap) {
			this.keyMapper.setKeyMap(keyMap);
		},
		_onActionDown: function(action) {
			switch (action) {
				case playerActions.pauseGame:
					this.game.pauseGame();
					break;
				case debugActions.gatherClosestCrystal:
					this.game.debug().gatherClosestCrystal();
					break;
				case debugActions.spawnEnemy:
					this.game.debug().spawnEnemy();
					break;
				case debugActions.spawnPowerCrystal:
					this.game.debug().spawnPowerCrystal();
					break;
				case debugActions.killPlayer:
					this.game.debug().killPlayer();
					break;
				case debugActions.toggleFPS:
					this.game.debug().toggleFPS();
					break;
				case debugActions.toggleDebugStats:
					this.game.debug().toggleDebugStats();
					break;
				case debugActions.activateInvincible:
					this.game.debug().activatePowerup('invincible');
					break;
				case debugActions.activateRapidFire:
					this.game.debug().activatePowerup('rapidFire');
					break;
				case debugActions.activateTripleShot:
					this.game.debug().activatePowerup('tripleShot');
					break;
				case debugActions.activateAutoAim:
					this.game.debug().activatePowerup('autoAim');
					break;
				case debugActions.addBomb:
					this.game.debug().addBomb();
					break;
			}
		},

		onInput: function(tickEvent, inputState) {
			var sensitivity = UserSettings.keyboardSensitivity;
			var downActions = this.keyMapper.getDownActions();

			var activeInputs = 4;

			if (downActions[playerActions.primaryWeapon]) inputState.primaryWeapon = true;
			else activeInputs--;

			if (downActions[playerActions.secondaryWeapon]) inputState.secondaryWeapon = true;
			else activeInputs--;

			if (downActions[playerActions.accelerateLeft]) inputState.accelerationX += -sensitivity;
			else if (downActions[playerActions.accelerateRight]) inputState.accelerationX += sensitivity;
			else activeInputs--;

			if (downActions[playerActions.accelerateUp]) inputState.accelerationY += -sensitivity;
			else if (downActions[playerActions.accelerateDown]) inputState.accelerationY += sensitivity;
			else activeInputs--;
			
			if (activeInputs >= 1)
				inputState.engaged = true;
		}

	});

	XQuestInput.KeyMapper = Smart.Class({
		element: null,
		onActionDown: null,
		codes: {
			8: 'backspace',
			9: 'tab',
			13: 'enter',
			16: 'shift',
			17: 'ctrl',
			18: 'alt',
			19: 'pause',
			20: 'capslock',
			27: 'escape',
			32: 'space',
			33: 'pageup',
			34: 'pagedown',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down',
			45: 'insert',
			46: 'delete',
			93: 'contextMenu',
			96: 'numpad0',
			97: 'numpad1',
			98: 'numpad2',
			99: 'numpad3',
			100: 'numpad4',
			101: 'numpad5',
			102: 'numpad6',
			103: 'numpad7',
			104: 'numpad8',
			105: 'numpad9',
			112: 'f1',
			113: 'f2',
			114: 'f3',
			115: 'f4',
			116: 'f5',
			117: 'f6',
			118: 'f7',
			119: 'f8',
			120: 'f9',
			121: 'f10',
			122: 'f11',
			123: 'f12',
			144: 'numlock',
			145: 'scrolllock'
		},
		keyMap: null,
		downKeys: null,
		downActions: null,

		initialize: function(element, onActionDown) {
			this.element = element;
			this.onActionDown = onActionDown;
			this.codes = _.clone(this.codes);
			this.downKeys = [];
			this.downActions = {};

			this.element.addEventListener('keydown', this._onKeydown.bind(this));
			this.element.addEventListener('keyup', this._onKeyup.bind(this));
		},
		_onKeydown: function(ev) {
			var keyName = this._getKeyName(ev);
			var action = this.keyMap[keyName];
			if (!action) return;

			ev.preventDefault();

			var downIndex = this.downKeys.indexOf(keyName);
			var isAlreadyDown = (downIndex !== -1);
			if (isAlreadyDown) return;
			this.downKeys.push(keyName);
			
			var downActionCount = (this.downActions[action] || 0) + 1;
			this.downActions[action] = downActionCount;
			if (downActionCount === 1) {
				this.onActionDown(action);
			}
		},
		_onKeyup: function(ev) {
			var keyName = this._getKeyName(ev);
			var action = this.keyMap[keyName];
			if (!action) return;
			
			var downIndex = this.downKeys.indexOf(keyName);
			var wasDown = (downIndex !== -1);
			if (!wasDown) return;
			this.downKeys.splice(downIndex, 1);
			
			ev.preventDefault();
			
			var downActionCount = (this.downActions[action] || 1) - 1;
			this.downActions[action] = downActionCount;
		},
		_getKeyName: function(ev) {
			var modifiers = "";
			if (ev.ctrlKey) modifiers += "ctrl+";
			if (ev.altKey) modifiers += "alt+";
			if (ev.shiftKey) modifiers += "shift+";
			var key =
				this.codes[ev.keyCode]
				|| (ev.keyIdentifier && ev.keyIdentifier.indexOf('U+') === -1 && ev.keyIdentifier.toLowerCase())
				|| (ev.key && ev.key.indexOf('U+') === -1 && ev.key.toLowerCase())
				|| String.fromCharCode(ev.keyCode).toLowerCase()
				|| 'unknown';
			
			return modifiers + key;
		},

		getDownActions: function() {
			return this.downActions;
		},

		setKeyMap: function(keyMap) {
			this.keyMap = keyMap;
		},

		disableContextMenu: function(disabled) {
			if (disabled === undefined) disabled = true;

			if (disabled) {
				window.addEventListener('contextmenu', preventDefault);
			} else {
				window.removeEventListener('contextmenu', preventDefault);
			}
		}
	});

	function preventDefault(ev) {
		ev.preventDefault();
	}

})();

/*
 ng-mousemove="ui.onMouseMove($event)"
 ng-mousedown="ui.primaryWeapon(true); $event.preventDefault();"
 ng-mouseup="ui.primaryWeapon(false);"
 ng-mouseleave="ui.togglePause(true)"

 */

(function() {
	var UserSettings = {
		mouseSensitivity: 10,
		sensitivityScale: 100,
		mouseBiasSensitivity: 2,
		maxMouseMove: 40 // Maximum mouse delta per mousemove event
	};

	var primaryWeapon = 'primaryWeapon', secondaryWeapon = 'secondaryWeapon';
	var mouseMap = {
		left: primaryWeapon
		, right: secondaryWeapon
	};

	XQuestInput.PlayerInputMouse = Smart.Class({ 
		element: null,
		elementSize: null,
		mouseState: null,
		previousMousePosition: null,

		initialize: function(game, element) {
			this.game = game;
			this.element = element;
			this.mouseMap = mouseMap;

			addEventListeners(this.element, {
				'mouseover': this._onMouseOver.bind(this),
				'mouseout': this._onMouseOut.bind(this),
				'mousedown': this._onMouseDown.bind(this),
				'mouseup': this._onMouseUp.bind(this),
				'mousemove': this._onMouseMove.bind(this)
			});

			addEventListeners(window, {
				'resize': this._onWindowResize.bind(this)
			});
			this._onWindowResize();
			
			this.game.onGamePaused(this._onGamePaused.bind(this));
			this._onGamePaused(false);
			
			this._resetMouseState();
		},
		_resetMouseState: function() {
			this.mouseState = { engaged: true, accelerationX: 0, accelerationY: 0 };
		},

		_onWindowResize: function() {
			this.elementSize = getElementSize(this.element);
			this.previousMousePosition = null;
		},

		_onGamePaused: function(paused) {
			this.element.style.cursor = paused ? null : "none";
			this.previousMousePosition = null;
			this._resetMouseState();
		},

		_onMouseOver: function(ev) {
			var isInsideElement = elementContains(this.element, ev.target);
			if (isInsideElement) {
				this.mouseState.engaged = true;
			}
		},
		_onMouseOut: function(ev) {
			var isInsideElement = elementContains(this.element, ev.relatedTarget);
			if (!isInsideElement) {
				this.mouseState.engaged = false;
				this.game.pauseGame(true);				
			}
		},
		_onMouseDown: function(ev) {
			var button = getMouseButton(ev);
			var action = this.mouseMap[button];
			if (action) {
				this.mouseState[action] = true;
				ev.preventDefault();
			}
		},
		_onMouseUp: function(ev) {
			var button = getMouseButton(ev);
			var action = this.mouseMap[button];
			if (action) {
				this.mouseState[action] = false;
			}
		},
		
		_onMouseMove: function(ev) {
			var mousePosition = getMousePosition(ev), previousMousePosition = this.previousMousePosition;
			this.previousMousePosition = mousePosition;
			if (!previousMousePosition)
				return;
			

			var delta = {
				x: Math.min(mousePosition.x - previousMousePosition.x, UserSettings.maxMouseMove)
				, y: Math.min(mousePosition.y - previousMousePosition.y, UserSettings.maxMouseMove)
			};

			var acceleration = this._adjustForSensitivity(delta, mousePosition);

			this.mouseState.accelerationX += acceleration.x;
			this.mouseState.accelerationY += acceleration.y;
		},
		_adjustForSensitivity: function(delta, mousePosition) {
			var elementSize = this.elementSize
				, sensitivity = UserSettings.mouseSensitivity * UserSettings.sensitivityScale
				, biasSensitivity = UserSettings.mouseBiasSensitivity;

			var screenDeltaX = delta.x / elementSize.width,
				screenDeltaY = delta.y / elementSize.height;

			var distanceFromCenterX = 2 * (mousePosition.x / elementSize.width) - 1,
				distanceFromCenterY = 2 * (mousePosition.y / elementSize.height) - 1;

			var biasX = this._getBias(distanceFromCenterX, delta.x, biasSensitivity),
				biasY = this._getBias(distanceFromCenterY, delta.y, biasSensitivity);

			var acceleration = {
				x: screenDeltaX * sensitivity * biasX
				, y: screenDeltaY * sensitivity * biasY
			};

			return acceleration;
		},
		_getBias: function(distanceFromCenter, deltaDirection, sensitivity) {
			// "Bias" is used to increase outward sensitivity, and decrease inward sensitivity.
			// This causes the user's mouse to gravitate toward the center of the page,
			// decreasing the likelihood of reaching the edges of the page.

			var isMovingAwayFromCenter = (distanceFromCenter < 0 && deltaDirection < 0) || (distanceFromCenter > 0 && deltaDirection > 0);
			distanceFromCenter = Math.abs(distanceFromCenter);
			if (isMovingAwayFromCenter) {
				return 1 + distanceFromCenter * (sensitivity - 1);
			} else {
				return 1 - distanceFromCenter + (distanceFromCenter / sensitivity);
			}
		},
		
		onInput: function(tickEvent, inputState) {
		
			var mouseState = this.mouseState;

			if (mouseState.primaryWeapon) inputState.primaryWeapon = true;
			if (mouseState.secondaryWeapon) inputState.secondaryWeapon = true;
			if (mouseState.accelerationX) inputState.accelerationX += mouseState.accelerationX;
			if (mouseState.accelerationY) inputState.accelerationY += mouseState.accelerationY;
			if (mouseState.engaged) inputState.engaged = true;

			mouseState.accelerationX = 0;
			mouseState.accelerationY = 0;
		}

	});

	function addEventListeners(element, events) {
		for (var eventName in events) {
			if (!events.hasOwnProperty(eventName)) continue;
			element.addEventListener(eventName, events[eventName]);
		}
	}
	function elementContains(element, child) {
		while (child) {
			if (child === element) return true;
			child = child.parentNode;
		}
		return false;
	}
	function getElementSize(element) {
		return { width: element.clientWidth, height: element.clientHeight };
	}
	function getMousePosition(ev) {
		return { x: ev.clientX, y: ev.clientY };
	}
	function getMouseButton(ev) {
		switch (ev.which || ev.button) {
			case 1: return 'left';
			case 2: return 'middle';
			case 3: return 'right';
			case 4: return 'xbutton1';
			case 5: return 'xbutton2';
			default: return 'none';
		}
	}

})();

/*
 ng-mousemove="ui.onMouseMove($event)"
 ng-mousedown="ui.primaryWeapon(true); $event.preventDefault();"
 ng-mouseup="ui.primaryWeapon(false);"
 ng-mouseleave="ui.togglePause(true)"

 */

(function() {
	var UserSettings = {
		touchSensitivity: 2,
		inactiveTouchTimeout: 4
	};

	XQuestInput.PlayerInputTouch = Smart.Class({
		element: null,
		elementSize: null,
		touches: null,
		touchState: null,

		initialize: function(game, element) {
			this.game = game;
			this.element = element;
			this.touchState = {};

			addEventListeners(this.element, {
				'touchstart': this._onTouchStart.bind(this),
				'touchend': this._onTouchEnd.bind(this),
				'touchleave': this._onTouchEnd.bind(this),
				'touchcancel': this._onTouchEnd.bind(this),
				'touchmove': this._onTouchMove.bind(this)
			});

			addEventListeners(window, {
				'resize': this._onWindowResize.bind(this)
			});
			this._onWindowResize();

		},

		_onWindowResize: function() {
			this.elementSize = getElementSize(this.element);
		},
		
		
		_onTouchStart: function(ev) {
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (!this.touchState.engaged) {
					this.touchState.engaged = { identifier: touch.identifier };
					var touchPosition = getTouchPosition(touch);
					this._updateTouchPosition(touchPosition);
				} else if (!this.touchState.primaryWeapon) {
					this.touchState.primaryWeapon = { identifier: touch.identifier };
				} else if (!this.touchState.secondaryWeapon) {
					this.touchState.secondaryWeapon = { identifier: touch.identifier };
				}
			}
		},
		_onTouchEnd: function(ev) {
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged && this.touchState.engaged.identifier === touch.identifier) {
					this.touchState.engaged = false;
				} else if (this.touchState.primaryWeapon && this.touchState.primaryWeapon.identifier === touch.identifier) {
					this.touchState.primaryWeapon = false;
				} else if (this.touchState.secondaryWeapon && this.touchState.secondaryWeapon.identifier === touch.identifier) {
					this.touchState.secondaryWeapon = false;
				}
			}
		},
		_onTouchMove: function(ev) {
			ev.preventDefault();
			var touches = ev.changedTouches;
			for (var i = 0, l = touches.length; i < l; i++) {
				var touch = touches[i];
				if (this.touchState.engaged && this.touchState.engaged.identifier === touch.identifier) {
					var touchPosition = getTouchPosition(touch);
					var delta = this._updateTouchPosition(touchPosition);
					if (!delta) continue;
					var acceleration = this._adjustForSensitivity(delta, touchPosition, this.elementSize);
					
					this.touchState.accelerationX += acceleration.x;
					this.touchState.accelerationY += acceleration.y;
				}
			}
		},
		
		_updateTouchPosition: function(touchPosition) {
			var delta = null;
			if (this.previousTouchPosition) {
				delta = {
					x: touchPosition.x - this.previousTouchPosition.x
					, y: touchPosition.y - this.previousTouchPosition.y
				};
			}
			this.previousTouchPosition = touchPosition;

			return delta;
		},
		_adjustForSensitivity: function(delta, touchPosition, elementSize) {
			var sensitivity = UserSettings.touchSensitivity;
			var acceleration = {
				x: delta.x * sensitivity
				, y: delta.y * sensitivity
			};
			return acceleration;
		},

		onInput: function(tickEvent, inputState) {

			var touchState = this.touchState;

			if (touchState.primaryWeapon) inputState.primaryWeapon = true;
			if (touchState.secondaryWeapon) inputState.secondaryWeapon = true;
			if (touchState.accelerationX) inputState.accelerationX += touchState.accelerationX;
			if (touchState.accelerationY) inputState.accelerationY += touchState.accelerationY;
			if (touchState.engaged) inputState.engaged = true;

			touchState.accelerationX = 0;
			touchState.accelerationY = 0;
		}

	});

	function addEventListeners(element, events) {
		for (var eventName in events) {
			if (!events.hasOwnProperty(eventName)) continue;
			element.addEventListener(eventName, events[eventName]);
		}
	}
	function elementContains(element, child) {
		while (child) {
			if (child === element) return true;
			child = child.parentNode;
		}
		return false;
	}
	function getElementSize(element) {
		return { width: element.clientWidth, height: element.clientHeight };
	}
	function getTouchPosition(touch) {
		return { x: touch.clientX, y: touch.clientY };
	}

})();

XQuestGame.XQuestHost = Smart.Class(new Smart.Disposable(), {
	initialize: function(canvas) {
		
		this.scenes = [];

		Balance.setGameMode('arcade');

		this._setupCanvas(canvas);
		this._setupTimer();

		this._setupBackgroundGraphics();
		this._setupMenuScene();
		
		this._loadStartMenu();
	}

	,_setupCanvas: function(canvas) {
		if (!canvas) {
			var bounds = Balance.level.bounds;
			canvas = this._createFullScreenCanvas(bounds.visibleWidth, bounds.visibleHeight);
		}
		this.canvas = canvas;
	}
	,_createFullScreenCanvas: function(canvasWidth, canvasHeight) {
		// Create elements manually, because parsing isn't "safe" for WinJS:
		var container = document.createElement('section'), canvas = document.createElement('canvas');
		container.appendChild(canvas);
		_.extend(container.style, { position: 'fixed', top: 0, left: 0, bottom: 0, right: 0, 'background-color': 'hsl(0, 0%, 5%)', outline: 'none' });
		_.extend(canvas.style, { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, margin: 'auto' });

		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);

		document.body.appendChild(container);
		document.body.style.overflow = "hidden";
		this.onDispose(function() {
			document.body.removeChild(container);
			document.body.style.overflow = null;
		});
		container.focus();

		this._contain(container, canvas, canvasWidth, canvasHeight);

		return canvas;
	}
	,_contain: function(container, canvas, canvasWidth, canvasHeight) {
		window.addEventListener('resize', scaleCanvas);
		scaleCanvas();

		function scaleCanvas() {
			var containerWidth = container.offsetWidth, containerHeight = container.offsetHeight;
			var fitWidth = (canvasWidth / canvasHeight > containerWidth / containerHeight);
			if (fitWidth) {
				canvas.style.width = "100%";
				canvas.style.height = "auto";
			} else {
				canvas.style.width = "auto";
				canvas.style.height = "100%";
			}
		}
	}

	,_setupTimer: function() {
		this.timer = new EaselJSTimer();
		this.timer.addTickHandler(this._tickHandler.bind(this));
		this.onDispose(function() {
			this.timer.dispose();
		}.bind(this));
	}
	,_tickHandler: function(tickEvent) {
		if (this.timeAdjust) {
			tickEvent.deltaSeconds *= this.timeAdjust;
		}
		
		this.backgroundGraphics.onDraw(tickEvent);
		this.scenes.forEach(function(scene) {
			scene.updateScene(tickEvent);
		});
	}
	,_setupBackgroundGraphics: function() {
		this.backgroundGraphics = new EaselJSGraphics(this.canvas);
	}

	,_setupMenuScene: function() {
		var host = this;
		var graphics = new EaselJSGraphics(this.canvas);
		graphics.showBackgroundStars(true);
		this.menuScene = new XQuestGame.MenuScene(graphics, host);
		this.menuScene.addSceneItem(new XQuestInput.MenuInputKeyboard());
		this.scenes.push(this.menuScene);
	}
	,_loadStartMenu: function() {
		var startMenu = new XQuestGame.CommonMenus.StartMenu(this.menuScene);
		this.menuScene.addMenu(startMenu);
		
		startMenu.onStartGame(this._startArcadeGame.bind(this));
	}
	
	,_startArcadeGame: function() {
		
		// Create Game:
		var graphics = new EaselJSGraphics(this.canvas);
		graphics.showBackgroundStars(true);
		this.game = new XQuestGame.ArcadeGame(graphics);
				
		// Game Inputs:
		this.game.addSceneItem(new XQuestInput.PlayerInputKeyboard(this.game, null));
		this.game.addSceneItem(new XQuestInput.PlayerInputMouse(this.game, this.canvas.parentNode));
		this.game.addSceneItem(new XQuestInput.PlayerInputTouch(this.game, this.canvas.parentNode));
		// Game Events:
		this.game.onGamePaused(this._showPauseMenu.bind(this));
		
		this.game.startArcadeGame();

		// Put the menu over the game:
		this.scenes = [ this.game, this.menuScene ];
		this.menuScene.gfx.showBackgroundStars(false);
		
	}
	,X_showPauseMenu: function(paused) {
		if (!paused) return;
		// Create Pause Menu:
		// Currently there can only be 1 scene that uses this.graphics;
		// otherwise we would be double-drawing everything:
		var graphics = new EaselJSGraphics(this.canvas);
		this.pauseMenu = new XQuestGame.PauseMenu(graphics);
		this.scenes.push(this.pauseMenu);
		// Menu Inputs:
		this.pauseMenu.addSceneItem(new XQuestInput.MenuInputKeyboard());
		// Menu Events:
		this.pauseMenu.onMenuExit(function() {
			this.scenes.pop();
			this.game.pauseGame(false);
		}.bind(this));
	}
	,_showPauseMenu: function(paused) {
		if (!paused) return;

		var pauseMenu = new XQuestGame.CommonMenus.PauseMenu(this.menuScene);
		this.menuScene.addMenu(pauseMenu);
		pauseMenu.onResumeGame(function() {
			this.game.pauseGame(false);
		}.bind(this));
	}	


});
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
	,sharedDrawingContext: new EaselJSGraphics.DrawingContext(null)
	,initialize: function(args_) {
		this.Drawing_initialize.apply(this, arguments);
	}
	,Drawing_initialize: function(args_) {
		this.DisplayObject_initialize();

		if (this.setup) {
			this.setup.apply(this, arguments);
		}
		
		if (this.drawStatic) {
			this.drawingQueue = new EaselJSGraphics.DrawingQueue();
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
		if (this.drawEffects && !ignoreCache && this.tickEvent) {
			this.sharedDrawingContext.setContext(ctx);
			this.drawEffects(this.sharedDrawingContext, this.tickEvent);
		}

		return true;
	}
});

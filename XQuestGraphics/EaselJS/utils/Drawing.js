EaselJSGraphics.Drawing = Smart.Class(new createjs.DisplayObject(), {
	DisplayObject_initialize: createjs.DisplayObject.prototype.initialize
	,DisplayObject_draw: createjs.DisplayObject.prototype.draw
	,sharedDrawingContext: new EaselJSGraphics.DrawingContext(null)
	,initialize: function() {
		this.Drawing_initialize();
	}
	,Drawing_initialize: function() {
		this.DisplayObject_initialize();

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
		if (this.drawEffects && !ignoreCache) {
			var tickEvent = this.tickEvent;
			this.sharedDrawingContext.setContext(ctx);
			this.drawEffects(this.sharedDrawingContext, tickEvent);
		}

		return true;
	}

	,drawStatic: null // Should be overridden
	,drawEffects: null // Should be overridden
});

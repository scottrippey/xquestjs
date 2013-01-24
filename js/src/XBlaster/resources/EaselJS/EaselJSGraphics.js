var EaselJSGraphics = new Class({
    initialize: function(canvas) {
        this.canvas = canvas;
        this.stage = new createjs.Stage(canvas);
    }
    ,
    addToStage: function(displayObject) {
        Array.each(arguments, function(displayObject) {
            this.stage.addChild(displayObject);
        }, this);
    }
    ,
    startTimer: function() {
        createjs.Ticker.addListener(this.stage);
    }
});
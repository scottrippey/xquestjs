var ArcadeGame = new Class({

    gfx: null
    , input: null

    , initialize: function(gfx, input) {
        this.gfx = gfx;
        this.input = input;
    }
    , start: function() {
        this.gfx.startTimer();
    }

});

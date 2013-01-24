var BrowserInput = new Class({

    initialize: function(el) {
        this.document = el.getDocument();

        this._setupEvents();
    }
    ,
    _setupEvents: function(){
        $(this.document.body).addEvents({
            'mousedown': this._onMouseDown.bind(this)
            ,'mouseup': this._onMouseUp.bind(this)
        });
    }
    ,
    _onMouseDown: function() {

    }
    ,
    _onMouseUp: function() {

    }

});

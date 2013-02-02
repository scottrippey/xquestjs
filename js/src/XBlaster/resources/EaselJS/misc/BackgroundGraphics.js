var BackgroundGraphics = function(size) {
	this.width = size.width;
	this.height = size.height;
	this._setupGraphics();

};
BackgroundGraphics.prototype = new createjs.Shape();
BackgroundGraphics.implement({

	variables: {
		backgroundColor: 'black'
	}
	,
	_setupGraphics: function(){
		var g = this.graphics, v = this.variables;
		g.clear();

		g.beginFill(this.variables.backgroundColor)
		 .drawRect(0, 0, this.width, this.height);

	}

});

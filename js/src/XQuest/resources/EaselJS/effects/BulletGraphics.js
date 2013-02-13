var BulletGraphics = function() {

	this._setupGraphics();

};
BulletGraphics.prototype = new createjs.Shape();
BulletGraphics.implement({

	_setupGraphics: function(){
		var g = this.graphics, v = Graphics.bullets;
		g.clear();

		g.beginStyle(v.strokeStyle)
		 .drawCircle(0, 0, Graphics.bullets.diameter)
		 .endStroke();

	}

	, moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	}
});

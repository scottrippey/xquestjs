define('PlayerGraphics', [ 'createjs', 'Physics' ], function (createjs, Physics) {

	var PlayerGraphics = new Class({
		Extends: createjs.Shape

		, variables: {
			outerRadius: 15
			, outerStyle: {
				strokeWidth: 3
				, strokeColor: '#FFFFFF'
			}

			, inside: {
				radius: 10
				, style: { strokeWidth: 3 , strokeColor: '#FFFF00' }
				, starPoints: 5
				, starDepth: 0.7
				, rotateSpeed: (1/5)
			}

		}
		, totalElapsed: 0

		, initialize: function(){
			this.parent();

		}

		, tick: function(elapsed) {
			var dt = (elapsed / 1000) || 0, v = this.variables, g = this.graphics;
			this.totalElapsed += dt;
			
			g.clear();

			// Outside circle
			g.beginStyle(v.outerStyle)
			 .drawCircle(0, 0, v.outerRadius);

			// Inside circle
			var rotate = (this.totalElapsed * v.inside.rotateSpeed);
			g.beginStyle(v.inside.style)
			 .drawPolyStar(0, 0, v.inside.radius, v.inside.starPoints, v.inside.starDepth, 360 * rotate);

		}

	});
	return PlayerGraphics;
});
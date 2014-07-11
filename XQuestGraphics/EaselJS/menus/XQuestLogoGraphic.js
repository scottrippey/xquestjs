Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		xquestLogo: {
			height: 80
			, thickness: 15
			, tailLength: 60
			, fontSize: 150
			, textColor: 'white'
			, xColor: 'yellow'
			, show: { duration: 3 }
			, hide: { duration: 1 }
		}
	});
});

EaselJSGraphics.XQuestLogoGraphic = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize
	, initialize: function(gfx) {
		this.Container_initialize();
		this.gfx = gfx;
		
		this._addX_Q_UEST();
	}
	, _addX_Q_UEST: function() {
		var X = new EaselJSGraphics.XQuestLogoGraphic.X();
		this.addChild(X);
		
		var Q = new EaselJSGraphics.XQuestLogoGraphic.Q();
		this.addChild(Q);
		
		var UEST = new EaselJSGraphics.XQuestLogoGraphic.UEST();
		this.addChild(UEST);
		
		X.moveTo(0, 0);
		Q.moveTo(150, 0);
		UEST.moveTo(250, 70);
	}

	, showLogo: function() {
		var G = Graphics.xquestLogo, logo = this;
		this.animation = this.gfx.addAnimation()
			.duration(G.show.duration).savePosition()
			.ease().fade(logo, [ 0, 1 ]);
		return this.animation;
	}
	
	, hideLogo: function() {
		var G = Graphics.xquestLogo, logo = this;
		this.animation.cancelAnimation();
		this.animation = this.gfx.addAnimation()
			.duration(G.hide.duration).easeOut()
			.fade(logo, 0);
		return this.animation;
	}
});

EaselJSGraphics.XQuestLogoGraphic.X = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		
		drawing
			.beginPath()
			.star(0, 0, G.height, 4, 0.8, 45)
			.endPath({ fillStyle: G.xColor });
	}
});
EaselJSGraphics.XQuestLogoGraphic.Q = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height, thickness = G.thickness, tailLength = G.tailLength;
		drawing
			.beginPath()
			.circle(0, 0, radius)
			.rect(radius - tailLength / 2, -thickness / 4, tailLength, thickness / 4 )
			.endPath({ strokeStyle: G.textColor, lineWidth: thickness });
		
		this.rotation = 45;
	}
});
EaselJSGraphics.XQuestLogoGraphic.UEST = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		drawing
			.font(G.fontSize + 'px Arial')
			.fillStyle(G.textColor)
			.fillText("uest", 0, 0);
	}
});

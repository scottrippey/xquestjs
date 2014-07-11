Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		xquestLogo: {
			height: 80
			, QThickness: 15
			, QTailLength: 50
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
		
		this.X = X;
		this.Q = Q;
		this.UEST = UEST;
	}

	, showLogo: function() {
		var G = Graphics.xquestLogo, logo = this, X = this.X, Q = this.Q, UEST = this.UEST;
		logo.alpha = 0;
		this.animation = this.gfx.addAnimation()
			.duration(G.show.duration)
			.savePosition()
			.ease()
			.fade(logo, 1)
			.restorePosition()
		;
			
		return this.animation;
	}
	
	, hideLogo: function() {
		var G = Graphics.xquestLogo, logo = this, X = this.X, Q = this.Q, UEST = this.UEST;
		this.animation.cancelAnimation();
		this.animation = this.gfx.addAnimation()
			.duration(G.hide.duration)
			.ease()
			.move(X, Q).rotate(X, 360).scale(X, 0.8)
			.queue()
			.duration(G.hide.duration).easeOut().savePosition()
			.fade(logo, 0)
			.restorePosition()
		;
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
		var radius = G.height, QThickness = G.QThickness, QTailLength = G.QTailLength;
		drawing
			.beginPath()
			.circle(0, 0, radius)
			.rect(radius - QTailLength / 2, -QThickness / 4, QTailLength, QThickness / 4 )
			.endPath({ strokeStyle: G.textColor, lineWidth: QThickness });
		
		this.rotation = 45;
	}
});
EaselJSGraphics.XQuestLogoGraphic.UEST = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		drawing
			.font(G.fontSize + 'px "Segoe UI"')
			.fillStyle(G.textColor)
			.fillText("uest", 0, 0);
	}
});

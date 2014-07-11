Balance.onUpdate(function(gameMode) {
	Graphics.merge({
		xquestLogo: {
			height: 160
			, QThickness: 15
			, QTailLength: 30
			, fontSize: 150
			, textColor: 'white'
			, xColor: 'yellow'
			, show: { duration: 3 }
			, hide: { duration: 2 }
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
		var QTail = new EaselJSGraphics.XQuestLogoGraphic.QTail();
		this.addChild(QTail);
		
		var UEST = new EaselJSGraphics.XQuestLogoGraphic.UEST();
		this.addChild(UEST);

		var left = 0;

		left += X.visibleWidth / 2;
		X.moveTo(left, 20);
		left += X.visibleWidth / 2 + 10;

		left += Q.visibleWidth / 2;
		Q.moveTo(left, 0);
		Q.scaleX = 0.8;
		QTail.moveTo(left, 0);
		QTail.scaleX = 0.8;
		left += Q.visibleWidth / 2 + 10;

		UEST.moveTo(left, 70);

		
		this.X = X;
		this.Q = Q;
		this.QTail = QTail;
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
		var G = Graphics.xquestLogo, logo = this, X = this.X, Q = this.Q, QTail = this.QTail, UEST = this.UEST;
		var spinRate = 270, firstSpin;
		this.animation.cancelAnimation();
		this.animation = this.gfx.addAnimation()
			.duration(G.hide.duration).savePosition()

			.ease().move(X, Q).scale(X, 0.8).restorePosition()
			.easeIn('swing').rotate(X, firstSpin = (spinRate * G.hide.duration * 0.5)).restorePosition()
			.ease()
			.tween([ Q.scaleX, 1 ], function(scaleX) { Q.scaleX = scaleX; })
			.fade(QTail, 0)
			.fade(UEST, 0)

			.queue().duration(G.hide.duration / 2)
			.rotate(X, firstSpin + (spinRate * G.hide.duration / 2))
			.easeIn().savePosition()
			.fade(logo, 0)
			.restorePosition()
		;
		return this.animation;
	}
});

EaselJSGraphics.XQuestLogoGraphic.X = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo, radius = G.height / 2;
		this.visibleWidth = G.height * 0.7;

		drawing
			.beginPath()
			.star(0, 0, radius, 4, 0.8, 45)
			.endPath({ fillStyle: G.xColor });
	}
});
EaselJSGraphics.XQuestLogoGraphic.Q = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height / 2, QThickness = G.QThickness, QTailLength = G.QTailLength;

		this.visibleWidth = G.height;

		drawing
			.beginPath()
			.circle(0, 0, radius)
			.endPath({ strokeStyle: G.textColor, lineWidth: QThickness });

		this.rotation = 45;
	}
});
EaselJSGraphics.XQuestLogoGraphic.QTail = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic: function(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height / 2, QThickness = G.QThickness, QTailLength = G.QTailLength;

		drawing
			.beginPath()
			.rect(radius + QThickness - 1, -QThickness / 4, QTailLength, QThickness / 4)
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

Balance.onUpdate(gameMode => {
	Graphics.merge({
		xquestLogo: {
			height: 160,
			QThickness: 15,
			QTailLength: 30,
			fontSize: 150,
			textColor: 'white',
			xColor: 'yellow',
			show: { duration: 3 },
			hide: { duration: 2 }
		}
	});
});

EaselJSGraphics.XQuestLogoGraphic = Smart.Class(new createjs.Container(), {
	Container_initialize: createjs.Container.prototype.initialize,
	initialize: function XQuestLogoGraphic(gfx) {
		this.Container_initialize();
		this.gfx = gfx;

		this._addX_Q_UEST();
	},
	_addX_Q_UEST() {
		var X = new EaselJSGraphics.XQuestLogoGraphic.X();
		this.addChild(X);

		var Q = new EaselJSGraphics.XQuestLogoGraphic.Q();
		this.addChild(Q);
		var QTail = new EaselJSGraphics.XQuestLogoGraphic.QTail();
		this.addChild(QTail);

		var UEST = new EaselJSGraphics.XQuestLogoGraphic.UEST();
		this.addChild(UEST);

		this.X = X;
		this.Q = Q;
		this.QTail = QTail;
		this.UEST = UEST;


		// Layout:
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
		left += UEST.visibleWidth;


		var G = Graphics.xquestLogo;
		this.visibleHeight = G.height;
		this.visibleWidth = left;
	},

	showLogo() {
		var G = Graphics.xquestLogo;
		var logo = this;
		var X = this.X;
		var Q = this.Q;
		var UEST = this.UEST;
		logo.alpha = 0;
		this.animation = this.gfx.addAnimation()
			.duration(G.show.duration)
			.savePosition()
			.easeOut()
			.fade(logo, 1)
			.restorePosition()
		;

		return this.animation;
	},

	hideLogo() {
		var G = Graphics.xquestLogo;
		var logo = this;
		var X = this.X;
		var Q = this.Q;
		var QTail = this.QTail;
		var UEST = this.UEST;
		var spinRate = 270;
		var firstSpin;
		this.animation.cancelAnimation();
		this.animation = this.gfx.addAnimation()
			.duration(G.hide.duration).savePosition()

			.ease().move(X, Q).scale(X, 0.8).restorePosition()
			.easeIn('swing').rotate(X, firstSpin = (spinRate * G.hide.duration * 0.5)).restorePosition()
			.ease()
			.tween([ Q.scaleX, 1 ], scaleX => { Q.scaleX = scaleX; })
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
	drawStatic(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height / 2;
		this.visibleWidth = G.height * 0.7;

		drawing
			.beginPath()
			.star(0, 0, radius, 4, 0.8, 45)
			.endPath({ fillStyle: G.xColor });
	}
});
EaselJSGraphics.XQuestLogoGraphic.Q = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height / 2;
		var QThickness = G.QThickness;
		var QTailLength = G.QTailLength;

		this.visibleWidth = G.height;

		drawing
			.beginPath()
			.circle(0, 0, radius)
			.endPath({ strokeStyle: G.textColor, lineWidth: QThickness });

		this.rotation = 45;
	}
});
EaselJSGraphics.XQuestLogoGraphic.QTail = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic(drawing) {
		var G = Graphics.xquestLogo;
		var radius = G.height / 2;
		var QThickness = G.QThickness;
		var QTailLength = G.QTailLength;

		drawing
			.beginPath()
			.rect(radius + QThickness / 2 - 1, -QThickness / 2, QTailLength, QThickness - 2)
			.endPath({ fillStyle: G.textColor });

		this.rotation = 45;
	}
});
EaselJSGraphics.XQuestLogoGraphic.UEST = Smart.Class(new EaselJSGraphics.Drawing(), {
	drawStatic(drawing) {
		var G = Graphics.xquestLogo;

		this.visibleWidth = G.height * 2;

		drawing
			.font(`${G.fontSize}px "Segoe UI"`)
			.fillStyle(G.textColor)
			.fillText("uest", 0, 0);
	}
});

(function() {
	var IntroSceneEvents = {
		onPlayGame: 'onPlayGame'
	};
	
	XQuestGame.IntroScene = Smart.Class(new XQuestGame.BaseScene().implementSceneEvents(IntroSceneEvents), {
		initialize: function(gfx, host) {
			this.BaseScene_initialize();
	
			this.gfx = gfx;
			this.host = host;
			this.addSceneItem(this);
			this.addSceneItem(this.gfx);
		}
		, onMove: function(tickEvent, inputState) {
			if (inputState.menuInvoke) {
				this._onInvoke();
			}
		}
		
		, startIntro: function() {
			this._addLogo();
			this._addPlayButton();
		}
		, _addLogo: function() {
			this.logo = this.gfx.createXQuestLogoGraphic();
			this.logo.moveTo(180, 350);
			return this.logo.showLogo()
				.easeOut()
				.move(this.logo, { x: 180, y: 200 });
		}
		, _addPlayButton: function() {
			this.playButton = this.gfx.createMenuButton("Play XQuest");
			this.playButton.addButtonEvents({
				invoke: this._onInvoke.bind(this)
			});

			var bottom = this.gfx.getHudPoint('bottom');
			var dest = { x: bottom.x, y: bottom.y - 100 };
			
			this.playButton.setActive(true);
			this.playButton.moveTo(bottom.x, bottom.y + 100);
			this.playButton.animation = this.gfx.addAnimation()
				.delay(1).duration(2)
				.easeOut()
				.fade(this.playButton, [0, 1])
				.move(this.playButton, dest);
		}
		, _onInvoke: function() {
			var bottom = this.gfx.getHudPoint('bottom');
			if (this.playButton) {
				this.playButton.animation.cancelAnimation();
				this.playButton.animation = this.gfx.addAnimation()
					.duration(1)
					.easeOut()
					.fade(this.playButton, 0)
					.move(this.playButton, bottom);
			}
				
			this.logo.hideLogo()
				.move(this.logo, { x: 180, y: 350})
				.queue(function() {
					this.fireSceneEvent(IntroSceneEvents.onPlayGame);
				}.bind(this));
		}
	});

})();
	
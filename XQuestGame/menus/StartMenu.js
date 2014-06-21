(function init_StartMenu() {
	var StartMenuEvents = {
		onStartArcadeGame: 'StartArcadeGame'
	};

	XQuestGame.StartMenu = Smart.Class(new XQuestGame.BaseScene(), {
		initialize: function (gfx) {
			this.BaseScene_initialize();
			
			this.buttonStack = [];
			
			this.gfx = gfx;
			this.addSceneItem(this.gfx);

			this._loadStartMenu();
		}
		,_loadButtons: function(buttons) {
			var isBackNavigation = false;
			if (this.buttonStack.length) {
				var currentButtons = this.buttonStack[this.buttonStack.length - 1];
				this._leaveButtons(currentButtons, isBackNavigation);
			}
			this.buttonStack.push(buttons);
			
			this._enterButtons(buttons, isBackNavigation);
			
		}
		,_goBack: function() {
			if (this.buttonStack.length) {
				var isBackNavigation = true;
				this._leaveButtons(this.buttonStack.pop(), isBackNavigation);
				
				var currentButtons = this.buttonStack[this.buttonStack.length - 1];
				this._enterButtons(currentButtons, isBackNavigation)
			}
		}
		,_enterButtons: function(buttons, isBackNavigation) {
			var layoutMargin = 20
				, animRotation = 30
				, animStagger = 0.25
				, animDuration = 1
				;
			
			var bottom = this.gfx.getHudPoint('bottom');
			var middle = this.gfx.getHudPoint('middle');

			var buttonHeight = buttons[0].visibleHeight;
			var stackedButtonsHeight = buttons.length * (buttonHeight + layoutMargin) - layoutMargin;
			var currentTop = middle.y - stackedButtonsHeight / 2;

			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				var buttonX = middle.x - button.visibleWidth / 2
					,buttonY = currentTop;
				
				button.moveTo(buttonX, bottom.y + button.visibleHeight);
				button.rotation = animRotation;
				button.animation = this.gfx.addAnimation()
					.delay(animStagger * i).duration(animDuration).easeOut('quint')
					.move(button, { x: buttonX, y: buttonY })
					.rotate(button, 0)
				;
				
				currentTop += button.visibleHeight + layoutMargin;
			}
		}
		,_leaveButtons: function(buttons, isBackNavigation) {
			var animRotation = 30
				,animStagger = 0.1
				,animDuration = 0.25
				;
			var top = this.gfx.getHudPoint('top');
			
			var buttonWidth = buttons[0].visibleWidth
				,buttonHeight = buttons[0].visibleHeight
				;
			top.x -= buttonWidth / 2;
			top.y -= buttonHeight * 1.5;
			
			var lastAnimation;
			
			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				if (button.animation) 
					button.animation.cancelAnimation();
				button.animation = this.gfx.addAnimation()
					.delay(animStagger * i).duration(animDuration).easeOut('quint')
					.move(button, top)
					.rotate(animRotation)
				;
				if (isBackNavigation)
					button.animation.queueDispose(button);
				
				lastAnimation = button.animation;
			}
			return lastAnimation;
		}

		,_loadStartMenu: function() {
			var startButton = this.gfx.createButton("Start Game", this._startArcadeGame.bind(this));
			var gameOptions = this.gfx.createButton("Game Options", this._loadGameOptions.bind(this));
			
			this._loadButtons([startButton, gameOptions]);
		}
		,_startArcadeGame: function() {
			this._leaveButtons(this.buttonStack.pop()).queue(function() {
				this.fireSceneEvent(StartMenuEvents.onStartArcadeGame);
			}.bind(this));
		}
		
		,_loadGameOptions: function() {
			var option1 = this.gfx.createButton("Option 1", this._goBack.bind(this));
			var option2 = this.gfx.createButton("Option 2", this._goBack.bind(this));
			var option3 = this.gfx.createButton("Option 3", this._goBack.bind(this));
			
			this._loadButtons([option1, option2, option3]);
		}
	});
	XQuestGame.StartMenu.prototype.implementSceneEvents(StartMenuEvents);
})();
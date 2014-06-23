(function init_StartMenu() {
	var BaseMenuEvents = {
		onMenuExit: 'MenuExit'
	};
	
	XQuestGame.BaseMenu = Smart.Class(new XQuestGame.BaseScene(), {
		BaseMenu_initialize: function (gfx) {
			this.BaseScene_initialize();
			this.buttonStack = [];			
			this.gfx = gfx;
			this.addSceneItem(this.gfx);
		}
		,loadButtons: function(buttons) {
			var isBackNavigation = false;
			if (this.buttonStack.length) {
				var currentButtons = this.buttonStack[this.buttonStack.length - 1];
				this._leaveButtons(currentButtons, isBackNavigation);
			}
			this.buttonStack.push(buttons);
			
			this._enterButtons(buttons, isBackNavigation);
		}
		,goBack: function() {
			if (this.buttonStack.length) {
				var isBackNavigation = true;
				this._leaveButtons(this.buttonStack.pop(), isBackNavigation);
				
				var currentButtons = this.buttonStack[this.buttonStack.length - 1];
				this._enterButtons(currentButtons, isBackNavigation)
			}
		}
		,exitMenu: function(callback) {
			var currentButtons = this.buttonStack.pop();
			this.buttonStack.length = 0;
			this._leaveButtons(currentButtons).queue(function() {
				this.fireSceneEvent(BaseMenuEvents.onMenuExit);
				callback();
			}.bind(this));
		}
		,_enterButtons: function(buttons, isBackNavigation) {
			var layoutMargin = 20
				, animRotation = 30
				, animStagger = 0.25
				, animDuration = 1
				;
			
			var entrance = this.gfx.getHudPoint('bottom');
			var middle = this.gfx.getHudPoint('middle');


			var buttonHeight = buttons[0].visibleHeight;
			entrance.y += buttonHeight * 2;
			var stackedButtonsHeight = (buttons.length - 1) * (buttonHeight + layoutMargin);
			var currentTop = middle.y - stackedButtonsHeight / 2;

			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				var buttonX = middle.x
					,buttonY = currentTop;
				
				button.moveTo(entrance.x, entrance.y);
				button.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
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

			var buttonWidth = buttons[0].visibleWidth
				,buttonHeight = buttons[0].visibleHeight;
			var exit = this.gfx.getHudPoint('top');
			exit.y -= buttonHeight * 2;
			
			var lastAnimation;
			
			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				if (button.animation) 
					button.animation.cancelAnimation();
				button.animation = this.gfx.addAnimation()
					.delay(animStagger * i).duration(animDuration).easeOut('quint')
					.move(button, exit)
					.rotate(animRotation)
				;
				if (isBackNavigation)
					button.animation.queueDispose(button);
				
				lastAnimation = button.animation;
			}
			return lastAnimation;
		}
	});
	
	XQuestGame.BaseMenu.prototype.implementSceneEvents(BaseMenuEvents);
})();
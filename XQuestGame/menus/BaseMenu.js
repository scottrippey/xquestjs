(function init_StartMenu() {
	var BaseMenuEvents = {
		onMenuExit: 'MenuExit'
	};
	
	XQuestGame.BaseMenuInputs = {
		menuUp: 'menuUp',
		menuDown: 'menuDown',
		menuLeft: 'menuLeft',
		menuRight: 'menuRight',
		menuInvoke: 'menuInvoke',
		menuBack: 'menuBack'
	};
	
	XQuestGame.BaseMenu = Smart.Class(new XQuestGame.BaseScene(), {
		BaseMenu_initialize: function (gfx) {
			this.BaseScene_initialize();
			this.buttonStack = [];
			this.gfx = gfx;
		}

		,loadButtons: function(buttons) {
			if (this.currentButtons) {
				this._leaveButtons(this.currentButtons, false);
			}
			this.buttonStack.push(buttons);
			this.currentButtons = buttons;
			this._setActiveButtonIndex(0);
			
			this._enterButtons(buttons, false);
		}
		,goBack: function() {
			if (this.buttonStack.length >= 2) {
				this._leaveButtons(this.buttonStack.pop(), true);
				
				this.currentButtons = this.buttonStack[this.buttonStack.length - 1];
				this.currentButtons.forEach(function(button, index) {
					if (button.isActive)
						this.activeIndex = index;
				}, this);

				this._enterButtons(this.currentButtons, true)
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
			
			var buttonHeight = buttons[0].visibleHeight;

			var fromTop = isBackNavigation;

			var entrance = this.gfx.getHudPoint(fromTop ? 'top' : 'bottom');
			entrance.y += buttonHeight * (fromTop ? -2 : 2);

			var middle = this.gfx.getHudPoint('middle');
			var stackedButtonsHeight = (buttons.length - 1) * (buttonHeight + layoutMargin);
			var currentTop = middle.y - stackedButtonsHeight / 2;

			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				var buttonX = middle.x
					,buttonY = currentTop;
				
				button.moveTo(entrance.x, entrance.y);
				button.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
				button.animation = this.gfx.addAnimation()
					.delay(animStagger * (fromTop ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(button, { x: buttonX, y: buttonY })
					.rotate(button, 0)
				;
				
				currentTop += button.visibleHeight + layoutMargin;
			}
		}
		,_leaveButtons: function(buttons, isBackNavigation) {
			var animRotation = 30
				,animStagger = 0.1
				,animDuration = 0.5
				;
			var toBottom = isBackNavigation;

			var buttonHeight = buttons[0].visibleHeight;
			var exit = this.gfx.getHudPoint(toBottom ? 'bottom' : 'top');
				exit.y += buttonHeight * (toBottom ? 2 : -2);

			var lastAnimation;
			
			for (var i = 0, l = buttons.length; i < l; i++) {
				var button = buttons[i];
				if (button.animation) 
					button.animation.cancelAnimation();
				button.animation = this.gfx.addAnimation()
					.delay(animStagger * (toBottom ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(button, exit)
					.rotate(animRotation)
				;
				if (isBackNavigation)
					button.animation.queueDispose(button);
				
				lastAnimation = button.animation;
			}
			return lastAnimation;
		}

		,onMove: function(tickEvent, inputState) {
			if (inputState.menuDown) {
				this._moveActiveButtonIndex(1);
			} else if (inputState.menuUp) {
				this._moveActiveButtonIndex(-1);
			}
			
			if (inputState.menuInvoke) {
				var currentButton = this._getActiveButton();
				if (currentButton && currentButton.onInvoke) {
					currentButton.onInvoke();
				}
			}
			if (inputState.menuBack && this.buttonStack.length >= 2) {
				this.goBack();
			}
		}

		,createMenuButton: function(text, onInvoke) {
			var buttonGfx = this.gfx.createMenuButton(text);
			buttonGfx.addButtonEvents({
				invoke: onInvoke
				, hoverEnter: this._setActiveButton.bind(this, buttonGfx)
				, hoverLeave: this._setActiveButtonIndex.bind(this, -1)
			});
			buttonGfx.onInvoke = onInvoke;
			return buttonGfx;
		}
		,_setActiveButton: function(activeButton) {
			var activeButtonIndex = this.currentButtons.indexOf(activeButton);
			this._setActiveButtonIndex(activeButtonIndex);
		}
		,_moveActiveButtonIndex: function(offset) {
			var activeButtonIndex = this.activeIndex + offset;
			// Loop:
			if (activeButtonIndex < 0) activeButtonIndex += this.currentButtons.length;
			if (activeButtonIndex >= this.currentButtons.length) activeButtonIndex -= this.currentButtons.length;
			
			this._setActiveButtonIndex(activeButtonIndex);
		}
		,_setActiveButtonIndex: function(activeButtonIndex) {
			var currentButtons = this.currentButtons;
			for (var i = 0, l = currentButtons.length; i < l; i++) {
				var button = currentButtons[i];

				var isActive = (i === activeButtonIndex);
				button.setActive(isActive);
			}
			this.activeIndex = activeButtonIndex;
		}
		,_getActiveButton: function() {
			return this.currentButtons[this.activeIndex] || null;
		}
		


	});
	
	XQuestGame.BaseMenu.prototype.implementSceneEvents(BaseMenuEvents);
})();
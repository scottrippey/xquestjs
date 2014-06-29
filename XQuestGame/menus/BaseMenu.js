(function init_BaseMenu() {
	XQuestGame.BaseMenu = Smart.Class(new Smart.Events(), {
		initialize: function(menuScene) {
			this.BaseMenu_initialize(menuScene);
		}
		,BaseMenu_initialize: function(menuScene) {
			this.menuScene = menuScene;
			this.activeRowIndex = 0;
			this.rows = this.getRows();
			this._setActiveRowIndex(this.activeRowIndex);
		}
		,
		/** @protected @mustOverride */
		getRows: function() {
			return [];
		}
		,createMenuButton: function(text, onInvoke) {
			var buttonRow = this.menuScene.gfx.createMenuButton(text);
			buttonRow.addButtonEvents({
				invoke: onInvoke
				, hoverEnter: this._setActiveRow.bind(this, buttonRow)
				, hoverLeave: this._setActiveRowIndex.bind(this, -1)
			});
			buttonRow.invoke = onInvoke;
			return buttonRow;
		}
	
		,menuEnter: function(isBackNavigation) {
			this._enterRows(this.rows, isBackNavigation);
		}
		,menuLeave: function(isBackNavigation) {
			return this._leaveRows(this.rows, isBackNavigation);
		}
		,_enterRows: function(rows, isBackNavigation) {
			var layoutMargin = 20
				, animRotation = 30
				, animStagger = 0.25
				, animDuration = 1
				;
			
			var rowHeight = rows[0].visibleHeight;
	
			var fromTop = isBackNavigation;
	
			var entrance = this.menuScene.gfx.getHudPoint(fromTop ? 'top' : 'bottom');
			entrance.y += rowHeight * (fromTop ? -2 : 2);
	
			var middle = this.menuScene.gfx.getHudPoint('middle');
			var stackedRowsHeight = (rows.length - 1) * (rowHeight + layoutMargin);
			var currentTop = middle.y - stackedRowsHeight / 2;
	
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				var rowX = middle.x
					,rowY = currentTop;
				
				row.moveTo(entrance.x, entrance.y);
				row.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animStagger * (fromTop ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(row, { x: rowX, y: rowY })
					.rotate(row, 0)
				;
				
				currentTop += row.visibleHeight + layoutMargin;
			}
		}
		,_leaveRows: function(rows, isBackNavigation) {
			var animRotation = 30
				,animStagger = 0.1
				,animDuration = 0.5
				;
			var toBottom = isBackNavigation;
	
			var rowHeight = rows[0].visibleHeight;
			var exit = this.menuScene.gfx.getHudPoint(toBottom ? 'bottom' : 'top');
				exit.y += rowHeight * (toBottom ? 2 : -2);
	
			var lastAnimation;
			
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				if (row.animation) 
					row.animation.cancelAnimation();
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animStagger * (toBottom ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(row, exit)
					.rotate(animRotation)
				;
				if (isBackNavigation)
					row.animation.queueDispose(row);
				
				lastAnimation = row.animation;
			}
			return lastAnimation;
		}
	
		,menuInput: function(inputState) {
			if (inputState.menuUp || inputState.menuLeft)
				this._moveActiveRowIndex(-1);
			else if (inputState.menuDown || inputState.menuRight)
				this._moveActiveRowIndex(1);
			
			if (inputState.menuInvoke)
				this._invokeActiveRow();
			
		}
		,_moveActiveRowIndex: function(offset) {
			var activeRowIndex = this.activeRowIndex + offset;
			// Loop:
			if (activeRowIndex < 0) activeRowIndex += this.rows.length;
			if (activeRowIndex >= this.rows.length) activeRowIndex -= this.rows.length;
			
			this._setActiveRowIndex(activeRowIndex);
		}
		
		,_setActiveRow: function(activeRow) {
			var activeRowIndex = this.rows.indexOf(activeRow);
			this._setActiveRowIndex(activeRowIndex);
		}
		,_setActiveRowIndex: function(activeRowIndex) {
			var rows = this.rows;
			for (var i = 0, l = rows.length; i < l; i++) {
				rows[i].setActive(i === activeRowIndex);
			}
			this.activeRowIndex = activeRowIndex;
		}
		,_getActiveRow: function() {
			return this.rows[this.activeRowIndex] || null;
		}
		,_invokeActiveRow: function() {
			var activeRow = this._getActiveRow();
			if (activeRow)
				activeRow.invoke();
			
		}
	
		
	});
})();
	
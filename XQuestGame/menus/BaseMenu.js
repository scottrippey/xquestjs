(function init_BaseMenu() {
	XQuestGame.BaseMenu = Smart.Class(new Smart.Events(), {
		initialize(menuScene) {
			if (menuScene)
				this.BaseMenu_initialize(menuScene);
		},
		BaseMenu_initialize(menuScene) {
			this.menuScene = menuScene;
			this.activeRowIndex = -1;
			this.rows = this.getRows();
			this._moveActiveRowIndex(1);
		},

		/** @protected @mustOverride */
		getRows() {
			return [];
		},

		/**
		 *
		 * @param {string|function():string} text
		 * @param {function()} onInvoke
		 * @returns {MenuButton}
		 */
		createMenuButton(text, onInvoke) {
			var isUpdatableText = (typeof text === 'function');
			var buttonRow = this.menuScene.gfx.createMenuButton(isUpdatableText ? "" : text);
			buttonRow.addButtonEvents({
				invoke: onInvoke,
				hoverEnter: this._setActiveRow.bind(this, buttonRow),
				hoverLeave: this._setActiveRowIndex.bind(this, -1)
			});
			buttonRow.invoke = onInvoke;
			if (isUpdatableText) {
				buttonRow.updateText = () => {
					var updatedText = text();
					buttonRow.setText(updatedText);
				};
				buttonRow.updateText();
			}
			return buttonRow;
		},


		menuEnter(isBackNavigation) {
			if (this.onMenuEnter) this.onMenuEnter(isBackNavigation);
			this.layoutRows(this.rows, isBackNavigation);
			this.flyInRows(this.rows, isBackNavigation);
		},

		/**
		 * @overridable
		 * @protected
		 */
		layoutRows(rows, isBackNavigation) {
			var layoutMargin = 20;

			var middle = this.menuScene.gfx.getHudPoint('middle');
			var stackedRowsHeight = -layoutMargin;
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				stackedRowsHeight += layoutMargin + row.visibleHeight;
			}


			var currentTop = middle.y - stackedRowsHeight / 2;
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];

				row.moveTo(middle.x, currentTop);

				currentTop += row.visibleHeight + layoutMargin;
			}
		},

		/**
		 * @overridable
		 * @protected
		 */
		flyInRows(rows, isBackNavigation, delay) {
            var animRotation = 30;
            var animStagger = 0.25;
            var animDuration = 1;
            var animDelay = delay || 0;

            var fromTop = isBackNavigation;
            var entrance = this.menuScene.gfx.getHudPoint(fromTop ? 'top' : 'bottom');

            for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				var destination = { x: row.x, y: row.y };

				var safeHeight = row.visibleHeight * (fromTop ? -2 : 2);

				row.moveTo(row.x, entrance.y + safeHeight);
				row.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animDelay + animStagger * (fromTop ? l - i : i)).duration(animDuration).easeOut('quint')
					.move(row, destination)
					.rotate(row, 0)
				;
			}
        },

		menuLeave(isBackNavigation) {
			if (this.onMenuLeave) this.onMenuLeave(isBackNavigation);
			return this.flyOutRows(this.rows, isBackNavigation);
		},
		/**
		 * @overridable
		 * @protected
		 */
		flyOutRows(rows, isBackNavigation) {
            var animRotation = 30;
            var animStagger = 0.1;
            var animDuration = 0.5;
            var toBottom = isBackNavigation;

            var exit = this.menuScene.gfx.getHudPoint(toBottom ? 'bottom' : 'top');

            var lastAnimation;

            for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				var rowHeight = row.visibleHeight;
				var safeHeight = rowHeight * (toBottom ? 2 : -2);

				if (row.animation)
					row.animation.cancelAnimation();
				row.animation = this.menuScene.gfx.addAnimation()
					.delay(animStagger * (toBottom ? l-i : i)).duration(animDuration).easeOut('quint')
					.move(row, { x: row.x, y: exit.y + safeHeight})
					.rotate(animRotation)
				;
				if (isBackNavigation)
					row.animation.queueDispose(row);

				lastAnimation = row.animation;
			}
            return lastAnimation;
        },


		menuInput(inputState) {
			if (inputState.menuUp || inputState.menuLeft)
				this._moveActiveRowIndex(-1);
			else if (inputState.menuDown || inputState.menuRight)
				this._moveActiveRowIndex(1);

			if (inputState.menuInvoke)
				this._invokeActiveRow();

		},
		_moveActiveRowIndex(direction) {
			var activeRowIndex = this.activeRowIndex;
			while (true) {
				activeRowIndex = activeRowIndex + direction;
				// Cycle top-to-bottom:
				if (activeRowIndex < 0) activeRowIndex += this.rows.length;
				if (activeRowIndex >= this.rows.length) activeRowIndex -= this.rows.length;

				var currentRow = this.rows[activeRowIndex];
				var isSelectable = currentRow.setActive;
				if (isSelectable) {
					break;
				} else if (activeRowIndex === this.activeRowIndex) {
					// Safeguard against infinite loops:
					break;
				}
			}

			this._setActiveRowIndex(activeRowIndex);
		},

		_setActiveRow(activeRow) {
			var activeRowIndex = this.rows.indexOf(activeRow);
			this._setActiveRowIndex(activeRowIndex);
		},
		_setActiveRowIndex(activeRowIndex) {
			var rows = this.rows;
			for (var i = 0, l = rows.length; i < l; i++) {
				var row = rows[i];
				if (row.setActive) {
					row.setActive(i === activeRowIndex);
				}
			}
			this.activeRowIndex = activeRowIndex;
		},
		_getActiveRow() {
			return this.rows[this.activeRowIndex] || null;
		},
		_invokeActiveRow() {
			var activeRow = this._getActiveRow();
			if (activeRow && activeRow.invoke)
				activeRow.invoke();

		}


	});
})();

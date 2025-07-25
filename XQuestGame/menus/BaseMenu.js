import { Events } from "@/Tools/Smart.Events.js";

export class BaseMenu extends Events {
  constructor(menuScene) {
    super();
    if (menuScene) this.BaseMenu_initialize(menuScene);
  }
  BaseMenu_initialize(menuScene) {
    this.menuScene = menuScene;
    this.activeRowIndex = -1;
    this.rows = this.getRows();
    this._moveActiveRowIndex(1);
  }

  /** @protected @mustOverride */
  getRows() {
    return [];
  }

  /**
   *
   * @param {string|function():string} text
   * @param {function()} onInvoke
   * @returns {MenuButton}
   */
  createMenuButton(text, onInvoke) {
    const isUpdatableText = typeof text === "function";
    const buttonRow = this.menuScene.gfx.createMenuButton(isUpdatableText ? "" : text);
    buttonRow.addButtonEvents({
      invoke: onInvoke,
      hoverEnter: this._setActiveRow.bind(this, buttonRow),
      hoverLeave: this._setActiveRowIndex.bind(this, -1),
    });
    buttonRow.invoke = onInvoke;
    if (isUpdatableText) {
      buttonRow.updateText = () => {
        const updatedText = text();
        buttonRow.setText(updatedText);
      };
      buttonRow.updateText();
    }
    return buttonRow;
  }

  menuEnter(isBackNavigation) {
    if (this.onMenuEnter) this.onMenuEnter(isBackNavigation);
    this.layoutRows(this.rows, isBackNavigation);
    this.flyInRows(this.rows, isBackNavigation);
  }

  /**
   * @overridable
   * @protected
   */
  layoutRows(rows, isBackNavigation) {
    const layoutMargin = 20;

    const middle = this.menuScene.gfx.getHudPoint("middle");
    let stackedRowsHeight = -layoutMargin;
    for (let i = 0, l = rows.length; i < l; i++) {
      const row = rows[i];
      stackedRowsHeight += layoutMargin + row.visibleHeight;
    }

    let currentTop = middle.y - stackedRowsHeight / 2;
    for (let i = 0, l = rows.length; i < l; i++) {
      const row = rows[i];

      row.moveTo(middle.x, currentTop);

      currentTop += row.visibleHeight + layoutMargin;
    }
  }

  /**
   * @overridable
   * @protected
   */
  flyInRows(rows, isBackNavigation, delay) {
    const animRotation = 30;
    const animStagger = 0.25;
    const animDuration = 1;
    const animDelay = delay || 0;

    const fromTop = isBackNavigation;
    const entrance = this.menuScene.gfx.getHudPoint(fromTop ? "top" : "bottom");

    for (let i = 0, l = rows.length; i < l; i++) {
      const row = rows[i];
      const destination = { x: row.x, y: row.y };

      const safeHeight = row.visibleHeight * (fromTop ? -2 : 2);

      row.moveTo(row.x, entrance.y + safeHeight);
      row.rotation = animRotation * (i % 2 === 0 ? 1 : -1);
      row.animation = this.menuScene.gfx
        .addAnimation()
        .delay(animDelay + animStagger * (fromTop ? l - i : i))
        .duration(animDuration)
        .easeOut("quint")
        .move(row, destination)
        .rotate(row, 0);
    }
  }

  menuLeave(isBackNavigation) {
    if (this.onMenuLeave) this.onMenuLeave(isBackNavigation);
    return this.flyOutRows(this.rows, isBackNavigation);
  }
  /**
   * @overridable
   * @protected
   */
  flyOutRows(rows, isBackNavigation) {
    const animRotation = 30;
    const animStagger = 0.1;
    const animDuration = 0.5;
    const toBottom = isBackNavigation;

    const exit = this.menuScene.gfx.getHudPoint(toBottom ? "bottom" : "top");

    let lastAnimation;

    for (let i = 0, l = rows.length; i < l; i++) {
      const row = rows[i];
      const rowHeight = row.visibleHeight;
      const safeHeight = rowHeight * (toBottom ? 2 : -2);

      if (row.animation) row.animation.cancelAnimation();
      row.animation = this.menuScene.gfx
        .addAnimation()
        .delay(animStagger * (toBottom ? l - i : i))
        .duration(animDuration)
        .easeOut("quint")
        .move(row, { x: row.x, y: exit.y + safeHeight });
      if (isBackNavigation) row.animation.queueDispose(row);

      lastAnimation = row.animation;
    }
    return lastAnimation;
  }

  menuInput(inputState) {
    if (inputState.menuUp || inputState.menuLeft) this._moveActiveRowIndex(-1);
    else if (inputState.menuDown || inputState.menuRight) this._moveActiveRowIndex(1);

    if (inputState.menuInvoke) this._invokeActiveRow();
  }
  _moveActiveRowIndex(direction) {
    let activeRowIndex = this.activeRowIndex;
    while (true) {
      activeRowIndex = activeRowIndex + direction;
      // Cycle top-to-bottom:
      if (activeRowIndex < 0) activeRowIndex += this.rows.length;
      if (activeRowIndex >= this.rows.length) activeRowIndex -= this.rows.length;

      const currentRow = this.rows[activeRowIndex];
      const isSelectable = currentRow.setActive;
      if (isSelectable) {
        break;
      } else if (activeRowIndex === this.activeRowIndex) {
        // Safeguard against infinite loops:
        break;
      }
    }

    this._setActiveRowIndex(activeRowIndex);
  }

  _setActiveRow(activeRow) {
    const activeRowIndex = this.rows.indexOf(activeRow);
    this._setActiveRowIndex(activeRowIndex);
  }
  _setActiveRowIndex(activeRowIndex) {
    const rows = this.rows;
    for (let i = 0, l = rows.length; i < l; i++) {
      const row = rows[i];
      if (row.setActive) {
        row.setActive(i === activeRowIndex);
      }
    }
    this.activeRowIndex = activeRowIndex;
  }
  _getActiveRow() {
    return this.rows[this.activeRowIndex] || null;
  }
  _invokeActiveRow() {
    const activeRow = this._getActiveRow();
    if (activeRow && activeRow.invoke) {
      activeRow.invoke();
    }
  }
}

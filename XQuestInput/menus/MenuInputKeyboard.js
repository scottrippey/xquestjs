(function() {
	
	var menuKeyMap = {
		up: XQuestGame.BaseMenuInputs.menuUp,
		down: XQuestGame.BaseMenuInputs.menuDown,
		left: XQuestGame.BaseMenuInputs.menuLeft,
		right: XQuestGame.BaseMenuInputs.menuRight,
		enter: XQuestGame.BaseMenuInputs.menuInvoke,
		escape: XQuestGame.BaseMenuInputs.menuBack,
		backspace: XQuestGame.BaseMenuInputs.menuBack
	};
	
	XQuestInput.MenuInputKeyboard = Smart.Class({
		initialize: function(element) {
			this.element = element || document;
			this.actionsQueue = [];
			this._setupKeyMap();
			
			
			this.keyMapper.setKeyMap(menuKeyMap);
		}
		,_setupKeyMap: function() {
			this.keyMapper = new XQuestInput.KeyMapper(this.element, this._onActionDown.bind(this));
		}
		,_onActionDown: function(actionName) {
			this.actionsQueue.push(actionName);
		}
		,onInput: function(tickEvent, inputState) {
			for (var i = 0, l = this.actionsQueue.length; i < l; i++) {
				var actionName = this.actionsQueue[i];
				inputState[actionName] = true;
			}
			this.actionsQueue.length = 0;
		}
	});
})();
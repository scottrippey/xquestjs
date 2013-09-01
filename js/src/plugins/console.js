var console = window.console || {};

var noop = function(){};
_.forEach([ 'log','debug','warn','error','assert' ], function(consoleMethod) {
	if (!consoleMethod in console) {
		console[consoleMethod] = noop;
	}
});

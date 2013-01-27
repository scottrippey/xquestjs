var console = window.console || {};

var noop = function(){};
Array.each([ 'log','debug','warn','error','assert' ], function(consoleMethod) {
	if (!consoleMethod in console) {
		console[consoleMethod] = noop;
	}
});
module.exports = function(grunt) {
	grunt.registerTask('index', [ 'concat:INDEX-HTML-TEMPLATE' ]);
	grunt.mergeConfig({
		concat: {
			'INDEX-HTML-TEMPLATE': {
				options: { process: true }
				, src: [ 'templates/index.html.template' ]
				, dest: '../index.html'
			}
		}
	});
};
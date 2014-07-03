module.exports = function(grunt) {
	
	grunt.registerTask('tests', [ 'jasmine' ]);
	
	grunt.mergeConfig({
		jasmine: {
			'SMART': {
				src: [ 
					'<%= sources.common.vendor %>'
					,'<%= sources.common.Smart %>'
					,'<%= sources.common.SmartAnimation %>'
					,'<%= sources.common.extensions %>'
				]
				, options: {
					specs: 'tests/common/Smart/**/*.js'
				}
			}
		}
	});
};
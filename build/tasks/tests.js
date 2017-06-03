module.exports = function(grunt) {

	grunt.registerTask('tests', [ 'jasmine:SMART' ]);

	grunt.mergeConfig({
		jasmine: {
			'SMART': {
				src: [
					'<%= sources.common.vendor %>',
					'<%= sources.common.Smart %>',
					'<%= sources.common.SmartAnimation %>',
					'<%= sources.common.extensions %>'
				],
				options: {
					specs: 'tests/common/Smart/**/*.js'
				}
			}
		},
		watch: {
			'TESTS': {
				files: [ '<%= jasmine.SMART.src %>', '<%= jasmine.SMART.options.specs %>' ],
				tasks: [ 'tests' ]
			}
		}
	});
};

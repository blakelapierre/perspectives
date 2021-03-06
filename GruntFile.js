module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		bgShell: {
			_defaults: {
				bg: true
			},
			startServer: {
				cmd: 'node server.js',
				bg: false
			},
			startClient: {
				cmd: 'start http://localhost:35711'
			}
		}
	});

	grunt.loadNpmTasks('grunt-bg-shell');

	grunt.registerTask('default' , '', function(numberClients) {
		numberClients = numberClients || 1;

		for (var i = 0; i < numberClients; ++i) {
			grunt.task.run('bgShell:startClient');
		}
		grunt.task.run('bgShell:startServer');
	});
};
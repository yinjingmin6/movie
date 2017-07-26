module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schema/**/*.js'],
				// tasks: ['jshint'],
				options: {
					// 当文件出现改动的时候，重新启动服务
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['node_modules/**', '.DS_Store', 'README.md'],
					watchedExtensions: ['js'],
					watchedFolders: ['app', 'config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname

				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	})
	// 只有有文件添加、删除或修改就在重新执行注册的任务
	grunt.loadNpmTasks('grunt-contrib-watch')
	// 实时监听入口文件 如果有改动 会自动重启 对app.js的一个包装
	grunt.loadNpmTasks('grunt-nodemon')
	// 优化慢任务（如less）的构建事件，可以跑多个阻塞的任务
	grunt.loadNpmTasks('grunt-concurrent')
	// 避免因为语法错误或警告中断grunt的整个服务
	grunt.option('force', true)
	grunt.registerTask('default', ['concurrent'])
}
var Movie = require('../models/movie.js')
var User = require('../models/user.js')
var _ = require('underscore')

module.exports = function(app) {
	// 预处理
	app.use(function(req, res, next) {
		// 每次刷新首页的时候都会重新动态的从session里面取user的数据
		var _user = req.session.user
		if(_user) {
			app.locals.user = _user
		}
		return next()
	})
	// index page
	app.get('/', function(req, res) {
		console.log('user in session')
		console.log(req.session.user)
		Movie.fetch(function(err, movies) {
			if(err) {
				console.log(err)
			}
			res.render('index', {
				title: 'movie 首页+++1',
				movies: movies
			})
		})
	});
	// admin page
	app.get('/admin/movie', function(req, res) {
		res.render('admin', {
			title: 'movie admin',
			movie: {
	      	title: '',
	      	doctor: '',
	      	country: '',
	      	year: '',
	      	poster: '',
	      	flash: '',
	      	summary: '',
	      	language: ''
	    }
		})
	});
	// admin update movie
	app.get('/admin/update/:id', function(req, res) {
		var id = req.params.id
		if(id) {
			Movie.findById(id, function(err, movie) {
				res.render('admin', {
					title: '后台更新页',
					movie: movie
				})
			})
		}
	});
	// admin post movie
	app.post('/admin/movie/new', function(req, res) {
		var id = req.body.movie._id
		var movieObj = req.body.movie
		var _movie
		if(id !== 'undefined') {
			Movie.findById(id, function(err, movie) {
				if(err) {
					console.log(err)
				}
				_movie = _.extend(movie, movieObj)
				_movie.save(function(err, movie) {
					if(err) {
						console.log(err)
					}
					// 将页面重定向到详情页
					res.redirect('/movie/'+ movie._id)
				})
			})
		} else {
			_movie = new Movie({
				title: movieObj.title,
			    doctor: movieObj.doctor,
			    country: movieObj.country,
			    year: movieObj.year,
			    poster: movieObj.poster,
			    flash: movieObj.flash,
			    summary: movieObj.summary,
			    language: movieObj.language
			})
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err)
				}
					// 将页面重定向到详情页
				res.redirect('/movie/'+ movie._id)
			})
		}
	});
	// signup
	app.post('/user/signup', function(req, res) {
		// body-parser这个中间件可以将post的body里面的内容初始化为一个对象
		var _user = req.body.user
		// 通过req.param(user)也可以拿到user
		// '/user/signup/:userId' 可以通过req.params.userId拿到路由参数
		// '/user/signup/11?userId=123' 可以通过req.query.userId拿到参数
		// 如果要获取异步提交data的内容，使用 req.body.userId
		// 如果url是'/user/signup/11?userId=123'，且异步提交data的内容有{userId=123456}
		// ze通过req.param('userId')拿到的是哪个值呢？
		// express内部的优先级顺序： 路由>body>query
		console.log(req.body.user)
		// 避免用户名重复
		User.findOne({name: _user.name}, function(err, user) {
			if(err) {
				console.log(err)
			}
			if(user) {
				console.log('用户名已存在')
				return res.redirect('/')
			} else {
				var user1 = new User(_user)
				user1.save(function(err, user1) {
					if(err) {
						console.log(err)
					}
					console.log(user1)
					res.redirect('/admin/userlist')
				})
			}
		})
	})
	// signin
	app.post('/user/signin', function(req, res) {
		// 拿到表单里提交过来的user信息
		var _user = req.body.user
		var name = _user.name
		var password = _user.password
		User.findOne({name: name}, function(err, user) {
			if(err) {
				console.log("查找用户名错误：" + err)
			}
			// 如果用户不存在，则返回首页
			if(!user) {
				return res.redirect('/')
			}
			// 判断密码是否匹配
			user.comparePassword(password, function(err, isMatch) {
				if(err) {
					console.log("用户密码匹配错误：" + err)
				}
				// 如果匹配 跳到首页
				if(isMatch) {
					req.session.user = user
					console.log('Password is matched')
					return res.redirect('/')
				} else {
					console.log('Password is not matched')
				}
			})
		})
	})
	// /loginout登出，删除登录信息
	app.get('/loginout', function(req, res) {
		delete req.session.user
		// 登出之后，如果不删除app.locals.user，那页面底部的‘登出’不会改变显示为‘登录’
		delete app.locals.user
		res.redirect('/')
	})
	// userlist page
	app.get('/admin/userlist', function(req, res) {
		Movie.fetch(function(err, users) {
			if(err) {
				console.log(err)
			}
			res.render('userlist', {
				title: '用户列表页',
				users: users
			})
		})
	})
	// detail page
	app.get('/movie/:id', function(req, res) {
		var id = req.params.id
		Movie.findById(id, function(err, movie) {
			res.render('detail', {
				title: 'movie 详情页'+movie.title,
				movie: movie
			})
		})
	})
	// list page
	app.get('/admin/list', function(req, res) {
		Movie.fetch(function(err, movies) {
			if(err) {
				console.log(err)
			}
			res.render('list', {
				title: 'yjm list page',
				movies: movies
			})
		})
	})
	// list delete movies
	app.delete('/admin/list', function(req, res) {
		var id = req.query.id
		if(id) {
			Movie.remove({_id: id}, function(err, movie) {
				if(err) {
					console.log(err)
				} else {
					// 如果没有问题 给客服端返回一段json数据success: 1
					res.json({success: 1})
				}
			})
		}
	})
}


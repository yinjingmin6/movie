var User = require('../models/user.js')
// userlist page
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '欢迎注册'
	})
}
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '欢迎登录'
	})
}
// signup
exports.signup = function(req, res) {
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
	// 避免用户名重复 使用find返回的users是一个数组 findOne返回的是第一条数据
	User.findOne({name: _user.name}, function(err, user) {
		if(err) {
			console.log(err)
		}
		if(user) {
			return res.redirect('/signin')
		} else {
			var user1 = new User(_user)
			user1.save(function(err, user1) {
				if(err) {
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})
};
	// signin
exports.signin = function(req, res) {
	// 拿到表单里提交过来的user信息
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	User.findOne({name: name}, function(err, user) {
		if(err) {
			console.log("查找用户名错误：" + err)
		}
		// 如果用户不存在，则重定向到signup页面
		if(!user) {
			return res.redirect('/signup')
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
				return res.redirect('/signin')
			}
		})
	})
}
	// /loginout登出，删除登录信息
exports.loginout = function(req, res) {
	delete req.session.user
	// 登出之后，如果不删除app.locals.user，那页面底部的‘登出’不会改变显示为‘登录’
	delete app.locals.user
	res.redirect('/')
}
// userlist page
exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if(err) {
			console.log(err)
		}
		res.render('userlist', {
			title: '用户列表页',
			users: users
		})
	})
}
// middleware for user singin
exports.signinRequired = function(req, res, next) {
	var user = req.session.user
	if(!user) {
		return res.redirect('/signin')
	}
	next()
}
// middleware for admin
exports.adminRequired = function(req, res, next) {
	var user = req.session.user
	if(user.role <= 10) {
		return res.redirect('/signin')
	}
	next()
}
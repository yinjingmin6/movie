// 引入路由控制文件
var Movie = require('../app/controllers/movie')
var User = require('../app/controllers/user')
var _ = require('underscore')
var Index = require('../app/controllers/index')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')

var multipart = require('connect-multiparty')
var multipartMiddleware = multipart()

module.exports = function(app) {
	// 预处理
	app.use(function(req, res, next) {
		// 每次刷新首页的时候都会重新动态的从session里面取user的数据
		var _user = req.session.user
		app.locals.user = _user
		return next()
	})
	// index page
	app.get('/', Index.index);

	// user
	// signup
	app.post('/user/signup', User.signup)
	app.post('/user/signin', User.signin)
	app.get('/signin', User.showSignin)
	app.get('/signup', User.showSignup)
	// /loginout登出，删除登录信息
	app.get('/loginout', User.loginout)
	// userlist page
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

	// Movie
	// admin new page
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	// admin update movie
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	// admin post movie
	app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	// detail page
	app.get('/movie/:id', Movie.detail)
	// list page
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
	// list delete movies
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

	// Comment
	app.post('/user/comment', User.signinRequired, Comment.save)

	// category 录入
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);

	// 保存
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

	// result
	app.get('/results', Index.search);
}


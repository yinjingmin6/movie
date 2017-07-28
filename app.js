var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
// mongoose.Promise = require('bluebird')
// var Movie = require('./models/movie.js')
// var User = require('./models/user.js')
// var _ = require('underscore')
// process是一个环境变量，用来获取环境变量或者外围传过来的参数
var port = process.env.PORT || 3000
// 启动一个服务器
var app = express()

var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var cookieParser = require('cookie-parser')
// var multipart = require('connect-multipart')
var session = require('express-session')
// 用于session持久化
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan');
var dbUrl = 'mongodb://localhost/movie'

// var dir = path.join(__dirname, './views/pages/');
// 为了解决node.js开发错误——DeprecationWarning: Mongoose: mpromise
mongoose.Promise = global.Promise
// 链接本地数据库
mongoose.connect(dbUrl, {useMongoClient:true})
// 设置视图的根目录
app.set('views', './app/views/pages')
// 设置默认的模板引擎
app.set('view engine', 'jade')
// app.use(express.bodyParser())

app.use(serveStatic('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser())
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.use(cookieParser())
app.use(session({
	secret: 'movie',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))
// 如果在开发环境下
if('development' === app.get('env')) {
	// 设置在屏幕上打印错误信息
	app.set('showStackError', true)
	// 一个请求的信息
	app.use(logger(':method :url :status'))
	// 现在页面上的源码都是压缩过的 我希望是格式化后的
	app.locals.pretty = true
	// 数据库的debug开关打开
	mongoose.set('debug', true)
}
require('./config/routes.js')(app)
app.listen(port)
console.log('server start on port '+ port)

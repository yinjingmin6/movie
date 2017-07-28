var Movie = require('../models/movie.js')
var Category = require('../models/category.js')
var count = 2
// 需要对所有的分类遍历 然后将分类下的电影生成一份电影列表数据
// index page
exports.index = function(req, res) {
	// options: {limit: 5}对电影的数据条目做一个限制，每条分类下取出5条数据
	Category.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categories) {
			if(err) {
				console.log(err)
			}
			// 传入相应数据 渲染页面
			res.render('index', {
				title: 'movie 首页+++1',
				categories: categories
			})
		})
		console.log('user in session')
		console.log(req.session.user)
}
// search
exports.search = function(req, res) {
	// 拿到关键词
	var catId = req.query.cat
	var q = req.query.q
	// 拿到分页
	var page = parseInt(req.query.p, 10) || 0
	// 从数据库开始查找的索引开始位置
	var index = page *count
	// 如果有catId 则认为是搜索某个分类
	if (catId) {
		// options: {limit: 5}对电影的数据条目做一个限制，每条分类下取出5条数据
		// 先拿到分类 然后对分类下的所有电影进行populate，现在查询到的个数 以及从那条数据开始查
		Category
			.find({_id: catId})
			.populate({path: 'movies', options: {limit: count, skip: index}})
			.exec(function(err, categories) {
				if(err) {
					console.log(err)
				}
				var category = categories[0] || {}
				// 取分类下的movies
				var movies = category.movies || {}
				// 从数组中将需要的部分取出来
				var results = movies.slice(index, index+count)
				// 传入相应数据 渲染页面
				res.render('results', {
					title: '结果列表页',
					ketword: category.name,
					// 参数里传的page参数p是从0开始的
					currentPage: page + 1,
					query: 'cat=' + catId,
					totalPage: Math.ceil(movies.length /count),
					movies: results
				})
			})
		} else {
			// 如果没有catId， 则认为是搜索电影 .find()里使用正则可以搜索类似关键词匹配的相关数据
			Movie
				.find({title: new RegExp(q+ '.*', 'i')})
				.exec(function(err, movies) {
				if(err) {
					console.log(err)
				}
				// 从数组中将需要的部分取出来
				var results = movies.slice(index, index+count)
				// 传入相应数据 渲染页面
				res.render('results', {
					title: '结果列表页',
					ketword: q,
					// 参数里传的page参数p是从0开始的
					currentPage: page + 1,
					query: 'q=' + q,
					totalPage: Math.ceil(movies.length /count),
					movies: results
				})
			})
		}
	
		console.log('user in session')
		console.log(req.session.user)
}
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Category = require('../models/category')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')
// admin new page
exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin', {
			title: 'movie admin后台录入页',
			categories: categories,
			movie: {}
		})
	})
};
	// admin update movie
exports.update = function(req, res) {
	var id = req.params.id
	if(id) {		
		Movie.findById(id, function(err, movie) {
			Category.find({}, function(err, categories) {
				res.render('admin', {
					title: '后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
};

// admin poster
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	// 用作判断 如果有originalFilename 则认为有图片传过来了
	var originalFilename = posterData.originalFilename

	console.log(req.files)
	if(originalFilename) {
		fs.readFile(filepath, function(err, data) {
			// 拿到时间戳
			var timestamp = Date.now()
			var type = posterData.type.split('')[1]
			var poster = imestamp + '.' + type
			// movie.js 相对于app的位置 ../../  文件放到 /public下
			var newPath = path.join(__dirname, '../../', '/public/upload'+ poster)
			fs.writeFile(newPath, data, function(err) {
				// 将写入成功的poster传给req
				req.poster = poster
				next()
			})
		})
	} else {
		// 如果没有文件上传的话 直接next()
		next()
	}
}


// admin post movie
exports.save = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie
	var _movie
	// 检查req里面有没有poster 如果有的话 就说明上一个流程里面存好了一个poster
	// 那就重新movieObj.poster
	if(req.poster) {
		movieObj.poster = req.poster
	}
	if(id) {
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
		_movie = new Movie(movieObj)
		// _movie = new Movie({
		// 	title: movieObj.title,
		// 	   doctor: movieObj.doctor,
		// 	   country: movieObj.country,
		// 	   year: movieObj.year,
		// 	   poster: movieObj.poster,
		// 	   flash: movieObj.flash,
		// 	   summary: movieObj.summary,
		// 	   language: movieObj.language
		// })
		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName
		_movie.save(function(err, movie) {
			if(err) {
				console.log(err)
			}
			console.log(movieObj)
			// 当categoryId与categoryName 都存在的时候 默认使用categoryId
			if (categoryId) {
				// 将电影的_id放入category
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)
					category.save(function(err, category) {
						// 将页面重定向到详情页
						res.redirect('/movie/'+ movie._id)
					})
				})
			} else if (categoryName){
				// 如果有categoryName，没有categoryId 则认为是新增一个分类
				var category = new Category({
					name: categoryName,
					// 新分类下的电影只有一条
					movies: [movie._id]
				})
				// 保存新增的电影分类
				category.save(function(err, category) {
					movie.category = category._id
					movie.save(function(err, movie) {
						// 将页面重定向到详情页
						res.redirect('/movie/'+ movie._id)
					})
				})		
			}
		})
	}
};	
	// detail page
exports.detail = function(req, res) {
	var id = req.params.id
	Movie.findById(id, function(err, movie) {
		Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
			if(err) {
				console.log(err)
			}
		})
		// 从Comment里查询哪些movieId跟当前详情页的movie是同一个，
		// 就拿到当前这条movie数据下的comments
		// 找到电影的评论数据 然后对每个评论数据进行populate方法
		// // 找到from里面的objectId，然后到user表里进行查找，返回name相应的数据
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				console.log('comments')
				console.log(comments)
				res.render('detail', {
					title: 'movie 详情页'+movie.title,
					movie: movie,
					comments:  comments
				})
			})
	})
}
	// list page
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err)
		}
		res.render('list', {
			title: 'yjm list page',
			movies: movies
		})
	})
}
	// list delete movies
exports.del = function(req, res) {
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
}

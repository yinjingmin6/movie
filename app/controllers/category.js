var Movie = require('../models/movie')
var Category = require('../models/category')
var _ = require('underscore')
// admin new page
exports.new = function(req, res) {
	res.render('category_admin', {
		title: 'admin后台电影分类录入页',
		category: {}
	})
};
	// admin post movie
exports.save = function(req, res) {
	var _category = req.body.category
	var category = new Category(_category)

	category.save(function(err, category) {
		if(err) {
			console.log(err)
		}
				// 将页面重定向到详情页
		res.redirect('/admin/category/list/')
	})
};
// category list
exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if(err) {
			console.log(err)
		}
		res.render('categorylist', {
			title: '分类列表页',
			categories: categories
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

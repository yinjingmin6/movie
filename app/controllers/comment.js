var Comment = require('../models/comment')

// comment post
exports.save = function(req, res) {

	var _comment = req.body.comment
	// 用于评论保存之后刷新页面 仍然能到原来的movie页面
	var movieId = _comment.movie
	// 判断提交过来的comment里面是否有cid
	// 正常下是没有的，只有在点击头像才会动态插入cid的隐藏域
	// // 如果有 则说明用户是要评论了 这个时候就不是new Comment了
	// 用户提交的字段除了原有的评论内容以外，还有评论给谁这个字段
	if(_comment.cid) {
		Comment.findById(_comment.cid, function(err, comment) {
			// 放具体的回复的内容
			var reply = {
				// 由谁进行回复的
				from: _comment.from,
				// 回复给谁
				to: _comment.tid,
				content: _comment.content
			}
			if(!comment.reply) comment.reply = []
			// 放入当前的comment的reply数组
			comment.reply.push(reply)
			// 在数组中新增一条回复内容之后 保存
			comment.save(function(err, comment) {
				if(err) {
					console.log(err)
				}
				res.redirect('/movie/' + movieId)
			})
		})
	} else {
		// 如果没有cid，则认为是一条简单的评论
		var comment = new Comment(_comment)
		comment.save(function(err, comment) {
			if(err) {
				console.log(err)
			} else {
				// 将页面重定向到movie页面
				res.redirect('/movie/'+ movieId)
			}
		})
	}
};

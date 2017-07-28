var mongoose = require('mongoose')
var CommentSchema = require('../schema/comment.js')
var Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment

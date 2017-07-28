var mongoose = require('mongoose')
var MovieSchema = require('../schema/movie.js')
var Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie

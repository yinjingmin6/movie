/*
* @Author: JMyin
* 测试用例
*/
// 
var crypto = require('crypto')
// 对密码进行加密
var bcrypt = require('bcrypt')

// 生成一个随机的字符串 为了测试user的时候有个名字
function getRandomString(len) {
	if(!len) len =16
	return crypto.randomBytes(Math.ceil(len /2).toString('hex'))
}

var should = require('should')
var app = require('../../app')
var mongoose = require('mongoose')
var User = require('../../app/models/user.js')
// var User = mongoose.model('User')
var user

// test
describe('<Unit Test', function() {
	describe('Model User:', function() {
		before(function(done) {
			user = {
				name: getRandomString(),
				password: 'password'
			}

			done()
		})

	})
	// 确定Model User 里面的 user.name 是不存在的
	describe('Before Method save:', function() {
		it('should begin without user', function(done) {
			User.find({name: user.name}, function(err, users) {
				users.should.have.length(0)

				done()
			})
		})
		
	})
	// 测试用户save的时候 没有问题
	describe('User save:', function() {
		it('should save without problems', function(done) {
			var _user = new User(user)

			_user.save(function(err) {
				should.not.exist(err)
				_user.remove(function(err) {
					should.not.exist(err)
					done()
				})
			})
		})
		// 测试 确定密码生成的时候没有问题
		it('should save without problems', function(done) {
			var password = user.password
			var _user = new User(user)

			_user.save(function(err) {
				should.not.exist(err)
				// 确定密码长度不为0
				_user.password.should.not.have.length(0)
				// password为原始密码, _user.password为加密后的密码
				bcrypt.compare(password, _user.password, function(err, isMatch) {
					should.not.exist(err)
					isMatch.should.equal(true)

					_user.remove(function(err) {
						should.not.exist(err)
						done()
					})
				})
			})
		})
		// 用户生成的时候权限为0
		it('should fail to save an existing user', function(done) {
			var _user1 = new User(user)
			_user1.save(function(err) {
				should.not.exist(err)
				var _user2 = new User(user)
				_user2.save(function(err) {
					should.exist(err)
					// 清理测试用例 防止影响数据库
					_user1.remove(function(err) {
						if (!err) {
							_user2.remove(function(err) {
								done()
							})
						}
					})
				})
			})		
		})
	})
	after(function(done) {
		// clear user info
		done()
	})
})

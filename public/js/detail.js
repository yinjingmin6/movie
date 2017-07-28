/*
* @Author: yjm
*** 删除的逻辑
*/
$(function() {
	$('.comment').click(function(e) {
		var target = $(this)
		var toId = target.data('tid')
		var commentId = target.data('cid')
		// 如果这个隐藏域已经存在 为其赋值
		if($('#toId').length > 0) {
			$(#toId).val(toId)
		} else {
			// 如果没有 就将隐藏域插入form表单
			// 动态的插入隐藏域
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm')
		}
		if($('#commentId').length > 0) {
			$(#commentId).val(commentId)
		} else {
			// 如果没有 就将隐藏域插入form表单
			// 动态的插入隐藏域
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm')
		}
	})
})
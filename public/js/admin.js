/*
* @Author: yjm
*** 删除的逻辑
*/
$(function() {
	$('.del').click(function(e) {
		var target = $(e.target)
		var id = target.data('id')
		// 拿到表格中的被点击的一行
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id' + id
		})
		.done(function(res) {
			if(res.success === 1) {
				if (tr.length > 0) {
					tr.remove()
				}
			}
		})
	})
})
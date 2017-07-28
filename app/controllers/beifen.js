if movie._id
					input(type="hidden", name="movie[_id]", value=movie._id)
				.form-group
					label.col-sm-2.control-label(for="inputCategory") 电影分类
					.col-sm-10
						input#inputTitle.form-control(type="text", name="movie[categoryName]", value="#{movie.categoryName}")
				.form-group
					label.col-sm-2.control-label(for="inputTitle") 电影分类
					each cat in categories
						label.radio-inline
							if movie._id
								input(type="radio", name="movie[title]", value="#{cat._id}", checked=cat._id==movie.category.toString())
								| #{cat.name}
							else
								input(type="radio", name="movie[title]", value="#{cat._id}"))
								| #{cat.name}
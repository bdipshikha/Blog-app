//app requirements
//express
var express = require('express')
var app = express();

//templating stuff
var ejs = require("ejs")
app.set("view engine", "ejs")
//body parser
var bodyParser = require('body-parser')
//tell app which method to use when parsing
app.use(bodyParser.urlencoded({extended: false}))

//method override setup
var methodOverride = require('method-Override')
//tell app which override method to use
app.use(methodOverride('_method'))

//allow sqlite3
var sqlite3 = require('sqlite3').verbose();
//set database
var db = new sqlite3.Database('./blogdb/blogs.db'); // 


app.get('/', function(req, res){
	res.redirect('/blogs')
})

// to get all the posts
app.get('/blogs', function(req, res) { // all posts, blogs
	db.all("SELECT * FROM posts;", function(err, data) { // db for database not the name of database
		if (err) {
			throw (err)
		}  else {
				var blogs = data;
				console.log(blogs)
		}
		res.render('index.ejs', {blogs: blogs});	
	});
});
app.get('/blog/:id', function(req, res){
	var id = req.params.id
	db.get("SELECT * FROM posts WHERE id = ?", id, function(err, thisPost){
		var post_row = thisPost;
		console.log(post_row.title);
			res.render('show.ejs', {blog: post_row })
	});		
});

// for new post
app.get('/blogs/new', function(req, res){
    res.render('new.ejs')
})




















app.listen('3000')
console.log("Listing to port 3000")





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
});

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

// to get single post
app.get('/blog/:id', function(req, res){
	var id = req.params.id
	db.get("SELECT * FROM posts WHERE id = ?", id, function(err, thisPost){
		var post_row = thisPost;
		console.log(post_row);
			res.render('show.ejs', {blog: post_row })
	});		
});

// for new post
app.get('/posts/new', function(req, res){
    res.render('new.ejs')
});

//create a post
app.post('/blogs', function(req, res){
    console.log(req.body)
    //get info from req.body, make new post
    db.run("INSERT INTO posts (title, body, image) VALUES (?, ?, ?)", req.body.title, req.body.body, req.body.image, function(err) {
        if (err) {
            throw err;
        }
    });
    //go to /blogs so we can see our new post
    res.redirect('/blogs')
});


// to go to edit page to edit a post
app.get('/blog/:id/edit', function(req, res){
	var id = req.params.id
    db.get("SELECT * FROM posts WHERE id = ?", id, function(err, thisPost) {
        if (err) {
            throw err
        } else {
            res.render("edit.ejs", {thisPost: thisPost})
        }
    });
});

//update a post
app.put('/blog/:id', function(req, res){
	console.log("put");
    //make changes to appropriate post
    db.run("UPDATE posts SET title = ?, body = ?, image = ? WHERE id = ?", req.body.title, req.body.content, req.body.image, req.params.id, function(err) {
        if (err) {
            throw err
        } // console.log(res)
    })
    //redirect to this blog page to see changes
    res.redirect('/blog/' + req.params.id)// needs to be blog not blogs since only one post
});

app.delete("/blog/:id", function(req,res){
	db.run("DELETE FROM posts WHERE id = ?", req.params.id, function(err) {
        if (err) {
            throw err
        }
    })
    //go to /pets to see change
    res.redirect('/blogs')
});

app.listen('3000')
console.log("Listing to port 3000")

// lets see





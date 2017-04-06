var express = require("express"),
    methodOverride = require("method-override"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");

//App config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");//dont have to write .ejs everytime :)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created:  {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);
Blog.create({
    title:"hi",
    image:"yo",
    body:"ptty"
    
});
//routes
//index route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});
//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//create route for new blog post
app.post("/blogs", function(req,res){
    //create blog
    Blog.create(req.body.blog ,function(err,newBlog){
        if(err){
            //give the form page again
          res.render("new");
       } else {
           //then redirect to the index blog
          res.redirect("/blogs"); 
       }
        
    });
    
});
//show blog
app.get("/blogs/:id", function(req, res){
      Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});
//edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})
// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});


//listner 
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("running!");
});
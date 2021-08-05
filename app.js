var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser=require("body-parser");
    methodOverride= require("method-override");
    expressSanitizer = require("express-sanitizer");
    mongoose.connect('mongodb://localhost/Cat_App', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
var catAppSchema =  mongoose.Schema({
  name:String,
  image:String,
  body:String,
  created:{type:Date , default:Date.now}
});
var cat= mongoose.model("cat",catAppSchema);

app.get("/",(req,res)=>{
  res.redirect("/cats");
});

app.get("/cats",(req,res)=>{
  cat.find({},(err,allCats)=>{
    if (err) {
      console.log(err);
    }else {
          res.render("indix",{cats:allCats});
    }
  });
});

app.get("/cats/new",(req,res)=>{
  res.render("new");
});

app.post("/cats",(req,res)=>{
  req.body.cat.body = req.sanitize(req.body.cat.body);
  cat.create(req.body.cat,(err,newCat)=>{
    if(err){
      res.render("new");
    }else {
      res.redirect("/cats");
    }
  });
});

app.get("/cats/:id",(req,res)=>{
  cat.findById(req.params.id,(err,foundCat)=>{
    if (err) {
      res.redirect("/cats");
    }else {
      res.render("show", {cat: foundCat});
    }
  });
});

app.get("/cats/:id/edit",(req,res)=>{
  cat.findById(req.params.id,(err,foundCat)=>{
    if (err) {
      res.redirect("/cats")
    }else {
      res.render("edit",{cat:foundCat});
    }
  });
});
app.put("/cats/:id",(req,res)=>{
    req.body.cat.body = req.sanitize(req.body.cat.body);
  cat.findByIdAndUpdate(req.params.id,req.body.cat,(err,updatedCat)=>{
    if(err){
      res.redirect("/cats");
    }else {
      res.redirect("/cats/"+req.params.id);
    }
  });
});

app.delete("/cats/:id",(req,res)=>{
  cat.findByIdAndRemove(req.params.id,req.body.cat,(err)=>{
    if (err) {
      res.redirect("/cats");
    }else {
      res.redirect("/cats");
    }
  });
});



app.listen(3000,function(){
	console.log("Cat App server has started");
});

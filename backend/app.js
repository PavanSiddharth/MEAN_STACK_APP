const express =require('express'); 
const app=express();
const mongoose=require('mongoose');
const Post=require('./models/post');
const path=require("path");
const postRoutes=require('./routes/posts');
const userRoutes=require('./routes/user');
mongoose.connect('mongodb+srv://Pavan:soG4mfByOdBOs0W0@cluster0-cghrs.mongodb.net/node-angular', { useNewUrlParser: true })
.then(()=>{
    console.log('Connected to database');
})
.catch((err)=>{
console.log(err);
});

const bodyParser=require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));

app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,PUT,DELETE,OPTIONS");
    next();
});
app.post("/api/posts",(req,res,next)=>{
    const post=new Post({
        
        title:req.body.title,
        content:req.body.content
    });
 post.save().then(createdPost=>{
    res.status(201).json({
        message:'Post added successfully',
        postId:createdPost._id
 });   

});
});
app.put("/api/posts/:id",(req,res,next)=>{
    const post=new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    });
    Post.updateOne({_id:req.params.id},post).then(result=>{
        res.status(200).json({message:"Update successful"});
    });
});
app.get('/api/posts',function(req,res,next){
    Post.find().then(documents =>{
        res.status(200).json({
            message:'Posts fetched successfully',
            posts:documents
    });
    
    });
});
app.get('/api/posts/:id',(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message:'Post not found!'});
        }
    });
});
app.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
        res.status(200).json({message:"Post deleted successfully"});
    });

});
app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);
module.exports=app;

import express from  "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.static("public"));
  mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true});
  const articleSchema = new mongoose.Schema({
      title : String,
      content:String
  }) 
const Article = mongoose.model("Article",articleSchema);

//////////////////////////////////Getting all the Articles////////////////////////////////////
app.route("/articles")
    .get((req,res)=>{
        Article.find((err ,foundArticles)=>{
            if(err){
                res.send(err)
            }else{
            res.send(foundArticles);
            }
        })
    })
    .post((req,res)=>{
        const newEntry = new Article({
           title : req.body.title,
           content:req.body.content 
        });
        newEntry.save(err =>{
            if(!err){
                res.send("successfully send new article");
            }else{
                res.send(err);
            }
        })

    })
    .delete((req,res)=>{
        Article.deleteMany(err =>{
        if(!err){
            res.send("deleted successfully ")
        }
        else{
            res.send(err)
        }
    
});
});

//////////////////////////////////////////////////Getting a specific article/////////////////////////////

app.route("/articles/:articleTitle")
.get((req,res)=>{
    console.log(req.params.articleTitle)
Article.findOne({title : req.params.articleTitle},(err ,foundArticle)=>{
    if(foundArticle){
        res.send(foundArticle)
    }
    else{
        res.send("No matching Article found",err)
    }
});
})
.put((req,res)=>{
    Article.update(
        {title : req.params.articleTitle},
        {  title : req.body.title,
            content:req.body.content 
        },
        {overwrite:true},
        err => {
          if(!err){
              res.send("successfully updated")
          }else{
              res.send(err)
          }
        }

    );
})
.patch((req,res)=>{
    Article.update(
        {title : req.params.articleTitle},
       {$set :req.body},
        err => {
          if(!err){
              res.send("successfully updated")
          }
        }

    )
})
.delete((req,res) => {
    Article.deleteOne(
        {
            title : req.params.articleTitle
        },
        err => {
            if(!err){
               res.send("successfull deleted")
            }
        }
        )

    });





app.listen(3000 ,()=>{
    console.log("App is runnning a port 3000")
});
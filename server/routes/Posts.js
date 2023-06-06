const express = require('express')
const router = express.Router()

const {Posts,Likes} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware")

router.get("/", validateToken,  async (req,res)=>{
const listOfPosts = await Posts.findAll({include: [Likes]});        //to join post and likes table to get the likes array with each posts.
const likedPosts = await Likes.findAll({where : {UserId : req.user.id}})        //list of all posts that user has liked before.
res.json({listOfPosts: listOfPosts,likedPosts: likedPosts});
});
 
router.get("/byId/:id",async (req,res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id",async (req,res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({where: {UserId: id}});
  res.json(listOfPosts);
});

router.post("/",validateToken, async (req,res)=>{
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

router.delete("/:postId",validateToken, async (req,res)=>{
  const postId = req.params.postId;
  await Posts.destroy({
    where:{
      id: postId,
    },
  });
  res.json("Deleted Successfully");
});

router.put("/title",validateToken , async (req,res)=>{
  const {newTitle,id} = req.body;
  await Posts.update({title: newTitle},{where : {id:id}});
  res.json(newTitle);
});

router.put("/postText",validateToken , async (req,res)=>{
  const {newText,id} = req.body;
  await Posts.update({postText: newText},{where : {id:id}});
  res.json(newText);
});


module.exports = router
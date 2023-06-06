const express = require('express')
const router = express.Router()

const {Likes} = require("../models");

const {validateToken} = require("../middlewares/AuthMiddleware");

router.post("/",validateToken,async (req,res)=>{
    const {PostId} = req.body;
    const UserId = req.user.id;

    //to prevent liking same post more than once
    const found  = await Likes.findOne({
        where : {PostId: PostId,UserId : UserId}
    });
    if(!found){
        //if not previously liked
        await Likes.create({PostId : PostId , UserId : UserId});
        res.json("Liked the Post")
    }else{
        // if already liked then to remove like
        await Likes.destroy({where : {PostId: PostId,UserId : UserId} });
        res.json("Unliked the Post");
    }
});


module.exports = router
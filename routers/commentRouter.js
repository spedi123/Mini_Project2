const express = require("express")
const router = express.Router()
const Comments = require("../schemas/comment")
const authMiddleware = require("../middlewares/auth-middleware")

router.post('/comment', authMiddleware, async (req, res) => {
    const { postId } = req.body;
    const { userId } = res.locals
    const userId = user["userId"]
    const recentComment = await Comments.find().sort("-commentId").limit(1)

    let commentId = 1
    if(recentComment.length != 0){ 
        commentId = recentComment[0]['commentId'] + 1 
    }
  
    const { desc } = req.body
    const date = new Date()
    await Comments.create({ commentId, postId, userId, desc, date }) 
    res.send({ result: "success" })
  }) 


router.get("/comment/:postId", async (req, res, next) => {

    const { postId } = req.params
    console.log(postId)

    const comment = await Comments.find({ postId }).sort("-commentId")
    res.json({ comment: comment })
});


router.delete("/comment", authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { commentId } = req.body

    const postingNickname = user["userId"]
    const userComment = await Comments.findOne({ commentId })
    const commentNickname = userComment["userId"]

    if ( postingNickname === commentNickname ) {
        await Comments.deleteOne({ commentId })
        res.send({ result: "success" }) 
      } 
      else {
        res.send({ result: "로그인후 이용하세요!" }) 
      }
  })


router.put("/comment", authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { commentId, desc } = req.body

    const postingNickname = user["userId"] 
    const userComment1 = await Comments.findOne({ commentId }) 
    const commentNickname = userComment1["userId"]

    if ( postingNickname === commentNickname ) {
        await Comments.updateOne({ commentId }, { $set: { desc } })
        res.send({ result: "success" })
      } else {
        res.send({ result: "로그인후 이용하세요!"})
      }
})

  module.exports = router
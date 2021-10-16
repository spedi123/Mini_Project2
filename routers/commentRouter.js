const express = require('express')
const Comment = require('../schemas/comment')
const Posts = require('../schemas/post')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')

// 댓글작성
router.post('/comment', authMiddleware, async (req, res) => {
    const recentComment = await Comment.find().sort("-commentId").limit(1);
    let commentId=1;
    if(recentComment.length!=0){
      console.log(recentComment)
      commentId = recentComment[0]['commentId']+1
    }

    const { commentDesc, postId, commentUserId } = req.body; 
    const commentDate = new Date()
    let currentDate = commentDate.toLocaleString()
    // const commentDate = new Date().format("yyyy-MM-dd a/p hh:mm:ss");
    isExits = await Posts.findOne({ postId : postId });
    if (!isExits) {
      res.status(403).send({
        errorMessage: '존재하지 않는 게시물입니다.'
      });
      return;
    } else if (commentDesc == "") {
      res.status(403).send({
        errorMessage: '내용을 입력해주세요.'
      });
      return;
    }  
    await Comment.create({ commentId, commentUserId, postId, commentDesc, commentDate : currentDate });
    // commentUserId는 백에서도 줄수 있고 프론트에서도 줄수 있다, 이번 프로젝트는 프론트에서 받아오는걸로 
    // 백엔드에서는 미들웨어 함수를 통해 불러올수 있음 ex) const { user } = res.locals선언하고 
    // Comment.create에 이값을 넣어서 생성 commentUserId: user.userId
    res.send({ commentId });
  });

//댓글 조회
router.get('/comment/:postId', async (req, res) => {
    const { postId } = req.params 
    const comment = await Comment.find({ postId }).sort('-commentId') 
    res.json({ comment: comment }) 
})

//댓글 삭제 
router.delete('/comment/:commentId', authMiddleware, async (req, res) => {
    const{ commentId } = req.params
    const current_user = res.locals.user.userId
    const userComment = await Comment.findOne({ commentId }) 
    const commentNickname = userComment['commentUserId'] 
    if (current_user  === commentNickname) {
        await Comment.deleteOne({ commentId }) 
        res.send({ result: 'success' }) 
    } else {
        res.send({ result: '로그인후 이용하세요!' })
    }
})

//댓글 수정
router.put('/comment/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params
    const { commentDesc } = req.body
    const current_user = res.locals.user.userId
    const userComment = await Comment.findOne({ commentId }) 
    const commentNickname = userComment['commentUserId']
    if (current_user === commentNickname) {
        await Comment.updateOne({ commentId }, { $set: { commentDesc } }) 
        res.send({ result: 'success' }) 
    } else {
        res.send({ result: '로그인후 이용하세요!' })
    }
})

module.exports = router
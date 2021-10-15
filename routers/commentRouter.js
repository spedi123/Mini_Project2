const express = require('express')
const Comment = require('../schemas/comment')
const Posts = require('../schemas/post')
const router = express.Router()
// var postId = "6167aee0048fa5d726a7bfbe"
const authMiddleware = require('../middlewares/auth-middleware')
//authMiddleware 뺌~

// 댓글작성
router.post('/comment', authMiddleware, async (req, res) => {
    const recentComment = await Comment.find().sort("-commentId").limit(1);
    let commentId=1;
    if(recentComment.length!=0){
      console.log(recentComment)
      commentId = recentComment[0]['commentId']+1
    }

    const { commentDesc, postId, commentUserId } = req.body; // 프런트와 commmentUserId확인하기
    // const { postId } = req.params;
    const commentDate = new Date()
    let currentDate = commentDate.toLocaleString()
    // const commentDate = new Date().format("yyyy-MM-dd a/p hh:mm:ss");
    // post id가 틀렸을 시 에러 출력
    isExits = await Posts.findOne({ postId : postId });
    if (!isExits) {
      res.status(403).send({
        errorMessage: '존재하지 않는 게시물입니다.'
      });
      return;
      // case2: content가 존재하지 않을 시 에러 출력
    } else if (commentDesc == "") {
      res.status(403).send({
        errorMessage: '내용을 입력해주세요.'
      });
      return;
    }  
    await Comment.create({ commentId, commentUserId, postId, commentDesc, commentDate : currentDate });
    // commentUserId는 백에서도 줄수 있고 프론트에서도 줄수 있다, 이번 프로젝트는 프론트에서 받아오는걸로 
    // 백엔드에서는 미들웨어 함수를 통해 불러올수 있음 ex) const { user } = res.locals선언하고 
    // create에 이값을 넣어서 생성 commentUserId: user.userId
    res.send({ commentId });
  });

//댓글 조회
router.get('/comment/:postId', async (req, res) => {
    //next()는 어디갔지???
    const { postId } = req.params //postId값으로 해당 게시물 안에 있는 댓글 찾기
    const comment = await Comment.find({ postId }).sort('-commentId') //postId로 찾아온 댓글을 내림차순으로 정렬
    res.json({ comment: comment }) //json형식으로 응답
})

//댓글 삭제 authmiddleware 삭제
router.delete('/comment/:commentId', authMiddleware, async (req, res) => {
    //미들웨어를 통해 유저 토큰 보유 여부 검증
    const{ commentId } = req.params
    const current_user = res.locals.user.userId
    // const postingNickname = user['userId'] //user스키마에서 userId를 찾아서 posting닉네임에 부여
    const userComment = await Comment.findOne({ commentId }) //comment 스키마에서 commentId를 찾아서 부여
    const commentNickname = userComment['commentUserId'] //user스키마에서 userId를 찾아서 comment닉네임에 부여
    if (current_user  === commentNickname) {
        //글 작성자와 현재 로그인한 자 일치여부 판별
        await Comment.deleteOne({ commentId }) //코멘트 아이디를 삭제
        res.send({ result: 'success' }) //성공시 success출력
    } else {
        //실패
        res.send({ result: '로그인후 이용하세요!' })
    }
})

//댓글 수정authMiddleware 삭제
router.put('/comment/:commentId', authMiddleware, async (req, res) => {
    //미들웨어를 통해 유저 토큰 보유 여부 검증
    const { commentId } = req.params
    const { commentDesc } = req.body
    const current_user = res.locals.user.userId
    const userComment = await Comment.findOne({ commentId }) //comment 스키마에서 commentId를 찾아서 부여
    const commentNickname = userComment['commentUserId']
    if (current_user === commentNickname) {
        //글 작성자와 현재 로그인한 자 일치여부 판별
        await Comment.updateOne({ commentId }, { $set: { commentDesc } }) //commentId의 Desc값 변경
        res.send({ result: 'success' }) //$set 왜 save가 아닌 vue 함수 사용? 정의 배열이나 객체의 값이 변경되었다고 요청
    } else {
        res.send({ result: '로그인후 이용하세요!' })
    }
})
module.exports = router
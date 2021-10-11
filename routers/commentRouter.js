const express = require('express')
//schemas/list에서 정보 가져오기
const Lists = require('../schemas/list')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')

const authMiddleware = require('../middlewares/auth-middleware')

//댓글쓰기
router.post('/comment', authMiddleware, async (req, res) => {
    const { postId } = req.body //요청:post 방식으로 넘어오는 postId를 파라미터 담기
    const { commentUserId } = res.locals //응답: 뷰를 렌더링하는 기본 콘텍스트 포함
    const commentUserId = user['commentUserId'] //user 스키마와 연결
    const recentComment = await Comment.find().sort('-commentId').limit(1) //comment스키마에서 commentId를 찾아서 내림차순으로 1개만 정렬
    //이거 이해안됨??
    let commentId = 1 //첫번째 댓글에는 commentId 1 부여
    if (recentComment.length != 0) {
        //
        commentId = recentComment[0]['commentId'] + 1 //새로 작성된 댓글에 commentId는 첫번째 recentComment에 1 더한 값 부여
    }

    const { commentDesc } = req.body //요청:post 방식으로 넘어오는 postId를 파라미터 담기
    const commentDate = new Date() //commentDate에 댓글 작성 날짜 담기
    await Comment.create({
        commentId,
        postId,
        commentUserId,
        commentDesc,
        commentDate,
    }) //비동기로 코멘트에 다음 항목들 값 담기
    res.send({ result: 'success' }) //댓글이 잘 작성되면 success 출력
})

//댓글 조회
// router.get("/comment/:postId", async (req, res, next) => {
//개별 댓글 조회 화면이 없기때문에 postId 제외
router.get('/comment', async (req, res, next) => {
    //next()는 어디갔지???

    const { postId } = req.params //postId값으로 해당 게시물 안에 있는 댓글 찾기
    console.log(postId)

    const comment = await Comment.find({ postId }).sort('-commentId') //postId로 찾아온 댓글을 내림차순으로 정렬
    res.json({ comment: comment }) //json형식으로 응답
})

//댓글 삭제
router.delete('/comment', authMiddleware, async (req, res) => {
    //미들웨어를 통해 유저 토큰 보유 여부 검증
    const { commentId } = req.body
    const { user } = res.locals

    const postingNickname = user['userId'] //user스키마에서 userId를 찾아서 posting닉네임에 부여
    const userComment = await Comment.findOne({ commentId }) //comment 스키마에서 commentId를 찾아서 부여
    const commentNickname = userComment['userId'] //user스키마에서 userId를 찾아서 comment닉네임에 부여

    if (postingNickname === commentNickname) {
        //글 작성자와 현재 로그인한 자 일치여부 판별
        await Comment.deleteOne({ commentId }) //코멘트 아이디를 삭제
        res.send({ result: 'success' }) //성공시 success출력
    } else {
        //실패
        res.send({ result: '로그인후 이용하세요!' })
    }
})

//댓글 수정
router.put('/comment', authMiddleware, async (req, res) => {
    //미들웨어를 통해 유저 토큰 보유 여부 검증
    const { user } = res.locals
    const { commentId, commentDesc } = req.body

    const postingNickname = user['userId']
    const userComment1 = await Comment.findOne({ commentId })
    const commentNickname = userComment1['userId']

    if (postingNickname === commentNickname) {
        //글 작성자와 현재 로그인한 자 일치여부 판별
        await Comment.updateOne({ commentId }, { $set: { commentDesc } }) //commentId의 Desc값 변경
        res.send({ result: 'success' }) //$set 왜 save가 아닌 vue 함수 사용? 정의 배열이나 객체의 값이 변경되었다고 요청
    } else {
        res.send({ result: '로그인후 이용하세요!' })
    }
})

module.exports = router

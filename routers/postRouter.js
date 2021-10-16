const express = require('express')
const Posts = require('../schemas/post')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')

// 게시글 작성
router.post("/", authMiddleware, async (req, res, next) => {
    try{
        const { user } = res.locals
        const { title, youtube_url, desc, image_url, video_url } = req.body;
        if (!youtube_url.includes("youtube.com")) {
            res.status(400).send({
                errorMessage: "유튜브 url을 입력해주세요!",
            });
            return;
        }
        const postDate = new Date()
        let currentDate = postDate.toLocaleString()
        const newPost = await Posts.create({ title, userId: user.userId, youtube_url, image_url, video_url, desc, date: currentDate }); //userId 프론트랑 협의후 다시 입력해야 함.
        res.send({ result: "success", newPost: newPost});
    } catch(err){
        next(err)
    }
    });

// 게시글 수정
router.put("/myPage/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        const postDetail = await Posts.findById( postId );
        const current_user = res.locals.user.userId;
        if (postDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 수정할수 있습니다.'
            })
            return
        }

        const { title, youtube_url, desc, image_url, video_url } = req.body;
        await Posts.updateOne(
            { _id: postId }, 
            { $set: { title, youtube_url, desc, image_url, video_url } }
        )
        res.send({ result: "success"})
    } catch (err) {
        console.error(err);
        next(err);
    }
    });

// 게시글 삭제
router.delete("/detail/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const postDetail = await Posts.findById( postId );
        const current_user = res.locals.user.userId;
        if (postDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 삭제할수 있습니다.'
            })
            return
        }
        await Posts.deleteOne({ _id: postId })
        res.send({ result: "success"})
    }
    catch (err) {
        console.error(err);
        next(err); 
  } 
  });

// 게시글 조회
router.get('/main', async (req, res) => {
    try {
        const post = await Posts.find({}).sort('-date')
        res.json({ post: post })
    } catch (err) {
        next(err)
    }
})


// 상세 페이지
router.get('/detail/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const postDetail = await Posts.findOne({ postId: postId })
        res.json({ detail: postDetail })
    } catch (err) {}
})


// 마이페이지
router.get('/myPage/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params
        const myPagePost = await Posts.find({ userId: userId }).sort("-date");
        res.json({ myPagePost: myPagePost })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;
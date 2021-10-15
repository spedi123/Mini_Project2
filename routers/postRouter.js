const express = require('express')
const Posts = require('../schemas/post')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')

// 게시글 작성 안성규
// authMiddleware 빼고 postman에 실험 중
router.post("/", authMiddleware, async (req, res, next) => {
    try{
        console.log(req.body);
        const { user } = res.locals
        const { title, youtube_url, desc, image_url, video_url } = req.body;
        // const { user } = res.locals;
        if (!youtube_url.includes("youtube.com")) {
            res.status(400).send({
                errorMessage: "유튜브 url을 입력해주세요!",
            });
            return;
        }
        // 고객에게 받은 url값으로 youtubeId 추출
        // const youtubeId = urlReceive;
        // const videoId=youtubeId.split('=')[1];
        // const url = videoId;
        const postDate = new Date()
        let currentDate = postDate.toLocaleString()
        const newPost = await Posts.create({ title, userId: user.userId, youtube_url, image_url, video_url, desc, date: currentDate }); //userId 프론트랑 협의후 다시 입력해야 함.
        res.send({ result: "success", newPost: newPost});
    } catch(err){
        next(err)
    }
    });

// 게시글 수정 안성규
router.put("/myPage/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        console.log("postId: ", postId)

        const postDetail = await Posts.findById( postId );
        console.log(postDetail.userId)
        const current_user = res.locals.user.userId;
        console.log(current_user)
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
        // const { postId } = req.params;
        // const { title, youtube_url, desc, image_url, video_url } = req.body;
        // const isPostInDetail = await Posts.find({ postId });
        // console.log(isPostInDetail)
        // if (isPostInDetail.length > 0) {
        // await Posts.updateOne(
        //     { postId },
        //     { $set: { title, youtube_url, desc, image_url, video_url } }
        // );
        // res.send({ result: "수정이 완료 되었습니다." });
        // } 
    } catch (err) {
        console.error(err);
        next(err);
    }
    });

// 게시글 삭제 안성규
router.delete("/detail/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const postDetail = await Posts.findById( postId );
        console.log(postDetail.userId)
        const current_user = res.locals.user.userId;
        console.log(current_user)
        if (postDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 삭제할수 있습니다.'
            })
            return
        }
        await Posts.deleteOne({ _id: postId })
        res.send({ result: "success"})


    // const { postId } = req.params;
    // const isPostInDetail = await Posts.find({ postId:postId });
    // if (isPostInDetail.length > 0) {
    //   await Posts.deleteOne({ postId });
    //   res.send({ result: "삭제되었습니다." });
    }
    catch (err) {
        console.error(err);
        next(err); 
  } 
  });

// 게시글 조회 안성규
router.get('/main', async (req, res) => {
    try {
        const post = await Posts.find({}).sort('-date')
        res.json({ post: post })
        // res.json({"result": "게시글 조회~"})
    } catch (err) {
        next(err)
    }
})


// 상세 페이지 황유정 <성공!>
router.get('/detail/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const postDetail = await Posts.findOne({ postId: postId })
        res.json({ detail: postDetail })
    } catch (err) {}
})


// 마이페이지 조회 황유정
//authMiddleware 빼고 postman에 실험 중
// router.get('/myPage/:userObjectId', async(req, res) =>{
//     const { userObjectId } = req.params
//     const myPage = await User.find({ userObjectId }).sort("-date");
//     console.log(myPage)
//     res.json({ 
//         myPage: myPage })

// })
// 마이페이지 황유정
router.get('/myPage/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params
        const post = await Posts.find({ userId: userId }).sort("date");
        res.json({ post: post })
    } catch (err) {
        console.error(err)
        next(err)
    }
})


module.exports = router;
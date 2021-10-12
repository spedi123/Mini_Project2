const express = require("express");
const Posts = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 작성 안성규
router.post("/myPage", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { title, userId, urlReceive, desc, date } = req.body;
  // 고객에게 받은 url이 youtube.com이 포함되지 않으면 에러 메세지 발송
  if (!urlReceive.includes("youtube.com")) {
    res.status(400).send({
        errorMessage: "유튜브 url을 입력해주세요!",
    });
    return;
  }
  // 고객에게 받은 url값으로 youtubeId 추출
  const youtubeId = urlReceive;
  const videoId=youtubeId.split('=')[1];
  const url = videoId;
  await Posts.create({ title, userId, url, desc, date });
  res.send({ result: "success" });
});

// 게시글 조회 안성규
router.get("/main", async (req, res) => {
  try {
    const post = await Posts.find({}).sort("-date");
    console.log(post);
    const youtubeId = post.url
    thumbnailId = youtubeId.split('=')[1]
    res.json({ post: post }, { thumbnailId: thumbnailId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시글 자세히 보기
router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId: postId });
    console.log(post);
    res.json({ detail: post });
  } catch (err) {}
});

// 게시글 수정 안성규
router.post("/post/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, userId, url, desc } = req.body;
    console.log(password);
    const isPostInDetail = await Posts.find({ postId, password });
    if (isPostInDetail.length > 0) {
      await Posts.updateOne(
        { postId },
        { $set: { title, userId, url, desc } }
      );
      res.send({ result: "수정이 완료 되었습니다." });
    } else {
      res.send({ result: "비밀번호가 틀렸습니다." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시글 삭제 안성규
router.post("/post/:postId/delete", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostInDetail = await Posts.find({ postId, password });
    if (isPostInDetail.length > 0) {
      await Posts.deleteOne({ postingId });
      res.send({ result: "삭제되었습니다." });
    } else {
      res.send({ result: "비밀번호가 틀렸습니다." });
    }
  } catch (err) {}
});

module.exports = router;

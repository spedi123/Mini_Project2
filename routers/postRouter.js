const express = require("express");
const Posts = require("../schemas/post");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

// 게시글 작성 안성규
router.post("/post", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { title, userId, url, desc, date } = req.body;
//   let postId = await Posts.find({}).sort("-postId").limit(1);
//   if (postId.length == 0) {
//     postId = 1;
//   } else {
//     postId = postId[0]["postId"] + 1;
//   }
  await Posts.create({ postId, title, userId, url, desc, date });
  res.send({ result: "success" });
});

// 게시글 조회 안성규
router.get("/post", async (req, res) => {
  try {
    const post = await Posts.find({}).sort("-date");
    console.log(post);
    res.json({ post: post });
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

const express = require("express");
const app = express();
const port = 3000;

const connect = require("./schemas");
connect();

const postingRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const commentRouter = require("./routers/commentRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 라우터 연결
app.use("/api", [postingRouter]);
app.use("/api", [userRouter]);
app.use("/api", [commentRouter]);


app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
// 메인페이지
app.get("/", (req, res) => {
  res.render("index");
});
// // 게시글 작성페이지
// app.get("/posting", (req, res) => {
//   res.render("posting");
// });
// // 게시글 자세히보기(댓글포함 / 댓글수정 및 삭제기능 포함)
// app.get("/detail", (req, res) => {
//   res.render("detail");
// });
// // 게시글 수정페이지
// app.get("/edit", (req, res) => {
//   res.render("edit");
// });
// // 로그인 페이지
// app.get("/login", (req, res) => {
//   res.render("login");
// });
// // 회원가입 페이지
// app.get("/register", (req, res) => {
//   res.render("register");
// });

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});


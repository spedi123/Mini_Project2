const express = require('express')
const app = express()
const port = 3000
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middlewares/auth-middleware')
// const authMiddleware = require('./middlewares/auth-middleware')

const token = jwt.sign({ test: true }, 'artube-secret-key')
console.log(token)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// schemas와 연결
const connect = require('./schemas')
connect()

//api 설정
const postRouters = require('./routers/postRouter')
// const postRouters = require('./routers/postRouter')
const userRouters = require('./routers/userRouter')
const commentRouters = require('./routers/commentRouter') //댓글 작업함
app.use('/api', [postRouters])
// const commentRouters = require('./routers/commentRouter')
// app.use('/api', [postRouters])
app.use('/api', [userRouters])
app.use('/api', [commentRouters]) //댓글 작업함
// app.use('/api', [commentRouters])

//ejs 템플릿 엔진을 위한 것
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.get('/signIn', (req, res) => {
    res.render('signIn')
})
app.get('/signUp', (req, res) => {
    res.render('signUp')
})
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})

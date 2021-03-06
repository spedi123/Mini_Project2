const express = require('express')
const app = express()
const port = process.env.port || 3000;
const dotenv = require("dotenv")
const cors = require('cors')
dotenv.config()

app.use(express.json())
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// schemas와 연결
const connect = require('./schemas')
connect()

//api 설정
const postRouters = require('./routers/postRouter')
const userRouters = require('./routers/userRouter')
const commentRouters = require('./routers/commentRouter')

app.use('/user', [userRouters])
app.use('/post', [postRouters])
app.use('/comment', [commentRouters])

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})

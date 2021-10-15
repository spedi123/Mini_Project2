const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
//option 1
const cors = require('cors')
// const corsOption = {
//     origin: "*",
//     credentials: true,
// }
app.use(cors());

// const token = jwt.sign({test: true}, 'artube-secret-key')

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

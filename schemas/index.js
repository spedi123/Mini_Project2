const mongoose = require('mongoose')

const connect = () => {
    mongoose
        // 이 부분을 env로 가려놔야 함 
        // .connect('mongodb://localhost:27017/admin', {
        .connect('mongodb://localhost:27017/myArtube', {
            useNewUrlParser: true,
            ignoreUndefined: true,
            // user: "test",
            // pass: "test"
        })
        .catch((err) => console.log(err))
}

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err)
})

module.exports = connect

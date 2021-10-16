const mongoose = require('mongoose')

const connect = () => {
    mongoose
    //      .connect(process.env.DB_SERVER_HOST, {
      .connect(process.env.DB_LOCAL_HOST, {
            useNewUrlParser: true,
            ignoreUndefined: true,
            // user: process.env.DB_USER,
            // pass: process.env.DB_PASS,
        })
        .catch((err) => console.log(err))
}

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러', err)
})

module.exports = connect

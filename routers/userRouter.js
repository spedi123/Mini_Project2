const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const router = express.Router()
// 회원가입 API - POST
router.post('/signUp', async (req, res, next) => {
    try {
        const { nickname, password, confirmPassword } = req.body
        const existsUsers = await User.findOne({ nickname })
        const { userId, password, confirmPassword } = req.body
        const existsUsers = await User.findOne({ userId })

        console.log(nickname, password)
        console.log(userId, password)

        const re_nickname = /^[a-zA-Z0-9]{3,255}$/
        const re_password = /^[a-zA-Z0-9]{4,255}$/

        if (nickname.search(re_nickname) == -1) {
        if (userId.search(re_nickname) == -1) {
            return res.status(412).send({
                errorMessage: 'ID의 형식이 일치하지 않습니다.',
            })
        } else if (password.search(re_password) == -1) {
            return res.status(400).send({
                errorMessage: '패스워드의 형식이 일치하지 않습니다.',
            })
        } else if (password.search(nickname) >= 1) {
        } else if (password.search(userId) >= 1) {
            return res.status(400).send({
                //왜 안될까요........
                // id: asd, pw: asdasd 하면 erroMessage가 잘 뜬다
                // id: asd1, pw: asdasd 하면 erroMessage가 안 뜨고 회원가입 된다ㅜㅜ
                errorMessage: '비밀번호에 아이디가 포함되어있습니다."',
            })
        } else if (password !== confirmPassword) {
            return res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
            })
        } else if (existsUsers) {
            return res.status(400).send({
                errorMessage: '닉네임을 이미 사용중입니다.',
            })
        }

        const user = new User({ nickname, password })
        const user = new User({ userId, password })
        await user.save()

       } res.status(201).send({})
    } catch (err) {
        next(err)
    }
})

//로그인 API - POST
router.post('/signIn', async (req, res) => {
    const { nickname, password } = req.body
    const { userId, password } = req.body

    console.log('sign In', nickname, password)
    console.log('sign In', userId, password)

    const user = await User.findOne({ nickname })
    const user = await User.findOne({ userId })

    //만약 user가 없거나
    //password가, 찾은 nickname의 password와 일치하지 않는다면
    //에러메세지를 보낸다
    if (!user || password !== user.password) {
        res.status(400).send({
            //일부러 error message를 모호하게 말해준다.
            errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
        })
        return
    }

    //send token
    const token = jwt.sign({ userId: user.userId }, 'eujeong-secret-key')
    const token = jwt.sign({ userId: user.userId }, 'artube-secret-key')
    res.send({ token })
})

module.exports = router
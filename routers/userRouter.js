const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')

// 회원가입 API - POST
router.post('/signUp', async (req, res, next) => {
    try {
        const { userId, password, confirmPassword } = req.body
        const existsUsers = await User.findOne({ userId })

        const re_nickname = /^[a-zA-Z0-9]{3,255}$/
        const re_password = /^[a-zA-Z0-9]{4,255}$/
        // 아이디는 영문 대/소문자와 숫자만 가능하고 3글자 이상이어야 합니다.
        if (userId.search(re_nickname) == -1) {
            return res.status(412).send({
                errorMessage: 'ID의 형식이 일치하지 않습니다.',
            })
        // 비밀번호는 영문 대/소문자와 숫자만 가능하고 4글자 이상이어야 합니다.
        } else if (password.search(re_password) == -1) {
            return res.status(400).send({
                errorMessage: '패스워드의 형식이 일치하지 않습니다.',
            })
        } else if (password.includes(userId)) {
            return res.status(400).send({
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

        const user = new User({ userId, password })
        await user.save()

        res.status(201).send({ result: 'sucess' })
    } catch (err) {
        next(err)
    }
})

//로그인 API - POST
router.post('/signIn', async (req, res) => {
    const { userId, password } = req.body
    const user = await User.findOne({ userId })

    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
        })
        return
    }
    //send token
    const token = jwt.sign(
        { userObjectId: user.userObjectId }, process.env.JWT_SECRET_KEY
    )
    res.send({ token, userId })
})

// 다른 유저 프로필 정보
router.get('/userProfile/:userId', authMiddleware, async (req, res) => {
    const { userId } = req.params
    const userProfile = await User.findOne ({ userId: userId })
    res.json({ userProfile: userProfile})
})

// 프로필 정보
router.get('/me', authMiddleware, async (req, res) => {
    const { user } = res.locals
    res.send({
        user,
    })
})

//프로필 정보 수정
router.put('/me', authMiddleware, async (req, res, next) => {
    try {
        const { user } = res.locals
        const userDetail = await User.findById( user._id )
        const current_user = user.userId
        if (userDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 수정할수 있습니다.',
            })
            return
        }
        const { userIntro, userPic } = req.body
        await User.updateOne(
            { userId: user.userId },
            { $set: { userIntro, userPic } }
        )
        res.send({ result: 'success' })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

// 프로필 정보 삭제(DB데이터를 삭제하는 기능이 없어서 null값으로 delete기능 대체)
router.delete("/me", authMiddleware, async (req, res, next) => {
    try {
        const { user } = res.locals
        const userDetail = await User.findById( user._id )
        const current_user = user.userId
        if (userDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 수정할수 있습니다.',
            })
            return
        }
        await User.findOneAndUpdate(
            { userId: user.userId },
            { $set: { userIntro : null, userPic : null }}
        )
        res.send({ result: 'success' })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router

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

        console.log(userId, password)

        const re_nickname = /^[a-zA-Z0-9]{3,255}$/
        const re_password = /^[a-zA-Z0-9]{4,255}$/

        if (userId.search(re_nickname) == -1) {
            return res.status(412).send({
                errorMessage: 'ID의 형식이 일치하지 않습니다.',
            })
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

        res.status(201).send({ result : "sucess"})
    } catch (err) {
        next(err)
    }
})

//로그인 API - POST
router.post('/signIn', async (req, res) => {
    const { userId, password } = req.body

    console.log('sign In', userId, password)

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
    const token = jwt.sign({ userObjectId: user.userObjectId }, 'artube-secret-key')
    res.send({ token })
})

router.get("/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
      user,
    });
});


// 프로필 정보 생성
// router.post("/me", authMiddleware, async(req, res)=> {

//     const { user } = res.locals
//     const { userIntro, userPic } = req.body;

//     const myProfile = await User.create({ userId: user.userId, password: user.password, userIntro, userPic }); 
//     res.send({ 
//         result: "success", 
//         myProfile
//     });

// }) 


//프로필 정보 수정
router.put('/me', authMiddleware, async (req, res, next) => {
    try {
        // const { userObjectId } = req.params
        const { user } = res.locals

        const userDetail = await User.findById( user._id )
        console.log(userDetail)

        // const current_user = res.locals.user.userId
        const current_user = user.userId

        console.log(current_user)

        if (userDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 수정할수 있습니다.',
            })
            return
        }

        const { userIntro, userPic } = req.body
        await User.updateOne(
            { userId: user.userId },
            { $set: { userIntro, userPic }}
        )
        res.send({ result: 'success' })
    } catch (err) {
        console.error(err)
        next(err)
    }
})


// 프로필 정보 삭제
router.delete("/me", authMiddleware, async (req, res, next) => {
    try {
        // const { userObjectId } = req.params
        const { user } = res.locals

        const userDetail = await User.findById( user._id )
        console.log(userDetail)

        // const current_user = res.locals.user.userId
        const current_user = user.userId

        console.log(current_user)

        if (userDetail.userId !== current_user) {
            res.status(403).send({
                errorMessage: '작성자만 수정할수 있습니다.',
            })
            return
        }

        // const { userIntro, userPic } = req.body
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


module.exports = router;

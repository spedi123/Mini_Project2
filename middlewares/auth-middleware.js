const jwt = require('jsonwebtoken')
const User = require('../schemas/user')

module.exports = (req, res, next) => {
    console.log('여기를 지나쳤어요!')
    const { authorization } = req.headers
    console.log(authorization)
    const [tokenType, tokenValue] = authorization.split(' ')

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMesage: '토큰이 잘못 되었습니다.',
        })
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, 'eujeong-secret-key')
        User.findById(userId).then((user) => {
            res.locals.user = user
            next()
        })
    } catch (error) {
        res.status(401).send({
            errorMesage: '로그인 후 사용하세요',
        })
        return
    }
}
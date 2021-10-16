const jwt = require('jsonwebtoken');
const User = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요'
    })
  }
  
  const [tokenType, tokenValue] = authorization.split(' ');
  if (!tokenValue || tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }

  try {
    const { userObjectId } = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);
    console.log("2", userObjectId)
    User.findById(userObjectId).then((user) => {
      res.locals.user = user;
      console.log("1", user)
      next();
    }).catch(err=>console.log(err))
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
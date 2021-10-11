const jwt = require('jsonwebtoken');
const Users = require('../schemas/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요'
    })
  }
  
  const [tokenType, tokenValue] = authorization.split(' ');
  console.log(tokenType, tokenValue)
  if (!tokenValue || tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(tokenValue, "peter-secret-key");
    Users.findById(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
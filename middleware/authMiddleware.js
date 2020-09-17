const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req, res, next) => {
  console.log(req.path);
  const token = req.cookies.jwt;
  console.log(token);
  if (token) {
    jwt.verify(token, 'my secure', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        if (req.path === '/login' || req.path === '/signup') {
          res.redirect('/');
        } else {
          next();
        }
      }
    });
  } else {
    if (req.path === '/login' || req.path === '/signup') {
      next();
    } else {
      res.redirect('/login');
    }

  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'my secure', async(err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = {
  requireAuth,
  checkUser
}
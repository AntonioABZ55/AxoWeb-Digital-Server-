const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, typeUser: user.typeUser },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  }
);

module.exports = router;
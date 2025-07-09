const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.name.givenName,
        lastname: profile.name.familyName || '',
        email,
        password: 'google_auth', // valor placeholder, no se usará
        typeUser: 'cliente',
      });
    }

    return done(null, user); // Pasamos el usuario al callback
  } catch (error) {
    return done(error, null);
  }
}));

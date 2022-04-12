const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const config = require('config')
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const secret = config.get('jwtPrivateKey');
const User = mongoose.model('User');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
    new JwtStrategy(opts, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
  
          return done(null, false);
        })
        .catch(err => {
          return done(err, false);
        });
    })
  );

module.exports = async app => {
    app.use(passport.initialize());
}
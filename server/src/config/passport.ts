var passport = require('passport');
var User = require('../app/models/user');
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;

var localOptions = {
    usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    console.log("Local Login: "+email+" "+password);

    User.findOne({
        email: email
    }, function(err, user) {

        if(err) {
            return done(err);
        }

        if(!user) {
            console.log("User not found");
            return done(null, false, {error: 'Login failed. Please try again.'});
        }

        user.comparePassword(password, function(err, isMatch) {

            if(err) {
                return done(err);
            }

            if(!isMatch) {
                console.log("Password is not correct");
                return done(null, false, {error: 'Login failed. Please try again.'});
            }

            return done(null, user);

        });

    });

});

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

    console.log("JWT Login");

    User.findById(payload._id, function(err, user) {

        if(err) {
            return done(err, false);
        }

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }

    });

});

passport.use(jwtLogin);
passport.use(localLogin);

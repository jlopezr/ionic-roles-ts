import * as passport from 'passport';
import {model as User} from '../app/models/user';
let config = require('./auth');
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import {Strategy as LocalStrategy} from 'passport-local';
import {ObjectID} from "bson";

let localOptions = {
    usernameField: 'email'
};

let localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    //console.log("Local Login: "+email+" "+password);

    User.findOne({
        email: email
    }, function(err, user) {

        if(err) {
            return done(err);
        }

        if(!user) {
            console.log("User not found");
            return done(null, false, {message: 'Login failed. Please try again.'});
        }

        user.comparePassword(password, function(err, isMatch) {

            if(err) {
                return done(err);
            }

            if(!isMatch) {
                console.log("Password is not correct");
                return done(null, false, {message: 'Login failed. Please try again.'});
            }

            return done(null, user);

        });

    });

});

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

let jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

    //console.log("JWT Login:", payload);

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

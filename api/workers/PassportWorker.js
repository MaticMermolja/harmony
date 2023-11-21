
/** 
 * 
 * const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require('../models/User.js');
const config = require('../env.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../env.js').jwt_secret;


// Improve this js file
// Make code coherent and fix errors
// If needed create other methods
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const searchedUser = UserModel.findByEmail(); //TODO:GET_EMAIL_FROM_GOOGLE  // add await
    if(searchedUser) {
        const accessToken = jwt.sign({ userId: searchedUser._id, permissionLevel: searchedUser.permissionLevel }, jwtSecret, {
            expiresIn: 3600,
        });
    } else {
        const user = {
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: "", //TODO:GET_EMAIL_FROM_GOOGLE
            password: '#',
            permissionLevel: 1,
        };

        const result = UserModel.createUser(user); // add await
        console.log('Created new user:', result);

        const accessToken = jwt.sign({ userId: result._id, permissionLevel: user.permissionLevel }, jwtSecret, {
            expiresIn: 3600,
        });
    }
    // TODO:WHAT_TO_DO_HERE, what to return and how
  }
));

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // TODO: Create optimized logic for registration and login similar to how it is created 
    // for google authentication.
  }
));

*/
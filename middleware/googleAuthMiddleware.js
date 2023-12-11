const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../model/User');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(user, null);
});

passport.use(new GoogleStrategy({
        clientID: '792985662173-0fkv0tq97srknvo1v4bki3uhisrr21rd.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            // Check if the user already exists in the database
            let user = await User.findOne({
                email: profile.emails[0].value
            });

            if (!user) {
                // If the user doesn't exist, create a new user entry
                user = new User({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    password:""
                });
                // Save the new user to the database
                await user.save();
            }
            // Return the user profile
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports.googleAuthMiddleware = passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'email']
});

module.exports.callbackMiddleware = passport.authenticate('google', {
    failureRedirect: '/login'
}); 

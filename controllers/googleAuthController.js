const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

passport.use(
    new GoogleStrategy(
        {
            callbackURL: `${process.env.callbackURLdomain}/auth/callback`,
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
            const token = jwt.sign(
                { id: profile._json.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '10m' }
            );
            // console.log(profile);
            const user = {
                email: profile._json.email,
                name: profile._json.name,
                // profileUrl: profile._json.picture,
                token
            };

            // i can pass error here
            // done(new Error("something went wrong..."), user);

            // i passed user here so that i can use this in callback url as req.user
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    if (user) return done(null, user);
    return done(null, false);
});

passport.deserializeUser((id, done) => {
    if (user) return done(null, user);
    return done(null, false);
});

module.exports = passport;

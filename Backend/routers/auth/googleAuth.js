const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("../../models/users_schema"); // Adjust path as needed

// Setup session middleware
router.use(session({
    secret: "YOUR_SECRET_KEY",
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport middleware
router.use(passport.initialize());
router.use(passport.session());


const clientid = "id"
const clientsecret = "id"

passport.use(new OAuth2Strategy({
        clientID: clientid,
        clientSecret: clientsecret,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    isGoogleUser:true
                    // image: profile.photos[0].value
                });

                await user.save();
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id); // Assuming Mongoose ObjectId
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Initial Google OAuth login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route

//  two ways to do this
// 1. redirect way
// router.get("/google/callback", passport.authenticate("google", {
//     failureRedirect: "/" // Redirect to login page on failure
// }), (req, res) => {
//     // Successful authentication
//     res.redirect("/dashboard"); // Redirect to dashboard or appropriate route
// });

//  2. my way Here i am sending the user
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login" // Redirect to login page on failure (if necessary)
}), (req, res) => {
    // Handle successful authentication without redirection
    // Example: Respond with JSON data or other response
    res.status(200).json({ message: 'Authentication successful', user: req.user });
});

module.exports = router;

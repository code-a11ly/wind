const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../database.js');
require('dotenv').config(); // Load environment variables from .env

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID, // Access variables from .env
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback', // Use default or .env value
        },
        (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
                if (err) return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    db.run(
                        'INSERT INTO users (name, email, is_admin, role) VALUES (?, ?, ?, ?)',
                        [name, email, 0, 'Employee'],
                        function (err) {
                            if (err) return done(err);

                            db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
                                if (err) return done(err);
                                return done(null, newUser);
                            });
                        }
                    );
                }
            });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

module.exports = passport;

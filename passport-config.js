const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername) {
  const authenticateUser = async (username, password, done) => {
    let user = undefined;
    try {
      user = await getUserByUsername(username);
    } catch (e) {
      return done(e);
    }

    if (user == null) {
      return done(null, false, { message: 'No user with that username.' });
    }

    /* The bcrypt.compare() method verifies the plain-text password from the
     * login attempt against the hashed password from the database. */
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect.' });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user, done) => done(null, user.user_name));
  passport.deserializeUser((username, done) => {
    return done(null, getUserByUsername(username));
  });
}

/* Return the "initialize" function to the caller when the server requires this
 * module (passport-config.js), thus letting the server call the "initialize"
 * function to set up local authentication via Passport. */
module.exports = initialize;

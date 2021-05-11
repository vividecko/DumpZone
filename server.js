/*
 * ----------------------------------------------------------------------------
 * USER DATA:
 * Upon login, one's username is stored in Passport session data, in
 * "req.session.passport.user". This username can be used to retrieve the rest
 * of the user data from storage. During retrieval from storage, the server
 * cache is first queried due to its speed, then the database is queried if the
 * cache has not yet loaded the given user's data.
 * ----------------------------------------------------------------------------
 */

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const storage = require('./storage');
const requireDir = require('require-dir');
const models = requireDir('./models');

const fs = require('fs');
const http = require('http');
const https = require('https');

const cert = {
  key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.crt', 'utf8')
}

const express = require('express');
const httpApp = express();          /* for plain HTTP */
const app = express();              /* for HTTPS (main app) */

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const httpServer = http.createServer(httpApp);
const httpsServer = https.createServer(cert, app);

/*
 * Set up username/password authentication via Passport by executing the
 * initialization function in passport-config.js. Pass it a function that takes
 * a username and returns the corresponding user object from the database.
 */
const initializePassport = require('./passport-config');
initializePassport(passport, models.User.get);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views/static"));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


/*
 * ----------------------------------------------------------------------------
 * ROUTES
 * ----------------------------------------------------------------------------
 */

/*
 * Upgrade all plain HTTP requests to more secure HTTPS connections.
 */
httpApp.all('*', (req, res) => res.redirect(300, 'https://localhost:3000'));


/*
 * Home page/dashboard, which differs based on whether the user is a student
 * or an instructor.
 */
app.get('/', checkAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Home',
    doc: 'index',
    username: req.session.passport.user
  });
});


/*
 * Work page, where students do assignments or tests.
 */
app.get('/work', (req, res) => {
  //const user = models.Student.get(req.session.passport.user);
  //models.WorkAssignment.
  res.render('template.ejs', {
    title: 'Work',
    doc: 'work',
    username: req.session.passport.user
  });
});

app.post('/work', (req, res) => {
  console.log('answer received');
});


/*
 * Practice page, where students can try problems an unlimited number of
 * times.
 */
app.get('/practice', (req, res) => {
  //const user = models.Student.get(req.session.passport.user);
  //models.WorkAssignment.
  res.render('template.ejs', {
    title: 'Practice',
    doc: 'work',
    username: req.session.passport.user
  });
});

app.post('/practice', (req, res) => {
  console.log('answer received');
});


/*
 * Tutorial page, where students view video tutorials.
 */
app.get('/tutorial', (req, res) => {
  res.render('template.ejs', {
    title: 'Tutorials',
    doc: 'tutorials',
    username: req.session.passport.user
  });
});


/*
 * Parrot collection page, where students can gaze upon their majestic
 * collection of party parrots.
 */
app.get('/parrots', (req, res) => {
  res.render('template.ejs', {
    title: 'Parrot Collection',
    doc: 'parrots',
    username: req.session.passport.user
  });
});


/*
 * Teacher dashboard page, where teachers can manage their virtual classrooms.
 */
app.get('/tp', (req, res) => {
  res.render('template.ejs', {
    title: 'Teacher Dashboard',
    doc: 'teacher',
    username: req.session.passport.user
  });
});


/*
 * Login page/form.
 */
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Login',
    doc: 'login'
  });
});

/*
 * Authenticate a user when they fill out the login form.
 */
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


/*
 * Settings page where users can change profile settings.
 */
app.get('/settings', (req, res) => {
  res.render('template.ejs', {
    title: 'Settings',
    doc: 'settings',
    username: req.session.passport.user,
    color: "#333"
  });
});


/*
 * Registration pages/forms, where new users are created.
 */
app.get('/register-student', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'student'
  });
});

app.get('/register-instructor', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'instructor'
  });
});


/*
 * Register a new student or instructor/teacher user respectively. The input is
 * received from the user via the registration form.
 */
app.post('/register-student', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    models.Student.create(
      req.body.username,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hashedPassword
    );

    res.redirect('/login');
  } catch {
    res.redirect('/register-student');
  }
});

app.post('/register-instructor', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    models.Teacher.create(
      req.body.username,
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      hashedPassword
    );

    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/register-instructor');
  }
});


/*
 * Log the user out and end the session.
 */
app.get('/logout', (req, res) => {
  storage.uncache(req.session.passport.user);
  req.logOut();
  res.redirect('/login');
});


/*
 * Ensure the user is authenticated or not authenticated before accessing
 * certain pages; otherwise, redirect the user.
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

/*
 * Ensure the user is a teacher before accessing teacher pages.
 */
const checkIfTeacher = (req, res, next) => {
  const user = models.User.get(req.session.passport.user);
  if (user.is_teacher === 0) {    /* not teacher */
    return res.redirect('/');
  }
  next();
}

/*
 * Ensure the user is a student before accessing student pages.
 */
const checkIfStudent = (req, res, next) => {
  const user = models.User.get(req.session.passport.user);
  if (user.is_teacher === 1) {    /* is teacher */
    return res.redirect('/');
  }
  next();
}

httpsServer.listen(3000);
httpServer.listen(80);

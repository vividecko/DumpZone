
//Database handler + models
var Handler = require("./models/Handler");
var User = require("./models/User");



/* The NODE_ENV environment variable indicates whether the server is running
 * in development (testing) or production (deployment). If it's testing, which
 * ours always is, then get a placeholder session key from the file ".env". */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const fs = require('fs')
const http = require('http')
const https = require('https')

/* Get self-signed SSL certs for the HTTPS connection. (For testing only.) */
const cert = {key: fs.readFileSync('localhost.key', 'utf8'),
  cert: fs.readFileSync('localhost.crt', 'utf8')}

/* Set up two Express apps: one for an HTTP server, one for an HTTPS server. */
const express = require('express')
const httpApp = express()
const app = express()

/* Load required Node modules. */
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const httpServer = http.createServer(httpApp)
const httpsServer = https.createServer(cert, app)

/* Configure Passport so it authenticates with a username and password. */
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  username => users.find(user => user.username === username)
)

/* temporary user storage (will use database later) */
/*const hashedPassword1 = bcrypt.hash("testtest", 10) {firstname: "XDDDDDD", lastname: "XDDDDDD", username: "Nick1234", email: "XDDDDDD@xd.com", password: hashedPassword1}*/
const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static("views/static"))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

/* The plain HTTP server simply redirects the user to a more secure HTTPS
 * connection. In production, the redirection URL would not be localhost. */
httpApp.all('*', (req, res) => res.redirect(300, 'https://localhost:3000'))


// ROUTES + CONTROLLER

// INDEX

app.get('/', checkAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Home',
    doc: 'index',
    username: req.user.username
  })
})


// Work page

app.get('/work', (req, res) => {
  res.render('template.ejs', {
    title: 'Work',
    doc: 'work',
    username: req.user.username
  })
})


// Login page

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Login',
    doc: 'login'
  })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


// Registration pages

app.get('/register-student', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'student'
  })
})

app.get('/register-instructor', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'instructor'
  })
})


// Registration forms

app.post('/register-student', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      user_type: 'student'
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register-student')
  }
})

app.post('/register-instructor', checkNotAuthenticated, async (req, res) => {
  try {

    var connection = Handler.connect();

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    var newUser = new User(req.body.username, req.body.firstname, req.body.lastname, req.body.email, hashedPassword);

    creationStatus = newUser.create(connection); //Should be -1 or 0 but is always -1

    connection.end(); //Not sure if making and closing connections works 100% properly since they are also async
                      //Also, the reason I did not establish the connection at the top is because then I cannot guarantee that the connection will ever close
                      //But maybe this is not an issue

    /*users.push({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      user_type: 'instructor'
    })*/

    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.redirect('/register-instructor')
  }
})


// Logout

app.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})


// Redirecting/Validation methods

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

/* Make the site accessible on port 3000 for testing HTTPS, and port 80 for
 * HTTP. */
httpsServer.listen(3000)
httpServer.listen(80)

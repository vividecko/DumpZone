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
app.get('/', checkAuthenticated, checkIfStudent, async (req, res) => {

  let aStudent = await models.User.get(req.session.passport.user);
  let theClassroom;

  if (aStudent.classroom_id !== null) {
    theClassroom = await models.Classroom.getByID(aStudent.classroom_id);
  } else {
    theClassroom = null;
  }

  res.render('template.ejs', {
    title: 'Home',
    doc: 'index',
    username: req.session.passport.user,
    teacher: 0,
    student: aStudent,
    classroom: theClassroom
  });
});


/*
 * Parse the given JSON file, representing a question, and return an HTML
 * string that can be displayed to the student as they do assignments.
 */
function questionToHTML() {
}

/*
 * Work page, where students do assignments or tests.
 */
app.get('/work', checkAuthenticated, checkIfStudent, checkIfInClass, async (req, res) => {
  const theuser = await models.Student.get(req.session.passport.user);
  const currentClass = await models.Classroom.getByID(theuser.classroom_id);
  const recentAssignment = await models.WorkAssignment.getRecent(theuser.classroom_id);

  if (recentAssignment !== undefined) {

    const questions = await models.WorkQuestion.getByAssignment(recentAssignment.id);

    let recentAttempt = await models.WorkAssignment.getRecentAttempt(
      req.session.passport.user,
      recentAssignment.id
    );

    if (!recentAttempt || recentAttempt.num_questions_attempted === questions.length) {
     recentAttempt = models.WorkAssignment.createAttempt(
        req.session.passport.user,
        recentAssignment.id,
        new Date(),
        new Array(questions.length).fill(0),  /* answers 0 (not correct) by default */
        0,    /* no questions attempted yet */
        0     /* no questions correct yet */
      );
    }

  }
  

  res.render('template.ejs', {
    title: 'Work',
    doc: 'work',
    username: req.session.passport.user,
    teacher: 0,
    classroom: currentClass,
    active: recentAssignment,
    practice: 0
  });
});

app.post('/work', checkAuthenticated, checkIfStudent, checkIfInClass, (req, res) => {
  const user_answer = req.body.answer;
});


/*
 * Practice page, where students can try problems an unlimited number of
 * times.
 */
app.get('/practice', checkAuthenticated, checkIfInClass, checkIfStudent, async (req, res) => {
  const theuser = await models.Student.get(req.session.passport.user);
  const currentClass = models.Classroom.getByID(theuser.classroom_id);
  const recentAssignment = await models.PracticeAssignment.getRecent(theuser.classroom_id);

  if (recentAssignment !== undefined) {

  }

  //models.WorkAssignment.
  res.render('template.ejs', {
    title: 'Practice',
    doc: 'work',
    username: req.session.passport.user,
    teacher: 0,
    classroom: currentClass,
    active: recentAssignment,
    practice: 1
  });
});

app.post('/practice', (req, res) => {
  console.log('answer received');
});


/*
 * Tutorial page, where students view video tutorials.
 */
app.get('/tutorials', checkAuthenticated, checkIfInClass, async (req, res) => {

  let theuser = await models.User.get(req.session.passport.user);

  if (theuser.is_teacher == 1) {

    let classroomList = await models.Classroom.getByInstructor(req.session.passport.user);

    if (classroomList.length > 0) {

      let selectedClass;
      let tutorialList;

      if (req.session.selectedClass == undefined) {
        selectedClass = classroomList[0];
        tutorialList = await models.TutorialAssignment.getByClass(1);
      } else {
        selectedClass = req.session.selectedClass;
        tutorialList = await models.TutorialAssignment.getByClass(req.session.selectedClass.id);
      }

      res.render('template.ejs', {
        title: 'Tutorials',
        doc: 'tutorials',
        username: req.session.passport.user,
        teacher: theuser.is_teacher,
        currentClass: selectedClass,
        classrooms: classroomList,
        tutorials: tutorialList
      });
    } else {
      res.redirect('/');
    }

  } else {

    let theClassroom = await models.Classroom.getByID(theuser.classroom_id);
    let tutorialList = await models.TutorialAssignment.getByClass(theClassroom.id);

    //Gonna organize this better once there's a way to specify which class
    res.render('template.ejs', {
      title: 'Tutorials',
      doc: 'tutorials',
      username: req.session.passport.user,
      teacher: theuser.is_teacher,
      currentClass: theClassroom,
      tutorials: tutorialList
    });

  }

});


/*
 * Parrot collection page, where students can gaze upon their majestic
 * collection of party parrots.
 */
app.get('/parrots', checkAuthenticated, checkIfInClass, async (req, res) => {

  let theuser = await models.User.get(req.session.passport.user);
  let theClassroom = await models.Classroom.getByID(theuser.classroom_id);

  res.render('template.ejs', {
    title: 'Parrot Collection',
    doc: 'parrots',
    username: req.session.passport.user,
    teacher: 0,
    classroom: theClassroom
  });
});


/*
 * Teacher dashboard page, where teachers can manage their virtual classrooms.
 * If the teacher has not created any classrooms yet, then they are shown a
 * panel informing them of this and allowing them to create their first class.
 */
app.get('/tp', checkAuthenticated, checkIfTeacher, async (req, res) => {
  let classroomList = await models.Classroom.getByInstructor(req.session.passport.user);

  if (classroomList.length > 0) {

    let selectedClass;

    if (req.session.selectedClass !== undefined) {
      selectedClass = req.session.selectedClass;
    } else {
      selectedClass = classroomList[0];
    }

    let tutorialList = await models.TutorialAssignment.getByClass(selectedClass.id);
    let studentList = await models.User.getAllStudents();
    let assignmentList = await models.WorkAssignment.getByClass(selectedClass.id);
    let practiceList = await models.PracticeAssignment.getByClass(selectedClass.id);
    let presetList = await models.QuestionPreset.getByTeacher(req.session.passport.user);

    res.render('template.ejs', {
      title: 'Teacher Dashboard',
      doc: 'teacher',
      username: req.session.passport.user,
      teacher: 1,
      currentClass: selectedClass,
      classrooms: classroomList,
      tutorials: tutorialList,
      assignments: assignmentList,
      practices: practiceList,
      presets: presetList,
      students: studentList
    });

  } else {
    res.render('template.ejs', {
      title: 'Teacher Dashboard',
      doc: 'teacher',
      username: req.session.passport.user,
      teacher: 1,
      classrooms: classroomList
    });
  }

});


/*
 * Link for teachers to select what classroom they are currently viewing.
 */
app.get('/c/:classname', checkAuthenticated, checkIfTeacher, async (req, res) => {

  let classroom = await models.Classroom.getByName(req.params.classname, req.session.passport.user);

  req.session.selectedClass = classroom[0];

  res.redirect('/');

});

app.post('/add/class', checkAuthenticated, checkIfTeacher, (req, res) => {
  models.Classroom.create(
    req.body.class_name,
    req.body.grade,
    req.session.passport.user
  );
  res.redirect('/');
});

app.post('/add/student', checkAuthenticated, checkIfTeacher, checkIfHasClasses, async (req, res) => {

  let classroomList = await models.Classroom.getByInstructor(req.session.passport.user);

  let selectedClass;

  if (req.session.selectedClass !== undefined) {
    selectedClass = req.session.selectedClass;
  } else {
    selectedClass = classroomList[0];
  }

  models.Student.addToClass(req.body.student_username, selectedClass.id);

  res.redirect('/');
});

app.post('/add/tutorial', checkAuthenticated, checkIfTeacher, checkIfHasClasses, async (req, res) => {
  try {
    let selectedClass;
    
    if (req.session.selectedClass !== undefined) {
      selectedClass = req.session.selectedClass;
    } else {
      selectedClass = classroomList[0];
    }

    let currentDate = new Date();

    await models.TutorialAssignment.create(req.body.tutorial_name, req.body.tutorial_description, 1, currentDate, selectedClass.id, req.body.tutorial_link, req.body.tutorial_tag, null);

    console.log("New resource/tutorial created!");
    res.redirect('/tp');
  } catch (e) {
    console.log(e);
  }
});

app.post('/add/practice', checkAuthenticated, checkIfTeacher, checkIfHasClasses, async (req, res) => {

  try {
    let classroomList = await models.Classroom.getByInstructor(req.session.passport.user);
    let selectedClass;
    
    if (req.session.selectedClass !== undefined) {
      selectedClass = req.session.selectedClass;
    } else {
      selectedClass = classroomList[0];
    }

    const currentDate = new Date();

    await models.PracticeAssignment.create(req.body.practice_name, req.body.practice_description, 1, currentDate, selectedClass.id);

    const questions = await models.Question.getByPreset(req.body.preset);
    const new_assign = await models.PracticeAssignment.getRecent(selectedClass.id);
    for (let i = 0; i < questions.length; i++) {
      models.PracticeQuestion.create(
        new_assign.id,
        questions[i].id,
        1,  // placeholder (allow_hints)
        i,  /* question number */
      );
    }

    console.log("New practice created!");
    res.redirect('/tp');
  } catch (e) {
    console.log(e);
  }

});

app.post('/add/assignment', checkAuthenticated, checkIfTeacher, checkIfHasClasses, async (req, res) => {
  try {
    let classroomList = await models.Classroom.getByInstructor(req.session.passport.user);
    let selectedClass;
    
    if (req.session.selectedClass !== undefined) {
      selectedClass = req.session.selectedClass;
    } else {
      selectedClass = classroomList[0];
    }

    const currentDate = new Date();
    const dueDate = new Date(req.body.due_date);
    let time_limit = req.body.time_limit;
    if (!time_limit)
      time_limit = 0;   /* understood to mean no time limit */

    await models.WorkAssignment.create(
      req.body.work_name,
      req.body.work_description,
      1,  /* is visible by default */
      currentDate,
      selectedClass.id,
      time_limit,
      dueDate
    );

    const questions = await models.Question.getByPreset(req.body.preset);
    const new_assign = await models.WorkAssignment.getRecent(selectedClass.id);
    for (let i = 0; i < questions.length; i++) {
      models.WorkQuestion.create(
        new_assign.id,
        questions[i].id,
        1,  // placeholder (allow_hints)
        i,  /* question number */
        3   // placeholder  (max attempts
      );
    }

    console.log("New assignment created!");
    res.redirect('/tp');
  } catch (e) {
    console.log(e);
  }
});


/*
 * Login page/form.
 */
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Login',
    doc: 'login',
    teacher: 0
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
    color: "#333",
    teacher: 0
  });
});

/*
 * Settings: change password
 */
app.post('/change/password', checkAuthenticated, async (req, res) => {

  let errorCode = await models.User.updatePassword(req.session.passport.user, req.body.password_new, req.body.password_confirm); 

  if (errorCode === 0) {
    console.log("Password has been changed!");
    res.redirect("/logout");
  } else {
    console.log("Password change unsuccessful");
    res.redirect("/");
  }

});

/*
 * Registration pages/forms, where new users are created.
 */
app.get('/register-student', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'student',
    teacher: 0
  });
});

app.get('/register-instructor', checkNotAuthenticated, (req, res) => {
  res.render('template.ejs', {
    title: 'Register',
    doc: 'register',
    user_type: 'instructor',
    teacher: 0
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
app.get('/logout', checkAuthenticated, (req, res) => {
  storage.uncache(req.session.passport.user);
  req.session.selectedClass = undefined;
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
async function checkIfTeacher(req, res, next) {

  let user = await models.User.get(req.session.passport.user);

  if (user.is_teacher === 0) {    /* not teacher */
    return res.redirect('/');
  }
  next();
}

/*
 * Ensure the user is a student before accessing student pages.
 */
async function checkIfStudent(req, res, next) {
  const user = await models.User.get(req.session.passport.user);
  if (user.is_teacher === 1) {    /* is teacher */
    return res.redirect('/tp');
  }
  next();
}

/*
 * Ensure the student is in a classroom before accessing pages.
 */
async function checkIfInClass(req, res, next) {
  const user = await models.User.get(req.session.passport.user);

  if (user.classroom_id == null && user.is_teacher === 0) {    /* NOT in a class */
    return res.redirect('/');
  }
  next();
}

/*
 * Ensure the teacher has classes before accessing pages.
 */
async function checkIfHasClasses(req, res, next) {
  const user = await models.User.get(req.session.passport.user);
  const classroomList = await models.Classroom.getByInstructor(req.session.passport.user);

  if (classroomList.length == 0 && user.is_teacher === 1) {    /* NOT in a class */
    return res.redirect('/');
  }
  next();
}

httpsServer.listen(3000);
httpServer.listen(80);

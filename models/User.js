const storage = require('../storage');
const bcrypt = require('bcrypt');
const table = 'user';

/* DB field names */
const f = {
  uname: 'user_name',
  fname: 'first_name',
  lname: 'last_name',
  email: 'email',
  pw: 'password',
  is_teacher: 'is_teacher'
}

const create = async (username, fname, lname, email, hashed_pw, is_teacher) => {

  let errorCode = 0;

  if (!isUsername(username)) {
    errorCode = -3;
  } else if (!isName(fname) || !isName(lname)) {
    errorCode = -2;
  } else if (!isEmail(email)) {
    errorCode = -1;
  }

  if (errorCode == 0) {

    //Checks if username or email already exists
    let usernameResult = await storage.getList(table, [f.uname], [username]);
    let emailResult = await storage.getList(table, [f.email], [email]);

    if (emailResult.length > 0) {
      errorCode = -4;
    } else if (usernameResult.length > 0) {
      errorCode = -5
    }

    if (errorCode == 0) {
      console.log("inside if");
      storage.insert(
        table,
        [f.uname, f.fname, f.lname, f.email, f.pw, f.is_teacher],
        [username, fname, lname, email, hashed_pw, is_teacher]
      );
    }

  }

  return errorCode;
}

const get = (username) => {
  return storage.getObject(table, f.uname, username);
}

const getAllStudents = () => {
  return storage.getList(table, [f.is_teacher], [0]);
}

/*
 * Change user password.
 */
const updatePassword = async (username, new_password, confirmation) => {

  let errorCode = 0;

  if (new_password === confirmation) {

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await storage.update(table, f.pw, [f.uname], [username], hashedPassword);

  } else {
    errorCode = -1;
  }

  return errorCode;
}


//Boolean methods
  
  const isUsername = (username) => {

    //Checks for 4 characters
    //Can contain A-Z, number, underscore
    var regex = /^[a-zA-Z0-9_]{4,}$/;

    if (username.search(regex) > -1) {
      return true;
    } else {
      return false;
    }

  }

  const isEmail = (email) => {

    var regex = /^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9-]+)[.]([a-zA-Z0-9.]+)$/;

    if (email.search(regex) > -1) {
      return true;
    } else {
      return false;
    }

  }

  const isName = (name) => {

    //Can contain A-Z
    var regex = /^[a-zA-Z]+$/;

    if (name.search(regex) > -1) {
      return true;
    } else {
      return false;
    }

  }


module.exports.create = create;
module.exports.get = get;
module.exports.getAllStudents = getAllStudents;
module.exports.updatePassword = updatePassword;
module.exports.isUsername = isUsername;
module.exports.isEmail = isEmail;
module.exports.isName = isName;

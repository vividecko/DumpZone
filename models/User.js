const storage = require('../storage');
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

const create = (username, fname, lname, email, hashed_pw, is_teacher) => {
  storage.insert(
    table,
    [f.uname, f.fname, f.lname, f.email, f.pw, f.is_teacher],
    [username, fname, lname, email, hashed_pw, is_teacher]
  );
}

const get = (username) => {
  return storage.getObject(table, f.uname, username);
}

const getAllStudents = () => {
  return storage.getList(table, [f.is_teacher], [0]);
}

module.exports.create = create;
module.exports.get = get;
module.exports.getAllStudents = getAllStudents;

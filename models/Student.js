const storage = require('../storage');
const user = require('./User');

const award_table = 'earns_award';
const f = {
  student_name: 'student_name',
  award_name: 'award_name',
  date: 'date',
  assign_id: 'assignment_id'
}

/*
 * Add a new user with "is_teacher" set to 0 (false).
 */
const create = (username, fname, lname, email, hashed_pw) => {
  user.create(username, fname, lname, email, hashed_pw, 0);
}

const get = (username) => {
  return user.get(username);
}

const getAwards = (username) => {
  return storage.getList(
    award_table,
    [f.student_name],
    [student_name]
  );
}

module.exports.create = create;
module.exports.get = get;
module.exports.getAwards = getAwards;

const storage = require('../storage');
const user = require('./User');

const table = 'user';
const award_table = 'earns_award';
const f = {
  student_name: 'student_name',
  award_name: 'award_name',
  date: 'date',
  assign_id: 'assignment_id',
  classroom_id: 'classroom_id'
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

/*
 * Add a student by ID to the specified classroom.
 */
const addToClass = (username, class_id) => {

  //storage.update(table, get_column_by, field, update_this_column_with, value);
  storage.update(table, f.classroom_id, ['user_name'], [username], class_id);

}


module.exports.create = create;
module.exports.get = get;
module.exports.getAwards = getAwards;
module.exports.addToClass =addToClass;

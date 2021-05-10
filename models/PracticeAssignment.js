const assignment = require('./Assignment');
const table = 'assignment_practice';
const attemptTable = 'practice_attempt';

const create = (name, desc, is_visible, date, class_id) => {
  assignment.create(
    table,
    name,
    desc,
    is_visible,
    date,
    class_id,
    [],
    []
  );
}

const getByID = (id) => {
  return assignment.getByID(table, id);
}

const getByClass = (class_id) => {
  return assignment.getByClass(table, class_id);
}

const getRecent = (class_id) => {
  return assignment.getRecent(table, class_id);
}

const getRecentAttempt = (student_name, class_id) => {
  return assignment.getRecentAttempt(
    attemptTable,
    student_name,
    class_id
  );
}

const getAttempts = (student_name, class_id) => {
  return assignment.getAttempts(
    attemptTable,
    student_name,
    class_id
  );
}

module.exports.create = create;
module.exports.getByID = getByID;
module.exports.getByClass = getByClass;
module.exports.getRecent = getRecent;
module.exports.getRecentAttempt = getRecentAttempt;
module.exports.getAttempts = getAttempts;

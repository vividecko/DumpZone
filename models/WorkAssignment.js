const assignment = require('./Assignment');
const table = 'assignment_work';
const attemptTable = 'work_attempt';

const f = {
  time_limit: 'time_limit',
  due_date: 'due_date'
}

const create = (name, desc, is_visible, date, class_id, time_limit,
  due_date) => {
  assignment.create(
    table,
    name,
    desc,
    is_visible,
    date,
    class_id,
    [f.time_limit, f.due_date],
    [time_limit, due_date]
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

const storage = require('../storage');
const assignment = require('./Assignment');
const table = 'assignment_work';
const attemptTable = 'work_attempt';

const f = {
  time_limit: 'time_limit',
  due_date: 'due_date',
  /* attempt fields */
  correct_list: 'correct_answers',
  num_q_attempted: 'num_questions_attempted',
  num_q_correct: 'num_questions_correct'
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

/*
const createAttempt = (student_name, assign_id, date, correct_list,
num_q_attempted, num_q_correct) => {
  assignment.createAttempt(
    attemptTable,
    student_name,
    assign_id,
    date,
    [f.correct_list, f.num_q_attempted, f.num_q_correct],
    [JSON.stringify(correct_list), num_q_attempted, num_q_correct]
  );
}
*/

/*
 * Skip straight to storage.js because the above query doesn't work for some
 * reason. The SQL syntax error it causes is "near" the parameter list in the
 * insert statement, so maybe it has to do with the spread operator in the
 * assignment.createAttempt() function.
 */
const createAttempt = (student_name, assign_id, date, correct_list,
num_q_attempted, num_q_correct) => {
  storage.insert(
    attemptTable,
    ['student_name', 'assignment_id', 'completion_date',
      f.correct_list,
      f.num_q_attempted,
      f.num_q_correct],
    [student_name, assign_id, date, JSON.stringify(correct_list),
      num_q_attempted,
      num_q_correct]
  );
}

const getRecentAttempt = (student_name, assign_id) => {
  return assignment.getRecentAttempt(
    attemptTable,
    student_name,
    assign_id
  );
}

const getAttempts = (student_name, assign_id) => {
  return assignment.getAttempts(
    attemptTable,
    student_name,
    class_id
  );
}

const incrementCorrect = async (student_name, assign_id) => {
  const recentAttempt = await getRecentAttempt(student_name, class_id);
  assignment.updateAttempt(
    attemptTable,
    f.num_q_correct,
    student_name,
    assign_id,
    recentAttempt.num_questions_correct + 1
  );
}

const incrementAttempted = async (student_name, assign_id) => {
  const recentAttempt = await getRecentAttempt(student_name, class_id);
  assignment.updateAttempt(
    attemptTable,
    f.num_q_att,
    student_name,
    assign_id,
    recentAttempt.num_questions_attempted + 1
  );
}

module.exports.create = create;
module.exports.getByID = getByID;
module.exports.getByClass = getByClass;
module.exports.getRecent = getRecent;
module.exports.createAttempt = createAttempt;
module.exports.getRecentAttempt = getRecentAttempt;
module.exports.getAttempts = getAttempts;
module.exports.incrementCorrect = incrementCorrect;
module.exports.incrementAttempted = incrementAttempted;

const attempt = require('./Attempt');
const table = 'work_attempt';

const f = {
  correct_answers: 'correct_answers',
  num_attempted: 'num_questions_attempted',
  num_correct: 'num_questions_correct'
}

const create = (student_name, assign_id, correct_answers, num_attempted,
num_correct) => {
  attempt.create(
    table,
    student_name,
    assign_id,
    [f.correct_answers, f.num_attempted, f.num_correct],
    [correct_answers, num_attempted, num_correct]
  );
}

const getRecent = (student_name, assign_id) => {
  return attempt.getRecent(table, student_name, assign_id);
}

const getList = (student_name, assign_id) => {
  return attempt.getList(table, student_name, assign_id);
}

module.exports.create = create;
module.exports.getRecent = getRecent;
module.exports.getList = getList;

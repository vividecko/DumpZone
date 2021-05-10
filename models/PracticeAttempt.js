const attempt = require('./Attempt');
const table = 'practice_attempt';

const f = {
  num_attempted: 'num_questions_attempted',
}

const create = (student_name, assign_id, num_attempted) => {
  attempt.create(
    table,
    student_name,
    assign_id,
    [f.num_attempted],
    [num_attempted]
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

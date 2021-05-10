const attempt = require('./Attempt');
const table = 'tutorial_view';

const create = (student_name, assign_id) => {
  attempt.create(
    table,
    student_name,
    assign_id,
    [],
    []
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

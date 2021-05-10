const storage = require('../storage');

/* DB field names */
const f = {
  student_name: 'student_name',
  assign_id: 'assignment_id',
  date: 'completion_date'
}

const create = (table, student_name, assign_id, other_fields, other_args) => {
  storage.insert(
    table,
    [f.student_name, f.assign_id, ...other_fields],
    [student_name, assign_id, ...other_args],
  );
}

const getRecent = (table, student_name, assign_id) => {
  return storage.getMax(
    table,
    [f.student_name, f.assign_id],
    [student_name, assign_id],
    date
  );
}

const getList = (table, student_name, assign_id) => {
  return storage.getList(
    table,
    [f.student_name, f.assign_id],
    [student_name, assign_id]
  );
}

module.exports.create = create;
module.exports.getRecent = getRecent;
module.exports.getList = getList;

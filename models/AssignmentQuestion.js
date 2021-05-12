const storage = require('../storage');

const f = {
  assign_id: 'assignment_id',
  question_id: 'question_id',
  allow_hints: 'allow_hints',
  q_num: 'question_number'
}

const create = (table, assign_id, question_id, allow_hints, q_num,
other_fields, other_values) => {
  storage.insert(
    table,
    [f.assign_id, f.question_id, f.allow_hints, f.q_num, ...other_fields],
    [assign_id, question_id, allow_hints, q_num, ...other_values]
  );
}

const get = (table, assign_id, question_id) => {
  return storage.getList(
    table,
    [f.assign_id, f.question_id],
    [assign_id, question_id]
  );
}

const getByAssignment = (table, assign_id) => {
  return storage.getList(
    table,
    [f.assign_id],
    [assign_id]
  );
}

module.exports.create = create;
module.exports.get = get;
module.exports.getByAssignment = getByAssignment;

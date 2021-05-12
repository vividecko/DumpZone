const assignment_question = require('./AssignmentQuestion');
table = 'work_question';

const f = {
  max: 'max_attempts'
}

const create = (assign_id, question_id, allow_hints, q_num, max) => {
  assignment_question.create(
    table,
    assign_id,
    question_id,
    allow_hints,
    q_num,
    [f.max],
    [max]
  );
}

const get = (assign_id, question_id) => {
  return assignment_question.get(table, assign_id, question_id);
}

const getByAssignment = (assign_id) => {
  return assignment_question.getByAssignment(table, assign_id);
}

module.exports.create = create;
module.exports.get = get;
module.exports.getByAssignment = getByAssignment;

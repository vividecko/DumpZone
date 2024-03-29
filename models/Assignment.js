const storage = require('../storage');

/* DB field names */
const f = {
  id: 'id',
  name: 'name',
  desc: 'description',
  is_visible: 'is_visible',
  date: 'assign_date',
  class_id: 'classroom_id',
  /* assignment attempt common fields */
  student_name: 'student_name',
  assign_id: 'assignment_id',
  att_date: 'completion_date'
}

const create = (table, name, desc, is_visible, date, class_id,
  other_fields, other_args) => {
  storage.insert(
    table,
    [f.name, f.desc, f.is_visible, f.date, f.class_id, ...other_fields],
    [name, desc, is_visible, date, class_id, ...other_args]
  );
}

const getByID = (table, id) => {
  return storage.getObject(table, f.id, id);
}

const getByClass = (table, class_id) => {
  return storage.getList(table, [f.class_id], [class_id]);
}

/*
 * Get the single most recently modified visible assignment in "table" for the
 * given class.
 */
const getRecent = (table, class_id) => {
  return storage.getMax(
    table,
    [f.class_id, f.is_visible],
    [class_id, 1],
    f.date
  );
}

const createAttempt = (table, student_id, assign_id, att_date, other_fields,
other_values) => {
  storage.insert(
    table,
    [f.student_id, f.assign_id, f.att_date, ...other_fields],
    [student_id, assign_id, att_date, ...other_values]
  );
}

/*
 * Update some field in the most recently created attempt by the given student
 * on the given assignment.
 */
const updateAttempt = (table, updated_field, student_name, assign_id,
updated_value) => {
  storage.update(
    table,
    updated_field,
    [f.student_name, f.assign_id],
    [student_name, assign_id],
    updated_value
  );
}

/*
 * Get the most recently worked on attempt for the given student on the given
 * assignment. Once a new attempt is begun, old attempts are inaccessible by
 * the student, but visible to the instructor.
 */
const getRecentAttempt = (table, student_name, assign_id) => {
  return storage.getMax(
    table,
    [f.student_name, f.assign_id],
    [student_name, assign_id],
    f.att_date
  );
}

/*
 * Get a list of all attempt by the given student on the given assignment.
 */
const getAttempts = (table, student_name, assign_id) => {
  return storage.getList(
    table,
    [f.student_name, f.assign_id],
    [student_name, assign_id]
  );
}

module.exports.create = create;
module.exports.getByID = getByID;
module.exports.getByClass = getByClass;
module.exports.getRecent = getRecent;
module.exports.createAttempt = createAttempt;
module.exports.updateAttempt = updateAttempt;
module.exports.getRecentAttempt = getRecentAttempt;
module.exports.getAttempts = getAttempts;

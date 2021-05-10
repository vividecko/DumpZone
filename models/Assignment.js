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
    f.date,
    [f.class_id, f.is_visible],
    [class_id, 1]
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
    f.att_date,
    [f.student_name, f.assign_id],
    [student_name, assign_id]
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
module.exports.getRecentAttempt = getRecentAttempt;
module.exports.getAttempts = getAttempts;

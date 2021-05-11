const assignment = require('./Assignment');
const table = 'assignment_tutorial';
const attemptTable = 'tutorial_view';

const f = {
  vid: 'video_url',
  tag: 'tag',
  practice_id: 'follow_up_practice_id'
}

const create = (name, desc, is_visible, date, class_id, vid, tag, practice_id) => {
  assignment.create(
    table,
    name,
    desc,
    is_visible,
    date,
    class_id,
    [f.vid, f.tag, f.practice_id],
    [vid, tag, practice_id]
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

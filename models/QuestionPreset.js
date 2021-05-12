const storage = require('../storage');
const table = 'question_preset';

const f = {
  id: 'id',
  name: 'name',
  grade: 'grade',
  author: 'author_name'
}

const create = (name, grade, author) => {
  storage.insert(
    table,
    [f.name, f.grade, f.author],
    [name, grade, author]
  );
}

const get = (id) => {
  return storage.getObject(table, f.id, id);
}

const getByGrade = (grade) => {
  return storage.getByNullValue(table, [f.grade], [grade], author);
}

/*
 * Get all question presets provided by default by HomeMath, i.e. presets
 * without an author.
 */
const getAll = () => {
  return storage.getByNullValue(table, null, null, f.author);
}

const getByTeacher = (teacher_name) => {
  return storage.getList(table, [f.author], [teacher_name]);
}

module.exports.create = create;
module.exports.get = get;
module.exports.getByGrade = getByGrade;
module.exports.getAll = getAll;
module.exports.getByTeacher = getByTeacher;

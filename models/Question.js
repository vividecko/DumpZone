const storage = require('../storage');
const table = 'question';

const f = {
  id: 'id',
  name: 'name',
  type: 'question_type',
  questions: 'questions',
  answers: 'answers',
  author_name: 'author_name',
  preset_id: 'preset_id'
}

const create = (name, type, questions, answers, author_name) => {
  storage.insert(
    table,
    [f.name, f.type, f.questions, f.answers, f.author_name],
    [name, type, questions, answers, author_name]
  );
}

const getByID = (id) => {
  return storage.getObject(
    table,
    f.id,
    id
  );
}

const getByAuthor = (author_name) => {
  return storage.getList(
    table,
    [f.author_name],
    [author_name]
  );
}

const getByPreset = (preset_id) => {
  return storage.getList(
    table,
    [f.preset_id],
    [preset_id]
  );
}

module.exports.create = create;
module.exports.getByID = getByID;
module.exports.getByAuthor = getByAuthor;
module.exports.getByPreset = getByPreset;

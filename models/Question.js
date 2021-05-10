const storage = require('../storage');
const table = 'question';

const f = {
  id: 'id',
  name: 'name',
  type: 'question_type',
  questions: 'questions',
  answers: 'answers',
  author_name: 'author_name'
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
  return getList(
    table,
    [f.author_name],
    [author_name]
  );
}

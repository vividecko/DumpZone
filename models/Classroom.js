const storage = require('../storage');
const table = 'classroom';

const f = {
  id: 'id',
  name: 'name',
  grade: 'grade',
  instr_name: 'instructor_name'
}

const create = (name, grade, instr_name) => {
  storage.insert(
    table,
    [f.name, f.grade, f.instr_name],
    [name, grade, instr_name]
  );
}

const getByID = (id) => {
  storage.getObject(
    table,
    f.id,
    id
  );
}

/*
 * Get a class by its name and instructor name. Despite using the getList
 * function, this query only returns one class.
 */
const getByName = (name, instr_name) => {
  storage.getList(
    table,
    [f.name, f.instr_name],
    [name, instr_name]
  );
}

/*
 * Get every class taught by the given instructor.
 */
const getByInstructor = (instr_name) => {
  storage.getList(
    table,
    [f.instr_name],
    [instr_name]
  );
}

module.exports.create = create;
module.exports.getByID = getByID;
module.exports.getByName = getByName;
module.exports.getByInstructor = getByInstructor;

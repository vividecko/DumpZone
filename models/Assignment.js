const storage = require('../storage');

/* DB field names */
const f = {
  id: 'id',
  name: 'name',
  desc: 'description',
  is_visible: 'is_visible',
  date: 'assign_date',
  class_id: 'classroom_id'
}

const create = (table, id, name, desc, is_visible, date, class_id,
  other_fields, other_args) => {
  storage.insert(
    table,
    [f.id, f.name, f.desc, f.is_visible, f.date, f.class_id, ...other_fields],
    [id, name, desc, is_visible, date, class_id, ...other_args]
  );
}

const getByID = (table, id) => {
  return storage.getObject(table, f.id, id);
}

const getByClass = (table, class_id) => {
  return storage.getList(table, [f.class_id], [class_id]);
}

/*
 * Get the single most recently modified visible assignment for the given
 * class.
 */
const getRecent = (table, date) => {
  return storage.getMax(
    table,
    f.id,
    [f.date, f.is_visible],
    [date, 1]
  );
}

/*
const getRecentAttempt = (table, 
*/

const storage = require('../storage');
const table = 'award';

const f = {
  name: 'name'
}

const get = (name) => {
  return storage.getObject(table, f.name, name);
}

module.exports.get = get;

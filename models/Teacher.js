const storage = require('../storage');
const user = require('./User');

/*
 * Add a new user with "is_teacher" set to 1 (true).
 */
const create = (username, fname, lname, email, hashed_pw) => {
  user.create(username, fname, lname, email, hashed_pw, 1);
}

const get = (username) => {
  user.get(username);
}

module.exports.create = create;
module.exports.get = get;

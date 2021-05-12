/*
 * ----------------------------------------------------------------------------
 * This script hides some storage implementation details from the main server
 * script as well as any model scripts using queries. As such, neither the
 * cache nor the database implementation need to be referenced within other
 * scripts (although knowledge of the DB schema is still needed), so it would
 * be easy to make reasonable changes to the DB implementation. Might it have
 * been easier to use an object-relational mapping (ORM)? Maybe...
 * ----------------------------------------------------------------------------
 */

const mysql = require('mysql2/promise');

/* Nick's DB info
const db = mysql.createPool({
  connectionLimit: 50,
  connectTimeout: 60 * 60 * 1000,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'homemath'
});
*/

/* Mike's DB info */
const db = mysql.createPool({
    connectionLimit: 50,
    connectTimeout: 60 * 60 * 1000,
    host: 'localhost',
    user: 'server',
    password: 'dgPqnf1vtPje7dLoLu3h',
    database: 'homemath'
});

const NodeCache = require('node-cache');
const ttl = 60 * 60 * 1;
const cache = new NodeCache({
  stdTTL: ttl,                /* 1 hr. until any given entry is deleted */
  checkperiod: ttl * 0.2,     /* 12 min. between deletion checks */
  useClones: false            /* return references (not copies) for objects */
});

/* Private function for generic error handling within DB queries. */
const errFunction = (err, result) => {
  if (err)
    throw err;
}


/*
 * ----------------------------------------------------------------------------
 * EXPORTED FUNCTIONS
 * ----------------------------------------------------------------------------
 */

/*
 * Get the object stored in "table" whose "field" matches the value of "key".
 * If no object in the cache has the given key, then find the matching object
 * from the database, cache it, and then return it.
 *
 * Per its name, the "key" field should be some candidate key in the database
 * so that it can identify an object in cache. As such, this function returns
 * just one object. It's useful for, say, getting an object by ID.
 */
const getObject = (table, field, key) => {
  const value = cache.get(key);
  if (value) {
    console.log('Cache: "' + key + '" found.');
    return Promise.resolve(value);
  }

  return db.query(
    `SELECT * FROM ${table} WHERE ${field}=?`,
    [key],
    errFunction
  ).then((result) => {
    console.log('Cache: "' + key + '" not found.');
    if (result[0][0])
      cache.set(key, result[0][0]);
    return result[0][0];
  });
}

/*
 * Get a list of objects in "table" for which some "fields" equal some
 * "values". The parameters "fields" and "values" should be lists of same
 * length with correct order mapping fields to values.
 *
 * Query just the database, because this cached list could quickly
 * become outdated as the database gets updated.
 */
const getList = async (table, fields, values) => {
  const list = await db.query(
    `SELECT * FROM ${table}`
    + ` WHERE ${fields.join('=? AND ') + '=?'}`,
    values,
    errFunction
  );
  return list[0];
}

const getByNullValue = (table, fields, values, null_field) => {
  const extra = (fields == null)
    ? '' : `AND ${fields.join('=? AND ') + '=?'}`;
  const list = db.query(
    `SELECT * FROM ${table}`
    + `WHERE ${null_field} IS NULL`
    + extra,
    values,
    errFunction
  );
  return list[0];
}

const getAll = (table) => {
  const list = db.query(
    `SELECT * FROM ${table}`,
    errFunction
  );
  return list[0];
}

/*
 * Get the object in "table" with the greatest value, of all objects, for
 * "max_field". The lists "other_fields" and "other_values" determine further
 * selection criteria.
 */
const getMax = (table, other_fields, other_values, max_field) => {
  const value = db.query(
    `SELECT * FROM ${table}`
    + ` WHERE ${other_fields.join('=? AND ') + '=?'}`
    + ` ORDER BY ${max_field} DESC LIMIT 1`,
    other_values,
    (err, result) => {
      if (err) throw err;
    }
  );
  return value[0][0];
}

/*
 * Add new data (e.g. a record for SQL) to "table" with a list of "fields" and
 * a list of their corresponding "values". Of course, the length of "fields"
 * should equal the length of "values".
 */
const insert = (table, fields, values) => {
  const params = '?,'.repeat(values.length-1) + '?';
  db.query(
    `INSERT INTO ${table} (${fields}) VALUES (${params})`,
    values,
    errFunction
  );
}

/*
 * Update data (e.g. a record for SQL) to "table" with a list of "fields" and
 * a list of their corresponding "values". Of course, the length of "fields"
 * should equal the length of "values".
 */
const update = (table, updated_field, fields, values, updated_value) => {
  const params = '?,'.repeat(values.length-1) + '?';
  db.query(
    `UPDATE ${table} SET ${updated_field}=?`
    + ` WHERE ${fields.join('=? AND ') + '=?'}`,
    [updated_value, ...values],
    errFunction
  );
}

/*
 * Delete from cache the object identified by "key".
 */
const uncache = (key) => {
  cache.del(key);
  console.log('Cache: Removed "' + key + '".');
}

module.exports.getObject = getObject;
module.exports.getList = getList;
module.exports.getByNullValue = getByNullValue;
module.exports.getAll = getAll;
module.exports.getMax = getMax;
module.exports.insert = insert;
module.exports.update = update;
module.exports.uncache = uncache;

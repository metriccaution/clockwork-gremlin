const { readFile, writeFile } = require("fs");
const { promisify } = require("util");
const isArray = require("lodash/isArray");

const readDb = file => () =>
  promisify(readFile)(file, "utf8")
    .then(JSON.parse)
    .catch(() => [])
    .then(data => (isArray(data) ? data : []));

const writeDb = file => data =>
  promisify(writeFile)(file, JSON.stringify(data, null, 2), {
    encoding: "utf8"
  });

module.exports = file => ({
  read: readDb(file),
  write: writeDb(file)
});

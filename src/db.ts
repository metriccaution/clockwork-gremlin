import { readFile, writeFile } from "fs";
import { promisify } from "util";
import { isArray } from "lodash";

const readDb = (file: string) => () =>
  promisify(readFile)(file, "utf8")
    .then(JSON.parse)
    .catch(() => [])
    .then(data => (isArray(data) ? data : []));

const writeDb = (file: string) => (data: any) =>
  promisify(writeFile)(file, JSON.stringify(data, null, 2), {
    encoding: "utf8"
  });

export default (file: string) => ({
  read: readDb(file),
  write: writeDb(file)
});

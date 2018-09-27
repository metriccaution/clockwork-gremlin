import { TimeDb, FileDb } from "./db";
import config, { Commands } from "./config";
import { help, start, stop, view } from "./commands";
import { existsSync, lstatSync } from "fs";

const configFile = config.get().configFile;
if (existsSync(configFile) && lstatSync(configFile).isFile()) {
  config.loadFile(configFile);
}

config.validate();

const args = config.get();
const db: TimeDb = new FileDb(args.file);

switch (args.command) {
  case Commands.Help:
    help();
    break;
  case Commands.Start:
    start(db, args.time);
    break;
  case Commands.Stop:
    stop(db, args.time);
    break;
  case Commands.View:
    view(db);
    break;
  default:
    throw new Error(`Unknown command "${args.command}"`);
}

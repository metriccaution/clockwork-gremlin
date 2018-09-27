import { existsSync, lstatSync } from "fs";
import { handleError, help, start, stop, view } from "./commands";
import config, { Commands } from "./config";
import { FileDb, TimeDb } from "./db";

const baseConfig = config.get();
const { configFile, project } = baseConfig;
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
    start(db, args.time, project).catch(handleError);
    break;
  case Commands.Stop:
    stop(db, args.time, project).catch(handleError);
    break;
  case Commands.View:
    view(db).catch(handleError);
    break;
  default:
    throw new Error(`Unknown command "${args.command}"`);
}

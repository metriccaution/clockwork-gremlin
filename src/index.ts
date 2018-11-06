import { existsSync, lstatSync } from "fs";
import { handleError, help, start, stop, view } from "./commands";
import config, { Commands } from "./config";
import { FileDb, TimeDb } from "./db";

(async () => {
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
      await start(db, args.time, project);
      await view(db);
      break;
    case Commands.Stop:
      await stop(db, args.time, project);
      await view(db);
      break;
    case Commands.View:
      await view(db);
      break;
    default:
      throw new Error(`Unknown command "${args.command}"`);
  }
})().catch(handleError);

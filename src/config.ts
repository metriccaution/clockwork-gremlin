import * as convict from "convict";
import { values } from "lodash";
import { resolve } from "path";
import { parseDate } from "./date";

export enum Commands {
  Help = "help",
  Start = "start",
  Stop = "stop",
  View = "view"
}

export default convict({
  configFile: {
    doc: "The location of any additional config",
    arg: "config",
    default: resolve(__dirname, "..", "config.json")
  },
  file: {
    doc: "The location of the database file",
    arg: "f",
    default: resolve(__dirname, "..", "db.json")
  },
  command: {
    doc: "The command being run",
    arg: "c",
    default: Commands.View,
    format: values(Commands)
  },
  time: {
    doc: "The time of the command being run (when appropriate)",
    arg: "t",
    default: new Date().toISOString(),
    format: parseDate
  },
  project: {
    doc: "The project chosen when not otherwise specified",
    arg: "p",
    default: "Time"
  }
});

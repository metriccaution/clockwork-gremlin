import * as convict from "convict";
import { resolve } from "path";
import { values } from "lodash";
import { parseDate } from "./date";

export enum Commands {
  Help = "help",
  Start = "start",
  Stop = "stop",
  View = "view"
}

export default convict({
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
  }
});

export default class Logger {
  static debug(message, label) {
    console.log("[DEBUG]", message, "(via " + label + ")");
  }

  static info(message, label) {
    console.log("[INFO]", message, "(via " + label + ")");
  }

  static warn(message, label) {
    console.log("[WARN]", message, "(via " + label + ")");
  }

  static error(message, label) {
    console.log("[ERROR]", message, "(via " + label + ")");
  }
}

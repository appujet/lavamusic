const chalk = require("chalk");
const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "log") {
		const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
		switch (type) {
	
		case "log": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgBlue(type.toUpperCase())}] ${content}`);
		}
		case "warn": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgYellow(type.toUpperCase())}] ${content}`);
		}
		case "error": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgRed(type.toUpperCase())}] ${content}`);
		}
		case "debug": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgGreen(type.toUpperCase())}] ${content}`);
		}
		case "cmd": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgWhite(type.toUpperCase())}] ${content}`);
		}
		case "event": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgWhite(type.toUpperCase())}] ${content}`);
		}
		case "ready": {
			return console.log(`[${chalk.gray(date)}]: [${chalk.black.bgBlueBright(type.toUpperCase())}] ${content}`);
		} 
		default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
		}
	}
};
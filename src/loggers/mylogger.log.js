"use strict";

const winston = require("winston");
const { createLogger, format } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );

    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          level: "info",
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true, // true: backup file log zip archive
          maxSize: "20m", // dung luong file log
          maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true, // true: backup file log zip archive
          maxSize: "20m", // dung luong file log
          maxFiles: "14d", // neu dat thi se xoa log trong vong 14 ngay
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }
    const requestId = req?.requestId || uuidv4();
    return { context, requestId, metadata };
  }

  log(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramsLog
    );
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();

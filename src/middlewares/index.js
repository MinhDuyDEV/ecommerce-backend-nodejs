"use strict";

const Logger = require("../loggers/discord.log.v2");

const pushToLogDiscord = async (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      code: {
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
      },
      title: `Request Log. Method: ${req.method} `,
      message: `${req.method} ${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};

"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = "1215422105928073310";
    // this.channelId = process.env.CHANNEL_ID_DISCORD;
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}`);
    });
    this.client.login(TOKEN_DISCORD);
  }
  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code Example",
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), // convert hexadecimal to color code to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    // const channel = this.client.channels.cache.get(this.channelId);
    // console.log("🚀 ~ LoggerService ~ sendToFormatCode ~ channel:", channel);
    // if (!channel) {
    //   console.log("Channel not found", this.channelId);
    //   return;
    // }
    this.sendToMessage(codeMessage);
  }
  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.log("Channel not found", this.channelId);
      return;
    }
    channel.send(message).catch((error) => {
      console.error("Error sending message", error);
    });
  }
}

module.exports = new LoggerService();

require("dotenv").config();
import { Client } from "discord.js";
import {
  scrapChannelForQrCodes,
  changeInvokeCommand,
  handleGameUpload,
  searchGame,
  handleGameEdit,
  createEmbeddedHelper
} from "./commands/index";
import { regexes, checkIfDM } from "./helpers/helpers";
import { initializeDb } from "./models/database";
import { approxQrCount } from "./db/db_qree";

void (async function() {
  try {
    await initializeDb();
    console.log("DB -> init DB");
  } catch (e) {
    console.log(e);
  }

  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (e) {
    console.log(e);
  }
})();

const client = new Client();
let botInvoker = process.env.BOT_DEFAULT_INVOKE;
let serverInvokers = new Map();

client.on("ready", async () => {
  console.log("On Discord!");
  console.log("Connected as " + client.user.tag);
  console.log("Servers:");
  client.guilds.forEach(guild => {
    serverInvokers.set(guild.id, botInvoker);
    console.log(" - " + guild.id);
    guild.channels.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });

    console.log(serverInvokers);
  });

  setInterval(async () => {
    const qrCount = await approxQrCount();
    qrCount.rows.map(async ({ count }) => {
      await client.user.setActivity(`QR Codes count: ${count}`, {
        type: "PLAYING"
      });
    });
  }, 60000);
});

client.on("message", receivedMessage => {
  if (receivedMessage.author === client.user) {
    // Prevent bot from responding to its own messages
    return;
  }

  if (receivedMessage.channel.type === "dm") {
    if (receivedMessage.content.startsWith(`${botInvoker}`)) {
      processCommand(receivedMessage);
    } else {
      return receivedMessage.channel.send(
        `You need to specify which command you want to use type "!qre help" to display available commands`
      );
    }
  } else {
    if (
      receivedMessage.content.startsWith(
        `${serverInvokers.get(receivedMessage.guild.id)}`
      )
    ) {
      processCommand(receivedMessage);
    }
  }
});

function processCommand(receivedMessage) {
  let fullCommand, primaryCommand;

  checkIfDM(receivedMessage)
    ? (fullCommand = receivedMessage.content.substr(botInvoker.length + 1))
    : (fullCommand = receivedMessage.content.substr(
        serverInvokers.get(receivedMessage.guild.id).length + 1
      ));

  const messageArguments = fullCommand.match(regexes.ARGUMENTS);

  if (messageArguments !== null && messageArguments.length) {
    primaryCommand = messageArguments[0]; // The first word directly after the exclamation is the command
  }

  if (
    primaryCommand === "" ||
    primaryCommand === null ||
    primaryCommand === undefined
  ) {
    checkIfDM(receivedMessage)
      ? receivedMessage.channel.send(
          `You need to specify which command you want to use type "!qre help" to display available commands`
        )
      : receivedMessage.channel.send(
          `You need to specify which command you want to use type "${serverInvokers.get(
            receivedMessage.guild.id
          )} help" to display available commands`
        );
    return;
  }

  if (primaryCommand === "help") {
    return createEmbeddedHelper(serverInvokers, receivedMessage).build();
  }

  if (!checkIfDM(receivedMessage)) {
    if (
      process.env.BOT_PERMISSIONS_GUILD.includes(receivedMessage.guild.id) &&
      receivedMessage.member.roles.some(r =>
        process.env.BOT_PERMISSIONS_ROLES.includes(r.name)
      )
    ) {
      if (primaryCommand === "upload") {
        return handleGameUpload(messageArguments, receivedMessage);
      }

      if (primaryCommand === "invoke") {
        return changeInvokeCommand(messageArguments, receivedMessage);
      }

      if (primaryCommand === "scrap") {
        return scrapChannelForQrCodes(messageArguments, receivedMessage);
      }

      if (primaryCommand === "edit") {
        return handleGameEdit(messageArguments, receivedMessage);
      }
    } else {
      return receivedMessage.channel.send(
        "You have no permissions to use this commands"
      );
    }
  }

  if (primaryCommand === "search") {
    return searchGame(messageArguments, receivedMessage);
  }

  return receivedMessage.channel.send(`Command not found`);
}

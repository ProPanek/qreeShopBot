const { findGame } = require("../../controllers/qree_items");
const {
  validation: { checkIfDM },
  embedded: { createEmbeddedAnswer }
} = require("../../helpers/index");

module.exports.searchGame = async function(messageArguments, receivedMessage) {
  try {
    let args = messageArguments.split(" ");
    args.shift();
    console.log(messageArguments, args);
    let finalArgs = args.join(" ");
    console.log(finalArgs);
    const rows = await findGame(finalArgs);
    console.log(rows);
    if (rows.length === 0) {
      if (checkIfDM(receivedMessage)) {
        return await receivedMessage.channel.send(
          `I didn't find anything called \`${finalArgs}\` in my database. If you want to request games join https://discord.gg/336MjzF`
        );
      } else {
        return await receivedMessage.channel.send(
          `I didn't find anything called \`${finalArgs}\` in my database. You can request game on <#670452321955610633> channel`
        );
      }
    } else {
      // const response = await receivedMessage.channel.send(`wait a moment...`);
      // const loadingMessageId = response.id;

      const QrCodesSearchResults = await createEmbeddedAnswer(
        rows,
        receivedMessage
        // loadingMessageId
      );
      await QrCodesSearchResults.build();
    }
  } catch (e) {
    console.log(e);
    await receivedMessage.channel.send(
      `something went wrong, send it to developer: \n\`\`\`diff\n- ${e}\`\`\``
    );
  }
};

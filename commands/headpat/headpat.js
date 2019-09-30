import { getRandomMeme } from "../../helpers/helpers";
import { RichEmbed } from "discord.js";

export async function headPat(messageArgument, receivedMessage) {
  if (messageArgument.length !== 2) {
    return receivedMessage.channel.send(
      `hey, specify who you want to headpat!`
    );
  }
  receivedMessage.channel.messages.get(receivedMessage.id).delete();
  const meme = await getRandomMeme("head-pat-anime");
  const embedHeadpat = new RichEmbed()
    .setColor(`${"#" + Math.floor(Math.random() * 16777215).toString(16)}`)
    .setDescription(
      `uwu *<@${receivedMessage.author.id}> headpats <@${messageArgument[1]}>*`
    )
    .setImage(meme);
  receivedMessage.channel.send(embedHeadpat);
}
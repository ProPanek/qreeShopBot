const {
  createEmbeddedAnswer,
  sendToQrGames,
  createRandomEmbed
} = require("./embedded/embedded");
const {
  validateAdmin,
  validateGuilds,
  validatePermissions,
  checkIfDM
} = require("./validation/validation");
const {
  checkFileSize,
  filteredRegexes,
  regexes
} = require("./other_helpers/other_helpers");
const {
  getGameCover,
  getRandomMeme
} = require("../helpers/third_party/third_party");
const {
  createASCIIQrCode,
  createDataURLQrCode,
  parseURL,
  createQrImageUrlFromLink
} = require("./qr/qr");
const { limitlessFetchMessages } = require("./discord/discord");

module.exports.validation = {
  validateAdmin,
  validateGuilds,
  validatePermissions,
  checkIfDM
};

module.exports.embedded = {
  createEmbeddedAnswer,
  sendToQrGames,
  createRandomEmbed
};

module.exports.third_party = {
  getGameCover,
  getRandomMeme
};

module.exports.qr = {
  createASCIIQrCode,
  createDataURLQrCode,
  parseURL,
  createQrImageUrlFromLink
};

module.exports.discord = {
  limitlessFetchMessages
};

module.exports.other = {
  checkFileSize,
  filteredRegexes,
  regexes
};

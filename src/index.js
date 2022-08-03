require("dotenv").config();
const { Client } = require("discord.js");

let client = new Client({
    intents: [
        1 << 0, // Guilds
        1 << 1, // Guild Members
        1 << 12 // Direct Messages
    ], allowedMentions: {
        parse: ["roles", "users"]
    },
    failIfNotExists: false // Sends normal message if message to reply to was deleted
})
module.exports = { client };
require("./setup.js");
client.login(process.env.TOKEN);

// In case we need the client somewhere else

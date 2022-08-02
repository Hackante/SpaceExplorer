// Gets the bot ready to run

const fs = require("fs");
const { Collection } = require("discord.js");
const { connect } = require("mongoose")

const client = require("./index.js");

// Collections
client.commands = new Collection();

// Categories
fs.readdirSync("./src/commands", { withFileTypes: true }).filter(file => file.isDirectory()).forEach(category => { // Don't access none existing folders
    console.log(`Loading commands in ${category.name}...`);
    fs.readdirSync(`./src/commands/${category}`, { withFileTypes: true }).filter(file => file.isFile()).forEach(file => {
        // Commands
        if (!file.name.endsWith(".js")) return; // Only add JS files
        const command = require(`./commands/${category.name}/${file.name}`);
        client.commands.set(command.object.name, command);
    });
});

// Events
fs.readdirSync("./src/events", { withFileTypes: true }).filter(file => file.isFile()).forEach(file => {
    if (!file.name.endsWith(".js")) return; // Only add JS files
    const event = require(`./events/${file.name}`);
    client.on(event.name, event.run);
});

// Database
await connect(process.env.MONGO).then(() => console.log("✅ Database is connected!")).catch(err => console.log(`❎ Error with connecting to the database!\n${err}`));
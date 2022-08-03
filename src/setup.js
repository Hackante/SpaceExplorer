// Gets the bot ready to run

const fs = require("fs");
const { Collection } = require("discord.js");
const { connect, connection } = require("mongoose");

const client = require("./index.js");

// Collections
client.commands = new Collection();

// Config.json
client.config = require("./config.json");

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
connect(process.env.MONGO).then(() => console.log("✅ Database is connected!")).catch(err => console.log(`❎ Error with connecting to the database!\n${err}`));
connection.on("error", (err) => {
    console.error(err);
});
connection.on("disconnected", () => {
    console.log("❎ Database is disconnected!");
    // Disable DB commands
});
connection.on("reconnected", () => {
    console.log("✅ Database is reconnected!");
    // Enable DB commands
});

// Deploy commands
client.once("ready", () => {
    client.commands.each(command => {
        client.application.commands.fetch().then(commands => {
            let com = commands.find(c => c.name == command.object.name);
            if (!com) {
                // Creating non existing commands
                client.application.commands.create(command.object).then(() => {
                    console.log(`✅ Command ${command.object.name} was deployed!`);
                }).catch(err => {
                    console.log(`❎ Error with deploying command ${command.object.name}!\n${err}`);
                });
            } else {
                // Updating existing commands
                if (!com.equals(command.object)) {
                    client.application.commands.edit(com, command.object).then(() => {
                        console.log(`✅ Command ${command.object.name} was updated!`);
                    }).catch(err => {
                        console.log(`❎ Error with updating command ${command.object.name}!\n${err}`);
                    });
                }
            }
        }).catch(err => console.log(`❎ Error with fetching commands!\n${err}`));
    })
    console.log(`${client.commands.size} commands loaded!`);
});
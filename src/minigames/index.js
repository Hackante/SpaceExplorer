/**
 * This file is only for collecting all minigames and and return the files in an array.
 */
const { readdirSync } = require("fs");
const minigames = [];
const minigamesDir = "./src/minigames";
const minigamesFiles = readdirSync(minigamesDir, { withFileTypes: true });
minigamesFiles.forEach(file => {
    if (!file.isFile() || file.name == "index.js") return;
    minigames.push(require(`${__dirname}/${file.name}`));
});

module.exports = minigames;
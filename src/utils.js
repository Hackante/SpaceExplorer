const { ActionRow } = require("discord.js");
const explorers = require("./Schemas/explorers");

module.exports = class Util {
    // Resolve a color from Hex to number
    static recolveColor(color) {
        return parseInt(color.replace("#", ""), 16);
    }

    // Add XP to a user and check it for level up
    static async addXP(userID, xp) {
        let explorer = await explorers.findOne({ user: userID });
        if (!explorer) explorer = await explorers.create({ user: userID });
        explorer.xp += xp;
        // linear level up till level 5 then exponential
        switch (explorer.level <= 5) {
            case true:
                if (explorer.xp >= (explorer.level * 50)) {
                    explorer.xp -= (explorer.level * 50);
                    explorer.level++;
                }
                break;
            case false:
                if (explorer.xp >= (Math.pow(explorer.level, 2) * 10)) {
                    explorer.xp -= (Math.pow(explorer.level, 2) * 10);
                    explorer.level++;
                }
                break;
        }
        explorer.save();
        return false;
    }
}
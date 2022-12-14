const explorers = require("../../Schemas/explorers");

module.exports = {
    object: {
        name: "discovery",
        description: "Complete a discovery mission.",
    },
    run: async function (interaction, client) {
        // if last discovery was less than 6 hours ago, return
        if (interaction.explorer.missions.lastDiscovery > Date.now() - 21600000) {
            interaction.reply({ content: interaction.i18n("mission.notReady", { time: Math.floor(Date.now() / 1000) + 43200 }), ephemeral: true });
            return;
        }
        if(interaction.explorer.missions.discActive) {
            interaction.reply({ content: interaction.i18n("mission.discActive"), ephemeral: true });
            return;
        }
        try {
            let missions = require("../../minigames/");
            missions[Math.floor(Math.random() * missions.length)].start(client, interaction);
        } catch (e) {
            console.log(e);
        }
        await explorers.updateOne({ user: interaction.user.id }, { $set: { "missions.lastDiscovery": new Date() } });
        return;
    }
}
const ms = require("ms");
const explorers = require("../../Schemas/explorers");

module.exports = {
    object: {
        name: "info",
        description: "Get information about the bot.",
    },
    run: async function (interaction, client) {
        let embed = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: `**Guilds**: ${client.guilds.cache.size}\n**Users**: ${await explorers.count({})}\n**Channels**: ${client.channels.cache.size}\n**Commands**: ${client.commands.size}\n**Uptime**: ${ms(process.uptime()*1000, { long: true })}`,
        }
        interaction.reply({ embeds: [embed] });
    }
}
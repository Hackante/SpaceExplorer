const { EmbedBuilder } = require("discord.js");

module.exports = {
    object: {
        name: "ping",
        description: "Send a signal into space and see how good the connection is.",
    },
    run: function(interaction, client) {
        let embed = new EmbedBuilder({
            color: 0x042B63,
            description: `Pinging...\nResult: ${client.ws.ping}ms`,
        })
        interaction.reply({embeds: [embed]});
    }
}
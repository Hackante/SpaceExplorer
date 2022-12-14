module.exports = {
    object: {
        name: "ping",
        description: "Send a signal into space and see how good the connection is.",
    },
    run: function(interaction, client) {
        let embed = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: `Pinging...\nResult: ${client.ws.ping}ms`,
        }
        interaction.reply({embeds: [embed]});
    }
}
module.exports = {
    object: {
        name: "exit",
        description: "Stop the bot",
    },
    devOnly: true,
    run: async function (interaction, client) {
        await interaction.reply({ content: "Shutting down" });
        client.destroy();
    }
}
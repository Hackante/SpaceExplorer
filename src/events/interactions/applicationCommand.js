module.exports = (interaction, client) => {
    // Return if user blacklisted and commandName is not appeal
    //if(interaction.explorer.blacklisted && interaction.commandName != "appeal") return;

    // Search for the command
    const command = client.commands.get(interaction.commandName);
    if(!command) {
        interaction.reply({content: "❎ Command not found! Please notify the developers.", ephemeral: true});
        console.log(`${interaction.user.tag} tried to use the command ${interaction.commandName} but it was not found.`);
        return;
    }

    // Check permissions
    if(command.devOnly && !client.config.developers.includes(interaction.user.id)) {
        interaction.reply({content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true});
        return;
    }
    if(command.betaOnly && !interaction.explorer.settings.beta) {
        interaction.reply({content: "❎ You do not have permission to use this command!\nMissing: [Beta Access]", ephemeral: true});
        return;
    }
    if(command.guildOnly && !interaction.inGuild()) {
        interaction.reply({content: "❎ You can only use this command in a server!", ephemeral: true});
        return;
    }

    // Run the command
    command.run(interaction, client);
}
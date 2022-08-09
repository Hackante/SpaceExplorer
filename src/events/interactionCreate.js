const explorers = require("../Schemas/explorers");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        // Create new Explorers if necessary
        interaction.explorer = await explorers.findOne({ user: interaction.user.id});
        if(!interaction.explorer) {
            interaction.explorer = await explorers.create({ user: interaction.user.id });
            // Welcome the user with a message
            let embed = {
                color: client.utils.resolveColor(client.config.colors.invis),
                // TODO: Edit and expand this message
                description: `Welcome Explorer#${await explorers.count({})}!\nYou are now part of the SpaceExplorationForce!\nUse </about:id> (\`/about\`) to get more information about the bot, its commands and how everything works.`,
                thumbnail: {
                    url: interaction.user.displayAvatarURL()
                },
                color: client.utils.resolveColor(client.config.colors.invis)

            }
            interaction.user.send({embeds: [embed]});
        }

        interaction.i18n = (key, data) => {
            return require("../../i18n")({key, replaceData: data, language: interaction.explorer.settings.language})
        }

        if(interaction.explorer.blacklisted && !interaction.type == 2) return;

        switch (interaction.type) {
            case 2: { 
                // ApplicationCommand 
                require("./interactions/applicationCommand")(interaction, client);
                break;
            } case 3: {
                // MessageComponent
                break;
            } case 4: {
                // AutoComplete
                break;
            } case 5: {
                // ModalSubmit
                break;
            } default: {
                // Ping or unknown
                return;
            }
        }
    });
}
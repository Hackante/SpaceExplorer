const explorers = require("../../Schemas/explorers");

module.exports = {
    object: {
        name: "balance",
        description: "View your balance",
        options: [
            {
                name: "user",
                description: "The user to view the balance of",
                type: 6,
                required: false,
            }
        ]
    },
    run: async function(interaction, client) {
        let user = interaction.options.getUser("user") || interaction.user;
        let explorer = await explorers.findOne({ user: user.id });
        if (!explorer) {
            interaction.reply({content: interaction.i18n("inventory.noExplorer"), ephemeral: true});
            return;
        }
        let embed = {
            title: "Balance",
            description: `${user} currently has ${explorer.inventory.credits} credits.`,
            thumbnail: {
                url: user.displayAvatarURL()
            },
            color: client.utils.resolveColor(client.config.colors.invis)
        }
        interaction.reply({embeds: [embed]});
        return;
    }
}
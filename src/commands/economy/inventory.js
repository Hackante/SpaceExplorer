const explorers = require("../../Schemas/explorers");

module.exports = {
    object: {
        name: "inventory",
        description: "View your inventory",
        options: [
            {
                name: "user",
                description: "The user to view the inventory of",
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
            title: "Inventory",
            description: "**Materials:**",
            fields: [
                { name: "Iron", value: explorer.inventory.materials.iron.toString(), inline: true },
                { name: "Copper", value: explorer.inventory.materials.copper.toString(), inline: true },
                { name: "Silver", value: explorer.inventory.materials.silver.toString(), inline: true },
                { name: "Credits", value: explorer.inventory.credits.toString(), inline: false },
                { name: "Level", value: explorer.level.toString(), inline: true },
                { name: "XP", value: `${explorer.xp}/${explorer.level >= 5 ? explorer.level * 50 : (Math.pow(explorer.level, 2) * 10)}`, inline: true },
                { name: "Robo Level", value: explorer.robo.level.toString(), inline: false },
            ],
            thumbnail: {
                url: user.displayAvatarURL()
            },
            color: client.utils.resolveColor(client.config.colors.invis)
        }
        interaction.reply({embeds: [embed]});
        return;
    }
}
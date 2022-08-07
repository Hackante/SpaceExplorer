module.exports = {
    object: {
        name: "upgrade",
        description: "Upgrade your Robo",
    },
    run: async function (interaction, client) {
        let roboLevel = interaction.explorer.robo.level;
        let requirements = roboLevel <= 5 ? { iron: 100 * roboLevel, copper: 50 * roboLevel, silver: 50 * roboLevel } : { iron: Math.pow(roboLevel, 2) * 15, copper: Math.pow(roboLevel, 2) * 8, silver: Math.pow(roboLevel, 2) * 8 };
        let iron = interaction.explorer.inventory.materials.iron + "/" + requirements.iron;
        let copper = interaction.explorer.inventory.materials.copper + "/" + requirements.copper;
        let silver = interaction.explorer.inventory.materials.silver + "/" + requirements.silver;
        if (interaction.explorer.inventory.materials.iron < requirements.iron || interaction.explorer.inventory.materials.copper < requirements.copper || interaction.explorer.inventory.materials.silver < requirements.silver) {
            interaction.reply({ content: interaction.i18n("upgrade.noMaterials", { iron, copper, silver }), ephemeral: true });
            return;
        }
        let embed = {
            title: "Upgrade",
            description: "**Materials:**",
            fields: [
                { name: "Iron", value: iron, inline: true },
                { name: "Copper", value: copper, inline: true },
                { name: "Silver", value: silver, inline: true },
            ],
            thumbnail: {
                url: interaction.user.displayAvatarURL()
            },
        }
        let components = [{
            type: 1,
            components: [
                {
                    type: 2,
                    label: `Upgrade to ${interaction.explorer.robo.level + 1}`,
                    style: 3,
                    custom_id: `upgrade-confirm-${interaction.user.id}-${interaction.explorer.robo.level + 1}`,
                }, {
                    type: 2,
                    label: `Cancel`,
                    style: 4,
                    custom_id: `upgrade-cancel-${interaction.user.id}`,
                }
            ]
        }]
        let reply = await interaction.reply({ embeds: [embed], components });
        let coll = reply.createMessageComponentCollector({ time: 15_000 })
        coll.on("collect", async (component) => {
            if (!component.user.id == interaction.user.id) return interaction.reply({ content: interaction.i18n("deny.button"), ephemeral: true });
            if (component.custom_id.startsWith("upgrade-confirm-")) {
                let level = parseInt(component.custom_id.split("-")[3]);
                interaction.explorer.robo.level = level;
                interaction.explorer.inventory.materials.iron -= requirements.iron;
                interaction.explorer.inventory.materials.copper -= requirements.copper;
                interaction.explorer.inventory.materials.silver -= requirements.silver;
                interaction.explorer.save();
                interaction.reply({ content: interaction.i18n("upgrade.success", { level }) });
                coll.stop();
            } else if (component.custom_id.startsWith("upgrade-cancel-")) {
                interaction.reply({ content: interaction.i18n("upgrade.cancelled"), ephemeral: true });
                coll.stop();
            }
            return;
        })
        coll.on("end", (collected) => {
            reply.edit({ content: collected.size > 0 ? null : "Upgrade cancelled", components: [] });
            return;
        })
    }
}

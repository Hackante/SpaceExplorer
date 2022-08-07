const explorers = require("../../Schemas/explorers.js");

module.exports = {
    object: {
        name: "upgrade",
        description: "Upgrade your Robo",
    },
    run: async function (interaction, client) {
        let roboLevel = interaction.explorer.robo.level;
        let requirements = roboLevel <= 5 ? { iron: 100 * roboLevel, copper: 50 * roboLevel, silver: 50 * roboLevel } : { iron: Math.pow(roboLevel, 2) * 15, copper: Math.pow(roboLevel, 2) * 8, silver: Math.pow(roboLevel, 2) * 8 };
        Object.assign(requirements, { credits: roboLevel * 100 });
        let iron = interaction.explorer.inventory.materials.iron + "/" + requirements.iron;
        let copper = interaction.explorer.inventory.materials.copper + "/" + requirements.copper;
        let silver = interaction.explorer.inventory.materials.silver + "/" + requirements.silver;
        let credits = interaction.explorer.inventory.credits + "/" + requirements.credits;
        let disabled = false;
        if (interaction.explorer.inventory.materials.iron < requirements.iron || interaction.explorer.inventory.materials.copper < requirements.copper || interaction.explorer.inventory.materials.silver < requirements.silver ||interaction.explorer.inventory.credits < requirements.credits) {
            disabled = true;
        }
        let embed = {
            title: "Upgrade",
            description: "**Materials:**",
            fields: [
                { name: "Iron", value: iron, inline: true },
                { name: "Copper", value: copper, inline: true },
                { name: "Silver", value: silver, inline: true },
                { name: "Credits", value: credits, inline: false },
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
                    disabled
                }, {
                    type: 2,
                    label: `Cancel`,
                    style: 4,
                    custom_id: `upgrade-cancel-${interaction.user.id}`,
                }
            ]
        }]
        let reply = await interaction.reply({ embeds: [embed], components, content: disabled ? interaction.i18n("upgrade.noMaterials") : null });
        let coll = reply.createMessageComponentCollector({ time: 15_000 })
        coll.on("collect", async (button) => {
            if (!button.user.id == interaction.user.id) return interaction.reply({ content: interaction.i18n("deny.button"), ephemeral: true });
            if (button.customId.startsWith("upgrade-confirm-")) {
                let level = parseInt(button.customId.split("-")[3]);
                let o = {$inc: { "robo.level": 1 , "inventory.materials.iron": -requirements.iron, "inventory.materials.copper": -requirements.copper, "inventory.materials.silver": -requirements.silver, "inventory.credits": -requirements.credits}};
                await explorers.updateOne({user: interaction.user.id}, o);
                button.reply({ content: interaction.i18n("upgrade.success", { level }) });
                coll.stop("confirmed");
            } else if (button.customId.startsWith("upgrade-cancel-")) {
                button.reply({ content: interaction.i18n("upgrade.cancel"), ephemeral: true });
                coll.stop("cancel");
            }
            return;
        })
        coll.on("end", (collected, reason) => {
            interaction.editReply({ content: reason == "confirmed" ? null : "Upgrade cancelled", components: [] });
            return;
        })
        return;
    }
}

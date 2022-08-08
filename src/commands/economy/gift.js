const explorers = require("../../Schemas/explorers");

module.exports = {
    object: {
        name: "gift",
        description: "Gift a user a certain amount of credits",
        options: [{
            type: 6,
            name: "user",
            description: "The user to gift items/credits to",
            required: true,
        }, {
            type: 4,
            minValue: 1,
            name: "amount",
            description: "The amount of items/credits to gift",
            required: true,
        }, {
            type: 3,
            name: "item",
            description: "The item to gift",
            required: true,
            choices: [
                { name: "Credits", value: "credits" },
                { name: "Iron", value: "iron" },
                { name: "Copper", value: "copper" },
                { name: "Silver", value: "silver" },
            ]
        }]
    },
    run: async function (interaction, client) {
        let user = interaction.options.getUser("user");
        let amount = interaction.options.getInteger("amount");
        let item = interaction.options.getString("item");

        let explorer = await explorers.findOne({ user: user.id });
        if (!explorer) {
            interaction.reply({ content: interaction.i18n("inventory.noExplorer"), ephemeral: true });
            return;
        }

        let updateNeg = { $inc: {} };
        let updatePos = { $inc: {} };

        if (item == "credits") {
            if (amount > interaction.explorer.inventory.credits) {
                interaction.reply({ content: interaction.i18n("inventory.notEnoughCredits"), ephemeral: true });
                return;
            }
            updateNeg.$inc["inventory.credits"] = -amount;
            updatePos.$inc["inventory.credits"] = amount;
        } else {
            if (amount > interaction.explorer.inventory.materials[item]) {
                interaction.reply({ content: interaction.i18n("inventory.notEnoughItems", { item: item }), ephemeral: true });
                return;
            }
            updateNeg.$inc["inventory.materials." + item] = -amount;
            updatePos.$inc["inventory.materials." + item] = amount;
        }

        let bttns = {
            type: 1,
            components: [{
                type: 2,
                label: "Confirm",
                style: 3,
                custom_id: "gift-confirm",
                disabled: false,
            }, {
                type: 2,
                label: "Cancel",
                style: 4,
                custom_id: "gift-cancel",
                disabled: false,
            }]
        }

        let embed = {
            title: "Gift",
            description: `Do you want to gift **${user.username}** ${amount} ${item}?`,
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
            color: client.utils.resolveColor(client.config.colors.invis),
        }
        let rpl = await interaction.reply({ embeds: [embed], components: [bttns] });
        let coll = rpl.createMessageComponentCollector({ time: 15_000 })
        coll.on("collect", async (b) => {
            if(interaction.user.id != b.user.id) return b.reply({ content: interaction.i18n("deny.button"), ephemeral: true });
            bttns.components[0].disabled = true;
            bttns.components[1].disabled = true;
            if (b.customId == "gift-confirm") {
                await explorers.updateOne({ user: user.id }, updatePos);
                await explorers.updateOne({ user: interaction.user.id }, updateNeg);
                b.reply({ content: interaction.i18n("inventory.gifted", { amount, item, user: user.username }), components: [bttns]});
            } else if (b.customId == "gift-cancel") {
                await b.update({ content: "Cancelled", components: [bttns] });
            }
        });
    }
}
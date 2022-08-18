const { MessageCollector } = require("discord.js");
const explorers = require("../../Schemas/explorers");

module.exports = async (interaction, client) => {
    // fixed custom ids 
    switch (interaction.customId) {
        case "dev-stop": {
            if (!client.config.developers.includes(interaction.user.id)) return interaction.reply({ content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true });
            interaction.reply("Stopping the bot...");
            client.destroy();
            console.log("Bot stopped.");
            break;
        }
        case "dev-eval": {
            if (!client.config.developers.includes(interaction.user.id)) return interaction.reply({ content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true });
            interaction.showModal(
                {
                    "title": "Evaluate code",
                    "custom_id": "dev-eval",
                    "components": [{
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "eval-code",
                            "label": "Code",
                            "style": 2,
                            "placeholder": "Code...",
                            "required": true
                        }]
                    }]
                }
            )
            break;
        } 
        case "dev-changes": {
            if (!client.config.developers.includes(interaction.user.id)) return interaction.reply({ content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true });
            interaction.showModal(
                {
                    "title": "Announce changes",
                    "custom_id": "dev-changes",
                    "components": [{
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "changes-message",
                            "label": "Message",
                            "style": 2,
                            "placeholder": "Message...",
                            "required": true
                        }]
                    }]
                }
            );
            break;
        }
    }
// TODO: 
/**
 * Specify the type of the announcement (changes, major, giveaway, all)
 * Depending on the type change the embed title and send to other users
 */


    // ids with userID
    if (interaction.customId.startsWith("report-")) {
        if (interaction.customId.split("-")[2] != interaction.user.id) return interaction.reply({ content: interaction.i18n("deny.button"), ephemeral: true });
        switch (interaction.customId.split("-")[1]) {
            case "bug": {
                let bugModal = {
                    "title": "Report a bug",
                    "custom_id": "report-bug",
                    "components": [{
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "bug-title",
                            "label": "Title",
                            "style": 1,
                            "placeholder": "/daily failed",
                            "max_length": 256,
                            "min_length": 1
                        }]
                    }, {
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "bug-description",
                            "label": "Description",
                            "style": 2,
                            "placeholder": "Detailed description of the bug (step by step)",
                            "min_length": 20,
                        }]
                    }]
                }
                interaction.showModal(bugModal);
                break;
            } case "feature": {
                let featureModal = {
                    "title": "Report a feature request",
                    "custom_id": "report-feature",
                    "components": [{
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "feature-title",
                            "label": "Title",
                            "style": 1,
                            "placeholder": "/spacenews command",
                            "max_length": 256,
                            "min_length": 1
                        }]
                    }, {
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "feature-description",
                            "label": "Description",
                            "style": 2,
                            "placeholder": "Detailed description of the feature and why it's needed",
                            "min_length": 20,
                        }]
                    }]
                }
                interaction.showModal(featureModal);
                break;
            } case "user": {
                let userModal = {
                    "title": "Report a user",
                    "custom_id": "report-user",
                    "components": [{
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "user-id",
                            "label": "User ID",
                            "style": 1,
                            "placeholder": "e.g. 517335997172809728",
                            "max_length": 20,
                            "min_length": 18,
                        }]
                    }, {
                        "type": 1,
                        "components": [{
                            "type": 4,
                            "custom_id": "user-reason",
                            "label": "Reason",
                            "style": 2,
                            "placeholder": "Detailed description why the user should be banned",
                            "min_length": 20,
                        }]
                    }]
                }
                interaction.showModal(userModal);
                break;
            }
        }
    }
    if(interaction.customId.startsWith("changes-")) {
        switch(interaction.customId.split("-")[1]) {
            case "confirm": {
                let e = await client.db.get("dev-changes-pre");
                await client.db.set("dev-changes-pre", null);
                await client.db.set("dev-changes", e);

                explorers.find({"subscriptions.changes": true}).then(async (users) => {
                    for(let user of users) {
                        let u = await client.users.fetch(user.user);
                        u.send({embeds: [e]})
                    }
                }).catch(console.error);

                break;
            } case "cancel": {

                break;
            } case "all": {

                break;
            }
        }
    }
}
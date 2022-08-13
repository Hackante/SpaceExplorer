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
    }

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
                        }, {
                            "type": 4,
                            "custom_id": "bug-description",
                            "label": "Description",
                            "style": 2,
                            "placeholder": "Detailled description...",
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
                        }, {
                            "type": 4,
                            "custom_id": "feature-description",
                            "label": "Description",
                            "style": 2,
                            "placeholder": "Detailled description...",
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
                        }, {
                            "type": 4,
                            "custom_id": "user-reason",
                            "label": "Reason",
                            "style": 2,
                            "placeholder": "Detailled description...",
                            "min_length": 20,
                        }]
                    }]
                }
                interaction.showModal(userModal);
                break;
            }
        }
    }
}
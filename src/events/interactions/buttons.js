const { MessageCollector } = require("discord.js");
const explorers = require("../../Schemas/explorers");

module.exports = async (interaction, client) => {
    switch (interaction.customId) {
        case "dev-stop": {
            if(!client.config.developers.includes(interaction.user.id)) return interaction.reply({content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true});
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
        }
    }
}
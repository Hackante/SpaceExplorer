// Sorry for the messy code my friend(s) D:

const { ComponentType } = require("discord.js");

module.exports = {
    async start(client, interaction) {
        interaction.deferReply();

        // This is a "blank", an emoji that is invisible
        const n = "<:blank:1004637804619374653>";

        // Creating a mission embed
        let missionEmb = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: `‍🚀 An enemy spaceship has been destroying cargo ships in D sector. We need someone to look into it and take care of the intruder.`,
        }

        // We will send this when a user first triggers the commnad
        let confirmRow = {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Look into it",
                    "style": 1,
                    "custom_id": "pursue"
                },
                {
                    "type": 2,
                    "emoji": "❌",
                    "style": 1,
                    "custom_id": "cancel"
                }
            ]
        };

        interaction.editReply({ embeds: [missionEmb], components: [confirmRow] });


        const confirmCollector = interaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        confirmCollector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === "pursue") {

                    // Disable both buttons since we no longer require them
                    confirmRow.components[0].setDisabled(true);
                    confirmRow.components[1].setDisabled(true);

                    // Create objects for each player, in this case, the user and the enemy
                    let userGameStats = {
                        hp: '4',
                        action: undefined,
                        charge: '0' // <-- 0 means no charge, 1 means charge
                    }

                    let enemyGameStats = {
                        hp: '4',
                        action: undefined,
                        charge: '1' // <-- 0 means no charge, 1 means charge
                    }


                    /*
                        Rendering message
                    */

                    let msg;

                    // Setting the positioning of the players
                    msg = `🧑‍🚀${n}${n}${n}${n}${n}🛸${n}${n}${n}`;

                    // Adding in the HP on the second line (hearts representing the health) | HP should be 4 at the start of the game
                    msg = msg + `\n` + `❤️`.repeat(userGameStats.hp) + `${n}${n}` + `❤️`.repeat(enemyGameStats.hp);

                    // Getting the charge of the enemies/user and rendering it
                    msg = msg + `\n` + `${userGameStats.charge}${n}${n}${n}${n}${n}${enemyGameStats.charge}`;
                    msg.replace("0", "\u200b");
                    msg.replace("1", "🔋");


                    // Creating an embed for the story ark
                    let arkEmb = {
                        color: client.config.invisColor,
                        description: `‍⚠️ Alert! Alert! Your radar scans have detected a nearby enemy spaceship armed and ready!`,
                    }

                    // Creating a literal *action* row (sorry if it's confusing)
                    let actionRow = {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "label": "Shoot",
                                "style": 4,
                                "custom_id": "shoot"
                            },
                            {
                                "type": 2,
                                "label": "Recharge",
                                "style": 1,
                                "custom_id": "recharge"
                            },
                            {
                                "type": 2,
                                "label": "Shield",
                                "style": 2,
                                "custom_id": "shield"
                            }
                        ]
                    };

                    interaction.followUp({ embeds: [arkEmb], components: [actionRow], content: msg });


                    


                } else if (i.customId === 'cancel') {
                    // Reply if the user cancels the interaction
                    interaction.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: client.config.mission.cancel }] });

                    // Disable both buttons
                    confirmRow.components[0].setDisabled(true);
                    confirmRow.components[1].setDisabled(true);

                    return;
                }

            } else {
                // "This button is not for you" -- Send this when a user clicks a button on a msg that they did not begin
                i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: client.config.deny.button }], ephemeral: true });
            }
        });

    }

}
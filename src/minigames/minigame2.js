// Sorry for the messy code my friend(s) D:

const { ComponentType } = require("discord.js");

let actionCollector;

module.exports = {
    async run(client, interaction) {
        interaction.deferReply();

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


        const collector = interaction.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === "pursue") {

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

                    // Render the environment
                    let render = await this.render(userGameStats, enemyGameStats);

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

                    i.followUp({ embeds: [arkEmb] });
                    i.followUp({ content: render, components: [actionRow] });

                } else if (i.customId === 'cancel') {
                    // Reply if the user cancels the interaction
                    i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: client.config.mission.cancel }] });

                    // Disable both buttons
                    confirmRow.components[0].setDisabled(true);
                    confirmRow.components[1].setDisabled(true);

                    return;
                }

                if (i.customId == 'shoot' || i.customId == 'recharge' || i.customId == 'shield') {
                    this.doAction(i, i.customId, userGameStats, enemyGameStats);
                }

            } else {
                // "This button is not for you" -- Send this when a user clicks a button on a msg that they did not begin
                i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: client.config.deny.button }], ephemeral: true });
            }
        });

    },

    async render(userGameStats, enemyGameStats) {
        // This is a "blank", an emoji that is invisible
        const n = "<:blank:1004637804619374653>";

        let render;

        // Setting the positioning of the players
        render = `🧑‍🚀${n}${n}${n}${n}${n}🛸${n}${n}${n}`;

        // Adding in the HP on the second line (hearts representing the health) | HP should be 4 at the start of the game
        render = render + `\n` + `❤️`.repeat(userGameStats.hp) + `${n}${n}` + `❤️`.repeat(enemyGameStats.hp);

        // Getting the charge of the enemies/user and rendering it
        render = render + `\n` + `${userGameStats.charge}${n}${n}${n}${n}${n}${enemyGameStats.charge}`;
        render.replace("0", "\u200b");
        render.replace("1", "🔋");

        return render;
    },

    async doAction(i, action, userGameStats, enemyGameStats) {
        let enemyAction = await this.getAction(i, action, userGameStats, enemyGameStats)
        // When a user does an action
        switch (action) {
            case "shoot":
                if (userGameStats.charge == 0) {
                    i.reply ({ content: "❌ You do not have enough charge to run this command", ephemeral: true })
                    return;
                }

                enemyGameStats.hp = enemyGameStats.hp - 1;

                if (enemyGameStats.hp < 1) {
                    // Game over
                    this.getResults(i, userGameStats, enemyGameStats);
                    return;
                }

                break;

            case "recharge":
                if (userGameStats.charge == 1) {
                    // Say "you already have full charge"
                    return;
                }

                userGameStats.charge = 1;

                break;

            case "shield":
                //
                break;
        }
    },

    async getAction(i, action, userGameStats, enemyGameStats) {
        let action;
        if (enemyGameStats.charge == 0) {
            action = 'recharge';
        } else if (enemyGameStats.charge == 1) {
            action = 'shoot';
        } else {
            action = 'shield';
        }

        return action;
    },

    async getResults() {

    }

}
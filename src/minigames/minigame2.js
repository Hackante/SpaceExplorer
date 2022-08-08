// Sorry for the messy code my friend(s) D:
// I rushed this so hard lol :o

const { ComponentType, createMessageComponentCollector, MessageEmbed } = require("discord.js");
const { start } = require("./minigame1");

let actionRow;
let collector;

module.exports = {
    async start(client, interaction) {

        actionRow = {
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

        let userGameStats = {
            hp: '4',
            action: undefined,
            charge: '0', // <-- 0 means no charge, 1 means charge
            shield: false
        }

        let enemyGameStats = {
            hp: '4',
            action: undefined,
            charge: '1', // <-- 0 means no charge, 1 means charge
            shield: false
        }

        // Creating a mission embed
        console.log("Creating mission embed");
        let missionEmb = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: `‍🚀 An enemy spaceship has been destroying cargo ships in D sector. We need someone to look into it and take care of the intruder.`,
        }

        // We will send this when a user first triggers the commnad
        console.log("Creating confirmation row");
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

        console.log("Sending mission task");
        await interaction.reply({ embeds: [missionEmb], components: [confirmRow] });

        console.log("Making collector");
        collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if (i.customId === "pursue") {

                    // Create objects for each player, in this case, the user and the enemy
                    userGameStats = {
                        hp: '4',
                        action: undefined,
                        charge: '0' // <-- 0 means no charge, 1 means charge
                    }

                    enemyGameStats = {
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


                    i.reply({ embeds: [arkEmb] });
                    i.channel.send({ content: render, components: [actionRow] });

                } else if (i.customId === 'cancel') {
                    // Reply if the user cancels the interaction
                    i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: "Mission cancelled." }] });

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
                    i.reply({ content: "❌ You do not have enough charge to run this command", ephemeral: true });
                    return;
                }

                if (enemyGameStats.shield == true) {
                    i.reply({ content: "❌ The alien shieleded, you did not damage to him", ephemeral: true });
                    return;
                }

                enemyGameStats.hp = enemyGameStats.hp - 1;
                userGameStats.charge = 0;
                i.reply({ content: "✅ You shot the intruder and dealt **one** heart", ephemeral: true })

                if (enemyGameStats.hp < 1) {
                    // Game over
                    this.getResults(i, userGameStats, enemyGameStats);
                    return;
                }

                break;

            case "recharge":
                if (userGameStats.charge == 1) {
                    i.reply({ content: "❌ You already have full charge :D", ephemeral: true });
                    return;
                }

                userGameStats.charge = 1;
                i.reply({ content: "✅ You recharged successfully", ephemeral: true })

                break;

            case "shield":
                i.reply({ content: "✅ You shielded successfully", ephemeral: true })
                break;
        }

        i.channel.send("The alien used the action " + enemyAction);

        switch (enemyAction) {
            case "shoot":
                if (userGameStats.shield = true) return console.log("Since you were shielded, they did not damage");
                userGameStats.hp = parseInt(userGameStats.hp) - 1;
                i.channel.send("You lost **one** heart");
                enemyGameStats.charge = 0;
                break;

            case "recharge":
                enemyGameStats.charge = '1';
                i.channel.send("The alien gained one charge point");
                break;

            case "shield":
                enemyGameStats.shield = true;
                i.channel.send("The enemy shielded");
                break;

        }

        console.log("Rendering...");
        let render = await this.render(userGameStats, enemyGameStats);
        console.log("Rendered");
        i.channel.send({ content: render, components: [actionRow] });

        console.log("Setting up collector");
        try {
            collector = i.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
        } catch(err) {
            console.log(err);
        }

    },

    async getAction(i, action, userGameStats, enemyGameStats) {
        let enemyAction;
        if (enemyGameStats.charge == 0) {
            enemyAction = 'recharge';
            console.log("Enemy recharged");

        } else if (enemyGameStats.charge == 1) {
            enemyAction = 'shoot';
            
            console.log("Enemy used Shoot action, user HP is now " + userGameStats.hp + ", things are not looking good!! D:");

        } else {
            enemyAction = 'shield';
            
            console.log("Enemy shielded");

        }

        return enemyAction;
    },

    async getResults() {

    }

}
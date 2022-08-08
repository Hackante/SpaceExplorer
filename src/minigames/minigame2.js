const explorers = require("../Schemas/explorers");

module.exports = {
    async start(client, interaction) {

        // Declare a player and a computer player object that contain the properties hp, action, shield and charge
        var player = {
            hp: 4,
            action: "",
            shield: false,
            charge: 0
        }
        var computer = {
            hp: 4,
            action: "",
            shield: false,
            charge: 1
        }

        // Set the actions for player and random for computer
        function setAction(playerAct) {
            player.shield = false;
            computer.shield = false;

            player.action = playerAct;
            computer.action = ["shoot", "shield", "charge"][Math.floor(Math.random() * 3)];
            if (computer.action == "shoot" && computer.charge <= 0) {
                computer.action = ["shield", "charge"][Math.floor(Math.random() * 2)];
            }
            if (computer.action == "charge" && computer.charge >= 1) {
                computer.action = ["shield", "shoot"][Math.floor(Math.random() * 2)];
            }

            // Player actions in own object
            switch (player.action) {
                case "charge":
                    player.charge++;
                    break;
                case "shield":
                    player.shield = true;
                    break;
                case "shoot":
                    player.charge--;
                    break;
            }
            // Computer actions in own object
            switch (computer.action) {
                case "charge":
                    computer.charge++;
                    break;
                case "shield":
                    computer.shield = true;
                    break;
                case "shoot":
                    computer.charge--;
            }
        }

        // Check for attacks
        function checkAttack() {
            if (player.action == "shoot" && !computer.shield) {
                computer.hp--;
            }
            if (computer.action == "shoot" && !player.shield) {
                player.hp--;
            }
        }

        // Create the UI
        function renderF() {
            let n = "<:blank:1004637804619374653>";
            let p = "🧑‍🚀";
            let c = "🛸";

            let playerHp = "";
            let computerHp = "";

            for (let i = 0; i < 4; i++) {
                if (i < player.hp) playerHp += "❤️";
                else playerHp += "🤍";
            }
            for (let i = 0; i < 4; i++) {
                if (i < computer.hp) computerHp += "❤️";
                else computerHp += "🤍";
            }
            // charge number
            let playerCharge = player.charge > 0 ? "🔋" : n;
            let computerCharge = computer.charge > 0 ? "🔋" : n;

            // action
            let playerAction = "";
            let computerAction = "";

            if (player.action == "shoot") playerAction = "🔫";
            else if (player.action == "shield") playerAction = "🛡";
            else if (player.action == "charge") playerAction = "🔋";

            if (computer.action == "shoot") computerAction = "🔫";
            else if (computer.action == "shield") computerAction = "🛡";
            else if (computer.action == "charge") computerAction = "🔋";

            let rows = [
                `${p}${n + n + n + n + n}${c}`,
                playerHp + n + n + computerHp,
                playerCharge + n + n + n + n + n + computerCharge,
                playerAction + n + n + n + n + n + computerAction,
            ];
            return rows.join("\n");
        }

        actionRow = {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Shoot",
                    "style": 4,
                    "custom_id": "shoot",
                    "disabled": true,
                },
                {
                    "type": 2,
                    "label": "Recharge",
                    "style": 1,
                    "custom_id": "charge",
                    "disabled": false,
                },
                {
                    "type": 2,
                    "label": "Shield",
                    "style": 2,
                    "custom_id": "shield",
                    "disabled": false,
                }
            ]
        };

        // function to run the game
        function runGame(game, collector) {
            collector.on("collect", async (b) => {
                if (interaction.user.id != b.user.id) return interaction.reply({ content: interaction.i18n("deny.button"), ephemeral: true });
                setAction(b.customId);
                checkAttack();
                actionRow.components[0].disabled = player.charge <= 0;
                actionRow.components[1].disabled = player.charge == 1;
                await b.update({ content: renderF(), components: [actionRow] });
                // Check if the game is over
                if (player.hp <= 0 || computer.hp <= 0) {
                    collector.stop("game over");
                    let res = player.hp <= 0 ? (computer.hp <= 0 ? "Tie" : "Computer") : "Player";
                    let credits = player.hp * 50 + 15;
                    let iron = player.hp * Math.floor(Math.random() * (10 - 5) + 5) + 5;
                    let copper = player.hp * Math.floor(Math.random() * (5 - 3) + 3) + 3;
                    let silver = player.hp * Math.floor(Math.random() * (3 - 3) + 3) + 3;
                    let xp = res == "Player" ? 50 : (res == "Tie" ? 35 : 25);
                    let embed = {
                        "title": `Game Over - ${res == "Tie" ? "Tie!" : res.replace("Computer", "Enemy").replace("Player", "You") + " won!"}`,
                        "description": `You got ${credits} credits, ${iron} iron, ${copper} copper, ${silver} silver and ${xp} xp.`,
                        "color": res == "Player" ? 0x00ff00 : 0xff0000,
                    }
                    b.followUp({ embeds: [embed] });
                    client.utils.addXP(interaction.user.id, xp);
                    explorers.updateOne({ userId: interaction.user.id }, { $inc: { "inventory.credits": credits, "inventory.materials.iron": iron, "inventory.materials.copper": copper, "inventory.materials.silver": silver } });
                }
            });
            collector.on("end", async (collected, reason) => {
                actionRow.components[0].disabled = true;
                actionRow.components[1].disabled = true;
                actionRow.components[2].disabled = true;
                game.edit({ components: [actionRow] });
            })

        }

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
                    "custom_id": "pursue",
                    "disabled": false
                },
                {
                    "type": 2,
                    "emoji": "❌",
                    "style": 1,
                    "custom_id": "cancel",
                    "disabled": false
                }
            ]
        };

        let conf = await interaction.reply({ embeds: [missionEmb], components: [confirmRow] });
        let confColl = conf.createMessageComponentCollector();
        setTimeout(() => {
            if (confColl.ended) return;
            confColl.stop("idle");
        }, 15_000);

        confColl.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: client.config.deny.button }], ephemeral: true });
            if (i.customId === "pursue") {
                // render the environment
                let render = renderF();

                // Creating an embed for the story ark
                let arkEmb = {
                    color: client.config.invisColor,
                    description: `‍⚠️ Alert! Alert! Your radar scans have detected a nearby enemy spaceship armed and ready!`,
                }
                await i.reply({ embeds: [arkEmb] });
                let game = await i.followUp({ content: render, components: [actionRow] });
                let gameColl = game.createMessageComponentCollector({ idle: 15_000 });
                runGame(game, gameColl);
                confColl.stop("game started");

            } else if (i.customId === 'cancel') {
                // Reply if the user cancels the interaction
                i.reply({ embeds: [{ color: client.utils.resolveColor(client.config.colors.invis), description: "Mission cancelled." }] });
                confirmRow.components[0].disabled = true;
                confirmRow.components[1].disabled = true;
                interaction.editReply({ components: [confirmRow] });
                confColl.stop("cancelled");
                return;
            }
        });
        confColl.on('end', async (coll, reason) => {
            confirmRow.components[0].disabled = true;
            confirmRow.components[1].disabled = true;
            interaction.editReply({ components: [confirmRow] });
            if (reason === "cancelled" || reason === "idle") {
                interaction.editReply({ content: "Mission cancelled." });
                return;
            }
        });
    },
}
module.exports = {
    object: {
        name: "panel",
        description: "Get a panel to stop the bot or do other actions.",
    },
    devOnly: true,
    run: async function (interaction, client) {
        // panel embed with two buttons (stop and eval)
        let embed = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: "Do some Dev action here.",
            fields: [
                {
                    name: "**Stop**",
                    value: "Stop the bot",
                    inline: true
                },
                {
                    name: "**Eval**",
                    value: "Evaluate a code",
                    inline: true
                }
            ]
        }

        let buttons = [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Stop",
                        style: 4,
                        custom_id: "dev-stop",
                        disabled: false,
                    },
                    {
                        type: 2,
                        label: "Eval",
                        style: 2,
                        custom_id: "dev-eval",
                        disabled: false,
                    }
                ]
            }
        ]
        // reply with the panel 
        interaction.reply({ embeds: [embed], components: buttons });

        // after 15 seconds disable the buttons
        setTimeout(() => {
            buttons[0].components[0].disabled = true;
            buttons[0].components[1].disabled = true;
            interaction.editReply({ components: buttons });
        }, 15_000);
    }
}


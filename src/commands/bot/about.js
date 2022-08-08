module.exports = {
    object: {
        name: "about",
        description: "Get information about the bot",
        options: [
            {
                type: 5,
                name: "desktop",
                description: "Get the desktop version the about message",
                required: false
            }
        ]
    },
    run: function (interaction, client) {
        let description = `The bot is not like most other Discord Bots. Its commands are not meant to be used all the time and keep you online 24/7.
It's also important to know that the bot uses real data from the NASA and other APIs to inform you about some objects in space.\n
Here is a list of the commands and what they do:
\`/about [desktop]\` - Replies with information about the bot. If \`desktop\` is True, it will use slash command mentions instead of code lines.
\`/credits\` - Shows the credits of the bot and ressources used.
\`/ping\` - Replies with the latency of the bot. This is useful to check if the bot is online.

\`/balance [user]\` - Shows the balance of the user. If no user is specified, it will show the balance of yourself.
\`/inventory\` - Shows the inventory of the user. If no user is specified, it will show the inventory of yourself.

\`/discovery\` - Start a random manual mission. You will get a small minigame, win to get more rewards.
\`/exploration start\` - Start an exploration mission. Your Robo will explore the space and returns with information about a real object. The rewards and duration till your Robo returns is dependant on your Robo Level.
\`/exploration results\` - After the time elapsed, the bot displays the results. Press the claim button to get the rewards.
\`/upgrade\` - Upgrade your Robo to the next level.
`
        if (interaction.options.getBoolean("desktop")) {
            description = description
            .replace(new RegExp("`/about [desktop]`", "g"), "</about:id>")
            .replace(new RegExp("`/credits`", "g"), "</credits:1005789061157503016>")
            .replace(new RegExp("`/ping`", "g"), "</ping:1004512656713072720>")
            .replace(new RegExp("`/balance [user]`", "g"), "</balance:1005789062784888933>")
            .replace(new RegExp("`/inventory`", "g"), "</inventory:1005568094430826557>")
            .replace(new RegExp("`/discovery`", "g"), "</discovery:1004689189884936272>")
            .replace(new RegExp("`/exploration start`" , "g"), "</exploration start:1004704655953121370>")
            .replace(new RegExp("`/exploration results`" , "g"), "</exploration results:1004704655953121370>")
            .replace(new RegExp("`/upgrade`", "g"), "</upgrade:1005797264905736321>")
        }
        let embed = {
            title: "About",
            description,
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
            footer: {
                text: `Thanks for using ${client.user.username}!`
            }
        }
        interaction.reply({embeds: [embed]});
    }
}
module.exports = {
    object: {
        name: "credits",
        description: "The credits of the bot",
    },
    run: async function (interaction, client) {
        let embed = {
            title: "Credits",
            description: `The Bot was developed by [Hackante#1482](https://github.com/Hackante) and [Jamieee#6862](https://github.com/JamieFromNZ).
It was part of a bot jam but still gets developed and new features are added regularly.
We are using space related data provided by [NASA](https://api.nasa.gov/) and [API Ninjas](https://api-ninjas.com/api/planets).
The profile pictue was found on [Pinterest](https://www.pinterest.de/pin/338262622013364902/), we are not the creator of the image.`,
            thumbnail: {
                url: client.user.displayAvatarURL()
            },
            footer: {
                text: `Thanks for using ${client.user.username}!`
            },
            color: client.utils.resolveColor(client.config.colors.invis)
        }
        interaction.reply({embeds: [embed]});
    }
}
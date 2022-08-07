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
We are using space related data provided by [NASA](https://api.nasa.gov/).] and [API Ninjas](https://api-ninjas.com/api/planets).`,
            thumbnail: {
                url: client.user.avatarURL()
            },
            footer: {
                text: `Thanks for using ${client.user.username}!`
            }
        }
        interaction.reply({embeds: [embed]});
    }
}
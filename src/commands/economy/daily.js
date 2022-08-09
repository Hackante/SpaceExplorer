const explorers = require("../../Schemas/explorers.js");

module.exports = {
    object: {
        name: "daily",
        description: "Get your daily credits",
    },
    run: async function (interaction, client) {
        let explorer = interaction.explorer;
        if (explorer.inventory.daily > Date.now()) {
            interaction.reply({ content: interaction.i18n("inventory.dailyCooldown", { time: Math.floor(explorer.inventory.daily.getTime() / 1000) }), ephemeral: true });
            return;
        }
        let update = { $set: { "inventory.daily": new Date(Date.now() + 86400000) } };
        let credits = Math.floor(Math.random() * 11) + 40;
        update.$inc = { "inventory.credits": credits };
        await explorers.updateOne({ user: interaction.user.id }, update);

        // Request the daily image by NASA APOD API
        let data = require("child_process").execSync(`curl https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA}`).toString();
        data = JSON.parse(data);

        let embed = {
            title: data.title,
            url: data.url,
            description: data.explanation.slice(0, 4096),
            color: client.utils.resolveColor(client.config.colors.invis)
        }
        if(data.media_type == "image") {
            embed.image = { url: data.url };
        }
        else if(data.media_type == "video") {
            data.url = data.url.replace("www.youtube.com/embed/", "youtu.be/").replace("?rel=0", "");
            console.log(data.url);
            embed.video = { url: data.url };
        }
        interaction.reply({ content: interaction.i18n("inventory.daily", { amount: credits }), embeds: [embed] });
        return;
    }
}

let missions = require("../../minigames");

module.exports = {
    object: {
        name: "test",
        description: "test minigame",
    },
    devOnly: true,
    run: function(interaction, client) {
        missions[1].start(client, interaction);
    }
}
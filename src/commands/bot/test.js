let missions = require("../../minigames/");

module.exports = {
    object: {
        name: "test",
        description: "test minigame",
    },
    run: function(interaction, client) {
        missions[1].start(client, interaction);
    }
}
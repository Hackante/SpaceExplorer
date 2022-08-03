const { Schema, model } = require("mongoose");

const schema = new Schema({
    user: { type: String, required: true, unique: true }, // Discord User ID
    blacklisted: { type: Boolean, default: false },
    statistics: {
        joined: { type: Date, default: new Date() },
        commandsUsed: { type: Number, default: 0 },
    }
});

module.exports = model("Explorers", schema);
const { Schema, model } = require("mongoose");

const schema = new Schema({
    user: { type: String, required: true, unique: true }, // Discord User ID
    blacklisted: { type: Boolean, default: false },
    statistics: {
        joined: { type: Date, default: new Date() },
        commandsUsed: { type: Number, default: 0 },
        discoveries: { type: Number, default: 0 },
        exploiations: { type: Number, default: 0 },
    },
    settings: {
        language: { type: String, default: "en" },
    },
    missions: {
        lastDiscovery: { type: Date, default: new Date(0) },
        discActive: { type: Boolean, default: false },
        expActive: { type: Boolean, default: false },
        expEnd: { type: Date, default: null },
    }
});

module.exports = model("Explorers", schema);
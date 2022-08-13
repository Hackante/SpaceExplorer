const { Schema, model } = require("mongoose");

const schema = new Schema({
    user: { type: String, required: true, unique: true }, // Discord User ID
    blacklisted: { type: Boolean, default: false },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: {
        credits: { type: Number, default: 0 },
        items: { type: Array, default: [] },
        materials: {
            iron: { type: Number, default: 0 },
            copper: { type: Number, default: 0 },
            silver: { type: Number, default: 0 },
        },
        daily: { type: Date, default: null },
    },
    statistics: {
        joined: { type: Date, default: new Date() },
    },
    settings: {
        language: { type: String, default: "en" },
        beta: { type: Boolean, default: false },
    },
    missions: {
        lastDiscovery: { type: Date, default: new Date(0) },
        discActive: { type: Boolean, default: false },
        expActive: { type: Boolean, default: false },
        expEnd: { type: Date, default: null },
    },
    robo: {
        level: { type: Number, default: 1 },
        upgrades: { type: Array, default: [] },
    }
});

module.exports = model("Explorers", schema);
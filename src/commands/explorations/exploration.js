const { XMLHttpRequest } = require("xmlhttprequest");
const { get } = require("request");
const { writeFileSync } = require("fs")
const explorers = require("../../Schemas/explorers");
const { client } = require("../..");

function getRandomDate(roboLevel) {
    let minutes = roboLevel * 10 + Math.floor(Math.random() * (3 + 2) - 2);
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

async function simulateResults(roboLevel, addStuff) {
    let type = ["Asteroid", "Moon"][Math.floor(Math.random() * 2)];
    switch (type) {
        // Planet will be added later due to too many errors
        case "Planet": {
            // Use the Planet API from API Ninjas
            get({
                url: `https://api.api-ninjas.com/v1/planets?min_mass=0.005&offset=${Math.floor(Math.random() * 34 * 30)}`,
                headers: {
                    "X-Api-Key": process.env.APININJA
                }
            }, function (err, res, body) {
                let ret = {};
                if (err) {
                    console.error(err);
                    let material1 = ["Iron"][Math.floor(Math.random() * 1)];
                    let value1 = roboLevel * 15 + Math.floor(Math.random() * (15 + 10) - 10);
                    let material2 = ["Copper", "Silver"][Math.floor(Math.random() * 2)];
                    let value2 = roboLevel * 15 + Math.floor(Math.random() * (15 + 10) - 10);

                    let embed = {
                        title: "Error",
                        description: "Your Robo almost found a planet. The SpaceExplorationForce thanked you with a small reward:",
                        fields: [{ name: "Materials", value: `${material1}: +${value1}\n${material2}: +${value2}`, inline: false }],
                    }
                    ret = { message: { content: "We are sorry for not returning an existing planet. We had some issues with the API.", embeds: [embed] }, update: { $inc: { [`robo.${roboLevel}.materials.${material1}`]: value1, [`robo.${roboLevel}.materials.${material2}`]: value2 } }, xp: Math.floor(Math.random() * (roboLevel / 2 + 25) + 25) };
                } else {
                    if (res.statusCode != 200) {
                        console.error("Error:" + res.statusCode, body.toString("utf8"));
                    }
                    let planet = JSON.parse(body)[Math.floor(Math.random() * JSON.parse(body).length)];
                    if (!planet) {
                        let material1 = ["Iron"][Math.floor(Math.random() * 1)];
                        let value1 = roboLevel * 15 + Math.floor(Math.random() * (15 + 10) - 10);
                        let material2 = ["Copper", "Silver"][Math.floor(Math.random() * 2)];
                        let value2 = roboLevel * 15 + Math.floor(Math.random() * (15 + 10) - 10);

                        let embed = {
                            title: "Error",
                            description: "Your Robo almost found a planet. The SpaceExplorationForce thanked you with a small reward:",
                            fields: [{ name: "Materials", value: `${material1}: +${value1}\n${material2}: +${value2}`, inline: false }],
                        }
                        ret = { message: { content: "We are sorry for not returning an existing planet. We had some issues with the API.", embeds: [embed] }, update: { $inc: { [`robo.${roboLevel}.materials.${material1}`]: value1, [`robo.${roboLevel}.materials.${material2}`]: value2 } }, xp: Math.floor(Math.random() * (roboLevel / 2 + 25) + 25) };
                    }
                    let material1 = ["Iron"][Math.floor(Math.random() * 1)];
                    let value1 = roboLevel * 15 + Math.floor(Math.random() * (10 + 5) - 5);
                    let material2 = ["Copper", "Silver"][Math.floor(Math.random() * 2)];
                    let value2 = roboLevel * 15 + Math.floor(Math.random() * (10 + 5) - 5);

                    let embed = {
                        title: `Planet: ${planet.name}`,
                        description: `Your Robo found a planet! Here are some details:`,
                        fields: [
                            { name: "Mass", value: `${planet.mass} Jupiters`, inline: true },
                            { name: "Period", value: `${planet.period} Earth days`, inline: true },
                            { name: "Distance", value: `${planet.distance_light_year} light years`, inline: true },
                            { name: "Temperature", value: `${planet.temperature ? planet.temperature + " Kelvin" : "N/A"}`, inline: true },
                            { name: "Host Star Mass", value: `${planet.host_star_mass} Suns`, inline: true },
                            { name: "Host Star Temperature", value: `${planet.host_star_temperature} Suns`, inline: true },
                            { name: "Materials", value: `${material1}: +${value1}\n${material2}: +${value2}`, inline: false },
                        ],
                        footer: {
                            text: "All Data is provided by API Ninjas' Planet API. We do not own any of the data and do not guarantee its accuracy."
                        }
                    }
                    ret = { message: { embeds: [embed] }, update: { $inc: { [`inventory.materials.${material1}`]: value1, [`inventory.materials.${material2}`]: value2 } }, xp: Math.floor(Math.random() * (roboLevel / 2 + 25) + 25) };
                }
                addStuff(ret);
            }).callback();
            break;
        } case "Asteroid": {
            // Use NASA's NeoWs API to get a random asteroid
            let httpReq = new XMLHttpRequest()
            // random page between 0 and 1468
            httpReq.open("GET", `http://www.neowsapp.com/rest/v1/neo/browse?page=${Math.floor(Math.random() * 1469)}&size=${20}&api_key=${process.env.NASA}`, false);
            httpReq.send();
            let data = JSON.parse(httpReq.responseText);
            let asteroid = data.near_earth_objects[Math.floor(Math.random() * 20)];
            // next close approach
            let next = asteroid.close_approach_data[asteroid.close_approach_data.findIndex(d => d.epoch_date_close_approach > Date.now())];
            // random materials
            let material1 = ["Iron"][Math.floor(Math.random() * 1)];
            let value1 = roboLevel * 15 + Math.floor(Math.random() * (10 + 5) - 5)
            let material2 = ["Copper", "Silver"][Math.floor(Math.random() * 2)];
            let value2 = roboLevel * 15 + Math.floor(Math.random() * (10 + 5) - 5)

            let embed = {
                title: `Asteroid: ${asteroid.name}`,
                url: asteroid.nasa_jpl_url,
                description: `Your Robo found an asteroid. Here are some details:`,
                fields: [
                    { name: "Magnitude", value: `${asteroid.absolute_magnitude_h}`, inline: true },
                    { name: "Estimated Diameter", value: `**Min:** ${Math.floor(asteroid.estimated_diameter.meters.estimated_diameter_min)}m\n**Max:** ${Math.floor(asteroid.estimated_diameter.meters.estimated_diameter_max)}m`, inline: true },
                    { name: "Observations", value: `First: <t:${new Date(asteroid.orbital_data.first_observation_date).getTime() / 1000}:d>\nLast: <t:${new Date(asteroid.orbital_data.last_observation_date).getTime() / 1000}:d>`, inline: true },
                    { name: "Hazardous", value: `${asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}`, inline: true },
                    { name: "Orbital Period", value: `${Math.floor(asteroid.orbital_data.orbital_period)} days`, inline: true },
                    { name: "Close Approach Date", value: `<t:${new Date(next?.epoch_date_close_approach || null).getTime() / 1000}:d>`, inline: true },
                    { name: "Rescources", value: `*Data randomly generated*\n${material1}: +${value1}\n${material2}: +${value2}`, inline: false },
                ],
                footer: {
                    text: "All data is provided by NASA's NeoWs API. We do not own any of the data and do not guarantee its accuracy.",
                }
            }
            addStuff({ message: { embeds: [embed] }, update: { $inc: { [`inventory.materials.${material1.toLowerCase()}`]: value1, [`inventory.materials.${material2.toLowerCase()}`]: value2 } }, xp: Math.floor(Math.random() * (roboLevel / 2 + 15) + 15) });
            break;
        } case "Moon": {
            // Using the Solar System API to get a random moon
            let data = JSON.parse(require("child_process").execSync("curl https://api.le-systeme-solaire.net/rest.php/bodies?filter%5B%5D=bodyType%2Ceq%2CMoon").toString());
            let moon = data.bodies[Math.floor(Math.random() * data.bodies.length)];
            let material1 = ["Iron"][Math.floor(Math.random() * 1)];
            let value1 = roboLevel * 15 + Math.floor(Math.random() * (5 + 2) - 2)

            const superscript = {
                "0": "⁰",
                "1": "¹",
                "2": "²",
                "3": "³",
                "4": "⁴",
                "5": "⁵",
                "6": "⁶",
                "7": "⁷",
                "8": "⁸",
                "9": "⁹"
            }
            let mass;
            let vol;
            for (let key in superscript) {
                mass = moon?.mass?.massExponent ? `${moon?.mass?.massExponent}`?.toString()?.replace(new RegExp(key, "g"), superscript[key]) : "";
                vol = moon?.vol?.volExponent ? `${moon?.vol?.volExponent}`?.toString()?.replace(new RegExp(key, "g"), superscript[key]) : "";
            }

            let embed = {
                title: `Moon: ${moon.englishName}`,
                description: `Your Robo found a moon. Here are some details:`,
                fields: [
                    { name: "Mass", value: `${mass = "" ? "N/A" : `${moon?.mass?.massValue} × 10${mass}`}`, inline: true },
                    { name: "Volume", value: `${moon?.vol?.volumeValue || "N/A"} × 10${vol}`, inline: true },
                    { name: "Denisty", value: `${moon.density} kg/m³`, inline: true },
                    { name: "Gravity", value: `${moon.gravity} m/s²`, inline: true },
                    { name: "Discovered By", value: `${moon.discoveredBy == "" ? "Unknown" : moon.discoveredBy}`, inline: true },
                    { name: "Discovery Date", value: `${moon.discoveryDate == "" ? "Unknown" : `<t:${new Date(moon.discoveryDate).getTime() / 1000}:d>`}`, inline: true },
                    { name: "Materials", value: `*Data randomly generated*\n${material1}: +${value1}`, inline: false },
                ],
                footer: {
                    text: "All data is provided by the Solar System API. We do not own any of the data and do not guarantee its accuracy.",
                }
            }
            addStuff({ message: { embeds: [embed] }, update: { $inc: { [`inventory.materials.${material1.toLowerCase()}`]: value1 } }, xp: Math.floor(Math.random() * (roboLevel / 2 + 10) + 10) });
            break;
        }
    }
}

module.exports = {
    object: {
        name: "exploration",
        description: "Send your Exploration Robo to explore the universe.",
        options: [
            {
                type: 1,
                name: "start",
                description: "Start a new exploration mission.",
            }, {
                type: 1,
                name: "results",
                description: "View the results of your exploration mission.",
            }
        ]
    },
    run: async function (interaction, client) {
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case "start": {
                // Check if the robo is ready to explore
                if (interaction.explorer.missions.expActive) {
                    interaction.editReply({ content: interaction.i18n("mission.expActive", { time: Math.floor(interaction.explorer.missions.expEnd.getTime() / 1000) }), ephemeral: true });
                    return;
                } else {
                    let date = getRandomDate(interaction.explorer.robo.level);
                    await explorers.updateOne({ user: interaction.user.id }, { $set: { "missions.expActive": true, "missions.expEnd": date } });
                    await interaction.editReply({ content: interaction.i18n("mission.expStart", { time: Math.floor(date.getTime() / 1000) }) });
                }
                return;
            } case "results": {
                // Check if robo is on mission
                if (!interaction.explorer.missions.expActive) {
                    interaction.editReply({ content: interaction.i18n("mission.expInactive"), ephemeral: true });
                    return;
                }
                // Check if the time is up
                if (interaction.explorer.missions.expEnd.getTime() > Date.now()) {
                    interaction.editReply({ content: interaction.i18n("mission.expActive", { time: Math.floor(interaction.explorer.missions.expEnd.getTime() / 1000) }), ephemeral: true });
                    return;
                }

                simulateResults(interaction.explorer.robo.level, async (res) => {
                    res.message = { ...res.message, components: [{ type: 1, components: [{ type: 2, style: 2, label: "Claim", custom_id: "notImportant" }] }] };
                    let reply = await interaction.editReply(res.message);
                    let coll = reply.createMessageComponentCollector({ time: 15_000 });
                    coll.on("collect", async (m) => {
                        if (!interaction.user.id == m.user.id) return interaction.editReply({ content: "This is not your Exploration!", ephemeral: true });
                        res.update = Object.assign(res.update, { $set: { "missions.expActive": false } });
                        console.log(res.update);
                        await explorers.updateOne({ user: interaction.user.id }, res.update);
                        client.utils.addXP(interaction.user.id, res.xp)
                        await m.update({ content: "Claimed" });
                        coll.stop();
                    });
                    coll.on("end", async () => {
                        await interaction.editReply({ components: [] });
                    });
                });
                break;
            }
        }
    }
}
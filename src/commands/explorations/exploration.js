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

async function simulateResults(interaction, roboLevel) {
    let type = ["Moon", "Moon", "Moon"][Math.floor(Math.random() * 3)];
    await interaction.deferReply()
    switch (type) {
        case "Planet": {
            // Use the Planet API from API Ninjas
            get({
                url: `https://api.api-ninjas.com/v1/planets?min_mass=0.005&offset=${Math.floor(Math.random() * 34 * 30)}`,
                headers: {
                    "X-Api-Key": process.env.APININJA
                }
            }, function(err, res, body) {                
                if(err) {
                    console.error(err);
                    interaction.editReply("Looks like we coudn't reach the API. Try again later!");
                    return;
                } else {
                    if(res.statusCode != 200) {
                        console.error("Error:" + res.statusCode, body.toString("utf8"));
                    }
                    console.log(body);
                    let planet = JSON.parse(body)[Math.floor(Math.random() * JSON.parse(body).length)];
                    interaction.editReply(`${planet?.name} is a planet.`);
                }
            })
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
                    { name: "Observations", value: `First: <t:${new Date(asteroid.orbital_data.first_observation_date).getTime()/1000}:d>\nLast: <t:${new Date(asteroid.orbital_data.last_observation_date).getTime()/1000}:d>`, inline: true },
                    { name: "Hazardous", value: `${asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}`, inline: true },
                    { name: "Orbital Period", value: `${Math.floor(asteroid.orbital_data.orbital_period)} days`, inline: true },
                    { name: "Close Approach Date", value: `<t:${new Date(next.epoch_date_close_approach).getTime()/1000}:d>`, inline: true },
                    { name: "Rescources", value: `*Data randomly generated*\n${material1}: +${value1}\n${material2}: +${value2}`, inline: false },
                ],
                footer: {
                    text: "All data is provided by NASA's NeoWs API. We do not own any of the data and do not guarantee its accuracy.",
                }
            }
            await interaction.editReply({embeds: [embed]});
            // Update explorer inventory
            await explorers.updateOne({user: interaction.user.id}, {$inc: {[`inventory.materials.${material1}`]: value1, [`inventory.materials.${material2}`]: value2}});
            client.utils.addXP(interaction.user.id, Math.floor(Math.random() * (roboLevel / 2 + 15) + 15));
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
            for(let key in superscript) {
                mass = moon?.mass?.massExponent ? `${moon?.mass?.massExponent}`?.replace(new RegExp(key, "g"), superscript[key]) : "";
                vol = moon?.vol?.volExponent ? `${moon?.vol?.volExponent}`?.replace(new RegExp(key, "g"), superscript[key]) : "";
            }

            let embed = {
                title: `Moon: ${moon.englishName}`,
                description: `Your Robo found a moon. Here are some details:`,
                fields: [
                    { name: "Mass", value: `${ mass = "" ? "N/A" : `${moon?.mass?.massValue} × 10${mass}`}`, inline: true },
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
            await interaction.editReply({embeds: [embed]});
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
        /*/ Check if the robo is ready to explore
        if(interaction.explorer.missions.expActive) {
            interaction.reply({content: interaction.i18n("mission.expActive", {time: interaction.explorer.missions.expEnd.getUTCMilliseconds()}), ephemeral: true});
            return;
        }
        // Send the robo to explore till getRandomDate()*/
        simulateResults(interaction, 1);
        

        /*/ Update th db
        await explorers.updateOne({user: interaction.user.id}, {$set: {missions: {expActive: true, expEnd: getRandomDate(interaction.explorer.statistics.exploitations)}}, $inc: {"statistics.exploitations": 1}});
        interaction.followUp({content: interaction.i18n("mission.expStart", {time: Math.floor(interaction.explorer.missions.expEnd.getUTCMilliseconds()/1000)}), ephemeral: true});*/
    }
}
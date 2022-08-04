const { XMLHttpRequest } = require("xmlhttprequest");
const { writeFileSync } = require("fs")
const explorers = require("../../Schemas/explorers");

function getRandomDate(roboLevel) {
    let minutes = roboLevel * 10 + Math.floor(Math.random() * (3 + 2) - 2);
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

async function simulateResults(interaction, roboLevel) {
    let type = ["Planet", "Asteroid", "Moon"][Math.floor(Math.random() * 3)];
    await interaction.deferReply()
    switch (type) {
        case "Planet": {
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
            // random resources
            let resource1 = ["Iron"][Math.floor(Math.random() * 1)];
            let value1 = roboLevel * 15 + Math.floor(Math.random() * (10 + 5) - 5)
            let resource2 = ["Copper", "Silver"][Math.floor(Math.random() * 2)];
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
                    { name: "Rescources", value: `*Data randomly generated*\n${resource1}: +${value1}\n${resource2}: +${value2}`, inline: false },
                ],
                footer: {
                    text: "All data is provided by NASA's NeoWs API. We do not own any of the data and do not guarantee its accuracy.",
                }

            }
            interaction.editReply({embeds: [embed]});
            

            break;
        } case "Moon": {
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
        interaction.reply({content: interaction.i18n("mission.expStart", {time: Math.floor(interaction.explorer.missions.expEnd.getUTCMilliseconds()/1000)}), ephemeral: true});*/
    }
}
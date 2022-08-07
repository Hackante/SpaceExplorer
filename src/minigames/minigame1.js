module.exports = {
    async start(client, interaction) {
        await interaction.deferReply();

        // Creating a mission embed
        let missionEmb = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: `You came across an asteroid field! Navigate through the obstacles using the buttons below 🚀!\nStarting in 5 seconds...\n<t:${Math.floor(new Date().setUTCSeconds(new Date().getUTCSeconds() + 5) / 1000)}:R>`,
        }
        let reply = await interaction.editReply({ embeds: [missionEmb] });
        await new Promise(resolve => setTimeout(resolve, 5_000));

        // Get a random integer
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Create a 14x5 matrix of <:blank:1004637804619374653>s 
        const matrix = [];
        for (let i = 0; i < 14; i++) {
            matrix[i] = [];
            for (let j = 0; j < 5; j++) {
                matrix[i][j] = '<:blank:1004637804619374653>';
            }
        }

        // every 2nd row stays the same. the others get one 🪨 at a random position
        for (let i = 0; i < matrix.length; i++) {
            if (i % 2 === 0) {
                continue;
            }
            const randomIndex = getRandomInt(0, 4);
            matrix[i][randomIndex] = '🪨';
        }

        // reverse the matrix
        matrix.reverse();

        // add 2 rows of <:blank:1004637804619374653>s at the bottom
        for (let i = 0; i < 3; i++) {
            matrix.push(['<:blank:1004637804619374653>', '<:blank:1004637804619374653>', '<:blank:1004637804619374653>', '<:blank:1004637804619374653>', '<:blank:1004637804619374653>']);
        }

        // add a 🚀 in the middle of the last row
        matrix[matrix.length - 1][2] = '🚀';

        // make the matrix one string
        function matrixToString() {
            const matrixString = matrix.map(row => row.join('')).join('\n');
            return matrixString;
        }

        // create the embed
        function createEmbed() {
            const embed = {
                color: client.utils.resolveColor(client.config.colors.invis),
                description: matrixToString(),
            };
            return embed;
        }

        //reply = await interaction.editReply({ embeds: [createEmbed()] });

        // every second put the rocket one row up and replace the 🚀 with <:blank:1004637804619374653>
        let ticker = setInterval(() => {
            let currentY = matrix.findIndex(row => row.includes('🚀'));
            let currentX = matrix[currentY].findIndex(cell => cell === '🚀');
            if(currentY === 0) {
                interaction.editReply({ components: []})
                interaction.followUp({ content: "You won!" });
                clearInterval(ticker);
                return;
            }
            matrix[currentY][currentX] = '<:blank:1004637804619374653>';
            matrix[currentY - 1][currentX] = matrix[currentY - 1][currentX] === '<:blank:1004637804619374653>' ? '🚀' : '🤯';
            // edit reply
            interaction.editReply({ embeds: [createEmbed()], components: [createButtons(currentX)] });
            let out = matrixToString();
            if (out.includes('🤯')) {
                console.log("failed");
                interaction.editReply({ components: []})
                interaction.followUp({ content: "You failed!" });
                // stop the interval
                clearInterval(ticker);
            }
        }, 500);

        // Move right and left with the buttons 
        function createButtons(x) {
            return {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: '⬅',
                        customId: `${interaction.user.id}-${x - 1}`,
                        disabled: x == 0,
                        style: 1
                    }, {
                        type: 2,
                        label: '➡',
                        customId: `${interaction.user.id}-${x + 1}`,
                        disabled: x == 4,
                        style: 1
                    }
                ]
            }
        }

        let coll = reply.createMessageComponentCollector()
        coll.on('collect', async (b) => {
            console.log(b.customId);
            if(!interaction.user.id == b.user.id) return b.reply({content: interaction.i18n('deny.button')});
            let x = parseInt(b.customId.split('-')[1]);
            let currentY = matrix.findIndex(row => row.includes('🚀'));
            let currentX = matrix[currentY].findIndex(cell => cell === '🚀');
            matrix[currentY][currentX] = '<:blank:1004637804619374653>';
            matrix[currentY][x] = matrix[currentY][x] === '<:blank:1004637804619374653>' ? '🚀' : '🤯';
            b.update({ embeds: [createEmbed()], components: [createButtons(x)] });
            let out = matrixToString();
            if (out.includes('🤯')) {
                interaction.editReply({ components: []})
                console.log("failed");
                // stop the interval
                clearInterval(ticker);
                coll.stop();
            }
        });
    }

}
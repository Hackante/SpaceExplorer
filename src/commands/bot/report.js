module.exports = {
    object: {
        name: "report",
        description: "Report a bug, a feature or a user.",
    },
    betaOnly: true,
    run: async function (interaction, client) {
        let embed = {
            color: client.utils.resolveColor(client.config.colors.invis),
            description: "Abuse of this command will result in a ban.\n**Report...**",
        }

        let components = [{
            type: 1,
            components: [{
                    type: 2,
                    label: "Bug",
                    style: 3,
                    custom_id: `report-bug-${interaction.user.id}`,
                    disabled: false,
                }, {
                    type: 2,
                    label: "Feature",
                    style: 1,
                    custom_id: `report-feature-${interaction.user.id}`,
                    disabled: false,
                }, {
                    type: 2,
                    label: "User",
                    style: 1,
                    custom_id: `report-user-${interaction.user.id}`,
                    disabled: false,
                }]
        }]
        await interaction.reply({ embeds: [embed], components});

        setTimeout(() => {
            components[0].components[0].disabled = true;
            components[0].components[1].disabled = true;
            components[0].components[2].disabled = true;
            interaction.editReply({ components });
        }, 15_000);

    }
}
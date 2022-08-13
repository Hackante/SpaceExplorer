module.exports = async (interaction, client) => {
    function find(customID) {
        return interaction.components.find(component => component.components.find(field => field.custom_id == customID)).value;
    }

    if (interaction.customId == "dev-eval") {
        // only 1 component with code to evaluate
        if (!client.config.developers.includes(interaction.user.id)) return interaction.reply({ content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true });
        let code = interaction.components[0].components[0].value;
        try {
            let lines = code.trim().split("\n")
            if (!lines[lines.length - 1].startsWith("return")) lines[lines.length - 1] = `return ${lines[lines.length - 1]}`

            let result = await eval("async () => { " + lines.join("\n") + " }")();
            let type = typeof result;
            if (result instanceof Promise) result = await result;
            if (typeof result == "string") result = `"${result}"`;
            if (result instanceof Error) result = result.stack;
            if (typeof result == "object") result = JSON.stringify(result);

            let ban = [
                "TOKEN",
                "MONGO",
                "NASA",
                "APININJA"
            ]
            for (let key of ban) {
                // replace all values in the .env file with the key
                result = result?.replace(new RegExp(process.env?.[key], "g"), `[${key}]`) ?? result;
                //code = code.replace(new RegExp(process.env[key], "g"), `[${key}]`);
            }

            // send the result
            await interaction.reply(`Typeof result: ${type}\n\`\`\`js\n${result}\n\`\`\``);
            await interaction.followUp({ content: `Evaluated Code:\n\`\`\`js\n${code}\n\`\`\`` });
        } catch (e) {
            let ban = [
                "TOKEN",
                "MONGO",
                "NASA",
                "APININJA"
            ]
            for (let key in ban) {
                // replace all values in the .env file with the key
                code.replace(new RegExp(process.env[key], "g"), `[${key}]`);
            }
            await interaction.reply(`\`\`\`js\n${e.stack}\n\`\`\``);
            interaction.followUp({ content: `Evaluated Code:\n\`\`\`js\n${code}\n\`\`\`` }).catch(e => {
                interaction.followUp({ content: `Evaluated Code:\n\`\`\`js\nFailed to send!\n\`\`\`` });
            })
        }
    }
    if (interaction.customId.startsWith("report-")) {
        let embed = {
            color: client.utils.resolveColor(client.config.colors.invis),
            author: {
                name: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            }
        }
        let webhookURL = ""
        switch (interaction.customId.split("-")[1]) {
            case "bug": {
                embed.title = find("bug-title");
                embed.description = find("bug-description");
                embed.footer = {
                    text: "Bug Report"
                }
                webhookURL = await client.db.get("webhooks.bug")
                break;
            } case "feature": {
                embed.title = find("feature-title");
                embed.description = find("feature-description");
                embed.footer = {
                    text: "Feature Request"
                }
                webhookURL = await client.db.get("webhooks.feature")
                break;
            } case "user": {
                embed.title = find("user-id");
                embed.description = find("user-reason");
                embed.footer = {
                    text: "User Report"
                }
                webhookURL = await client.db.get("webhooks.user")
                break;
            }
        }
    }
}
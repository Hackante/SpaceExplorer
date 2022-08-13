module.exports = async (interaction, client) => {
    if (interaction.customId == "dev-eval") {
        // only 1 component with code to evaluate
        if (!client.config.developers.includes(interaction.user.id)) return interaction.reply({ content: "❎ You do not have permission to use this command!\nMissing: [Developer]", ephemeral: true });
        let code = interaction.components[0].components[0].value;
        try {
            let lines = code.split("\n")
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
}
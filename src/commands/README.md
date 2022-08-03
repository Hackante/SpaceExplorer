# Commands
All commands should follow the following format:

```js
module.exports = {
    object: CommandObject,
    run: async (interaction, client) => {
        // do something
    }
}
```
These are the required properties. Optional properties are:

| Property | Type | default | Use |
|----------|------|---------|-----|
| `guildOnly` | Boolean | false | This command will only work in guilds. |
| `devOnly` | Boolean | false | Only developers can use that command. |
| `betaOnly` | Boolean | false | Only users in the beta program can use this command as it is still in the test phase. |

More might be coming soon (like permissions, etc.)
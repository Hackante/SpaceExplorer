# Events
All JavaScript files in this folder are considered events. The names of the files should be the event names or names that can be easily used to identify the event.

## Emiting Events
To emit a custom event use the `emit` function.

```js
client.emit("eventName", data);
```

## Listening to Events
To listen to a custom event use the `on` function.

```js
client.on("eventName", function(data) {
    // do something
});
```

You can also split the events into different files. Use folders and create the files you want to use.

```js
client.on("eventName", function(data) {
    switch (data.type) {
        case "type1":
            require("./type1.js")(data);
            break;
        case "type2":
            require("./type2.js")(data);
            break;
        default:
            // do something
            break;
    }
});
```

## List
| Event | File | Description |
|-------|------|-------------|
| `interactionCreate` | `src\events\interactionCreate.js` | Splits up interaction event and passes them to the handlers in src\events\interactions |
| `ready` | `src\events\ready.js` | Handles the ready event |
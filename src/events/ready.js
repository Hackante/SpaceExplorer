module.exports = (client) => {
    client.once("ready", () => {
        // change status every 15 seconds
        let status = [
            "millions of stars",
            "the galaxy",
            "the universe",
            "the stars",
            "the universe die",
            "so many moons",
            "a planet"
        ]
        let i = 0;
        setInterval(() => {
            let stat = status[i%status.length];
            i++;
            client.user.setActivity({ name: stat, type: 3 });
        }, 15_000);
    });
}

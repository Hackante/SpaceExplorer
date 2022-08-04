const { readdirSync } = require("fs");
const template = require("string-template")
let allLanguages = new Map();

readdirSync("./i18n").forEach(file => {
    if (!file.endsWith(".json")) return;
    allLanguages.set(file.split(".")[0], (require(`./${file}`)));
});

module.exports = function i18n({key, replaceData = {}, language = "en"}) {
    let lang = allLanguages.get(language);
    if (!lang) return `${key} (Language: ${language}) was not found!`;
    let string = getString(key, lang);
    if (!string) string = getString(key, "en") || `${key}`;
    return template(string, replaceData);
}

function getString(key, language = "en") {
    let currentObj = language;
    while(key.includes(".")) {
        let split = key.split(".");
        currentObj = currentObj[split[0]];
        key = split.slice(1).join(".");
    }
    return currentObj[key];
}
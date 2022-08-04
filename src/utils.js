module.exports = {
    // Resolve a color from Hex to number
    resolveColor: function(color) {
        return parseInt(color.replace("#", ""), 16);
    }
}
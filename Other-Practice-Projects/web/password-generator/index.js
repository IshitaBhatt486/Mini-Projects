const characterSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-="
};

function generatePassword(length, selectedSets) {
    const pool = selectedSets.map(set => characterSets[set]).join("");
    if (!pool || length < 1) return "Select a character set and valid length.";
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    return Array.from(values, value => pool[value % pool.length]).join("");
}

document.getElementById("generate").addEventListener("click", () => {
    const length = Number(document.getElementById("length").value);
    const selectedSets = Object.keys(characterSets).filter(id => document.getElementById(id).checked);
    document.getElementById("password").textContent = generatePassword(length, selectedSets);
});

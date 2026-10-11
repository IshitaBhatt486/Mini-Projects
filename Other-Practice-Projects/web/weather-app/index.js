const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
// Add your OpenWeather API key here before running this app.
const apiKey = "";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!apiKey) return displayError("Add an OpenWeather API key in index.js to use this app.");
    if (!city) return displayError("Please enter a city.");
    try { displayWeatherInfo(await getWeatherData(city)); }
    catch (error) { displayError(error.message); }
});
async function getWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`);
    if (!response.ok) throw new Error("Could not fetch weather data.");
    return response.json();
}
function displayWeatherInfo({ name, main: { temp, humidity }, weather: [{ description, id }] }) {
    card.replaceChildren(make("h1", name, "cityDisplay"), make("p", `${((temp - 273.15) * 9 / 5 + 32).toFixed(1)}°F`, "tempDisplay"), make("p", `Humidity: ${humidity}%`, "humidityDisplay"), make("p", description, "descDisplay"), make("p", getWeatherEmoji(id), "weatherEmoji"));
    card.style.display = "flex";
}
function make(tag, text, className) { const element = document.createElement(tag); element.textContent = text; element.className = className; return element; }
function getWeatherEmoji(id) { if (id < 300) return "⛈️"; if (id < 600) return "🌧️"; if (id < 700) return "❄️"; if (id < 800) return "🌫️"; if (id === 800) return "☀️"; return "☁️"; }
function displayError(message) { card.replaceChildren(make("p", message, "errorDisplay")); card.style.display = "flex"; }

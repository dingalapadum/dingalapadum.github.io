//init theme-variable
let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

function switchTheme() {
    theme = theme == "light" ? "dark" : "light";
}

function applyTheme() {
    document.getElementById("themeswitcher").src = "resources/" + theme + ".png";
    document.documentElement.setAttribute("data-theme", theme);
}

function switchLights() {
    switchTheme();
    applyTheme();
}

applyTheme();
const mainMenu = document.getElementById("main");
const optionsMenu = document.getElementById("options");
const controlsMenu = document.getElementById("controls");

function showMain() {
    optionsMenu.style.visibility = "hidden";
    controlsMenu.style.visibility = "hidden";
    mainMenu.style.visibility = "visible";
}

function showOptions() {
    optionsMenu.style.visibility = "visible";
    controlsMenu.style.visibility = "hidden";
    mainMenu.style.visibility = "hidden";
}

function showControls() {
    optionsMenu.style.visibility = "hidden";
    controlsMenu.style.visibility = "visible";
    mainMenu.style.visibility = "hidden";
}

function startGame() {
    optionsMenu.style.visibility = "hidden";
    controlsMenu.style.visibility = "hidden";
    mainMenu.style.visibility = "hidden";
    requestAnimationFrame(animate);
}
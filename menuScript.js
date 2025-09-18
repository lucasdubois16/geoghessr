const mainMenu = document.getElementById("main-menu");
const settingsMenu = document.getElementById("settings-menu");

document.getElementById("settings-btn").addEventListener("click", () => {
    mainMenu.style.display = "none";  
    settingsMenu.style.display = "block";
});

document.getElementById("back-btn").addEventListener("click", () => {
    settingsMenu.style.display = "none"; 
    mainMenu.style.display = "block";    
});

document.getElementById("play-btn").addEventListener("click", () => {
    window.location.href = "game.html";
});


document.getElementById("online-btn").addEventListener("click", () => {
    alert("Fonctionnalité à venir !");
});


window.addEventListener("DOMContentLoaded", () => {
    mainMenu.style.display = "block";
    settingsMenu.style.display = "none";

    const inputManches = document.getElementById("input-manches");
    const inputTime = document.getElementById("input-time");

    const defaultManches = 5;
    const defaultTime = 30;

    inputManches.value = localStorage.getItem("manches") || defaultManches;
    inputTime.value = localStorage.getItem("time") || defaultTime;
});


document.getElementById("save-btn").addEventListener("click", () => {
    const manches = document.getElementById("input-manches").value;
    const time = document.getElementById("input-time").value;

    localStorage.setItem("manches", manches)
    localStorage.setItem("time", time)

    alert("Réglages enregistrés ! ")
});
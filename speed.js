'use strict';
let unit = "MPH"
let textColour = "#ffffff"
async function handleGPSInfo(position) {
    const speedMps = position.coords?.speed ?? 0;
    const speedMPH = Math.round(speedMps * 2.23694);
    const speedKMH = Math.round(speedMps * 3.6);
    let speed = 0;
    let limit = 0;

    const data = await getStreetData(position.coords.latitude,position.coords.longitude);
    document.getElementById("street").textContent = data.name;
    if (unit === "local"){
        let tempUnit = data.localSpeedUnit;
        if (tempUnit === "mph"){
            unit = "MPH"
        }
        if (tempUnit === "km/h"){
            unit = "KM/H"
        }
    }

    document.getElementById("unit").textContent = unit;
    if (unit === "MPH"){
        speed = speedMPH;
        limit = Math.round(data.siSpeed * 2.23694);
    }
    else if (unit === "KM/H"){
        speed = speedKMH;
        limit = Math.round(data.siSpeed * 3.6);
    }

    document.getElementById("speed").textContent = speed;
    if (isNaN(limit)){
        document.getElementById("limit").textContent = "";
    }
    document.getElementById("limit").textContent = limit;


    if (speed > limit && limit !== 0) {
        document.getElementById("speed").style.color = "#ff0000";
    } else if (speed >= limit - 5  && limit !== 0) {
        document.getElementById("speed").style.color = "#ff8400";
    }
    else {
        document.getElementById("speed").style.color = textColour;
    }
}

document.getElementById("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    unit = document.forms["settingsForm"]["unitSettingForm"].value;
    if (document.forms["settingsForm"]["limitSettingForm"].value === "Left"){
        document.getElementById("limit").style.left = "3dvw";
    }
    else {
        document.getElementById("limit").style.right = "3dvw";
    }
});
const textColorInput = document.getElementById('textColourForm');
textColorInput.addEventListener('input', function () {
    textColour = textColorInput.value;
});

const backgroundColorInput = document.getElementById('backgroundColourForm');
backgroundColorInput.addEventListener('input', function () {
    document.body.style.backgroundColor = backgroundColorInput.value;
});

async function getStreetData(lat,lon){
    const response = await fetch(`https://devweb2024.cis.strath.ac.uk/aes02112-nodejs/speed?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error("Failed to fetch speed limit");
    return await response.json();
}

function handleGPSError(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}

function init() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(handleGPSInfo, handleGPSError, {enableHighAccuracy: true});
    } else {
        console.error("Geolocation is not supported.");
    }
}
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;

    document.getElementById("speed").hidden = portrait;
    document.getElementById("unit").hidden = portrait;
    document.getElementById("street").hidden = portrait;
    document.getElementById("limit").hidden = portrait;

    document.getElementById("settings").hidden = !portrait;
});

document.addEventListener('DOMContentLoaded', init);
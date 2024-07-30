import {Color, intervalFor, randomObject, sleep} from "./util/general.js";
import {SubWeapon} from "./util/weaponsClass.js";

import { SPECIAL_WEAPONS, SUB_WEAPONS, TEAMS, MAIN_WEAPONS} from "./util/constants.js";
console.log("hello world"); 

const CONFIG = {
    autoHide: false,
    hideDuration: 2.5,
    showDuration: 2.5,
    disableMusic: false,
    iterations: 25,
    disableAnimation: false, 
}

/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");
/**
 * @type {HTMLCanvasElement}
 */
const SPECIAL_INK_CANVAS = document.getElementById("specialInk");


const AUDIO = new Audio("./assets/audio/randomizer.mp3");


var animationPlaying = false;
document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());
document.getElementById("subWeapon").addEventListener("change", () => selectSub());
document.getElementById("specialWeapon").addEventListener("change", () => selectSpecial());
document.getElementById("customColor").addEventListener("change", () => customColor());
document.getElementById("mainWeapon").addEventListener("change", () => selectMainWeapon());
document.getElementById("generate").addEventListener("click", () => generate());
document.getElementById("hide").addEventListener("click", () => hide());

document.getElementById("autoHide").addEventListener("change", () => updateConfig());
document.getElementById("hideLen").addEventListener("change", () => updateConfig());
document.getElementById("showLen").addEventListener("change", () => updateConfig());
document.getElementById("disableSound").addEventListener("change", () => updateConfig());
document.getElementById("iterations").addEventListener("change", () => updateConfig());
document.getElementById("disableAnimation").addEventListener("change", () => updateConfig());

document.getElementById("hideConfig").addEventListener("click", () => hideConfig());
document.getElementById("colorToggle").addEventListener("click", () => toggleColorConfig()); 
document.getElementById("showConfig").addEventListener("click", () => showConfig());

setDefaultConfig();

function toggleColorConfig() {
    let colorConfig = document.getElementById("colorConfig");
    console.log(colorConfig.hidden)
    colorConfig.hidden =!colorConfig.hidden;
    let colorToggle = document.getElementById("colorToggle");
}
function hideConfig(){
    let config = document.getElementById("config")
    config.hidden = true
    let showConfigButton = document.getElementById("showConfig");
    showConfigButton.hidden = false;
}
function showConfig(){
    let config = document.getElementById("config")
    config.hidden = false;
    let showConfigButton = document.getElementById("showConfig");
    showConfigButton.hidden = true;
}
async function hide(){
    let randomizerResult = document.getElementById("randomizerResult");
    randomizerResult.style.animation = `fadeOut ${CONFIG.hideDuration}s`;
    await sleep(CONFIG.hideDuration * 1000);
    randomizerResult.hidden = true;
    randomizerResult.style.animation = "none";
}

function updateConfig(){
    console.log("updating config");
    let autoHide = document.getElementById("autoHide").checked;
    let hideDuration = document.getElementById("hideLen").value;
    let showDuration = document.getElementById("showLen").value;
    let disableMusic = document.getElementById("disableSound").checked;
    let iterations = document.getElementById("iterations").value;
    let disableAnimation = document.getElementById("disableAnimation").checked;
    CONFIG.autoHide = autoHide;
    CONFIG.hideDuration = hideDuration;
    CONFIG.showDuration = showDuration;
    CONFIG.disableMusic = disableMusic;
    CONFIG.iterations = iterations;
    CONFIG.disableAnimation = disableAnimation;
    if(autoHide){
        document.getElementById("showControls").hidden = false;
    } else {
        document.getElementById("showControls").hidden = true;
    }

}

function setDefaultConfig(){
    document.getElementById("autoHide").checked = CONFIG.autoHide;
    document.getElementById("hideLen").value = CONFIG.hideDuration;
    document.getElementById("showLen").value = CONFIG.showDuration;
    document.getElementById("disableSound").checked = CONFIG.disableMusic;
    document.getElementById("iterations").value = CONFIG.iterations;
    document.getElementById("disableAnimation").checked = CONFIG.disableAnimation;
}

async function generate(){
    let generateButton = document.getElementById("generate");
    if(animationPlaying){
        console.log("Animation already playing");
        return;
    } else {
        animationPlaying = true;
        generateButton.disabled = true;
    }
    let randomizerResult = document.getElementById("randomizerResult");
    randomizerResult.hidden = false;
    let key = randomObject(MAIN_WEAPONS);
    let weapon = MAIN_WEAPONS[key];
    let mainWeaponName = document.getElementById("mainWeaponName");
    let subWeaponName = document.getElementById("subWeaponName");
    let specialWeaponName = document.getElementById("specialWeaponName");
    console.log(weapon);
    applySub(weapon.subWeapon);
    applySpecial(weapon.specialWeapon);
    let weaponImage = document.getElementById("mainWeaponImage");
    let subSpecial = document.getElementsByClassName("multiImage");
    subSpecial.item(0).hidden = true;
    subSpecial.item(1).hidden = true;
    mainWeaponName.hidden = true;
    subWeaponName.hidden = true;
    specialWeaponName.hidden = true;
    let totalLenght = 2550;
    let iterations = CONFIG.iterations;
    let lengthMS = totalLenght/iterations;
    let lengthS = lengthMS/1000;
    document.getElementById("mainWeaponImage").style.animation = `shake ${lengthS}s infinite`;

    selectSub();
    selectSpecial();
    if(!CONFIG.disableMusic) AUDIO.play();
    console.log(iterations)
    if(!CONFIG.disableAnimation){
        for(let i = 0; i < iterations; i++){
            let randomKey = randomObject(MAIN_WEAPONS);
            let randomWeapon = MAIN_WEAPONS[randomKey];
            weaponImage.src = randomWeapon.primaryTexture;
            await sleep(lengthMS)
        }
    }
    applyMain(weapon)
    selectTeam();
    weaponImage.style.animation = `finish ${lengthS}s`;
    mainWeaponName.hidden = false;
    subWeaponName.hidden = false;
    specialWeaponName.hidden = false;
    mainWeaponName.innerHTML = weapon.name;
    subWeaponName.innerHTML = weapon.subWeapon.name;
    specialWeaponName.innerHTML = weapon.specialWeapon.name;
    mainWeaponName.style.animation = `finish ${lengthS}s`;
    subSpecial.item(0).hidden = false;
    subSpecial.item(1).hidden = false;
    subSpecial.item(0).style.animation = `finish ${lengthS}s`
    subSpecial.item(1).style.animation = `finish ${lengthS}s`;
    if(CONFIG.autoHide){
        await sleep(CONFIG.showDuration*1000);
        hide();
    }
    console.log(AUDIO.duration)
    await sleep(AUDIO.duration*1000 - totalLenght)
    animationPlaying = false;
    generateButton.disabled = false;
}

function selectMainWeapon(){
    let main = document.getElementById("mainWeapon").value;
    applyMain(MAIN_WEAPONS[main]);
}
function applyMain(main){
    console.log(main);
    document.getElementById("mainWeaponImage").src = main.primaryTexture;
}

function customColor(){
    let color = document.getElementById("customColor").value;
    let customColor = Color.hex(color);
    console.log(customColor);
    applyColorAll(customColor);
}
async function testMainWeapons(){
    const image = document.getElementById("mainWeaponImage");
    for (let main in MAIN_WEAPONS) {
        await sleep(100);
        let weapon = MAIN_WEAPONS[main];
        image.src = weapon.primaryTexture;
    }
}
applyColorAll(TEAMS.BlueYellow.alpha);
updateDropDowns();
function updateDropDowns(){
    let teamColor = document.getElementById("teamColor");
    let subWeapon = document.getElementById("subWeapon");
    let specialWeapon = document.getElementById("specialWeapon");
    let mainWeapon = document.getElementById("mainWeapon");
    for (let team in TEAMS) {
        let option = document.createElement("option");
        option.value = team;
        option.innerText = team;
        teamColor.appendChild(option);
    }
    for (let sub in SUB_WEAPONS) {
        let weapon = SUB_WEAPONS[sub];
        let option = document.createElement("option");
        option.value = sub;
        option.innerText = weapon.name;
        subWeapon.appendChild(option);
    }
    for (let special in SPECIAL_WEAPONS) {
        let weapon = SPECIAL_WEAPONS[special];
        let option = document.createElement("option");
        option.value = special;
        option.innerText = weapon.name;
        specialWeapon.appendChild(option);
    }
    for (let main in MAIN_WEAPONS) {
        let weapon = MAIN_WEAPONS[main];
        let option = document.createElement("option");
        option.value = main;
        option.innerText = weapon.name;
        mainWeapon.appendChild(option);
    }
}
function selectSpecial(){
    let special = document.getElementById("specialWeapon").value;
    applySpecial(SPECIAL_WEAPONS[special]);
}
function applySpecial(special){
    document.getElementById("specialColor").src = special.primaryTexture;
    document.getElementById("specialWhite").src = special.secondaryTexture;
}
function selectTeam(){
    let team = document.getElementById("teamColor").value;
    let side = document.getElementById("teamSide").value;
    applyColorAll(TEAMS[team][side]);
}

function selectSub(){
    let sub = document.getElementById("subWeapon").value;
    applySub(SUB_WEAPONS[sub]);
}
/**
 * 
 * @param {SubWeapon} sub 
 */
async function applySub(sub){
    document.getElementById("subColor").src = sub.primaryTexture;
    document.getElementById("subWhite").src = sub.secondaryTexture;
}
/**
 * 
 * @param {Color} color 
 */
async function applyColor(color, imageID, canvas){
    let ctx = canvas.getContext("2d");
    console.log(imageID)
    let image = document.getElementById(imageID);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await sleep(50);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const threashold = 115;
        if(!(imageData.data[i] <= threashold && imageData.data[i + 1] <= threashold && imageData.data[i + 2] <= threashold)) continue;
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyColorAll(color){
    applyColor(color, "subColor", WEAPON_INK_CANVAS);
    applyColor(color, "specialColor", SPECIAL_INK_CANVAS);
}
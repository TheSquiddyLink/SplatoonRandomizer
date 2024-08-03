import {Color, filterWeapons, randomObject, sleep} from "./util/general.js";
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
    teamColor: TEAMS.BlueYellow,
    teamSide: "alpha",
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
document.getElementById("exportToURL").addEventListener("click", () => exportToURL());
document.getElementById("weaponToggle").addEventListener("click", () => toggleWeaponConfig());
document.getElementById("subToggle").addEventListener("click", () => toggleSubConfig());
document.getElementById("specialToggle").addEventListener("click", () => toggleSpecialConfig());

loadUrlConfig();

function loadUrlConfig(){
    console.log("loading url config");
    const params = new URLSearchParams(window.location.search);
    if (params.get("autoHide") !== null) CONFIG.autoHide = params.get("autoHide") === "true";
    if (params.get("hideLen") !== null) CONFIG.hideDuration = parseFloat(params.get("hideLen"));
    if (params.get("showLen") !== null) CONFIG.showDuration = parseFloat(params.get("showLen"));
    if (params.get("disableSound") !== null) CONFIG.disableMusic = params.get("disableSound") == "true";
    if (params.get("disableAnimation") !== null) CONFIG.disableAnimation = params.get("disableAnimation") == "true";
    if (params.get("hideConfig")  !== null) hideConfig();
    if(params.get("hideControls") !==  null) hideAllControls();
    if(params.get("weaponConfig") !== null) parseWeaponConfigHex(params.get("weaponConfig"));
    else enableAllWeapons();
    if(params.get("subConfig") !== null) parseSubConfigHex(params.get("subConfig"));
    else enableAllSubs();
    if(params.get("teamColor") !== null) setTeamColor(params.get("teamColor"));
    if(params.get("teamSide") !== null) setTeamSide(params.get("teamSide"));
    updateDropDowns();
    setDefaultConfig();
    updateConfig();
    generateWeaponConfig();
    generateSubConfig();
    generateSpecialConfig();
}
function setTeamColor(teamColor){
    let keys = Object.keys(TEAMS);
    console.log(keys);
    console.log(teamColor);
    if(keys.includes(teamColor)){
        CONFIG.teamColor  = TEAMS[teamColor];
        console.log("Team color set to "+teamColor);
    } 
}
/**
 * 
 * @param {string} teamSide 
 */
function setTeamSide(teamSide){
    const teams = ["alpha", "bravo"];
    console.log(teamSide)
    if(teams.includes(teamSide)) CONFIG.teamSide = teamSide;
}
function enableAllWeapons(){
    for(let weapon in MAIN_WEAPONS){
        MAIN_WEAPONS[weapon].enabled = true;
    }
}

function enableAllSubs(){
    for(let sub in SUB_WEAPONS){
        SUB_WEAPONS[sub].enabled = true;
    }
}
/**
 * 
 * @param {string} weapon 
 */
function selectWeapon(weaponStr){
    MAIN_WEAPONS[weaponStr].toggleEnabled();
    console.log(MAIN_WEAPONS[weaponStr].enabled);
    setWeaponOpacity(weaponStr);
    
}
function generateSubConfig(){
    let subConfig = document.getElementById("subConfig");
    for (let sub in SUB_WEAPONS){
        let weapon = SUB_WEAPONS[sub];
        let img = document.createElement("img");
        img.src = weapon.primaryTexture;
        img.classList.add("subConfigImg");
        img.id = sub;
        img.addEventListener("click", () => toggleSub(sub));
        subConfig.appendChild(img);
        setSubOpacity(sub);
    }
}
function generateSpecialConfig(){
    let specialConfig = document.getElementById("specialConfig");
    for (let special in SPECIAL_WEAPONS){
        let weapon = SPECIAL_WEAPONS[special];
        let img = document.createElement("img");
        img.src = weapon.primaryTexture;
        img.classList.add("specialConfigImg");
        img.id = special;
        img.addEventListener("click", () => toggleSpecial(special));
        specialConfig.appendChild(img);
        setSpecialOpacity(special);
    }
}
function toggleSpecial(specialStr){
    let special = SPECIAL_WEAPONS[specialStr];
    special.toggleEnabled();
    setSpecialOpacity(specialStr);
}
function toggleSub(subStr){
    let sub = SUB_WEAPONS[subStr];
    sub.toggleEnabled();
    setSubOpacity(subStr);
}
function setSubOpacity(weaponStr){
    let weaponEl = document.getElementById(weaponStr);
    if(SUB_WEAPONS[weaponStr].enabled) weaponEl.style.opacity = 1;
    else weaponEl.style.opacity = 0.5;
}
function setSpecialOpacity(weaponStr){
    let weaponEl = document.getElementById(weaponStr);
    if(SPECIAL_WEAPONS[weaponStr].enabled) weaponEl.style.opacity = 1;
    else weaponEl.style.opacity = 0.5;
}


function toggleSpecialConfig(){
    let specialConfig = document.getElementById("specialConfig");
    if(specialConfig.style.display === "none"){
        specialConfig.style.display = "flex";
    }
    else{
        specialConfig.style.display = "none";
    }
    console.log(specialConfig.hidden);
}
function toggleSubConfig(){
    let subConfig = document.getElementById("subConfig");
    if(subConfig.style.display === "none"){
        subConfig.style.display = "flex";
    }
    else{
        subConfig.style.display = "none";
    }
    console.log(subConfig.hidden);
}
function setWeaponOpacity(weaponStr){
    let weaponEl = document.getElementById(weaponStr);
    if(MAIN_WEAPONS[weaponStr].enabled) weaponEl.style.opacity = 1;
    else weaponEl.style.opacity = 0.5;
}
function generateWeaponConfig(){
    let weaponConfig = document.getElementById("weaponConfig");
    for (let weapon in MAIN_WEAPONS){
        let img = document.createElement("img");
        img.src = MAIN_WEAPONS[weapon].primaryTexture;
        img.classList.add("weaponConfigImg");
        img.id = weapon;
        img.addEventListener("click", () => selectWeapon(weapon));
        weaponConfig.appendChild(img);
        setWeaponOpacity(weapon);
    }
}
function toggleWeaponConfig(){
    let weaponConfig = document.getElementById("weaponConfig");
    if(weaponConfig.style.display === "none"){
        weaponConfig.style.display = "flex";
    }
    else{
        weaponConfig.style.display = "none";
    }
    console.log(weaponConfig.hidden);
}
function hideAllControls(){
    document.getElementById("debugControls").hidden = true;
    document.getElementById("config").hidden = true;
}
function exportToURL(){
    console.log("generating url config");
    let url = new URL(window.location.href);
    url.searchParams.set("autoHide", CONFIG.autoHide);
    url.searchParams.set("hideLen", CONFIG.hideDuration);
    url.searchParams.set("showLen", CONFIG.showDuration);
    url.searchParams.set("disableSound", CONFIG.disableMusic);
    url.searchParams.set("disableAnimation", CONFIG.disableAnimation);
    url.searchParams.set("weaponConfig", generateWeaponConfigHex());
    url.searchParams.set("subConfig", generateSubConfigHex());
    url.searchParams.set("teamColor", CONFIG.teamColor.name);
    url.searchParams.set("teamSide", CONFIG.teamSide);
    navigator.clipboard.writeText(url.href);
    alert("URL Config Generated and Copied to Clipboard");
}

function updateColorPreview(defaultColor){
    console.log(defaultColor)
    let color;
    if(defaultColor != null){
        console.log("Found Default Color")
        color = defaultColor;
    } else {
        color = getTeam();
    }
   
    let colorPreview = document.getElementById("colorPreview");
    colorPreview.style.backgroundColor = color.toString();
    colorPreview.style.color = color.toString();
}

function toggleColorConfig() {
    let colorConfig = document.getElementById("colorConfig");
    console.log(colorConfig.hidden)
    colorConfig.hidden =!colorConfig.hidden;
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
    updateColorPreview(CONFIG.teamColor[CONFIG.teamSide]);
}

function setDefaultConfig(){
    console.log(CONFIG)
    document.getElementById("autoHide").checked = CONFIG.autoHide;
    document.getElementById("hideLen").value = CONFIG.hideDuration;
    document.getElementById("showLen").value = CONFIG.showDuration;
    document.getElementById("disableSound").checked = CONFIG.disableMusic;
    document.getElementById("iterations").value = CONFIG.iterations;
    document.getElementById("disableAnimation").checked = CONFIG.disableAnimation;
    document.getElementById("teamColor").value = CONFIG.teamColor.name;
    document.getElementById("teamSide").value = CONFIG.teamSide;
}
function generateWeaponConfigHex() {
    return generateAnyConfigHex(MAIN_WEAPONS);
}
function generateSubConfigHex(){
    return generateAnyConfigHex(SUB_WEAPONS);
}


function generateAnyConfigHex(weaponArr){
    let binary = "";
    for (let weaponKey in weaponArr) {
        let weapon = weaponArr[weaponKey];
        binary += weapon.enabled ? "1" : "0";
        console.log(weapon.name + " enabled: " + weapon.enabled);
    }
    console.log(binary);
    let decimal = BigInt("0b" + binary);
    console.log(decimal);
    let hex = decimal.toString(16).toUpperCase();
    console.log(hex);
    return hex;
}
function parseAnyWeaponFromHex(hex, weapons){
    let binaryString = BigInt("0x" + hex).toString(2);
    let expectedLength = Object.keys(weapons).length;
    binaryString = binaryString.padStart(expectedLength, '0');
    console.log("Check here")
    console.log(binaryString)
    let i = 0;
    for (let weaponKey in weapons) {
        let weapon = weapons[weaponKey];
        let enabled = binaryString[i] === '1';
        weapon.enabled = enabled;
        if(enabled){
            console.log(weapon.name + " is enabled");
        }
        i++
    }
}
function parseWeaponConfigHex(hex) {
    parseAnyWeaponFromHex(hex, MAIN_WEAPONS);
}
function parseSubConfigHex(hex){
    parseAnyWeaponFromHex(hex, SUB_WEAPONS);
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
    let filteredWeapons = filterWeapons(MAIN_WEAPONS);
    console.log("Filtered Weapons:")
    console.log(filteredWeapons)
    let key = randomObject(filteredWeapons);
    let weapon = filteredWeapons[key];
    console.log("Selected Weapon:");
    let mainWeaponName = document.getElementById("mainWeaponName");
    let subWeaponName = document.getElementById("subWeaponName");
    let specialWeaponName = document.getElementById("specialWeaponName");
    let mainWeapoonStars = document.getElementById("mainWeaponStars");
    mainWeapoonStars.innerHTML = "";
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

    applySub(weapon.subWeapon);
    applySpecial(weapon.specialWeapon);
    if(!CONFIG.disableMusic) AUDIO.play();
    console.log(iterations)
    if(!CONFIG.disableAnimation){
        for(let i = 0; i < iterations; i++){
            let randomKey = randomObject(filteredWeapons);
            let randomWeapon = filteredWeapons[randomKey];
            weaponImage.src = randomWeapon.primaryTexture;
            await sleep(lengthMS)
        }
    }
    applyMain(weapon)
    selectTeam();
    for(let i = 0; i< weapon.stars; i++){
        let star = document.createElement("img");
        star.src = "assets/svg/star.svg";
        star.classList.add("star");
        mainWeapoonStars.appendChild(star);
    }
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
function getTeam(){
    let team = document.getElementById("teamColor").value;
    let side = document.getElementById("teamSide").value;
    return TEAMS[team][side];
}
function selectTeam(){
    let team = document.getElementById("teamColor").value;
    let side = document.getElementById("teamSide").value;
    console.log("Team Changed")
    console.log(side)
    console.log(team)
    CONFIG.teamColor = TEAMS[team];
    CONFIG.teamSide = side;
    updateColorPreview();
    applyColorAll(getTeam());
}

/**
 * @deprecated
 */
function selectSub(){
    let sub = document.getElementById("subWeapon").value;
    applySub(SUB_WEAPONS[sub]);
}
/**
 * 
 * @param {SubWeapon} sub 
 */
async function applySub(sub){
    console.log("Look Bellow")
    console.log(sub);
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
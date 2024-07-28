import {Color} from "./util/general.js";
import {SubWeapon} from "./util/weaponsClass.js";

import { SPECIAL_WEAPONS, SUB_WEAPONS, TEAMS, MAIN_WEAPONS} from "./util/constants.js";
console.log("hello world"); 


/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");
/**
 * @type {HTMLCanvasElement}
 */
const SPECIAL_INK_CANVAS = document.getElementById("specialInk");

document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());
document.getElementById("subWeapon").addEventListener("change", () => selectSub());
document.getElementById("specialWeapon").addEventListener("change", () => selectSpecial());
document.getElementById("customColor").addEventListener("change", () => customColor());
document.getElementById("mainWeapon").addEventListener("change", () => selectMainWeapon());

function selectMainWeapon(){
    let main = document.getElementById("mainWeapon").value;
    applyMain(MAIN_WEAPONS[main]);
}
function applyMain(main){
    console.log(main);
    document.getElementById("mainWeaponImage").src = main.primaryTexture;
    selectTeam();
}

function customColor(){
    let color = document.getElementById("customColor").value;
    let customColor = Color.hex(color);
    console.log(customColor);
    applyColorAll(customColor);
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
    // BUG: Color dose not change on first attempt
    selectTeam();
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
    // BUG: Color dose not change on first attempt
    selectTeam();
}
/**
 * 
 * @param {Color} color 
 */
function applyColor(color, imageID, canvas){
    let ctx = canvas.getContext("2d");
    console.log(imageID)
    let image = document.getElementById(imageID);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
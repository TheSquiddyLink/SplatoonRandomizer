import {Color, filterWeapons, filterWeaponsStars, randomObject, generateStarHex, sleep, Team, Queue, toggleAll, filterByType, averageColor} from "./util/general.js";
import {MainWeapon, SubWeapon, BaseWeapon, SpecialWeapon, WeaponType, ColorChip, SideOrderWeapon} from "./util/weaponsClass.js";
import { MAIN_TYPES } from "./util/constants.js";

import {  SPECIAL_WEAPONS, SUB_WEAPONS, TEAMS, MAIN_WEAPONS, SORTED_WEAPONS, WEAPON_SPLAT, ALL_SPLAT_IMGS, PRESETS, ORDER_WEAPONS, SIDE_ORDER_COLORS} from "./util/constants.js";
import { Config, Package } from "./util/config.js";

const PACKAGE = new Package();

const CONFIG = new Config();
CONFIG.setDefault();

/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");
/**
 * @type {HTMLCanvasElement}
 */
const SPECIAL_INK_CANVAS = document.getElementById("specialInk");

/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_SPLAT_CANVAS = document.getElementById("weaponSplatCanvas");

const AUDIO = new Audio("./assets/audio/randomizer.mp3");

/**
 * @type {Queue<MainWeapon>}
 */
const MAIN_QUEUE = new Queue(CONFIG.weaponQueueSize);

/**
 * @type {Queue<SubWeapon>}
 */
const SUB_QUEUE = new Queue(CONFIG.subQueueSize);

/**
 * @type {Queue<SpecialWeapon>}
 */
const SPECIAL_QUEUE = new Queue(CONFIG.specialQueueSize);

/**
 * @type {Queue<WeaponType>}
 */
const TYPE_QUEUE = new Queue(CONFIG.typeQueueSize);


var animationPlaying = false;

document.addEventListener("keypress", (e) => handleKeyPress(e));
document.addEventListener("click", (e) => handleClick(e));

let hoverTimeout;

document.getElementById("config").addEventListener("change", (e) => handleConfigChange(e));
document.getElementById("generate").addEventListener("click", () => generate());

// Buttons
document.getElementById("invertTypes").addEventListener("click", (e) => invertTypes());
document.getElementById("invertWeapons").addEventListener("click", (e) => invertWeapons());
document.getElementById("invertSubs").addEventListener("click", (e) => invertSubs());
document.getElementById("invertSpecials").addEventListener("click", (e) => invertSpecials());
document.getElementById("permaHide").addEventListener("click", (e) => permaHideConfig());
document.getElementById("resetConfig").addEventListener("click", (e) => resetConfig());
document.getElementById("resetAll").addEventListener("click", (e) => resetAll());
document.getElementById("exportToURL").addEventListener("click", (e) => exportToURL());
document.getElementById("exportToJSON").addEventListener("click", (e) => exportToJSON());
document.getElementById("importFromJSON").addEventListener("change", (e) => importFromJSON(e));
document.getElementById("hideConfig").addEventListener("click", (e) => hideConfig());
document.getElementById("showConfig").addEventListener("click", (e) => showConfig());

document.getElementById("addConfig").addEventListener("change", (e) => addConfigJSON(e));
document.getElementById("exportPackage").addEventListener("click", (e) => exportPackage());
document.getElementById("importPackage").addEventListener("change", (e) => importPackage(e));
document.getElementById("importPackage2").addEventListener("change", (e) => importPackage(e));
document.getElementById("configSelector").addEventListener("change", (e) => selectConfig(e));

document.getElementById("config").addEventListener("mousemove", (e) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => handleHover(e), 10);
});

function selectConfig(e){
    CONFIG.cloneFrom(PACKAGE.configs[e.target.value]);
    setDefaultConfig();
}

/**
 * Handle when a config element has been changed
 * - This version uses a singular event listener rather than multiple for each element, thus resulting in less CPU usuag.
 * - NOTE: This has not been fully tested yet. Issues are likely to be present.
 * @param {Event} event 
 */
function handleConfigChange(event){
    console.log("Config Change");
    const target = /** @type {HTMLInputElement} */ (event.target);
    const id = target.id;

    switch (target.type) {
        case "checkbox":
            console.log("Checkbox");
            console.log(id, target.checked);
            CONFIG[id] = target.checked;
            break;
        case "number":
            console.log("Number");
            console.log(id, target.value);
            CONFIG[id] = parseInt(target.value);
            break;
        case "select-one":
            console.log("Select");
            console.log(id, target.value);
            handleSelect(event)
            break;
        case "color":
            console.log("Color");
            console.log(id, target.value);
            handelColor(event);
            break;
        default:
            console.log("Unknown");
            console.log(target.type)
            console.log(id, target.value);
            break;
    }
    if(event.target.getAttribute("submenu")!==null) updateSubMenu(event);
    updateURL();
}

/**
 * @param {Event} event
 */
function handelColor(event){
    switch(event.target.id){
        case "customColor":
            CONFIG.customColor = Color.hex(event.target.value);
            break;
        case "customBravoColor":
            CONFIG.customBravoColor = Color.hex(event.target.value);
            break
    }
    applyColorAll(getTeam());
}

/**
 * 
 * @param {Event} event 
 */
function handleSelect(event){
    console.log("Select");
    console.log(event.target.id);
    switch (event.target.id) {
        case "selectConfigMenu":
            selectConfigMenu();
            break;
        case "selectStars":
            setStarsFilter();
            break;
        case "presets":
            selectPreset();
            break;
        case "teamSide":
        case "teamColor":
            handleTeamSelect(event);
            break;
    }

}

/**
 * @param {Event} event
 */
function handleTeamSelect(event){
    console.log("Team Select");
    console.log(event.target.id);
    switch (event.target.id) {
        case "teamSide":
            CONFIG.teamSide = event.target.value;
            break;
        case "teamColor":
            CONFIG.teamColor = TEAMS[event.target.value];
            break;
    }
    console.log(CONFIG);
    applyColorAll(getTeam());
}
/**
 * 
 * @param {Event} event 
 */
function updateSubMenu(event){
    console.log("Updating Sub menu!")
    console.log(event.target.id);
    switch (event.target.id) {
        case "autoHide":
            document.getElementById("showControls").hidden = !event.target.checked;
            break;
        case "customColorToggle":
            document.getElementById("customColorSpan").hidden = !event.target.checked;
            break;
        case "customBravoToggle":
            document.getElementById("customBravoSpan").hidden = !event.target.checked;
            break;
    }
}

/**
 * Handles importing a package from a file
 * - This will display the package info and update the config selector
 * @param {Event} e - The event that triggered this function
 * @see {@link Package.loadPackageJSON}
 * @see {@link updateConfigSelector}
 */
async function importPackage(e){
    console.log("Importing Package")
    const target = /** @type {HTMLInputElement} */ (e.target);
    const file = target.files[0];
    if(file){
        let raw = await file.text();
        let json = JSON.parse(raw);
        console.log(json)
        PACKAGE.loadPackageJSON(json);
        console.log(PACKAGE)
        document.getElementById("packageInfo").hidden = false
        document.getElementById("pkgName").innerHTML = PACKAGE.name;
        document.getElementById("pkgAuthor").innerHTML = PACKAGE.author;
        document.getElementById("pkgDescription").innerHTML = PACKAGE.description;
        document.getElementById("pkgVersion").innerHTML = PACKAGE.version;
        document.getElementById("pkgDate").innerHTML = PACKAGE.date;
    }
    updateConfigSelector();
}

/**
 * Update the config selection drop down menu with the configs in the package
 * @see {@link PACKAGE}
 */
function updateConfigSelector(){
    const selector = document.getElementById("configSelector");
    selector.innerHTML = "";
    const placeHolder = document.createElement("option");
    placeHolder.innerHTML = "Select Config";
    placeHolder.setAttribute("disabled", "true");
    placeHolder.setAttribute("selected", "true");
    selector.appendChild(placeHolder);
    for(let i = 0; i < PACKAGE.configs.length; i++){
        console.log(PACKAGE.configs[i].metaData.name)
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = PACKAGE.configs[i].metaData.name == "" ? "Unnamed Config "+i : PACKAGE.configs[i].metaData.name;
        selector.appendChild(option);
    }
}

/**
 * Export the current package to a file
 * @see {@link PACKAGE}
 */
function exportPackage(){
    PACKAGE.name = document.getElementById("packageName").value;
    PACKAGE.description = document.getElementById("packageDescription").value;
    PACKAGE.author = document.getElementById("packageAuthor").value;
    PACKAGE.version = document.getElementById("packageVersion").value;
    PACKAGE.date = document.getElementById("packageDate").value;

    console.log(PACKAGE)
    let json = PACKAGE.toJSON();
    let blob = new Blob([JSON.stringify(json, null, 2)], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = "package.json";
    link.click();
}

/**
 * Add a config JSON to the package
 * - This will add the config(s) to the package
 * @param {Event} event
 */
async function addConfigJSON(event){
    const target = /** @type {HTMLInputElement} */ (event.target);
    const files = target.files;
    const selection = document.getElementById("configSelector");
    for(let i = 0; i < files.length; i++){
        let file = files[i];
        let raw = await file.text();
        let json = JSON.parse(raw);
        console.log(json)
        let index = PACKAGE.addConfig(Config.parseJSON(json));
        document.getElementById("addConfig").value = "";
        let option = document.createElement("option");
        option.value = index;
        option.text = json.metaData.name;
        selection.appendChild(option);
    }

}

/**
 * Import a singular config from JSON
 * @param {Event} event - File Upload Event
 */
async function importFromJSON(event){
    const target = /** @type {HTMLInputElement} */ (event.target);
    let file = target.files[0];
    console.log(file)
    let raw = await file.text();
    let json = JSON.parse(raw);
    CONFIG.parseJSON(json)
    setDefaultConfig();
}

/**
 * Export the current config to a file
 * @see {@link CONFIG}
 */
function exportToJSON(){
    const JSON_CONFIG = structuredClone(CONFIG);
    JSON_CONFIG.teamColor = CONFIG.teamColor.name.replace(" ", "");
    console.log(JSON_CONFIG.customColor)
    if(JSON_CONFIG.customColor !== null) JSON_CONFIG.customColor = CONFIG.customColor.toHex();
    if(JSON_CONFIG.customBravoColor !== null) JSON_CONFIG.customBravoColor = CONFIG.customBravoColor.toHex();
    let json = JSON.stringify(JSON_CONFIG);
    let blob = new Blob([json], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();
}

/**
 * Select a preset from the dropdown menu
 * @returns {void}
 */
function selectPreset(){
    let value = document.getElementById("presets").value;
    if(value == "none") return;
    let response = confirm("Are you sure you want to apply the preset " + value + "? This will overwrite your current configuration.");
    if(!response) {
        let params = new URLSearchParams(window.location.search);
        let oldPreset = params.get("preset");
        console.log(oldPreset)
        if(oldPreset == null) document.getElementById("presets").value = "none";
        else document.getElementById("presets").value = oldPreset;
        return
    };
    let oldURL = window.location.href;
    let newURL = oldURL.split("?")[0];
    newURL += "?preset=" + value;
    window.location.href = newURL;
}
/**
 * Toggle the visibility of the chip result
 * @see  {@link CONFIG}
 */
function toggleShowChipResult(){
    let value = document.getElementById("showChipResult").checked;
    CONFIG.showChipResult = value;
}
/**
 * Toggle averaging the chip color
 * @see {@link CONFIG}
 */
function toggleAverageChipColor(){
    let value = document.getElementById("averageChipColor").checked;
    CONFIG.averageChipColor = value;
}

/**
 * Toggle using an automatic chip color
 * @see {@link CONFIG}
 */
function toggleAutoChipColor(){
    let value = document.getElementById("autoChipColor").checked;
    document.getElementById("averageChipColorSpan").style.display = value ? "inline" : "none";
    CONFIG.autoChipColor = value;
}

/**
 * Toggle the using side order mode
 * @see {@link CONFIG}
 */
function toggleSideOrderMode(){
    let value = document.getElementById("sideOrderMode").checked;
    CONFIG.sideOrderMode = value;
}

/**
 * Apply using a custom bravo color
 * @see {@link CONFIG}
 * @see {@link applyColorAll}
 */
function applyCustomBravoColor(){
    let value = document.getElementById("customBravoColor").value;
    CONFIG.customBravoColor = Color.hex(value);
    applyColorAll(CONFIG.customColor);
}

/**
 * Toggle using a custom bravo color
 * @see {@link CONFIG}
 */
function toggleCustomBravo(){
    let value = document.getElementById("customBravoToggle").checked;
    document.getElementById("customBravoSpan").hidden = !value;
    if(!value) CONFIG.customBravoColor = null;
}

/**
 * Toggle Smart Generation
 */
function toggleSmartGen(){
    let value = document.getElementById("smartGen").checked;
    CONFIG.smartGen = value;
}

/**
 * Invert the color of all weapons, and update the opacity
 * @see {@link MAIN_WEAPONS}
 * @see {@link toggleAll}
 * @see {@link setWeaponOpacity}
 */
function invertWeapons(){
    toggleAll(MAIN_WEAPONS);
    for(let weapon in MAIN_WEAPONS){
        setWeaponOpacity(weapon);
    }
}

/**
 * Invert the color of all sub weapons, and update the opacity
 * @see {@link SUB_WEAPONS}
 * @see {@link toggleAll}
 * @see {@link setSubOpacity}
 */
function invertSubs(){
    toggleAll(SUB_WEAPONS);
    for(let weapon in SUB_WEAPONS){
        setSubOpacity(weapon);
    }
}
/**
 * Invert the color of all special weapons, and update the opacity
 * @see {@link SPECIAL_WEAPONS}
 * @see {@link toggleAll}
 * @see {@link setSpecialOpacity}
 */
function invertSpecials(){
    toggleAll(SPECIAL_WEAPONS);
    for(let weapon in SPECIAL_WEAPONS){
        setSpecialOpacity(weapon);
    }
}

/**
 * Invert all weapon types
 * @see {@link MAIN_TYPES}
 * @see {@link toggleAll}
 * @see {@link setTypeOpacity}
 */
function invertTypes(){
    toggleAll(MAIN_TYPES);
    for(let weapon in MAIN_TYPES){
        setTypeOpacity(weapon);
    }
}

/**
 * Cap the size of an input field using the max attribute
 * @param {String} idStr - The id of the input field
 * @returns {number} The new value of the input field
 */
function capSize(idStr){
    console.log("capSize", idStr);
    const input = document.getElementById(idStr);
    const max = parseInt(input.getAttribute("max"));
    if(input.value > max){
        console.log("Setting to max")
        input.value = max;
    } else if (input.value < 0){
        input.value = 0;
    }
    return input.value;
}
/**
 * Set the queue size for weapons
 * @see {@link CONFIG}
 */
function setQueueSize(){
    CONFIG.weaponQueueSize = capSize("weaponQueueSize");
    MAIN_QUEUE.maxSize = CONFIG.weaponQueueSize;

    CONFIG.subQueueSize = capSize("subQueueSize");
    SUB_QUEUE.maxSize = CONFIG.subQueueSize;

    CONFIG.specialQueueSize = capSize("specialQueueSize");
    SPECIAL_QUEUE.maxSize = CONFIG.specialQueueSize;

    CONFIG.typeQueueSize = capSize("typeQueueSize");
    TYPE_QUEUE.maxSize = CONFIG.typeQueueSize;
}   

/**
 * Toggle the visibility of config menu options based on the selection
 * @see {@link CONFIG}
 */
function selectConfigMenu(){
    const configMenu = document.getElementById("selectConfigMenu");
    const configMenuValue = configMenu.value;
    const weaponOptions = ["weapon", "sub", "special", "type"];
    for(let i=0; i<configMenu.children.length; i++){
        let configMenuOption = configMenu.children.item(i);
        console.log(configMenuOption)
        let configEle = document.getElementById(configMenuOption.value+"Config");
        if(configMenuOption.value == "all") continue;
        if(configMenuValue == "all") {
            if(weaponOptions.includes(configMenuOption.value)) configEle.style.display = "none";
            configEle.hidden = false
        }
        else if(configMenuOption.value == configMenuValue && weaponOptions.includes(configMenuOption.value)) configEle.style.display = "flex";
        else if(weaponOptions.includes(configMenuOption.value)) configEle.style.display = "none";
        else if(configMenuOption.value == configMenuValue) configEle.hidden = false;
        else configEle.hidden = true;
    }
}

/**
 * Toggle the visibility of the hover info
 * @see {@link CONFIG}
 */
function toggleHoverInfo(){
    CONFIG.hideHoverInfo = document.getElementById("hideHoverInfo").checked;
}

/**
 * Toggle the custom color setting
 */
function toggleCustomColor(){
    let customColorToggle = document.getElementById("customColorToggle");
    let customColorSpan = document.getElementById("customColorSpan");
    let customBravoSpan = document.getElementById("customBravoSpan");
    if(customColorToggle.checked){
        customColorSpan.hidden = false;
    } else {
        customColorSpan.hidden = true;
        customBravoSpan.hidden = true;
        CONFIG.customColor = null;
        CONFIG.customBravoColor = null;
    }
}

/**
 * Handel hovering for hover info
 * @param {MouseEvent} event 
 * @see {@link CONFIG}
 */
function handleHover(event) {
    if(CONFIG.hideHoverInfo) return;
    const hoverInfo = document.getElementById("hoverInfo");
    const hoverTitle = document.getElementById("hoverTitle");
    const hoverDesc = document.getElementById("hoverDesc");
    requestAnimationFrame(async () => {
        let title = event.target.getAttribute('hoverTitle');
        let dec = event.target.getAttribute('hoverDesc');
        if(!title) {
            hoverInfo.style.animation = "fadeOut 0.2s";
            await sleep(200);
            hoverInfo.hidden = true;
            hoverInfo.style.animation = "none";
            return;
        }
        hoverInfo.style.animation = "fadeIn 0.2s"
        hoverInfo.hidden = false;
        hoverInfo.style.position = "absolute";
        if((event.clientX + window.scrollX + 50 + hoverInfo.offsetWidth) > window.innerWidth){
            hoverInfo.style.left = (event.clientX + window.scrollX - hoverInfo.offsetWidth - 10) + "px";
        } else {
            hoverInfo.style.left = (event.clientX + window.scrollX + 10) + "px";
        
        }
        if((event.clientY + 50 +  hoverInfo.offsetHeight)> window.innerHeight){
            console.log("Outside")
            hoverInfo.style.top = (event.clientY + window.scrollY - hoverInfo.offsetHeight - 10) + "px";
        } else {
            hoverInfo.style.top = (event.clientY + window.scrollY + 10) + "px";
        }
        hoverTitle.innerHTML = title;
        hoverDesc.innerHTML = dec;
    });
}
/**
 * Toggle the invert splat color setting
 */
function toggleSplatConfig(){
    let value = document.getElementById("invertSplat").checked;
    CONFIG.invertSplat = value;
    applyColorAll(getTeam());
}

/**
 * Handle clicking when OBS friendly is enabled
 * @param {MouseEvent} event 
 */
function handleClick(event){
    if(CONFIG.obsFriendly){
        event.preventDefault();
        generate();
    }
}

/**
 * Confirm the user wants to reset all settings
 * @returns {void}
 */
function resetAll(){
    let result = confirm("Are you sure you want to reset all settings including weapons?");
    if(!result) return;
    let oldURL = window.location.href;
    let newURL = oldURL.split("?")[0];
    window.location.href = newURL;
}

const INPUT_KEYS = ["Space", "Enter"]
/**
 * Handle pressing a key in {@link INPUT_KEYS}
 * - If conditions are met it will generate a new weapon
 * @param {KeyboardEvent} event 
 */
function handleKeyPress(event){
    console.log("Key Pressed: ");
    console.log(event.code);
    if(INPUT_KEYS.includes(event.code)){
        if(event.target.tagName.toLowerCase() === "input") return;
        event.preventDefault();
        generate();
    }

}

/**
 * Set the background to the current setting
 * - Rainbow background
 * - Rainbow button
 * - Normal Background
 * - Normal button
 * @see {@link CONFIG}
 */
function setBackground(){
    CONFIG.rainbowBackground = document.getElementById("rainbowBackground").checked
    CONFIG.rainbowButton = document.getElementById("rainbowButton").checked;
    let body = document.getElementById("body");
    let button = document.getElementById("generate");
    if(CONFIG.rainbowBackground){
        body.style.backgroundImage = genRainbowGradient();
        body.style.backgroundSize = "2000%";
    } else {
        body.style.backgroundImage = "none";
        body.style.backgroundSize = "100%";
    }
    if(CONFIG.rainbowButton){
        button.style.backgroundImage = genRainbowGradient();
        button.style.backgroundSize = "2000%";
        button.style.animation = "movingBackground 500s linear infinite";
    } else {
        setAniBackground();
        applyColorAll(getTeam());
    }
  
}

/**
 * Reset the current config to the default values
 * @see {@link CONFIG.setDefault}
 */
function resetConfig(){
    CONFIG.setDefault();
    updateURL();
    setDefaultConfig();
}
/**
 * Permanently hide the config and header
 */
function permaHideConfig(){
    CONFIG.permaHide = true;
    document.getElementById("config").remove();
    document.getElementById("header").remove();
    updateURL();
}

/**
 * Set the auto URL setting
 * @see {@link updateURL}
 */
function setAutoURL(){
    CONFIG.autoURL = document.getElementById("autoURL").checked;
    updateURL();
}

/**
 * Update the URL if the auto URL setting is enabled
 * @see {@link updateURL}
 */
async function automaticConfigUpdate(){
    if(!CONFIG.autoURL) return;
    await sleep(500);
    updateURL()
}

/**
 * Update the current url
 * @see {@link generateURL}
 */
function updateURL(){
    let url = generateURL();
    if(window.location.href == url.href) return;
    window.history.pushState({}, '', url)
    console.log(url)
}

/**
 * Set the animated background
 */
function setAniBackground(){
    console.log("Setting Ani Background")
    let button = document.getElementById("generate");
    let toggle = document.getElementById("aniGenButton");
    CONFIG.aniGenButton = toggle.checked;
    if(CONFIG.aniGenButton) {
        button.style.animation = "movingBackground 10s infinite";
        button.style.animationFillMode = "forwards";
        button.style.backgroundSize = "120%"
    }
    else button.style.animation = "none";
    console.log(button.style.animation)
}

/**
 * Set the config settings for the stars filter
 */
function setStarsFilter(){
    CONFIG.starsFilter = document.getElementById("selectStars").value;
    CONFIG.exactStarsFilter = document.getElementById("exactStarsFilter").checked;
}

/**
 * Toggle showing stars in the result
 * @see {@link updateStars}
 */
function toggleResultStars(){
    CONFIG.resultStars = !CONFIG.resultStars;
    updateStars();
}

/**
 * Toggle editing stars in the config
 * @see {@link toggleShowStarsConfig}
 */
function toggleEditStarsConfig(){
    CONFIG.editStars = !CONFIG.editStars;
    if(CONFIG.editStars){
        document.getElementById("showStarsToggle").checked = true;
        toggleShowStarsConfig();
    }
}

/**
 * Toggle the displaying stars setting
 * @see {@link updateStars}
 */
function toggleShowStarsConfig(){
    CONFIG.displayStars = !CONFIG.displayStars;
    updateStars();
}

/**
 * Update the stars in the result
 */
function updateStars(){
    let stars = document.getElementsByClassName("starDiv")
    console.log(stars.length)
    for(let i = 0; i < stars.length; i++){
        stars.item(i).hidden = !CONFIG.displayStars;
        stars.item(i).style.display = CONFIG.displayStars ? "flex" : "none";
    }
    let resultStar =  document.getElementsByClassName("mainStars").item(0);
    if(CONFIG.resultStars) {
       resultStar.hidden = false;
       resultStar.style.display = "flex";
    }
    else {
        resultStar.hidden = true;
        resultStar.style.display = "none";
    }
}
loadUrlConfig();

/**
 * Load the config from the url
 * - This will go through the search params and set the respective config value
 * @see {@link CONFIG}
 * @see {@link updateDropDowns}
 * @see {@link updateDropDowns()}
 * @see {@link updateStars}
 * @see {@link updateURL}
 * @see {@link generateAnyConfigHex}
 */
function loadUrlConfig(){
    console.log("loading url config");
    const params = new URLSearchParams(window.location.search);
    if (params.get("autoHide") !== null) CONFIG.autoHide = params.get("autoHide") === "true";
    if (params.get("hideLen") !== null) CONFIG.hideLen = parseFloat(params.get("hideLen"));
    if (params.get("showLen") !== null) CONFIG.showLen = parseFloat(params.get("showLen"));
    if (params.get("disableSound") !== null) CONFIG.disableSound = params.get("disableSound") == "true";
    if (params.get("disableAnimation") !== null) CONFIG.disableAnimation = params.get("disableAnimation") == "true";
    if (params.get("hideConfig")  !== null) hideConfig();
    if(params.get("hideControls") !==  null) hideAllControls();
    if(params.get("weaponConfig") !== null) parseWeaponConfigHex(params.get("weaponConfig"));
    else enableAllWeapons();
    if(params.get("subConfig") !== null) parseSubConfigHex(params.get("subConfig"));
    else enableAllSubs();
    if(params.get("specialConfig") !== null) parseSpecialConfigHex(params.get("specialConfig"));
    else enableAllSpecials();
    if(params.get("typeConfig") !== null) parseTypeConfigHex(params.get("typeConfig"));
    else enableAllTypes();
    if(params.get("teamColor") !== null) setTeamColor(params.get("teamColor"));
    if(params.get("teamSide") !== null) setTeamSide(params.get("teamSide"));
    if(params.get("editStars") !== null) CONFIG.editStars = params.get("editStars") == "true";
    if(params.get("displayStars") !== null) CONFIG.displayStars = params.get("displayStars") == "true";
    if(params.get("resultStars") !== null) CONFIG.resultStars = params.get("resultStars") == "true";
    if(params.get("exactStarsFilter") !== null) CONFIG.exactStarsFilter = params.get("exactStarsFilter") == "true";
    if(params.get("starsFilter") !== null) CONFIG.starsFilter = parseInt(params.get("starsFilter"));
    if(params.get("starConfig") !== null) parseStarHex(params.get("starConfig"));
    if(params.get("aniGenButton") !== null) CONFIG.aniGenButton = params.get("aniGenButton") == "true";
    if(params.get("autoURL") !=null) CONFIG.autoURL = params.get("autoURL") == "true";
    if(params.get("rainbowBackground") !== null) CONFIG.rainbowBackground = params.get("rainbowBackground") == "true";
    if(params.get("rainbowButton") !== null) CONFIG.rainbowButton = params.get("rainbowButton") == "true";
    if(params.get("obsFriendly") !== null) CONFIG.obsFriendly = params.get("obsFriendly") == "true";
    if(params.get("invertSplat") !== null) CONFIG.invertSplat = params.get("invertSplat") == "true";
    if(params.get("hideHoverInfo") !== null) CONFIG.hideHoverInfo = params.get("hideHoverInfo") == "true";
    if(params.get("customColor") !== null) CONFIG.customColor = Color.hex(params.get("customColor"));
    if(params.get("weaponQueueSize") !== null) CONFIG.weaponQueueSize = parseInt(params.get("weaponQueueSize"));
    if(params.get("subQueueSize") !== null) CONFIG.subQueueSize = parseInt(params.get("subQueueSize"));
    if(params.get("specialQueueSize") !== null) CONFIG.specialQueueSize = parseInt(params.get("specialQueueSize"));
    if(params.get("typeQueueSize") !== null) CONFIG.typeQueueSize = parseInt(params.get("typeQueueSize"));
    if(params.get("smartGen") !== null) CONFIG.smartGen = params.get("smartGen") == "true";
    if(params.get("iterations") !== null) CONFIG.iterations = parseInt(params.get("iterations"));
    if(params.get("customBravoColor") !== null) CONFIG.customBravoColor = Color.hex(params.get("customBravoColor"));
    if(params.get("preset") !== null) loadPreset(params.get("preset"));
    if(params.get("sideOrderMode") !== null) CONFIG.sideOrderMode = params.get("sideOrderMode") == "true";
    if(params.get("autoChipColor") !== null) CONFIG.autoChipColor = params.get("autoChipColor") == "true";
    if(params.get("averageChipColor") !== null) CONFIG.averageChipColor = params.get("averageChipColor") == "true";
    if(params.get("showChipResult") !== null) CONFIG.showChipResult = params.get("showChipResult") == "true";
    document.getElementById("weaponQueueSize").setAttribute("max", Object.keys(MAIN_WEAPONS).length);
    document.getElementById("subQueueSize").setAttribute("max", Object.keys(SUB_WEAPONS).length);
    document.getElementById("specialQueueSize").setAttribute("max", Object.keys(SPECIAL_WEAPONS).length);
    updateDropDowns();
    setDefaultConfig();
    if(params.get("permaHide") == "true") permaHideConfig(); 
    if(!CONFIG.permaHide){
        updateConfig();
        generateWeaponConfig();
        generateAnyWeaponConfig("subConfig", SUB_WEAPONS, toggleSub, setSubOpacity);
        generateAnyWeaponConfig("specialConfig", SPECIAL_WEAPONS, toggleSpecial, setSpecialOpacity);
        generateAnyWeaponConfig("typeConfig", MAIN_TYPES, toggleType, setTypeOpacity, "_");
    }
    }
    
/**
 * Enable all weapon types
 * @see {@link MAIN_TYPES}
 */
function enableAllTypes(){
    for(let key in MAIN_TYPES){
        let type = MAIN_TYPES[key]
        type.enabled = true;
    }
}

/**
 * Parse the weapon type hex
 * @param {String} hex - hex value for the weapon types
 */
function parseTypeConfigHex(hex){
    parseAnyWeaponFromHex(hex, MAIN_TYPES);
}

/**
 * Load a preset
 * - If no preset is found, it will do nothing
 * @param {String} presetStr 
 * @returns  {void}
 */
function loadPreset(presetStr){
    console.log("Loading Preset"+ presetStr)
    const preset = PRESETS[presetStr];
    document.getElementById("presets").value = presetStr;
    console.log(preset);
    if(preset == null) return;
    const keys = Object.keys(preset);
    for(let key of keys){
        if(key == "weaponHex") {
            parseWeaponConfigHex(preset[key])
            continue;
        }
        CONFIG[key] = preset[key]
    }
}

function toggleType(typeStr){
    console.log("TOGGLE TYPE")
    let type = MAIN_TYPES[typeStr];
    console.log(type)
    type.toggleEnabled();
    setTypeOpacity(typeStr);
}
function setTypeOpacity(typeStr){
    console.log(typeStr)
    let weaponEl = document.getElementById(typeStr+"_");
    console.log(weaponEl)
    if(MAIN_TYPES[typeStr].enabled) weaponEl.style.opacity = 1;
    else weaponEl.style.opacity = 0.5;
}
async function testSplatImgs(){
    const PATH  = "/assets/svg/splat/";
    const weaponSplatImg = document.getElementById("weaponSplatImg");
    for(let i = 0; i< WEAPON_SPLAT.length; i++){
        let splat = WEAPON_SPLAT[i];
        console.log(splat)
        weaponSplatImg.src = PATH+splat;
        await sleep(1000)
    } 
}
function setTeamColor(teamColor){
    let keys = Object.keys(TEAMS);
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
function enableAllSpecials(){
    for(let special in SPECIAL_WEAPONS){
        SPECIAL_WEAPONS[special].enabled = true;
    }
}
/**
 * 
 * @param {string} weapon 
 */
function clickWeapon(weaponStr){
    console.log("Clicked Weapon")
    let weapon = MAIN_WEAPONS[weaponStr];
    if(!CONFIG.editStars){
        weapon.toggleEnabled();
    } else {
        weapon.increaseStars();
        weapon.enabled = true;
    }
    setWeaponOpacity(weaponStr);
}

/**
 * 
 * @param {MouseEvent} event 
 * @param {string} weaponStr 
 */
function rightClickWeapon(event, weaponStr){
    event.preventDefault();
    let weapon = MAIN_WEAPONS[weaponStr];
    if(!CONFIG.editStars){
        return;
    }
    else if(event.shiftKey){
        weapon.toggleEnabled();
    }else {
        let stars = weapon.stars;
        console.log(stars)
        weapon.decreaseStars();
    }
    setWeaponOpacity(weaponStr);
    
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

function createConfigStar(_class = "configStar"){
    let star = document.createElement("img");
    star.src = "assets/svg/star.svg";
    star.classList.add(_class);
    return star;
}
function setWeaponOpacity(weaponStr){
    let weaponEl = document.getElementById(weaponStr);
    let weapon = MAIN_WEAPONS[weaponStr]
    if(weapon.enabled) weaponEl.style.opacity = 1;
    else weaponEl.style.opacity = 0.5;
    let starDiv =  document.getElementById(`${weaponStr}-stars`)
    let oldStars = starDiv.childElementCount;
    let starDiff  = oldStars - weapon.stars
    if (starDiff == 0) return;
    if(starDiff > 0){
        for(let i = 0; i < starDiff; i++){
            starDiv.removeChild(starDiv.lastChild);
        }
    } else {
        for(let i = 0; i < Math.abs(starDiff); i++){
            starDiv.appendChild(createConfigStar());
        }
    }
}

/**
 * 
 * @param {string} id 
 * @param {Array<BaseWeapon>} array 
 * @param {Function} eventFunc 
 * @param {Function} opacityFunc 
 * @param {String} prefix 
 */
function generateAnyWeaponConfig(id, array, eventFunc, opacityFunc, prefix=""){
    let config = document.getElementById(id);
    for (let item in array){
        let div = document.createElement("div");
        div.classList.add("weaponConfigDiv");
        let weapon = array[item];
        let img = document.createElement("img");
        img.src = weapon.primaryTexture;
        img.classList.add("weaponConfigImg");
        img.id = item+prefix;
        img.addEventListener("click", () => eventFunc(item));
        div.setAttribute("hoverTitle", weapon.name);
        img.setAttribute("hoverTitle", weapon.name);
        div.appendChild(img);
        config.appendChild(div);
        opacityFunc(item);
    }
}

/**
 * Generate the weapon config
 * @see {@link SORTED_WEAPONS}
 * @see {@link MAIN_WEAPONS}
 */
function generateWeaponConfig(){
    let weaponConfig = document.getElementById("weaponConfig");
    for (let weapon in SORTED_WEAPONS){
        let div = document.createElement("div");
        let img = document.createElement("img");
        let starDiv = document.createElement("div");
        generateStars(MAIN_WEAPONS[weapon], starDiv, "configStar");
        starDiv.classList.add("starDiv");
        starDiv.setAttribute("id", `${weapon}-stars`);
        img.src = MAIN_WEAPONS[weapon].primaryTexture;
        img.classList.add("weaponConfigImg");
        div.classList.add("weaponConfigDiv");
        img.id = weapon;
        img.addEventListener("click", () => clickWeapon(weapon));
        img.addEventListener("contextmenu", (e) => rightClickWeapon(e, weapon));
        div.setAttribute("hoverTitle", MAIN_WEAPONS[weapon].name);
        div.setAttribute("hoverDesc", `${MAIN_WEAPONS[weapon].subWeapon.name} | ${MAIN_WEAPONS[weapon].specialWeapon.name}`);
        img.setAttribute("hoverTitle", MAIN_WEAPONS[weapon].name);
        img.setAttribute("hoverDesc", `${MAIN_WEAPONS[weapon].subWeapon.name} | ${MAIN_WEAPONS[weapon].specialWeapon.name}`);
        console.log(div)
        div.appendChild(img);
        div.appendChild(starDiv);
        weaponConfig.appendChild(div);
        setWeaponOpacity(weapon);
    }
    updateStars();
}

/**
 * Toggle the visibility of the weapon config
 * @deprecated
 */
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
/**
 * Hide the entire config section
 */
function hideAllControls(){
    document.getElementById("debugControls").hidden = true;
    document.getElementById("config").hidden = true;
}
/**
 * Generate the URL for the current config
 * @see {@link CONFIG}
 * @see {@link generateWeaponConfigHex}
 * @see {@link generateSubConfigHex}
 * @see {@link generateSpecialConfigHex}
 * @see {@link generateStarHex}
 * @see {@link generateAnyConfigHex}
 * @returns {URL}
 */
function generateURL(){
    let url = new URL(window.location.href);
    for(let setting in CONFIG){
        if(setting == "metaData") continue;
        if(CONFIG.isDefault(setting)) {
            url.searchParams.delete(setting);
            continue;
        }
        if(setting == "teamColor") {
            url.searchParams.set(setting, CONFIG[setting].name.replace(" ", ""));
            continue;
        }
        if(setting == "customColor" || setting == "customBravoColor"){
            url.searchParams.set(setting, CONFIG[setting].toHex());
            continue;
        }
        url.searchParams.set(setting, CONFIG[setting]);
    }
    url.searchParams.set("weaponConfig", generateWeaponConfigHex());
    url.searchParams.set("subConfig", generateSubConfigHex());
    url.searchParams.set("specialConfig", generateSpecialConfigHex());
    url.searchParams.set("starConfig", generateStarHex(MAIN_WEAPONS));
    url.searchParams.set("typeConfig", generateAnyConfigHex(MAIN_TYPES));
    return url
}

/**
 * Export the current url to the clipboard
 * @see {@link generateURL}
 */
function exportToURL(){
    console.log("generating url config");
    let url = generateURL()
    navigator.clipboard.writeText(url.href);
    alert("URL Config Generated and Copied to Clipboard");
}

/**
 * 
 * @param {*} defaultColor 
 */
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

/**
 * Toggle the visibility of the color config
 * @deprecated
 */
function toggleColorConfig() {
    let colorConfig = document.getElementById("colorConfig");
    console.log(colorConfig.hidden)
    colorConfig.hidden =!colorConfig.hidden;
}
/**
 * Hide the config section
 */
function hideConfig(){
    let config = document.getElementById("config")
    config.hidden = true
    let showConfigButton = document.getElementById("showConfig");
    showConfigButton.hidden = false;
    let header = document.getElementById("header");
    header.style.display = "none"
}
/**
 * Show the config section
 */
function showConfig(){
    let config = document.getElementById("config")
    config.hidden = false;
    let showConfigButton = document.getElementById("showConfig");
    showConfigButton.hidden = true;
    let header = document.getElementById("header");
    header.style.display = "flex"
}

/**
 * Hide the randomizer result
 */
async function hide(){
    let randomizerResult = document.getElementById("randomizerResult");
    randomizerResult.style.animation = `fadeOut ${CONFIG.hideLen}s`;
    await sleep(CONFIG.hideLen * 1000);
    randomizerResult.hidden = true;
    randomizerResult.style.animation = "none";
}
/**
 * Update the config
 * @see {@link CONFIG}
 */
function updateConfig(){
    console.log("updating config");
    let autoHide = document.getElementById("autoHide").checked;
    let hideDuration = document.getElementById("hideLen").value;
    let showLen = document.getElementById("showLen").value;
    let disableMusic = document.getElementById("disableSound").checked;
    let iterations = document.getElementById("iterations").value;
    let disableAnimation = document.getElementById("disableAnimation").checked;
    CONFIG.autoHide = autoHide;
    CONFIG.hideLen = hideDuration;
    CONFIG.showLen = showLen;
    CONFIG.disableSound = disableMusic;
    CONFIG.iterations = iterations;
    CONFIG.disableAnimation = disableAnimation;
    if(autoHide){
        document.getElementById("showControls").hidden = false;
    } else {
        document.getElementById("showControls").hidden = true;
    }
    updateColorPreview(CONFIG.teamColor[CONFIG.teamSide]);
}

/**
 * Set the config settings on the document to the default values
 * @see {@link CONFIG}
 */
function setDefaultConfig(){
    console.log(CONFIG)
    
    const specialCases = {
        editStars: "editStarsToggle",
        displayStars: "showStarsToggle",
        resultStars: "showResultStars",
        starsFilter: "selectStars"
    }
    for(let setting in CONFIG){
        console.log(setting)
        if(setting == "metaData") continue;
        if(setting == "obsFriendly") continue;
        if(setting == "teamColor"){
            document.getElementById(setting).value = CONFIG[setting].name.replace(" ", "");
            continue;
        }
        if(typeof CONFIG[setting] == "boolean"){
            if(setting in specialCases){
                document.getElementById(specialCases[setting]).checked = CONFIG[setting];
                continue;
            }
            document.getElementById(setting).checked = CONFIG[setting];
            continue;
        } else {
            if(setting in specialCases){
                document.getElementById(specialCases[setting]).value = CONFIG[setting];
                continue;
            }
            document.getElementById(setting).value = CONFIG[setting];
            continue;
        }
    }
    MAIN_QUEUE.maxSize = CONFIG.weaponQueueSize;
    SUB_QUEUE.maxSize = CONFIG.subQueueSize;
    SPECIAL_QUEUE.maxSize = CONFIG.specialQueueSize;
    if(CONFIG.customColor != null){
        document.getElementById("customColor").value = CONFIG.customColor;
        document.getElementById("customColorToggle").checked = true;
        toggleCustomColor();
    }
    if(CONFIG.editStars){
        document.getElementById("showStarsToggle").checked = true;
    }
    setBackground();
}
/**
 * Generate Weapon config hex
 * @deprecated Replaced by {@link generateAnyConfigHex}
 * @returns {string} HEX string
 */
function generateWeaponConfigHex() {
    return generateAnyConfigHex(MAIN_WEAPONS);
}
/**
 * Generate Sub config hex
 * @deprecated Replaced by {@link generateAnyConfigHex}
 * @returns {String} HEX string
 */
function generateSubConfigHex(){
    return generateAnyConfigHex(SUB_WEAPONS);
}
/**
 * Generate Special config hex
 * @deprecated Replaced by {@link generateAnyConfigHex}
 * @returns {String} HEX string
 */
function generateSpecialConfigHex(){
    return generateAnyConfigHex(SPECIAL_WEAPONS);
}

/**
 * Generate a HEX string from the given weapon array
 * - Using the weapon's enabled status, generate a binary string, then convert to HEX
 * @param {Record<String, BaseWeapon>} weaponArr 
 * @returns {String} HEX String
 * @see {@link BaseWeapon}
 * @see {@link BaseWeapon.enabled}
 */
function generateAnyConfigHex(weaponArr){
    let binary = "";
    for (let weaponKey in weaponArr) {
        let weapon = weaponArr[weaponKey];
        binary += weapon.enabled ? "1" : "0";
    }
    console.log(binary);
    let decimal = BigInt("0b" + binary);
    console.log(decimal);
    let hex = decimal.toString(16).toUpperCase();
    console.log(hex);
    return hex;
}
/**
 * Using a given HEX string, parse the stars for each weapon
 * @param {String} hex HEX value for the current stars 
 * @see {@link MainWeapon.stars}
 * @see {@link generateStarHex}
 */
function parseStarHex(hex){
    let binaryString = BigInt("0x" + hex).toString(2);
    let expectedLength = Object.keys(MAIN_WEAPONS).length;
    binaryString = binaryString.padStart(expectedLength, '0');
    let i = 0;
    for (let weaponKey in MAIN_WEAPONS) {
        let weapon = MAIN_WEAPONS[weaponKey]
        let newStars = parseInt(binaryString[i] + binaryString[i + 1] + binaryString[i + 2], 2);
        weapon.stars = newStars;
    }
}

/**
 * Parse a HEX string into the given weapon array
 * @param {String} hex HEX value for the current stars
 * @param {Record<String, BaseWeapon>} weapons An string base weapon pair of weapons such as: {@link MAIN_WEAPONS}
 */
function parseAnyWeaponFromHex(hex, weapons){
    let binaryString = BigInt("0x" + hex).toString(2);
    let expectedLength = Object.keys(weapons).length;
    binaryString = binaryString.padStart(expectedLength, '0');
    let i = 0;
    for (let weaponKey in weapons) {
        let weapon = weapons[weaponKey];
        let enabled = binaryString[i] === '1';
        weapon.enabled = enabled;
        i++
    }
}
/**
 * Parse a HEX string into the {@link MAIN_WEAPONS} array
 * @param {String} hex - HEX value for the current stars
 * @deprecated Replaced by {@link parseAnyWeaponFromHex}
 */
function parseWeaponConfigHex(hex) {
    parseAnyWeaponFromHex(hex, MAIN_WEAPONS);
}
/**
 * Parse a HEX string into the {@link SUB_WEAPONS} array
 * @param {String} hex - HEX value for the current stars
 * @deprecated Replaced by {@link parseAnyWeaponFromHex}
 */
function parseSubConfigHex(hex){
    parseAnyWeaponFromHex(hex, SUB_WEAPONS);
}
/**
 * Parse a HEX string into the {@link SPECIAL_WEAPONS} array
 * @param {String} hex - HEX value for the current stars
 * @deprecated Replaced by {@link parseAnyWeaponFromHex}
 */
function parseSpecialConfigHex(hex){
    parseAnyWeaponFromHex(hex, SPECIAL_WEAPONS);
}

/**
 * Generate a new weapon and handle the randomization process
 * - This is the main function of the generator, handling getting weapons, animations, and more
 * @returns {Promise<void>}
 */
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
    randomizerResult.style.animation = `fadeOut 0.25s`;
    await sleep(250);
    randomizerResult.style.animation = "";
    randomizerResult.hidden = false;
    console.log(ORDER_WEAPONS)
    let filteredWeapons = CONFIG.sideOrderMode ? filterWeapons(ORDER_WEAPONS) : filterWeapons(MAIN_WEAPONS);
    console.log("stars Filter: " + CONFIG.starsFilter);
    if(CONFIG.starsFilter > 0 || CONFIG.exactStarsFilter){
        filteredWeapons = filterWeaponsStars(filteredWeapons, CONFIG.starsFilter, CONFIG.exactStarsFilter);
    }
    console.log("Filtered Weapons:")
    console.log(filteredWeapons)
    let key;
    if(CONFIG.smartGen){
        console.log("Using Smart Gen")
        let randomType = randomObject(MAIN_TYPES);
        console.log(randomType)
        let filteredTypes = filterByType(filteredWeapons, randomType);
        console.log(filteredTypes)
        key = randomObject(filteredTypes);
        if(key == undefined) {
            console.log("Smart gen was unable to work")
            console.log(filteredWeapons)
            key = randomObject(filteredWeapons);
        }
    }else {
        key = randomObject(filteredWeapons);
    }
    let weapon = filteredWeapons[key];
    console.log("Selected Weapon:");
    let mainWeaponName = document.getElementById("mainWeaponName");
    let subWeaponName = document.getElementById("subWeaponName");
    let specialWeaponName = document.getElementById("specialWeaponName");
    let mainWeaponStars = document.getElementById("mainWeaponStars");
    console.log("Result Stars: "+CONFIG.resultStars)
    mainWeaponStars.style.display = CONFIG.resultStars ? "flex" : "none";  
    let weaponSplatImg = document.getElementById("weaponSplatImg");
    let randomSplatIndex = Math.round(Math.random()*(WEAPON_SPLAT.length - 1));
    let primaryChipName = document.getElementById("primaryChipName");
    let secondaryChipName = document.getElementById("secondaryChipName");
    const SPLAT_PATH = "assets/svg/splat/"
    weaponSplatImg.src = SPLAT_PATH+WEAPON_SPLAT[randomSplatIndex];
    WEAPON_SPLAT_CANVAS.hidden = true;
    mainWeaponStars.innerHTML = "";
    console.log(weapon);
    if(weapon == undefined){
        alert("No weapons left to generate! Please adjust your filters and try again");
        animationPlaying = false;
        generateButton.disabled = false;
        return;
    }
    applySub(weapon.subWeapon);
    applySpecial(weapon.specialWeapon);

    let weaponImage = document.getElementById("mainWeaponImage");
    let subSpecial = document.getElementsByClassName("multiImage");
    let primaryChip = document.getElementById("primaryChip");
    let secondaryChip = document.getElementById("secondaryChip");
    subSpecial.item(0).hidden = true;
    subSpecial.item(1).hidden = true;
    mainWeaponName.hidden = true;
    subWeaponName.hidden = true;
    specialWeaponName.hidden = true;
    primaryChip.hidden = true;
    secondaryChip.hidden = true;
    primaryChipName.hidden = true;
    secondaryChipName.hidden = true;
    let totalLength = 2550;
    let iterations = CONFIG.iterations;
    let lengthMS = totalLength/iterations;
    let lengthS = lengthMS/1000;
    document.getElementById("mainWeaponImage").style.animation = `shake ${lengthS}s infinite`;

    applySub(weapon.subWeapon);
    applySpecial(weapon.specialWeapon);
    if(!CONFIG.disableSound) AUDIO.play();
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
    if(weapon instanceof SideOrderWeapon && CONFIG.autoChipColor){
        let primaryChip = weapon.primaryChip;
        let primaryColor = SIDE_ORDER_COLORS[primaryChip.name];
        let secondaryChip = weapon.secondaryChip;
        let secondaryColor = SIDE_ORDER_COLORS[secondaryChip.name];
        if(CONFIG.averageChipColor) selectTeam(averageColor(primaryColor, secondaryColor, 0.5));
        else selectTeam(primaryColor);
    } else {
        selectTeam();
    }

    generateStars(weapon, mainWeaponStars);

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
    WEAPON_SPLAT_CANVAS.style.animation = `finish ${lengthS}s`;
    toggleChipResult();
    if(weapon instanceof SideOrderWeapon){
        applyChips(weapon.primaryChip, weapon.secondaryChip)
        primaryChip.style.animation = `finish ${lengthS}s`;
        secondaryChip.style.animation = `finish ${lengthS}s`;
        primaryChipName.style.animation = `finish ${lengthS}s`;
        secondaryChipName.style.animation = `finish ${lengthS}s`;
    }
    WEAPON_SPLAT_CANVAS.hidden = false;
    if(CONFIG.autoHide){
        await sleep(CONFIG.showLen*1000);
        hide();
    }
    console.log(AUDIO.duration)
    await sleep(AUDIO.duration*1000 - totalLength)
    animationPlaying = false;
    generateButton.disabled = false;
    if(CONFIG.weaponQueueSize > 0) mainEnqueue(weapon);
    if(CONFIG.subQueueSize > 0) subEnqueue(weapon.subWeapon);
    if(CONFIG.specialQueueSize > 0) specialEnqueue(weapon.specialWeapon);
    if(CONFIG.typeQueueSize > 0) typeEnqueue(weapon.type);
}

/**
 * Enqueue the weapon type to the type queue
 * @param {WeaponType} type
 * @see {@link Queue}
 * @see {@link TYPE_QUEUE}
 * @deprecated Replaced by {@link anyWeaponEnqueue}
 */
function typeEnqueue(type){
    anyWeaponEnqueue(type, TYPE_QUEUE);
    console.log("Type Queue:")
    console.log(TYPE_QUEUE.queue);
}
/**
 * Enqueue the special weapon to the special queue
 * @param {SpecialWeapon} special
 * @see {@link Queue}
 * @see {@link SPECIAL_QUEUE}
 * @deprecated Replaced by {@link anyWeaponEnqueue}
 */
function specialEnqueue(special){
    anyWeaponEnqueue(special, SPECIAL_QUEUE);
    console.log("Special Queue:")
    console.log(SPECIAL_QUEUE.queue);
}

/**
 * Enqueue the main weapon to the main queue
 * @param {MainWeapon} weapon
 * @see {@link Queue}
 * @see {@link MAIN_QUEUE}
 * @deprecated Replaced by {@link anyWeaponEnqueue}
 */
function mainEnqueue(weapon){
    anyWeaponEnqueue(weapon, MAIN_QUEUE);
    console.log(MAIN_QUEUE.queue)
}

/**
 * Enqueue the sub weapon to the sub queue
 * @param {SubWeapon} sub
 * @see {@link Queue}
 * @see {@link SUB_QUEUE}
 * @deprecated Replaced by {@link anyWeaponEnqueue}
 */
function subEnqueue(sub){
    anyWeaponEnqueue(sub, SUB_QUEUE);
    console.log("Sub Queue:")
    console.log(SUB_QUEUE.queue);
}
/**
 * This will enqueue the weapon to the queue
 * - If the queue is full, the oldest weapon will be removed from the queue
 * - When adding to the queue it will disable the weapon
 * - When removing from the queue it will enable the weapon
 * @param {BaseWeapon} weapon 
 * @param {Queue<BaseWeapon>} queue 
 * @see {@link Queue}
 * @see {@link BaseWeapon.enabled}
 */
function anyWeaponEnqueue(weapon, queue){
    weapon.enabled = false;
    let removedWeapon = queue.enqueue(weapon)
    console.log(queue.size)
    console.log(queue.maxSize)
    if(removedWeapon != undefined){
        removedWeapon.enabled = true;
        console.log("Enabled weapon: " + removedWeapon.name);
    }
}
/**
 * Handle selecting a main weapon from the debug dropdown
 * @see {@link applyMain}
 * @deprecated No longer used
 */
function selectMainWeapon(){
    let main = document.getElementById("mainWeapon").value;
    applyMain(MAIN_WEAPONS[main]);
}
/**
 * Apply the main weapon to the element
 * @param {MainWeapon} main 
 * @deprecated No longer used
 */
function applyMain(main){
    console.log(main);
    document.getElementById("mainWeaponImage").src = main.primaryTexture;
}

/**
 * Apply the color when a custom color has been selected
 * @see {@link applyColorAll}
 */
function applyCustomColor(){
    let color = document.getElementById("customColor").value;
    let customColor = Color.hex(color);
    CONFIG.customColor = customColor;
    applyColorAll(customColor);

}

/**
 * Test all main weapons by displaying their images
 * - This is used to test if the images are loading correctly as well if the paths exist
 */
async function testMainWeapons(){
    const image = document.getElementById("mainWeaponImage");
    for (let main in MAIN_WEAPONS) {
        await sleep(100);
        let weapon = MAIN_WEAPONS[main];
        image.src = weapon.primaryTexture;
    }
}

applyColorAll(TEAMS.BlueYellow.alpha);

/**
 * Update the dropdowns with the current values
 * - These are the debug dropdowns and are no longer uses
 * @deprecated No longer used
 */
function updateDropDowns(){
    const teamColor = document.getElementById("teamColor");
    const subWeapon = document.getElementById("subWeapon");
    const specialWeapon = document.getElementById("specialWeapon");
    const mainWeapon = document.getElementById("mainWeapon");
    const weaponType = document.getElementById("weaponTypeFilter");
    for (let team in TEAMS) {
        let option = document.createElement("option");
        option.value = team;
        option.innerText = TEAMS[team].name;
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

/**
 * Generate the stars based on the weapon
 * @param {MainWeapon} weapon  - The weapon to generate the stars for
 * @param {HTMLDivElement} element  - The element to append the stars to
 * @param {string} [_class="star"] - The CSS class for the star elements, defaults to "star"
 * @see {@link createConfigStar}
*/
function generateStars(weapon, element, _class = "star"){
    for(let i = 0; i< weapon.stars; i++){
        let star = createConfigStar(_class);
        element.appendChild(star);
    }
}
/**
 * Select a special weapon
 * - This is used to select a special weapon from the debug dropdown
 * @see {@link applySpecial}
 * @deprecated No longer used
 */
function selectSpecial(){
    let special = document.getElementById("specialWeapon").value;
    applySpecial(SPECIAL_WEAPONS[special]);
}
/**
 * Apply the special weapon to the element
 * @param {SpecialWeapon} special
 */
function applySpecial(special){
    document.getElementById("specialColor").src = special.primaryTexture;
    document.getElementById("specialWhite").src = special.secondaryTexture;
}

/**
 * Get the current selected team
 * @returns {Team}
 * @see {@link TEAMS}
 */
function getTeam(){
    return CONFIG.teamColor[CONFIG.teamSide];
}
/**
 * Get the alpha and bravo teams based on the team type selected
 * @returns {Team}
 * @see {@link TEAMS}
 */
function getAllTeams(){
    return CONFIG.teamColor;
}
/**
 * Event for selecting a team
 * @param {?Color} sideOrderColor -  The Side Order Color to apply to the team, if null the normal color will be used
 * @see {@link updateColorPreview}
 * @see {@link applyColorAll}
 * @see {@link getTeam}
 */
function selectTeam(sideOrderColor){
    if(sideOrderColor != null) applyColorAll(sideOrderColor);
    else applyColorAll(getTeam());
}

/**
 * Select a sub weapon
 * - This is used to select a sub weapon from the debug dropdown
 * @deprecated No longer used
 */
function selectSub(){
    let sub = document.getElementById("subWeapon").value;
    applySub(SUB_WEAPONS[sub]);
}
/**
 * Apply a sub weapon
 * - Update the sub weapon images
 * @param {SubWeapon} sub 
 */
function applySub(sub){
    console.log("Look Bellow")
    console.log(sub);
    document.getElementById("subColor").src = sub.primaryTexture;
    document.getElementById("subWhite").src = sub.secondaryTexture;
}

/**
 * Apply the color chips
 * @param {ColorChip} primary - Primary color chip
 * @param {ColorChip} secondary - Secondary color chip
 */
function applyChips(primary, secondary){
    console.log("Applying Chips")
    console.log(primary);
    document.getElementById("primaryChip").src = primary.primaryTexture;
    document.getElementById("secondaryChip").src = secondary.primaryTexture;

    document.getElementById("primaryChipName").innerHTML = primary.name;
    document.getElementById("secondaryChipName").innerHTML = secondary.name;
}

/**
 * Toggle showing the color chips result
 * @see {@link Config.sideOrderMode}
 * @see {@link Config.showChipResult}
 */
function toggleChipResult(){
    document.getElementById("primaryChip").hidden = !CONFIG.sideOrderMode || (!CONFIG.showChipResult && CONFIG.sideOrderMode);
    document.getElementById("secondaryChip").hidden = !CONFIG.sideOrderMode || (!CONFIG.showChipResult && CONFIG.sideOrderMode);
    document.getElementById("primaryChipName").hidden = !CONFIG.sideOrderMode || (!CONFIG.showChipResult && CONFIG.sideOrderMode);
    document.getElementById("secondaryChipName").hidden = !CONFIG.sideOrderMode || (!CONFIG.showChipResult && CONFIG.sideOrderMode);
}

/**
 * Apply a color to the canvas
 * - Using the current team color, adjust the image to use the color
 * @param {Color} color  - The color to apply
 * @param {string} imageID - The ID of the image to apply the color to
 * @param {HTMLCanvasElement} canvas - The canvas to apply the color to
 */
async function applyColor(color, imageID, canvas){
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    console.log(imageID)
    let image = document.getElementById(imageID);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await sleep(50);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    if(imageID == "weaponSplatImg"){
        console.log(canvas.width);
        console.log(image.width);
    }
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const threshold = 115;
        if(!(imageData.data[i] <= threshold && imageData.data[i + 1] <= threshold && imageData.data[i + 2] <= threshold)) continue;
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
    }
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply the color to all images:
 * - Sub Weapon
 * - Special Weapon\
 * If the team color is set to custom, use the custom color
 * Handle if the splat color is inverted
 * @param {Color} color - The color to set the values of
 * @see {@link applyColor}
 */
function applyColorAll(color){
    if(CONFIG.customColor != null) color = CONFIG.customColor;
    applyColor(color, "subColor", WEAPON_INK_CANVAS);
    applyColor(color, "specialColor", SPECIAL_INK_CANVAS);
    let team = getAllTeams();

    let color1 = CONFIG.customColor ? CONFIG.customColor : team.alpha;
    let color2 = CONFIG.customColor ? CONFIG.customColor.invert() : team.bravo;
    color2 = CONFIG.customBravoColor ? CONFIG.customBravoColor : color2
    console.log(CONFIG.teamSide)
    let splatColor;
    if(CONFIG.sideOrderMode){
        splatColor = color;
    }
    else if(CONFIG.invertSplat){
        splatColor = CONFIG.teamSide == "alpha" ? color2 : color1;
    } else {
        splatColor = CONFIG.teamSide == "alpha" ? color1 : color2;
    }

    applyColor(splatColor, "weaponSplatImg", WEAPON_SPLAT_CANVAS);
    if(!CONFIG.rainbowButton)  {
        let backgroundImage = `linear-gradient(45deg, ${color1.toString()}, ${color2.toString()})`;
        console.log(backgroundImage);
        document.getElementById("generate").style.backgroundImage = "none"
        document.getElementById("generate").style.backgroundImage = backgroundImage;
    }
}

/**
 * Generate a CSS linear gradient that contains all the teams
 * @returns {string} - The background image string
 * @see {@link TEAMS}
 * @see {@link Team}
 * @see {@link Color}
 */
function genRainbowGradient(){
    let backgroundImageString = "";
    let i = 0;
    let len = Object.keys(TEAMS).length;
    console.log(len)
    for(let key in TEAMS){
        let team = TEAMS[key];
        let color1 = team.alpha;
        let color2 = team.bravo;
        backgroundImageString += `${color1.toString()}, ${color2.toString()}`  
       
        if(i != len-1) backgroundImageString += ", ";
        i++;
    }
    let backgroundImage = `linear-gradient(45deg, ${backgroundImageString})`;
    console.log(backgroundImage);
    return backgroundImage;
}

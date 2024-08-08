import {Color, filterWeapons, filterWeaponsStars, randomObject, generateStarHex, sleep, Team, Queue, toggleAll} from "./util/general.js";
import {MAIN_TYPES, MainWeapon, SubWeapon, BaseWeapon, SpecialWeapon, WeaponType} from "./util/weaponsClass.js";

import {  SPECIAL_WEAPONS, SUB_WEAPONS, TEAMS, MAIN_WEAPONS, SORTED_WEAPONS, WEAPON_SPLAT, ALL_SPLAT_IMGS} from "./util/constants.js";

const CONFIG = {
    autoHide: false,
    hideLen: 2.5,
    showLen: 2.5,
    disableSound: false,
    iterations: 25,
    disableAnimation: false, 
    teamColor: TEAMS.BlueYellow,
    teamSide: "alpha",
    editStars: false,
    displayStars: false,
    resultStars: false,
    starsFilter: 0,
    exactStarsFilter: false,
    aniGenButton: true,
    autoURL: true,
    permaHide: false,
    rainbowBackground: false,
    rainbowButton: false,
    obsFriendly: false,
    invertSplat: true,
    hideHoverInfo: false,
    customColor: null,
    weaponQueueSize: 3,
    subQueueSize: 0,
    specialQueueSize: 0,
    typeQueueSize: 0,
}

const ORGINAL_CONFIG = structuredClone(CONFIG)

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
document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());
document.getElementById("subWeapon").addEventListener("change", () => selectSub());
document.getElementById("specialWeapon").addEventListener("change", () => selectSpecial());
document.getElementById("customColor").addEventListener("change", () => applyCustomColor());
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
document.getElementById("showConfig").addEventListener("click", () => showConfig());
document.getElementById("exportToURL").addEventListener("click", () => exportToURL());
document.getElementById("editStarsToggle").addEventListener("click", () => toggleEditStarsConfig());
document.getElementById("showStarsToggle").addEventListener("click", () => toggleShowStarsConfig());
document.getElementById("showResultStars").addEventListener("click", () => toggleResultStars());
document.getElementById("selectStars").addEventListener("change", () => setStarsFilter());
document.getElementById("exactStarsFilter").addEventListener("change", () => setStarsFilter());
document.getElementById("aniGenButton").addEventListener("click", () => setAniBackground())
document.getElementById("autoURL").addEventListener("click", () => setAutoURL() )
document.getElementById("permaHide").addEventListener("click", () => permaHideConfig())
document.getElementById("resetConfig").addEventListener("click", () => resetConfig())
document.getElementById("rainbowBackground").addEventListener("click", () => setBackground())
document.getElementById("rainbowButton").addEventListener("click", () => setBackground())
document.getElementById("resetAll").addEventListener("click", () => resetAll())
document.getElementById("invertSplat").addEventListener("click", () => toggleSplatConfig())
document.getElementById("hideHoverInfo").addEventListener("click", () => toggleHoverInfo())
document.getElementById("customColorToggle").addEventListener("change", () => toggleCustomColor())
document.getElementById("selectConfigMenu").addEventListener("change", () => selectConfigMenu())
document.getElementById("weaponQueueSize").addEventListener("change", () => setQueueSize())
document.getElementById("subQueueSize").addEventListener("change", () => setQueueSize())
document.getElementById("specialQueueSize").addEventListener("change", () => setQueueSize())
document.getElementById("typeQueueSize").addEventListener("change", () => setQueueSize())
document.getElementById("invertWeapons").addEventListener("click", () => invertWeapons());

document.getElementById("config").addEventListener("change", () => automaticConfigUpdate())
document.addEventListener("keypress", (e) => handleKeyPress(e));
document.addEventListener("click", (e) => handleClick(e));

let hoverTimeout;

document.getElementById("config").addEventListener("mousemove", (e) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => handleHover(e), 10);
});

function invertWeapons(){
    toggleAll(MAIN_WEAPONS);
    for(let weapon in MAIN_WEAPONS){
        setWeaponOpacity(weapon);
    }
}
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

function selectConfigMenu(){
    const configMenu = document.getElementById("selectConfigMenu");
    const configMenuValue = configMenu.value;
    const weaponOptions = ["weapon", "sub", "special", "type"];
    for(let i=0; i<configMenu.children.length; i++){
        let configMenuOption = configMenu.children.item(i);
        console.log(configMenuOption)
        let configEle = document.getElementById(configMenuOption.value+"Config");
        if(configMenuOption.value == "all") continue;
        if(configMenuValue == "all") configEle.hidden = false;
        else if(configMenuOption.value == configMenuValue && weaponOptions.includes(configMenuOption.value)) configEle.style.display = "flex";
        else if(weaponOptions.includes(configMenuOption.value)) configEle.style.display = "none";
        else if(configMenuOption.value == configMenuValue) configEle.hidden = false;
        else configEle.hidden = true;
    }
}

function toggleHoverInfo(){
    CONFIG.hideHoverInfo = document.getElementById("hideHoverInfo").checked;
}

function toggleCustomColor(){
    let customColorToggle = document.getElementById("customColorToggle");
    let customColorSpan = document.getElementById("customColorSpan");
    if(customColorToggle.checked){
        customColorSpan.hidden = false;
    } else {
        customColorSpan.hidden = true;
        CONFIG.customColor = null;
    }
}

/**
 * 
 * @param {MouseEvent} event 
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
function toggleSplatConfig(){
    let value = document.getElementById("invertSplat").checked;
    CONFIG.invertSplat = value;
    applyColorAll(getTeam());
}

function handleClick(event){
    if(CONFIG.obsFriendly){
        event.preventDefault();
        generate();
    }
}
function resetAll(){
    let result = confirm("Are you sure you want to reset all settings including weapons?");
    if(!result) return;
    let oldURL = window.location.href;
    let newURL = oldURL.split("?")[0];
    window.location.href = newURL;
}

const INPUT_KEYS = ["Space", "Enter"]
/**
 * 
 * @param {KeyboardEvent} event 
 */
function handleKeyPress(event){
    console.log("Key Pressed: ");
    console.log(event.code);
    if(INPUT_KEYS.includes(event.code)){
        event.preventDefault();
        generate();
    }

}

// setRainbowBackground();
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
function resetConfig(){
    for(let setting in CONFIG){
        CONFIG[setting] = ORGINAL_CONFIG[setting]
    }
    updateURL();
    setDefaultConfig();
}
function permaHideConfig(){
    CONFIG.permaHide = true;
    document.getElementById("config").style.display = "none"
    document.getElementById("header").style.display = "none"
    updateURL();
}

function setAutoURL(){
    CONFIG.autoURL = document.getElementById("autoURL").checked;
    updateURL();
}

async function automaticConfigUpdate(){
    if(!CONFIG.autoURL) return;
    await sleep(500);
    updateURL()
}
function updateURL(){
    let url = generateURL();
    if(window.location.href == url.href) return;
    window.history.pushState({}, '', url)
    console.log(url)
}
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

function setStarsFilter(){
    CONFIG.starsFilter = document.getElementById("selectStars").value;
    CONFIG.exactStarsFilter = document.getElementById("exactStarsFilter").checked;
}

function toggleResultStars(){
    CONFIG.resultStars = !CONFIG.resultStars;
    updateStars();
}
function toggleEditStarsConfig(){
    CONFIG.editStars = !CONFIG.editStars;
    if(CONFIG.editStars){
        document.getElementById("showStarsToggle").checked = true;
        toggleShowStarsConfig();
    }
}
function toggleShowStarsConfig(){
    CONFIG.displayStars = !CONFIG.displayStars;
    updateStars();
}
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
    if(params.get("permaHide") == "true") permaHideConfig(); 
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
    
    document.getElementById("weaponQueueSize").setAttribute("max", Object.keys(MAIN_WEAPONS).length);
    document.getElementById("subQueueSize").setAttribute("max", Object.keys(SUB_WEAPONS).length);
    document.getElementById("specialQueueSize").setAttribute("max", Object.keys(SPECIAL_WEAPONS).length);
    updateDropDowns();
    setDefaultConfig();
    updateConfig();
    generateWeaponConfig();
    generateAnyWeaponConfig("subConfig", SUB_WEAPONS, toggleSub, setSubOpacity);
    generateAnyWeaponConfig("specialConfig", SPECIAL_WEAPONS, toggleSpecial, setSpecialOpacity);
    generateAnyWeaponConfig("typeConfig", MAIN_TYPES, toggleType, setTypeOpacity, "_");
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
/**
 * 
 * @returns {URL}
 */
function generateURL(){
    let url = new URL(window.location.href);
    for(let setting in CONFIG){
        if(ORGINAL_CONFIG[setting] == CONFIG[setting]) continue;
        if(setting == "teamColor") {
            url.searchParams.set(setting, CONFIG[setting].name.replace(" ", ""));
            continue;
        }
        if(setting == "customColor"){
            url.searchParams.set(setting, CONFIG[setting].toHex());
            continue;
        }
        url.searchParams.set(setting, CONFIG[setting]);
    }
    url.searchParams.set("weaponConfig", generateWeaponConfigHex());
    url.searchParams.set("subConfig", generateSubConfigHex());
    url.searchParams.set("specialConfig", generateSpecialConfigHex());
    url.searchParams.set("starConfig", generateStarHex(MAIN_WEAPONS));
    return url
}
function exportToURL(){
    console.log("generating url config");
    let url = generateURL()
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
    let header = document.getElementById("header");
    header.style.display = "none"
}
function showConfig(){
    let config = document.getElementById("config")
    config.hidden = false;
    let showConfigButton = document.getElementById("showConfig");
    showConfigButton.hidden = true;
    let header = document.getElementById("header");
    header.style.display = "flex"
}
async function hide(){
    let randomizerResult = document.getElementById("randomizerResult");
    randomizerResult.style.animation = `fadeOut ${CONFIG.hideLen}s`;
    await sleep(CONFIG.hideLen * 1000);
    randomizerResult.hidden = true;
    randomizerResult.style.animation = "none";
}

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

function setDefaultConfig(){
    console.log(CONFIG)
    
    const specialCases = {
        editStars: "editStarsToggle",
        displayStars: "showStarsToggle",
        resultStars: "showResultStars",
        starsFilter: "selectStars"
    }
    for(let setting in CONFIG){
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
function generateWeaponConfigHex() {
    return generateAnyConfigHex(MAIN_WEAPONS);
}
function generateSubConfigHex(){
    return generateAnyConfigHex(SUB_WEAPONS);
}
function generateSpecialConfigHex(){
    return generateAnyConfigHex(SPECIAL_WEAPONS);
}


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
function parseWeaponConfigHex(hex) {
    parseAnyWeaponFromHex(hex, MAIN_WEAPONS);
}
function parseSubConfigHex(hex){
    parseAnyWeaponFromHex(hex, SUB_WEAPONS);
}
function parseSpecialConfigHex(hex){
    parseAnyWeaponFromHex(hex, SPECIAL_WEAPONS);
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
    console.log("stars Filter: " + CONFIG.starsFilter);
    if(CONFIG.starsFilter > 0 || CONFIG.exactStarsFilter){
        filteredWeapons = filterWeaponsStars(filteredWeapons, CONFIG.starsFilter, CONFIG.exactStarsFilter);
    }
    console.log("Filtered Weapons:")
    console.log(filteredWeapons)
    let key = randomObject(filteredWeapons);
    let weapon = filteredWeapons[key];
    console.log("Selected Weapon:");
    let mainWeaponName = document.getElementById("mainWeaponName");
    let subWeaponName = document.getElementById("subWeaponName");
    let specialWeaponName = document.getElementById("specialWeaponName");
    let mainWeapoonStars = document.getElementById("mainWeaponStars");
    let weaponSplatImg = document.getElementById("weaponSplatImg");
    let randomSplatIndex = Math.round(Math.random()*(WEAPON_SPLAT.length - 1));
    const SPLATPATH = "assets/svg/splat/"
    weaponSplatImg.src = SPLATPATH+WEAPON_SPLAT[randomSplatIndex];
    WEAPON_SPLAT_CANVAS.hidden = true;
    mainWeapoonStars.innerHTML = "";
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
    selectTeam();
    generateStars(weapon, mainWeapoonStars);
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
    WEAPON_SPLAT_CANVAS.hidden = false;
    if(CONFIG.autoHide){
        await sleep(CONFIG.showLen*1000);
        hide();
    }
    console.log(AUDIO.duration)
    await sleep(AUDIO.duration*1000 - totalLenght)
    animationPlaying = false;
    generateButton.disabled = false;
    if(CONFIG.weaponQueueSize > 0) mainEnqueue(weapon);
    if(CONFIG.subQueueSize > 0) subEnqueue(weapon.subWeapon);
    if(CONFIG.specialQueueSize > 0) specialEnqueue(weapon.specialWeapon);
    if(CONFIG.typeQueueSize > 0) typeEnqueue(weapon.type);
}

/**
 * @param {WeaponType} type
 */
function typeEnqueue(type){
    anyWeaponEnqueue(type, TYPE_QUEUE);
    console.log("Type Queue:")
    console.log(TYPE_QUEUE.queue);
}
/**
 * 
 * @param {SpecialWeapon} special 
 */
function specialEnqueue(special){
    anyWeaponEnqueue(special, SPECIAL_QUEUE);
    console.log("Special Queue:")
    console.log(SPECIAL_QUEUE.queue);
}
/**
 * 
 * @param {MainWeapon} weapon 
 */
function mainEnqueue(weapon){
    anyWeaponEnqueue(weapon, MAIN_QUEUE);
    console.log(MAIN_QUEUE.queue)
}

/**
 * @param {SubWeapon} sub
 */
function subEnqueue(sub){
    anyWeaponEnqueue(sub, SUB_QUEUE);
    console.log("Sub Queue:")
    console.log(SUB_QUEUE.queue);
}
/**
 * 
 * @param {BaseWeapon} weapon 
 * @param {Queue<BaseWeapon>} queue 
 */
function anyWeaponEnqueue(weapon, queue){
    weapon.enabled = false;
    let removedWeapon = queue.enqueue(weapon)
    console.log(queue.size)
    console.log(queue.maxSize)
    if(removedWeapon != undefined){
        removedWeapon.enabled = true;
        console.log("Eneabled weapon: " + removedWeapon.name);
    }
}
function selectMainWeapon(){
    let main = document.getElementById("mainWeapon").value;
    applyMain(MAIN_WEAPONS[main]);
}
function applyMain(main){
    console.log(main);
    document.getElementById("mainWeaponImage").src = main.primaryTexture;
}

function applyCustomColor(){
    let color = document.getElementById("customColor").value;
    let customColor = Color.hex(color);
    CONFIG.customColor = customColor;
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
 * 
 * @param {MainWeapon} weapon 
 * @param {HTMLDivElement} element 
 * @param {?string} _class
 */
function generateStars(weapon, element, _class = "star"){
    for(let i = 0; i< weapon.stars; i++){
        let star = createConfigStar(_class);
        element.appendChild(star);
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
/**
 * 
 * @returns {Team}
 */
function getAllTeams(){
    let team = document.getElementById("teamColor").value
    return TEAMS[team]
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
    if(imageID == "weaponSplatImg"){
        console.log(canvas.width);
        console.log(image.width);
    }
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

/**
 * 
 * @param {Color} color 
 */
function applyColorAll(color){
    if(CONFIG.customColor != null) color = CONFIG.customColor;
    applyColor(color, "subColor", WEAPON_INK_CANVAS);
    applyColor(color, "specialColor", SPECIAL_INK_CANVAS);
    let team = getAllTeams();

    let color1 = CONFIG.customColor ? CONFIG.customColor : team.alpha;
    let color2 = CONFIG.customColor ? CONFIG.customColor.invert() : team.bravo;
    console.log(CONFIG.teamSide)
    let splatColor;
    if(CONFIG.invertSplat){
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
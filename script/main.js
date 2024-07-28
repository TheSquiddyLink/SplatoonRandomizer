import {Team, RGB} from "./util/general.js";
import {SubWeapon} from "./util/weapons.js";

console.log("hello world"); 


/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");
const SPECIAL_INK_CANVAS = document.getElementById("specialInk");

const TEAMS = {
    BlueYellow: new Team("BlueYellow", "Splatoon 3", new RGB(26,26,174), new RGB(227,141,36)),
    GreenPurple: new Team("GreenPurple", "Splatoon 3", new RGB(160,201,55), new RGB(174,0,174)),
    LimegreenPurple: new Team("LimegreenPurple", "Splatoon 3", new RGB(190,205,65), new RGB(99,37,205)),
    OrangeBlue: new Team("OrangeBlue", "Splatoon 1", new RGB(222, 102, 36), new RGB(52,59,196)),
    OrangePurple: new Team("OrangePurple", "Splatoon 3", new RGB(222, 102, 36), new RGB(110,4,182)),
    PinkGreen: new Team("PinkGreen", "Splatoon 2", new RGB(193,45,116), new RGB(44,183,33)),
    TurquoisePink: new Team("TurquoisePink", "Splatoon 3", new RGB(27,190,171), new RGB(196,58,110)),
    TurquoiseRed: new Team("TurquoiseRed", "Splatoon 3", new RGB(30,192,173), new RGB(215,75,49)),
    YellowBlue: new Team("YellowBlue", "Splatoon 3", new RGB(208,190,8), new RGB(58,12,205)),
    YellowPurple: new Team("YellowPurple", "Splatoon 3", new RGB(206,177,33), new RGB(144,37,198)),
}

const SUB_WEAPONS = {
    AngleShooter: new SubWeapon("AngleShooter", "angle_shooter"),
    AutoBomb: new SubWeapon("AutoBomb", "auto_bomb"),
    BurstBomb: new SubWeapon("BurstBomb", "burst_bomb"),
    CurlingBomb: new SubWeapon("CurlingBomb", "curling_bomb"),
    FizzyBomb: new SubWeapon("FizzyBomb", "fizzy_bomb"),
    InkMine: new SubWeapon("InkMine", "ink_mine"),
    PointSensorr: new SubWeapon("PointSensor", "point_sensor"),
    SplatBomb: new SubWeapon("SplatBomb", "splat_bomb"),
    Sprinkler: new SubWeapon("Sprinkler", "sprinkler"),
    SquidBeakon: new SubWeapon("SquidBeakon", "squid_beakon"),
    SuctionBomb: new SubWeapon("SuctionBomb", "suction_bomb"),
    Torpedo: new SubWeapon("Torpedo", "torpedo"),
    ToxicMist: new SubWeapon("ToxicMist", "toxic_mist"),
}

document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());
document.getElementById("subWeapon").addEventListener("change", () => selectSub());
document.getElementById("customColor").addEventListener("change", () => customColor());

function customColor(){
    let customColor = document.getElementById("customColor").value;
    console.log(customColor)
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(customColor);
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    ApplyColorAll(new RGB(r,g,b));
}

ApplyColorAll(TEAMS.BlueYellow.alpha);
updateDropDowns();
function updateDropDowns(){
    let teamColor = document.getElementById("teamColor");
    let subWeapon = document.getElementById("subWeapon");
    for (let team in TEAMS) {
        let option = document.createElement("option");
        option.value = team;
        option.innerText = team;
        teamColor.appendChild(option);
    }
    for (let sub in SUB_WEAPONS) {
        let option = document.createElement("option");
        option.value = sub;
        option.innerText = sub;
        subWeapon.appendChild(option);
    }
}

function selectTeam(){
    let team = document.getElementById("teamColor").value;
    let side = document.getElementById("teamSide").value;
    ApplyColorAll(TEAMS[team][side]);
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
    document.getElementById("inkColor").src = sub.primaryTexture;
    document.getElementById("weaponWhite").src = sub.secondaryTexture;
    // BUG: Color dose not change on first attempt
    selectTeam();
}
/**
 * 
 * @param {RGB} color 
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

function ApplyColorAll(color){
    applyColor(color, "inkColor", WEAPON_INK_CANVAS);
    applyColor(color, "specialColor", SPECIAL_INK_CANVAS);
}
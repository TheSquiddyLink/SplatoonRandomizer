console.log("hello world"); 


/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");


const SUB_TEXTURES = "./assets/subs/";
class SubWeapon {
    name;
    primaryTexture;
    secondaryTexture;
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = SUB_TEXTURES+primaryTexture+"_1"+".png";
        this.secondaryTexture = SUB_TEXTURES+primaryTexture+"_2"+".png";
    }
}

class RGB {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Team {

    /**
     * @type {string}
     */
    name;
    /**
     * @type {string}
     */
    game;
    /**
     * @type {Color}
     */
    alpha;
    /**
     * @type {Color} 
    */
    bravo;


    /**
     * 
     * @param {string} name 
     * @param {string} game 
     * @param {Color} alpha 
     * @param {Color} bravo 
     */
    constructor(name, game, alpha, bravo){
        this.name = name;
        this.game = game;
        this.alpha = alpha;
        this.bravo = bravo;
    }
}

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
    Topedo: new SubWeapon("Topedo", "topedo"),
    ToxicMist: new SubWeapon("ToxicMist", "toxic_mist"),
}

document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());
document.getElementById("subWeapon").addEventListener("change", () => selectSub());

applyColor(new RGB(0, 0, 0));
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
    applyColor(TEAMS[team][side]);
}

function selectSub(){
    let sub = document.getElementById("subWeapon").value;
    applySub(SUB_WEAPONS[sub]);
}

/**
 * 
 * @param {SubWeapon} sub 
 */
function applySub(sub){
    document.getElementById("inkColor").src = sub.primaryTexture;
    document.getElementById("weaponWhite").src = sub.secondaryTexture;
    selectTeam();
}
/**
 * 
 * @param {RGB} color 
 */
function applyColor(color){
    console.log
    const ctx = WEAPON_INK_CANVAS.getContext("2d");
    let image = document.getElementById("inkColor");
    ctx.clearRect(0, 0, WEAPON_INK_CANVAS.width, WEAPON_INK_CANVAS.height);
    ctx.drawImage(image, 0, 0);
    let imageData = ctx.getImageData(0, 0, WEAPON_INK_CANVAS.width, WEAPON_INK_CANVAS.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const threashold = 115;
        if(!(imageData.data[i] <= threashold && imageData.data[i + 1] <= threashold && imageData.data[i + 2] <= threashold)) continue;
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
    }
    ctx.putImageData(imageData, 0, 0);
}
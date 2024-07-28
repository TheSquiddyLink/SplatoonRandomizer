console.log("hello world"); 


/**
 * @type {HTMLCanvasElement}
 */
const WEAPON_INK_CANVAS = document.getElementById("weaponInk");

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
    PinkGreen: new Team("PinkGreen", "Splatoon 2", new RGB(255, 128, 128), new RGB(44,183,33)),
    TurquoisePink: new Team("TurquoisePink", "Splatoon 3", new RGB(27,190,171), new RGB(196,58,110)),
    TurquoiseRed: new Team("TurquoiseRed", "Splatoon 3", new RGB(30,192,173), new RGB(215,75,49)),
    YellowBlue: new Team("YellowBlue", "Splatoon 3", new RGB(208,190,8), new RGB(58,12,205)),
    YellowPurple: new Team("YellowPurple", "Splatoon 3", new RGB(206,177,33), new RGB(144,37,198)),
}

document.getElementById("teamColor").addEventListener("change", () => selectTeam());
document.getElementById("teamSide").addEventListener("change", () => selectTeam());

applyColor(new RGB(0, 0, 0));

function selectTeam(){
    let team = document.getElementById("teamColor").value;
    let side = document.getElementById("teamSide").value;
    applyColor(TEAMS[team][side]);
}

/**
 * 
 * @param {RGB} color 
 */
function applyColor(color){
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
class Color {
    /**
     * 
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
    /**
     * 
     * @param {string} hex 6 character hex string
     * @returns {Color} RGB color
     */
    static hex(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = parseInt(result[1], 16)
        let g = parseInt(result[2], 16)
        let b = parseInt(result[3], 16)
        return new Color(r, g, b);
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { Color, Team, sleep };
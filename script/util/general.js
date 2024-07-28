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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export { RGB, Team, sleep };
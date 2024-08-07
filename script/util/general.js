import { MainWeapon, MAIN_TYPES } from "./weaponsClass.js";

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
    toString(){
        return "rgb("+this.r+","+this.g+","+this.b+")";
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

function randomObject(object){
    let arr = Object.keys(object);
    let index = Math.floor(Math.random()*(arr.length))
    console.log("Index "+index);
    return arr[index];
}

function intervalFor(func, ms, length) {
    return new Promise((resolve) => {
        let i = 0;
        let interval = setInterval(async function() {
            func();
            i++;
            if (i >= length) {
                clearInterval(interval);
                resolve();
            }
        }, ms);
    });
}

/**
 * 
 */
function isWeaponDisabled(weapon){
    return weapon.getEnabled();
}

function filterWeapons(weapons){
    let filteredWeapons = {};
    for(
        let weapon in weapons
    ){
        if(isWeaponDisabled(weapons[weapon])){
            filteredWeapons[weapon] = weapons[weapon];
        }
    }
    return filteredWeapons;
}
function filterWeaponsStars(weapons, min, exact){
    console.log("Exact filter: "+exact);
    console.log("Min: "+min);
    var result = {};
    for(let weapon in weapons){
        let weaponObj = weapons[weapon];
        let stars = weaponObj.stars;
        if(exact){
            if(stars == min){
                result[weapon] = weaponObj;
            }
        } else {
            if(stars >= min){
                result[weapon] = weaponObj;
            }
        }
    }
    console.log(result)
    return result;
}

function generateStarHex(weaponArray){
    let binaryString = "";
    for(let weapon in weaponArray){
        let weaponObj = weaponArray[weapon];
        // Stars are 0-5
        let star = weaponObj.stars;
        let starBinary = star.toString(2);
        let starBinaryString = starBinary.padStart(3, "0");
        binaryString += starBinaryString;
    }
    let decimal = BigInt("0b" + binaryString);
    let hex = decimal.toString(16).toUpperCase();
    return hex;
}


export { Color, Team, sleep, randomObject, intervalFor, filterWeapons, filterWeaponsStars, generateStarHex };
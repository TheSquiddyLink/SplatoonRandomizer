import { BaseWeapon, MainWeapon, WeaponType } from "./weaponsClass.js";
/**
 * Class for a color
 * - Handles RGB and HEX colors
 */
class Color {

    /** @type {number} - red value */ r;
    /** @type {number} - green value */ g;
    /** @type {number} - blue value */ b;

    /**
     * An RGB constructor
     * @param {number} r - red value
     * @param {number} g - green value
     * @param {number} b - blue value
     */
    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Create a {@link Color} from a hex string
     * @param {string} hex 6 character hex string (e.g. `#FF0000` for red)     
     * @static
     * @returns {Color} RGB color
     */
    static hex(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = parseInt(result[1], 16)
        let g = parseInt(result[2], 16)
        let b = parseInt(result[3], 16)
        return new Color(r, g, b);
    }
    /**
     * Convert to a string for use in CSS
     * @returns {string} CSS RGB color string
     */
    toString(){
        return "rgb("+this.r+","+this.g+","+this.b+")";
    }
    /**
     * Create a new color that is the inverse of the current color
     * @returns {Color} Inverted color
     */
    invert(){
        return new Color(255-this.r, 255-this.g, 255-this.b);
    }
    /**
     * Convert to a 6 character hex string
     * @returns {string} 6 character hex string (e.g. `#FF0000` for red)
     */
    toHex(){
        return "#"+this.r.toString(16).padStart(2, "0")+this.g.toString(16).padStart(2, "0")+this.b.toString(16).padStart(2, "0");
    }
}

/**
 * Class for a team
 */
class Team {

    /** @type {string} - Name of the Team*/ name;
    /** @type {string} - Game the Team is from (Unused)*/ game;
    /** @type {Color} - Alpha team color*/ alpha;
    /** @type {Color} - Bravo Team Color*/ bravo;

    /**
     * 
     * @param {String} name - Name of the Team
     * @param {String} game - Game the Team is from (Unused). Example: `Splatoon 2`
     * @param {Color} alpha - Alpha team color
     * @param {Color} bravo - Bravo Team Color
     */
    constructor(name, game, alpha, bravo){
        this.name = name;
        this.game = game;
        this.alpha = alpha;
        this.bravo = bravo;
    }
}

/**
 * Sleep for a given amount of time in milliseconds
 * @param {number} ms - Milliseconds to sleep for
 * @returns {Promise<void>} - Promise that resolves when the sleep is done
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: Change to retrive an object rather than key
/**
 * Get a random key from an object
 * @param {Object} object - Object to get a random key from
 * @returns {string} - Random key from the object
 */
function randomObject(object){
    let arr = Object.keys(object);
    let index = Math.floor(Math.random()*(arr.length))
    console.log("Index "+index);
    return arr[index];
}


/**
 * Runs a function repeatedly at a given interval for a specified number of times.
 * @param {function} func - The function to be executed on each interval.
 * @param {number} ms - The interval in milliseconds between each function call.
 * @param {number} length - The number of times to execute the function.
 * @returns {Promise<void>} - A Promise that resolves when the interval has completed.
 * @deprecated - Unused
 */
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
 * Check if a weapon is disabled
 * @param {MainWeapon} weapon - Weapon to check
 * @returns {boolean} - True if the weapon is disabled, false otherwise
 */
function isWeaponDisabled(weapon){
    return weapon.getEnabled();
}

/**
 * Check if a weapon is disabled
 * @param {Record<string, MainWeapon>} weapons - Weapons to check
 * @returns {Record<string, MainWeapon>} - Weapons that are not disabled
 */
function filterWeapons(weapons){
    let filteredWeapons = {};
    for(
        let weapon in weapons
    ){
        console.log(weapon)
        if(isWeaponDisabled(weapons[weapon])){
            filteredWeapons[weapon] = weapons[weapon];
        }
    }
    return filteredWeapons;
}
filterByType
/**
 * Filter weapons based on stars
 * @param {Record<string, MainWeapon>} weapons - Weapons to filter
 * @param {number} min - Minimum stars (0 | 1 | 2 | 3 | 4 | 5)
 * @param {Boolean|null} exact - If true, only weapons with the exact number of stars will be returned. If false or null (default), weapons with more stars than the minimum will be returned.
 * @returns {Record<string, MainWeapon>} - Filtered weapons
 */
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

/**
 * Generate Star Hex Code
 * @param {Array<MainWeapon>} weaponArray - Array of weapons
 * @returns {string} - Hex code of the star pattern
 */
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

/**
 * Toggle the current state of all weapons
 * @param {Array<BaseWeapon>} weapons 
 */
function toggleAll(weapons){
    for(let weapon in weapons){
        let weaponObj = weapons[weapon];
        weaponObj.toggleEnabled();
    }
}

/**
 * Filter by weapon type
 * @param {Array<BaseWeapon>} weapons - Weapons to filter
 * @param {WeaponType} type - Type of weapon to filter by
 * @returns {Array<BaseWeapon>} - Filtered weapons
 */
function filterByType(weapons, type){
    let result = {};
    for(let weapon in weapons){
        let weaponObj = weapons[weapon];
        if(weaponObj.type.name == type.toLowerCase()){
            result[weapon] = weaponObj;
        }
    }
    return result;
}

/**
 * 
 * @param {Color} color1 - First color
 * @param {Color} color2 - Second color
 * @param {number} color2Weight - Weight of the second color (0-1)
 * @returns {Color} - Average color using weighted average
 */
function averageColor(color1, color2, color2Weight){
    let color1Weight = 1 - color2Weight;
    let r = Math.round(color1.r * color1Weight + color2.r * color2Weight);
    let g = Math.round(color1.g * color1Weight + color2.g * color2Weight);
    let b = Math.round(color1.b * color1Weight + color2.b * color2Weight);
    return new Color(r, g, b);
}


/**
 * A generic queue data structure.
 * @template T The type of elements in the queue.
 */
class Queue {
    /** @type {T[]} */
    queue = [];
    maxSize = 0;
    constructor(maxSize) {
        this.maxSize = maxSize;
    }
    /**
     * Adds an item to the end of the queue.
     * @param {T} item The item to enqueue.
     * @returns {T | undefined} The item that was removed from the front of the queue, or undefined if the queue was full.
     */
    enqueue(item) {
        this.queue.push(item);
        if(this.queue.length > this.maxSize){
            return this.dequeue();
        }
    }

    /**
     * Removes and returns the item at the front of the queue.
     * @returns {T | undefined} The dequeued item, or undefined if the queue is empty.
     */
    dequeue() {
        return this.queue.shift();
    }

    /**
     * @return {number} The number of items in the queue.
     */
    get size(){
        return this.queue.length;
    }
}

export { Color, Team, Queue, sleep, randomObject, intervalFor, filterWeapons, filterWeaponsStars, generateStarHex, toggleAll, filterByType, averageColor };
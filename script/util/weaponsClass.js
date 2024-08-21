const SUB_TEXTURES = "./assets/subs/";
const SPECIAL_TEXTURES = "./assets/specials/";
const WEAPON_TEXTURES = "./assets/weapon_flat/";
const CHIP_TEXTURES = "./assets/chips/";

/**
 * This is a base weapon class, it is not directly used by the randomizer.
 */
class BaseWeapon {
    /**
     * @type {string} - The name of the weapon
     */
    name;
    /**
     * @type {string} - The file name of the weapon's primary texture, excluding path and file extension
     * @see {@link path}
     */
    primaryTexture;
    /**
     * @type {boolean} - Whether the weapon is enabled or not
     */
    enabled = false;
    /**
     * 
     * @param {String} name - Name of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension
     */
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = this.path+primaryTexture+".png";
    }
    /**
     * Get the folder path to the weapon's textures
     * @returns {string} - The folder path to the weapon's textures
     * @abstract - Override this method to return the folder path to the weapon's textures
     */
    get path(){
        throw new Error("path not implemented");
    }
    /**
     * Toggle the enabled state of the weapon
     * @see {@link enabled}
     */
    toggleEnabled(){
        this.enabled = !this.enabled;
    }
}
/**
 * The is a weapon class that has a secondary texture, it is not directly used by the randomizer.
 */
class SecondaryTextureWeapon extends BaseWeapon {
    /**
     * @type {string} - The file name of the weapon's secondary texture, excluding path and file extension
     */
    secondaryTexture;
    /**
     * 
     * @param {String} name - Name of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension as well as the file number "_1"
     */
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
        this.primaryTexture = this.path+primaryTexture+"_1.png";
        this.secondaryTexture = this.path+primaryTexture+"_2.png";
    }
}

/**
 * This is a sub weapon class
 */
class SubWeapon extends SecondaryTextureWeapon {
    /**
     * 
     * @param {String} name - Name of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension as well as the file number "_1"
     */
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
    }
    get path(){
        return SUB_TEXTURES;
    }
}

/**
 * This is a special weapon class
 */
class SpecialWeapon extends SecondaryTextureWeapon {
    /**
     * @param {String} name - Name of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension as well as the file number "_1"
     */
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
    }
    get path(){
        return SPECIAL_TEXTURES;
    }
}

/**
 * This is a main weapon class, it will contain a sub weapon and a special weapon
 * @extends {BaseWeapon}
 */
class MainWeapon extends BaseWeapon {
    /**
     * @type {WeaponType} - The type of the weapon
     * @see {@link WeaponType}
     */
    type;
    /**
     * @type {SubWeapon} - The sub weapon of the weapon
     * @see {@link SubWeapon}
     */
    subWeapon;
    /**
     * @type {SpecialWeapon} - The special weapon of the weapon
     * @see {@link SpecialWeapon}
     */
    specialWeapon;

    /**
     * @type {number} - The number of stars the weapon has
     * @default 5 - This default is subject to change
     */
    stars = 5;
    /**
     * 
     * @param {String} name  - Name of the weapon
     * @param {WeaponType} type - The type of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension
     * @param {SubWeapon} subWeapon - The sub weapon of the weapon
     * @param {SpecialWeapon} specialWeapon - The special weapon of the weapon
     */
    constructor(name, type, primaryTexture, subWeapon, specialWeapon) {
        super(name, primaryTexture);
        this.type = type;
        this.subWeapon = subWeapon;
        this.specialWeapon = specialWeapon;
    }
    get path(){
        return WEAPON_TEXTURES;
    }
    /**
     * Get the current enabled state of the weapon, checking the following
     * - The weapon is enabled
     * - The sub weapon is enabled
     * - The special weapon is enabled
     * - The type is enabled
     * @returns {boolean} - Whether the weapon is enabled
     */
    getEnabled() {
        return this.enabled && this.subWeapon.enabled && this.specialWeapon.enabled && this.type.enabled;
    }
    /**
     * Increase the stars of the weapon
     * @returns {number} - The new number of stars the weapon has
     * @see {@link stars}
     */
    increaseStars() {
        if(this.stars < 5) this.stars++;
        return this.stars;
    }
    /**
     * Decrease the stars of the weapon
     * @returns {number} - The new number of stars the weapon has
     * @see {@link stars}
     */
    decreaseStars() {
        if(this.stars > 0) this.stars--;
        return this.stars;
    }
}

/**
 * This is a color chip class
 * - Although a Color Chip is technicly not a weapon, it is treated as a weapon for the purposes of the randomizer
 * @extends {BaseWeapon}
 */
class ColorChip extends BaseWeapon {
    /**
     * @param {String} name - Name of the color chip
     */
    constructor(name){
        super(name, name);
        this.enabled = true;
    }
    get path(){
        return CHIP_TEXTURES;
    }
}

class SideOrderWeapon extends MainWeapon {
    /**
     * @type {ColorChip}
     */
    primaryChip;
    /**
     * @type {ColorChip}
     */
    secondaryChip;
    constructor(name, type, primaryTexture, subWeapon, specialWeapon, primaryChip, secondaryChip){
        super(name, type, primaryTexture, subWeapon, specialWeapon);
        console.log(this.name)
        console.log(name)
        this.primaryChip = primaryChip;
        this.secondaryChip = secondaryChip;
        this.enabled = true;
    }
    get path(){
        return WEAPON_TEXTURES;
    }
    getEnabled() {
        return this.enabled && this.subWeapon.enabled && this.specialWeapon.enabled && this.type.enabled;
    }

}

class WeaponType {
    name;
    primaryTexture;
    enabled = true;
    constructor(name) {
        this.name = name;
        this.primaryTexture = "./assets/weapon_type/"+name+".png";
    }
    toggleEnabled(){
        this.enabled = !this.enabled;
    }
}


const MAIN_TYPES = {
    Blaster: new WeaponType("blaster"),
    Brella: new WeaponType("brella"),
    Brush: new WeaponType("brush"),
    Charger: new WeaponType("charger"),
    Dualies: new WeaponType("dualies"),
    Roller: new WeaponType("roller"),
    Shooter: new WeaponType("shooter"),
    Slosher: new WeaponType("slosher"),
    Splatana: new WeaponType("splatana"),
    Splatling: new WeaponType("splatling"),
    Stringer: new WeaponType("stringer"),
}

export { BaseWeapon, SubWeapon, SpecialWeapon, MainWeapon, WeaponType, ColorChip, SideOrderWeapon, MAIN_TYPES };
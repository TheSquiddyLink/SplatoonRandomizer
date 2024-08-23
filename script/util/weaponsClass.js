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
 * - Although a Color Chip is technically not a weapon, it is treated as a weapon for the purposes of the randomizer
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

/**
 * This is a side order weapon class
 * @extends {MainWeapon}
 */
class SideOrderWeapon extends MainWeapon {
    /**
     * @type {ColorChip} - The primary color chip of the weapon
     */
    primaryChip;
    /**
     * @type {ColorChip} - The secondary color chip of the weapon
     */
    secondaryChip;

    /**
     * 
     * @param {String} name - Name of the weapon
     * @param {WeaponType} type - The type of the weapon
     * @param {String} primaryTexture - The file name of the weapon's primary texture, excluding path and file extension
     * @param {SubWeapon} subWeapon - The sub weapon of the weapon
     * @param {SpecialWeapon} specialWeapon - The special weapon of the weapon
     * @param {ColorChip} primaryChip - The primary color chip of the weapon
     * @param {ColorChip} secondaryChip - The secondary color chip of the weapon
     */
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
    /**
     * Get the current enabled state of the weapon, checking the following
     * - The weapon is enabled
     * - The sub weapon is enabled
     * - The special weapon is enabled
     * - The type is enabled
     * - The primary chip is enabled | Unused
     * - The secondary chip is enabled | Unused
     * @returns {boolean} - Whether the weapon is enabled
     */
    getEnabled() {
        return this.enabled && this.subWeapon.enabled && this.specialWeapon.enabled && this.type.enabled;
    }

}

/**
 * The weapon type class
 * - This is used to determine the type of weapon a weapon is
 * @see {@link MainWeapon}
 * @see {@link SideOrderWeapon}
 */
class WeaponType {
    /**
     * @type {String} - The name of the weapon type
     */
    name;
    /**
     * @type {String} - The file name of the weapon type's primary texture, excluding path and file extension
     */
    primaryTexture;
    /**
     * @type {boolean} - Whether the weapon type is enabled
     */
    enabled = true;
    /**
     * 
     * @param {String} name - The name of the weapon type
     */
    constructor(name) {
        this.name = name;
        this.primaryTexture = "./assets/weapon_type/"+name+".png";
    }
    /**
     * Toggle the enabled state of the weapon type
     */
    toggleEnabled(){
        this.enabled = !this.enabled;
    }
}

export { BaseWeapon, SubWeapon, SpecialWeapon, MainWeapon, WeaponType, ColorChip, SideOrderWeapon };
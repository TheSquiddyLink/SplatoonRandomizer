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

class MainWeapon extends BaseWeapon {
    /**
     * @type {string}
     */
    type;
    /**
     * @type {SubWeapon}
     */
    subWeapon;
    /**
     * @type {SpecialWeapon}
     */
    specialWeapon;

    stars = 5;
    constructor(name, type, primaryTexture, subWeapon, specialWeapon) {
        super(name, primaryTexture);
        this.type = type;
        this.subWeapon = subWeapon;
        this.specialWeapon = specialWeapon;
    }
    get path(){
        return WEAPON_TEXTURES;
    }
    getEnabled() {
        return this.enabled && this.subWeapon.enabled && this.specialWeapon.enabled && this.type.enabled;
    }
    increaseStars() {
        if(this.stars < 5) this.stars++;
    }
    decreaseStars() {
        if(this.stars > 0) this.stars--;
        return this.stars;
    }
}

class ColorChip extends BaseWeapon {
    enabled = true;
    constructor(name){
        super(name, name);
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
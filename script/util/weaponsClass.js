const SUB_TEXTURES = "./assets/subs/";
const SPECIAL_TEXTURES = "./assets/specials/";
const WEAPON_TEXTURES = "./assets/weapon_flat/";
class BaseWeapon {
    name;
    primaryTexture;
    enabled = true;
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = this.path+primaryTexture+".png";
    }
    get path(){
        throw new Error("path not implemented");
    }
    toggleEnabled(){
        this.enabled = !this.enabled;
    }
}
class SecondaryTextureWeapon extends BaseWeapon {
    secondaryTexture;
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
        this.primaryTexture = this.path+primaryTexture+"_1.png";
        this.secondaryTexture = this.path+primaryTexture+"_2.png";
    }
}
class SubWeapon extends SecondaryTextureWeapon {
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
    }
    get path(){
        return SUB_TEXTURES;
    }
}

class SpecialWeapon extends SecondaryTextureWeapon {
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
    constructor(name, type, primaryTexture, subWeapon, specialWeapon) {
        super(name, primaryTexture);
        this.type = type;
        this.subWeapon = subWeapon;
        this.specialWeapon = specialWeapon;
    }
    get path(){
        return WEAPON_TEXTURES;
    }
}

const MAIN_TYPES = {
    Blaster: "blaster",
    Brella: "brella",
    Brush: "brush",
    Charger: "charger",
    Dualies: "dualies",
    Roller: "roller",
    Shooter: "shooter",
    Slosher: "slosher",
    Splatana: "splatana",
    Splatling: "splatling",
    Stringer: "stringer",
}
export { SubWeapon, SpecialWeapon, MainWeapon, MAIN_TYPES };
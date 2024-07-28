const SUB_TEXTURES = "./assets/subs/";
const SPECIAL_TEXTURES = "./assets/specials/";
const WEAPON_TEXTURES = "./assets/weapon_flat/";
class BaseWeapon {
    name;
    primaryTexture;
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = this.path+primaryTexture+".png";
    }
    get path(){
        throw new Error("path not implemented");
    }
}

class SubWeapon extends BaseWeapon {
    secondaryTexture;
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
        this.secondaryTexture = this.path+primaryTexture+"_2"+".png";
    }
    get path(){
        return SUB_TEXTURES;
    }
}

class SpecialWeapon extends SubWeapon {
    constructor(name, primaryTexture) {
        super(name, primaryTexture);
    }
    get path(){
        return SPECIAL_TEXTURES;
    }
}

class MainWeapon extends BaseWeapon {
    constructor(name, type, primaryTexture) {
        super(name, primaryTexture);
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
const SUB_TEXTURES = "./assets/subs/";
const SPECIAL_TEXTURES = "./assets/specials/";
class SubWeapon {
    name;
    primaryTexture;
    secondaryTexture;
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = this.path+primaryTexture+"_1"+".png";
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
export { SubWeapon, SpecialWeapon };
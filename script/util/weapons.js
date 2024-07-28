const SUB_TEXTURES = "./assets/subs/";

class SubWeapon {
    name;
    primaryTexture;
    secondaryTexture;
    constructor(name, primaryTexture) {
        this.name = name;
        this.primaryTexture = SUB_TEXTURES+primaryTexture+"_1"+".png";
        this.secondaryTexture = SUB_TEXTURES+primaryTexture+"_2"+".png";
    }
}

export { SubWeapon };
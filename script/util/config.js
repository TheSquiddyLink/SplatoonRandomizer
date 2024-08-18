import { Team, Color } from "./general.js";
import { TEAMS } from "./constants.js";

export class Package {
    /** @type {string} */
    name;
    /** @type {string} */
    description;
    /** @type {string} */
    author;
    /** @type {string} */
    version;
    /** @type {string} */
    date;

    /** @type {Array<Config>} */
    configs = [];

    /**
     * 
     * @param {Config} config 
     */
    addConfig(config){
        this.configs.push(config);
    }
    get length() {
        return this.configs.length
    }
}

export class Config {
    /** @type {boolean} */
    autoHide;

    /** @type {number} */
    hideLen;

    /** @type {number} */
    showLen;

    /** @type {boolean} */
    disableSound;

    /** @type {number} */
    iterations;

    /** @type {boolean} */
    disableAnimation;

    /** @type {Team} */
    teamColor;

    /** @type {string} */
    teamSide;

    /** @type {boolean} */
    editStars;

    /** @type {boolean} */
    displayStars;

    /** @type {boolean} */
    resultStars;

    /** @type {number} */
    starsFilter;

    /** @type {boolean} */
    exactStarsFilter;

    /** @type {boolean} */
    aniGenButton;

    /** @type {boolean} */
    autoURL;

    /** @type {boolean} */
    permaHide;

    /** @type {boolean} */
    rainbowBackground;

    /** @type {boolean} */
    rainbowButton;

    /** @type {boolean} */
    obsFriendly;

    /** @type {boolean} */
    invertSplat;

    /** @type {boolean} */
    hideHoverInfo;

    /** @type {Color|null} */
    customColor;

    /** @type {Color|null} */
    customBravoColor;

    /** @type {number} */
    weaponQueueSize;

    /** @type {number} */
    subQueueSize;

    /** @type {number} */
    specialQueueSize;

    /** @type {number} */
    typeQueueSize;

    /** @type {boolean} */
    smartGen;

    /** @type {boolean} */
    sideOrderMode;

    /** @type {boolean} */
    autoChipColor;

    /** @type {boolean} */
    averageChipColor;

    /** @type {boolean} */
    showChipResult;
    
    setDefault() {
        this.autoHide = false;
        this.hideLen = 2.5;
        this.showLen = 2.5;
        this.disableSound = false;
        this.iterations = 25;
        this.disableAnimation = false;
        this.teamColor = TEAMS.BlueYellow;
        this.teamSide = "alpha";
        this.editStars = false;
        this.displayStars = false;
        this.resultStars = false;
        this.starsFilter = 0;
        this.exactStarsFilter = false;
        this.aniGenButton = true;
        this.autoURL = true;
        this.permaHide = false;
        this.rainbowBackground = false;
        this.rainbowButton = false;
        this.obsFriendly = false;
        this.invertSplat = true;
        this.hideHoverInfo = false;
        this.customColor = null;
        this.customBravoColor = null;
        this.weaponQueueSize = 3;
        this.subQueueSize = 0;
        this.specialQueueSize = 0;
        this.typeQueueSize = 0;
        this.smartGen = false;
        this.sideOrderMode = false;
        this.autoChipColor = false;
        this.averageChipColor = false;
        this.showChipResult = true;
    }
    /**
     * @param {string} property
     */
    isDefault(property) {
        const defaultConfig = new Config();
        defaultConfig.setDefault();
        return this[property] === defaultConfig[property];
    }
    parseJSON(json){
        const KEYS = Object.keys(this);
        let undefinedCount = 0;
        for(let key in json){
            console.log("Loading " + key + " from JSON");
            if(key == "customColor" || key == "customBravoColor"){
                if(json[key] == null) continue;
                this.customColor = Color.hex(json[key]);
                continue;
            } 
            if(key == "teamColor"){
                this.teamColor = TEAMS[json[key]];
                continue;
            }
            if(!(KEYS.includes(key))) {
                console.warn(`${key} is not a valid config value.`);
                console.log(`Value attempted to load: ${JSON[key]}`);
                undefinedCount++;
                continue;
            }
            this[key] = json[key];
        }
        if(undefinedCount > 0){
            alert(`${undefinedCount} values were not valid for this config format. Please check the console for more information.`);
        }
    }
    static parseJSON(json) {
        const config = new Config();
        config.parseJSON(json);
        return config;
    }

    

}
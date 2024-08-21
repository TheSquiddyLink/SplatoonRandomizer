import { Team, Color } from "./general.js";
import { TEAMS } from "./constants.js";

/**
 * Class for a package
 * @see {@link Config}
 */
export class Package {
    /** @type {string} - package name */
    name;
    /** @type {string} - package description */
    description;
    /** @type {string} - package author */
    author;
    /** @type {string} - package version */
    version;
    /** @type {string} - package date */
    date;

    /** @type {Array<Config>} - package configs */
    configs = [];

    /**
     * Add a config to the package
     * @param {Config} config 
     */
    addConfig(config){
        this.configs.push(config);
        return this.length;
    }
    /**
     * Get the length of the package
     * @returns {number}
     */
    get length() {
        return this.configs.length
    }

    /**
     * Load a package from a JSON object
     * @param {Package} json - JSON object, expected to be a package JSON object
     */
    loadPackageJSON(json){
        this.name = json.name;
        this.description = json.description;
        this.author = json.author;
        this.version = json.version;
        this.date = json.date;
        this.configs = json.configs.map(config => {
            const configObj = new Config();
            configObj.parseJSON(config);
            return configObj;
        });
    }
    /**
     * Convert the package to a JSON object
     * @returns {Object} - JSON object
     * @see {@link Config.prepareJSON}
     */
    toJSON(){
        return {
            name: this.name,
            description: this.description,
            author: this.author,
            version: this.version,
            date: this.date,
            configs: this.configs.map(config => config.prepareJSON())
        }
    }
}

/**
 * Class for a config
 * - Used in a {@link Package}
 */
export class Config {
    /** @type {boolean} */ autoHide;
    /** @type {number} */ hideLen;
    /** @type {number} */ showLen;
    /** @type {boolean} */ disableSound;
    /** @type {number} */ iterations;
    /** @type {boolean} */ disableAnimation;
    /** @type {Team} */ teamColor;
    /** @type {string} */ teamSide;
    /** @type {boolean} */ editStars;
    /** @type {boolean} */ displayStars;
    /** @type {boolean} */ resultStars;
    /** @type {number} */ starsFilter;
    /** @type {boolean} */ exactStarsFilter;
    /** @type {boolean} */ aniGenButton;
    /** @type {boolean} */ autoURL;
    /** @type {boolean} */ permaHide;
    /** @type {boolean} */ rainbowBackground;
    /** @type {boolean} */ rainbowButton;
    /** @type {boolean} */ obsFriendly;
    /** @type {boolean} */ invertSplat;
    /** @type {boolean} */ hideHoverInfo;
    /** @type {Color|null} */ customColor;
    /** @type {Color|null} */ customBravoColor;
    /** @type {number} */ weaponQueueSize;
    /** @type {number} */ subQueueSize;
    /** @type {number} */ specialQueueSize;
    /** @type {number} */ typeQueueSize;
    /** @type {boolean} */ smartGen;
    /** @type {boolean} */ sideOrderMode;
    /** @type {boolean} */ autoChipColor;
    /** @type {boolean} */ averageChipColor;
    /** @type {boolean} */ showChipResult;
    
    /**
     * The Metadata of the config
     */
    metaData = {
        name: "",
        description: ""
    }

    /**
     * Set the default values of the config
     */
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
     * Check if the value at the property is currently the default value
     * @param {string} property - Key of a property in the config
     * @returns {boolean} - Whether the property is the default value
     * @see {@link setDefault}
     */
    isDefault(property) {
        const defaultConfig = new Config();
        defaultConfig.setDefault();
        return this[property] == defaultConfig[property];
    }
    /**
     * Parse a JSON object into the config. Following cases are handled:
     * - Custom Color: If the value is a string, it is parsed as a hex color code {@link Color.hex}
     * - Custom Bravo Color: If the value is a string, it is parsed as a hex color code {@link Color.hex}
     * - Team Color: If the value is a string, it is parsed as a team color object key {@link TEAMS}
     * - Metadata: If the value is a string, it is parsed as a metadata object
     * @param {Config} json - JSON object, expected to be a config JSON object
     */
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
                console.log("Loading team color from JSON");
                console.log("Team color: " + json[key]);
                console.log(TEAMS[json[key]]);
                this.teamColor = TEAMS[json[key]];
                continue;
            }
            if(!(KEYS.includes(key))) {
                console.warn(`${key} is not a valid config value.`);
                console.log(`Value attempted to load: ${JSON[key]}`);
                undefinedCount++;
                continue;
            }
            if(key == "metaData"){
                this.metaData.name = json[key].name;
                this.metaData.description = json[key].description;
                console.log("Loading metadata from JSON");
                continue;
            }
            this[key] = json[key];
        }
        if(undefinedCount > 0){
            alert(`${undefinedCount} values were not valid for this config format. Please check the console for more information.`);
        }
    }
    /**
     * Parse a JSON object into the config.
     * @see {@link Config#parseJSON} - Non static version of this method
     */
    static parseJSON(json) {
        const config = new Config();
        config.parseJSON(json);
        return config;
    }
    /**
     * Clone the config into a new config
     * @param {Config} config - Config to clone from
     */
    cloneFrom(config) {
        for(let key in config) {
            if(config[key] == null) continue;
            this[key] = config[key];
        }
    }

    /**
     * Set the metadata info of the config
     * @param {String} name - Name of the config
     * @param {String} description - Description of the config
     * @see {@link metaData}
     */
    setInfo(name, description) {
        this.metaData.name = name;
        this.metaData.description = description;
    }
    
    /**
     * Prepare the config for JSON serialization, handling the following:
     * - Convert the team color to a string
     * - Convert the custom color to a hex string
     * - Convert the custom bravo color to a hex string
     * @returns {Object} - JSON object of the config
     */
    prepareJSON(){
        const JSON_CONFIG = structuredClone(this);
        console.log(JSON_CONFIG);
        JSON_CONFIG.teamColor = this.teamColor.name.replace(" ", "");
        console.log(JSON_CONFIG.customColor)
        if(JSON_CONFIG.customColor) JSON_CONFIG.customColor = this.customColor.toHex();
        if(JSON_CONFIG.customBravoColor) JSON_CONFIG.customBravoColor = this.customBravoColor.toHex();
        return JSON_CONFIG;
    }
    

}
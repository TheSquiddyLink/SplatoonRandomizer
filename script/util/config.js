import { Team } from "./general.js";
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
    configs;
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
}
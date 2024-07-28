import {Team, Color} from "./general.js";
import {SubWeapon, SpecialWeapon} from "./weaponsClass.js";

export const SPECIAL_WEAPONS = {
    BigBubbler: new SpecialWeapon("Big Bubbler", "big_bubbler"),
    BooyahBomb: new SpecialWeapon("Booyah Bomb", "booyah_bomb"),
    CrabTank: new SpecialWeapon("Crab Tank", "crab_tank"),
    InkJet: new SpecialWeapon("Ink Het", "ink_jet"),
    InkStorm: new SpecialWeapon("Ink Storm", "ink_storm"),
    InkVac: new SpecialWeapon("Ink Vac", "ink_vac"),
    KillerWail: new SpecialWeapon("Killer Wail 5.1", "killer_wail_5_1"),
    KrakenRoyale: new SpecialWeapon("Kraken Royale", "kraken_royale"),
    ReefSlider: new SpecialWeapon("Reef Slider", "reef_slider"),
    SplattercolorScreen: new SpecialWeapon("Splattercolor Screen", "splattercolor_screen"),
    SuperChump: new SpecialWeapon("Super Chump", "super_chump"),
    Tacticooler: new SpecialWeapon("Tacticooler", "tacticooler"),
    TentaMissiles: new SpecialWeapon("Tenta Missiles", "tenta_missiles"),
    TripleInkstrike: new SpecialWeapon("Triple Inkstrike", "triple_inkstrike"),
    TripleSplashdown: new SpecialWeapon("Triple Splashdown", "triple_splashdown"),
    Trizooka: new SpecialWeapon("Trizooka", "trizooka"),
    UltraStamp: new SpecialWeapon("Ultra Stamp", "ultra_stamp"),
    WaveBreaker: new SpecialWeapon("Wave Breaker", "wave_breaker"),
    Zipcaster: new SpecialWeapon("Zipcaster", "zipcaster"),
}
export const SUB_WEAPONS = {
    AngleShooter: new SubWeapon("Angle Shooter", "angle_shooter"),
    AutoBomb: new SubWeapon("Auto Bomb", "auto_bomb"),
    BurstBomb: new SubWeapon("Burst Bomb", "burst_bomb"),
    CurlingBomb: new SubWeapon("Curling Bomb", "curling_bomb"),
    FizzyBomb: new SubWeapon("Fizzy Bomb", "fizzy_bomb"),
    InkMine: new SubWeapon("Ink Mine", "ink_mine"),
    PointSensorr: new SubWeapon("Point Sensor", "point_sensor"),
    SplatBomb: new SubWeapon("Splat Bomb", "splat_bomb"),
    Sprinkler: new SubWeapon("Sprinkler", "sprinkler"),
    SquidBeakon: new SubWeapon("Squid Beakon", "squid_beakon"),
    SuctionBomb: new SubWeapon("Suction Bomb", "suction_bomb"),
    Torpedo: new SubWeapon("Torpedo", "torpedo"),
    ToxicMist: new SubWeapon("Toxic Mist", "toxic_mist"),
}
export const TEAMS = {
    BlueYellow: new Team("BlueYellow", "Splatoon 3", new Color(26,26,174), new Color(227,141,36)),
    GreenPurple: new Team("GreenPurple", "Splatoon 3", new Color(160,201,55), new Color(174,0,174)),
    LimegreenPurple: new Team("LimegreenPurple", "Splatoon 3", new Color(190,205,65), new Color(99,37,205)),
    OrangeBlue: new Team("OrangeBlue", "Splatoon 1", new Color(222, 102, 36), new Color(52,59,196)),
    OrangePurple: new Team("OrangePurple", "Splatoon 3", new Color(222, 102, 36), new Color(110,4,182)),
    PinkGreen: new Team("PinkGreen", "Splatoon 2", new Color(193,45,116), new Color(44,183,33)),
    TurquoisePink: new Team("TurquoisePink", "Splatoon 3", new Color(27,190,171), new Color(196,58,110)),
    TurquoiseRed: new Team("TurquoiseRed", "Splatoon 3", new Color(30,192,173), new Color(215,75,49)),
    YellowBlue: new Team("YellowBlue", "Splatoon 3", new Color(208,190,8), new Color(58,12,205)),
    YellowPurple: new Team("YellowPurple", "Splatoon 3", new Color(206,177,33), new Color(144,37,198)),
}


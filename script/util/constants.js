import {Team, Color, randomObject} from "./general.js";
import {SubWeapon, SpecialWeapon, MainWeapon, SideOrderWeapon, ColorChip, WeaponType} from "./weaponsClass.js";

/**
 * Object of all weapon types
 * @see {@link WeaponType}
 */
export const MAIN_TYPES = {
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
};

/**
 * Object of all special weapons
 * @see {@link SpecialWeapon}
 */
export const SPECIAL_WEAPONS = {
    BigBubbler: new SpecialWeapon("Big Bubbler", "big_bubbler"),
    BooyahBomb: new SpecialWeapon("Booyah Bomb", "booyah_bomb"),
    CrabTank: new SpecialWeapon("Crab Tank", "crab_tank"),
    InkJet: new SpecialWeapon("Ink Jet", "ink_jet"),
    InkStorm: new SpecialWeapon("Ink Storm", "ink_storm"),
    InkVac: new SpecialWeapon("Ink Vac", "ink_vac"),
    KillerWail: new SpecialWeapon("Killer Wail 5.1", "killer_wail_5_1"),
    KrakenRoyale: new SpecialWeapon("Kraken Royale", "kraken_royale"),
    ReefSlider: new SpecialWeapon("Reef Slider", "reefslider"),
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
/**
 * Object of all sub weapons
 * @see {@link SubWeapon}
 */
export const SUB_WEAPONS = {
    AngleShooter: new SubWeapon("Angle Shooter", "angle_shooter"),
    AutoBomb: new SubWeapon("Auto Bomb", "auto_bomb"),
    BurstBomb: new SubWeapon("Burst Bomb", "burst_bomb"),
    CurlingBomb: new SubWeapon("Curling Bomb", "curling_bomb"),
    FizzyBomb: new SubWeapon("Fizzy Bomb", "fizzy_bomb"),
    InkMine: new SubWeapon("Ink Mine", "ink_mine"),
    PointSensor: new SubWeapon("Point Sensor", "point_sensor"),
    SplashWall: new SubWeapon("Splash Wall", "splash_wall"),
    SplatBomb: new SubWeapon("Splat Bomb", "splat_bomb"),
    Sprinkler: new SubWeapon("Sprinkler", "sprinkler"),
    SquidBeakon: new SubWeapon("Squid Beakon", "squid_beakon"),
    SuctionBomb: new SubWeapon("Suction Bomb", "suction_bomb"),
    Torpedo: new SubWeapon("Torpedo", "torpedo"),
    ToxicMist: new SubWeapon("Toxic Mist", "toxic_mist"),
}
/**
 * Object of all teams
 * @see {@link Team}
 * @see {@link Color}
 */
export const TEAMS = {
    BlueYellow: new Team("Blue Yellow", "Splatoon 3", new Color(26,26,174), new Color(227,141,36)),
    GreenPurple: new Team("Green Purple", "Splatoon 3", new Color(160,201,55), new Color(174,0,174)),
    LimegreenPurple: new Team("Limegreen Purple", "Splatoon 3", new Color(190,205,65), new Color(99,37,205)),
    OrangeBlue: new Team("Orange Blue", "Splatoon 1", new Color(222, 102, 36), new Color(52,59,196)),
    OrangePurple: new Team("Orange Purple", "Splatoon 3", new Color(222, 102, 36), new Color(110,4,182)),
    PinkGreen: new Team("Pink Green", "Splatoon 2", new Color(193,45,116), new Color(44,183,33)),
    TurquoisePink: new Team("Turquoise Pink", "Splatoon 3", new Color(27,190,171), new Color(196,58,110)),
    TurquoiseRed: new Team("Turquoise Red", "Splatoon 3", new Color(30,192,173), new Color(215,75,49)),
    YellowBlue: new Team("Yellow Blue", "Splatoon 3", new Color(208,190,8), new Color(58,12,205)),
    YellowPurple: new Team("Yellow Purple", "Splatoon 3", new Color(206,177,33), new Color(144,37,198)),
}

/**
 * Object of all main weapons
 * @see {@link MainWeapon}
 */
export const MAIN_WEAPONS = {
    GalDeco52: new MainWeapon(".52 Gal Deco", MAIN_TYPES.Shooter, "52_gal_deco", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.SplattercolorScreen),
    Gal52: new MainWeapon(".52 Gal", MAIN_TYPES.Shooter, "52_gal", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.KillerWail),
    GalDeco96: new MainWeapon(".96 Gal Deco", MAIN_TYPES.Shooter, "96_gal_deco", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.KrakenRoyale),
    Gal96: new MainWeapon(".96 Gal", MAIN_TYPES.Shooter, "96_gal", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.InkVac),
    AerosprayMG: new MainWeapon("Aerospray MG", MAIN_TYPES.Shooter, "aerospray_mg", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.ReefSlider),
    AerosprayRG: new MainWeapon("Aerospray RG", MAIN_TYPES.Shooter, "aerospray_rg", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.BooyahBomb),
    AnnakiSplattershotNova: new MainWeapon("Annaki Splattershot Nova", MAIN_TYPES.Shooter, "annaki_splattershot_nova", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.InkJet),
    BallpointSplatlingNouveau: new MainWeapon("Ballpoint Splatling Nouveau", MAIN_TYPES.Splatling, "ballpoint_splatling_nouveau", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.InkVac),
    BallpointSplatling: new MainWeapon("Ballpoint Splatling", MAIN_TYPES.Splatling, "ballpoint_splatling",SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.InkJet),
    Bamboozler14MI: new MainWeapon("Bamboozler 14 Mk I", MAIN_TYPES.Charger, "bamboozler_14_mk_I", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.KillerWail),
    Bamboozler14MkII: new MainWeapon("Bamboozler 14 Mk II", MAIN_TYPES.Charger, "bamboozler_14_mk_II", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.SuperChump),
    BigSwigRollerExpress: new MainWeapon("Big Swig Roller Express", MAIN_TYPES.Roller, "big_swig_roller_express", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.InkStorm),
    BigSwigRoller: new MainWeapon("Big Swig Roller", MAIN_TYPES.Roller, "big_swig_roller", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.InkVac),
    Blaster: new MainWeapon("Blaster", MAIN_TYPES.Blaster, "blaster", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.BigBubbler),
    BloblobberDeco: new MainWeapon("Bloblobber Deco", MAIN_TYPES.Slosher, "bloblobber_deco", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.KrakenRoyale),
    Bloblobber: new MainWeapon("Bloblobber", MAIN_TYPES.Slosher, "bloblobber", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.InkStorm),
    CarbonRollerDeco: new MainWeapon("Carbon Roller Deco", MAIN_TYPES.Roller, "carbon_roller_deco", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.Trizooka),
    CarbonRoller: new MainWeapon("Carbon Roller", MAIN_TYPES.Roller, "carbon_roller", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.Zipcaster),
    CharcoalDecavitator: new MainWeapon("Charcoal Decavitator", MAIN_TYPES.Splatana, "charcoal_decavitator", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.InkJet),
    ClashBlaster: new MainWeapon("Clash Blaster", MAIN_TYPES.Blaster, "clash_blaster", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.Trizooka),
    ClashBlasterNeo: new MainWeapon("Clash Blaster Neo", MAIN_TYPES.Blaster, "clash_blaster_neo", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.SuperChump),
    ClassicSquiffer: new MainWeapon("Classic Squiffer", MAIN_TYPES.Charger, "classic_squiffer", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.BigBubbler),
    CustomBlaster: new MainWeapon("Custom Blaster", MAIN_TYPES.Blaster, "custom_blaster", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.TripleSplashdown),
    CustomDouserDualiesFF: new MainWeapon("Custom Douser Dualies FF", MAIN_TYPES.Dualies, "custom_douser_dualies_ff", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.TripleInkstrike),
    CustomDualieSquelchers: new MainWeapon("Custom Dualie Squelchers", MAIN_TYPES.Dualies, "custom_dualie_squelchers", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.SuperChump),
    CustomELiter4KScope: new MainWeapon("Custom E-liter 4K Scope", MAIN_TYPES.Charger, "custom_e_liter_4k_scope", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.KrakenRoyale),
    CustomELiter4k:  new MainWeapon("Custom E-liter 4K", MAIN_TYPES.Charger, "custom_e_liter_4k", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.KrakenRoyale),
    CustomExplosher: new MainWeapon("Custom Explosher", MAIN_TYPES.Slosher, "custom_explosher", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.TripleSplashdown),
    CustomGooTuber: new MainWeapon("Custom Goo Tuber", MAIN_TYPES.Charger, "custom_goo_tuber",SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.UltraStamp),
    CustomHydraSplatling: new MainWeapon("Custom Hydra Splatling", MAIN_TYPES.Splatling, "custom_hydra_splatling", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.SplattercolorScreen),
    CustomJetSquelcher: new MainWeapon("Custom Jet Squelcher", MAIN_TYPES.Slosher, "custom_jet_squelcher", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.InkStorm),
    CustomRangeBlaster: new MainWeapon("Custom Range Blaster", MAIN_TYPES.Blaster, "custom_range_blaster", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.KrakenRoyale),
    CustomSplattershotJR: new MainWeapon("Custom Splattershot Jr.", MAIN_TYPES.Shooter, "custom_splattershot_jr", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.WaveBreaker),
    CustomWellstringV: new MainWeapon("Custom Wellstring V", MAIN_TYPES.Stringer, "custom_wellstring_v", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.WaveBreaker),
    DappleDualiesNouveau: new MainWeapon("Dapple Dualies Nouveau", MAIN_TYPES.Dualies, "dapple_dualies_nouveau", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.ReefSlider),
    DappleDualies: new MainWeapon("Dapple Dualies", MAIN_TYPES.Dualies, "dapple_dualies", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.Tacticooler),
    DarkTetraDualies: new MainWeapon("Dark Tetra Dualies", MAIN_TYPES.Dualies, "dark_tetra_dualies", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.ReefSlider),
    DouserDualiesFF: new MainWeapon("Douser Dualies FF", MAIN_TYPES.Dualies, "douser_dualies_ff", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.KillerWail),
    DreadWringerD: new MainWeapon("Dread Wringer D", MAIN_TYPES.Slosher, "dread_wringer_d", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.WaveBreaker ),
    DreadWringer: new MainWeapon("Dread Wringer", MAIN_TYPES.Slosher, "dread_wringer", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.ReefSlider),
    DualieSquelchers: new MainWeapon("Dualie Squelchers", MAIN_TYPES.Dualies, "dualie_squelchers", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.WaveBreaker),
    DynamoRoller: new MainWeapon("Dynamo Roller", MAIN_TYPES.Roller, "dynamo_roller", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.Tacticooler),
    Eliter4KScope: new MainWeapon("E-liter 4K Scope", MAIN_TYPES.Charger, "e_liter_4k_scope", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.WaveBreaker),
    Eliter4k: new MainWeapon("E-liter 4K", MAIN_TYPES.Charger, "e_liter_4k", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.WaveBreaker),
    EnperrySplatDualies: new MainWeapon("Enperry Splat Dualies", MAIN_TYPES.Dualies, "enperry_splat_dualies", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.TripleSplashdown),
    Explosher: new MainWeapon("Explosher", MAIN_TYPES.Slosher, "explosher", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.InkStorm),
    FlingzaRoller: new MainWeapon("Flingza Roller", MAIN_TYPES.Roller, "flingza_roller", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.TentaMissiles),
    FoilFlingzaRoller: new MainWeapon("Foil Flingza Roller", MAIN_TYPES.Roller, "foil_flingza_roller", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.SplattercolorScreen),
    FoilSqueezer: new MainWeapon("Foil Squeezer", MAIN_TYPES.Shooter, "foil_squeezer", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.SplattercolorScreen),
    ForgeSplattershotPro: new MainWeapon("Forge Splattershot Pro", MAIN_TYPES.Shooter, "forge_splattershot_pro", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.BooyahBomb),
    GloogaDualiesDeco: new MainWeapon("Glooga Dualies Deco", MAIN_TYPES.Dualies, "glooga_dualies_deco", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.Trizooka),
    GloogaDualies: new MainWeapon("Glooga Dualies", MAIN_TYPES.Dualies, "glooga_dualies", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.BooyahBomb),
    GoldDynamoRoller: new MainWeapon("Gold Dynamo Roller", MAIN_TYPES.Roller, "gold_dynamo_roller", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.SuperChump),
    GooTuber: new MainWeapon("Goo Tuber", MAIN_TYPES.Charger, "goo_tuber", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.TentaMissiles),
    H3Nozzelnose: new MainWeapon("H-3 Nozzelnose", MAIN_TYPES.Shooter, "h_3_nozzelnose", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.Tacticooler),
    H3NozzelnoseD: new MainWeapon("H-3 Nozzelnose D", MAIN_TYPES.Shooter, "h_3_nozzelnose_d", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.BigBubbler),
    HeavyEditSplatling: new MainWeapon("Heavy Edit Splatling", MAIN_TYPES.Splatling, "heavy_edit_splatling", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.Tacticooler),
    HeavyEditSplatlingNouveau: new MainWeapon("Heavy Edit Splatling Nouveau", MAIN_TYPES.Splatling, "heavy_edit_splatling_nouveau", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.CrabTank),
    HeavySplatlingDeco: new MainWeapon("Heavy Splatling Deco", MAIN_TYPES.Splatling, "heavy_splatling_deco", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.KrakenRoyale),
    HeavySplatling: new MainWeapon("Heavy Splatling", MAIN_TYPES.Splatling, "heavy_splatling", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.WaveBreaker),
    HeroShotReplica: new MainWeapon("Hero Shot Replica", MAIN_TYPES.Shooter, "hero_shot_replica", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Trizooka),
    HydraSplatling: new MainWeapon("Hydra Splatling", MAIN_TYPES.Splatling, "hydra_splatling", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.BooyahBomb),
    InkbrushNouveau: new MainWeapon("Inkbrush Nouveau", MAIN_TYPES.Brush, "inkbrush_nouveau", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.UltraStamp),
    Inkbrush: new MainWeapon("Inkbrush", MAIN_TYPES.Brush, "inkbrush", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.KillerWail),
    InklineTriStringer: new MainWeapon("Inkline Tri-stringer", MAIN_TYPES.Stringer, "inkline_tri_stringer", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.SuperChump),
    JetSquelcher: new MainWeapon("Jet Squelcher", MAIN_TYPES.Shooter, "jet_squelcher", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.InkVac),
    KrakOnSplatRoller: new MainWeapon("Krak-On Splat Roller", MAIN_TYPES.Roller, "krak_on_splat_roller", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.KrakenRoyale),
    L3NozzlenoseD: new MainWeapon("L-3 Nozzelnose D", MAIN_TYPES.Shooter, "l_3_nozzelnose_d", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.UltraStamp),
    L3Nozzlenose: new MainWeapon("L-3 Nozzelnose", MAIN_TYPES.Shooter, "l_3_nozzelnose", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.CrabTank),
    LightTetraDualies: new MainWeapon("Light Tetra Dualies", MAIN_TYPES.Dualies, "light_tetra_dualies", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.Zipcaster),
    LunaBlasterNeo: new MainWeapon("Luna Blaster Neo", MAIN_TYPES.Blaster, "luna_blaster_neo", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.UltraStamp),
    LunaBlaster: new MainWeapon("Luna Blaster", MAIN_TYPES.Blaster, "luna_blaster", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.Zipcaster),
    MiniSplatling: new MainWeapon("Mini Splatling", MAIN_TYPES.Splatling, "mini_splatling", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.UltraStamp),
    MintDecavitator: new MainWeapon("Mint Decavitator", MAIN_TYPES.Splatana, "mint_decavitator", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.BigBubbler),
    NZap85: new MainWeapon("N-ZAP '85", MAIN_TYPES.Shooter, "n_zap_85", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Tacticooler),
    NZap89: new MainWeapon("N-ZAP '89", MAIN_TYPES.Shooter, "n_zap_89", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.SuperChump),
    Nautilus47: new MainWeapon("Nautilus 47", MAIN_TYPES.Splatling, "nautilus_47", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.InkStorm),
    Nautilus79: new MainWeapon("Nautilus 79", MAIN_TYPES.Splatling, "nautilus_79", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.TripleSplashdown),
    NeoSplashOMatic: new MainWeapon("Neo Splash-o-matic", MAIN_TYPES.Shooter, "neo_splash_o_matic",SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.KillerWail),
    NeoSplooshOMatic: new MainWeapon("Neo Sploosh-o-matic", MAIN_TYPES.Shooter, "neo_sploosh_o_matic", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.KillerWail),
    NewSquiffer: new MainWeapon("New Squiffer", MAIN_TYPES.Charger, "new_squiffer", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.Zipcaster),
    OctoShotReplica: new MainWeapon("Octo Shot Replica", MAIN_TYPES.Shooter, "octo_shot_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.TripleInkstrike),
    OctobrushNouveau: new MainWeapon("Octobrush Nouveau", MAIN_TYPES.Brush, "octobrush_nouveau", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.InkStorm),
    Octobrush: new MainWeapon("Octobrush", MAIN_TYPES.Brush, "octobrush", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Zipcaster),
    OrderBlasterReplica: new MainWeapon("Order Blaster Replica", MAIN_TYPES.Blaster, "order_blaster_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.Zipcaster),
    OrderBrellaReplica: new MainWeapon("Order Brella Replica", MAIN_TYPES.Brella, "order_brella_replica", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.TripleInkstrike),
    OrderBrushReplica: new MainWeapon("Order Brush Replica", MAIN_TYPES.Brush, "order_brush_replica", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Zipcaster),
    OrderChargerReplica: new MainWeapon("Order Charger Replica", MAIN_TYPES.Charger, "order_charger_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.InkVac),
    OrderDualieReplicas: new MainWeapon("Order Dualie Replicas", MAIN_TYPES.Dualies, "order_dualie_replicas", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.CrabTank),
    OrderRollerReplica: new MainWeapon("Order Roller Replica", MAIN_TYPES.Roller, "order_roller_replica", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.BigBubbler),
    OrderShotReplica: new MainWeapon("Order Shot Replica", MAIN_TYPES.Shooter, "order_shot_replica", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Trizooka),
    OrderSlosherReplica: new MainWeapon("Order Slosher Replica", MAIN_TYPES.Slosher, "order_slosher_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.TripleInkstrike),
    OrderSplatanaReplica: new MainWeapon("Order Splatana Replica", MAIN_TYPES.Splatana, "order_splatana_replica", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.Zipcaster),
    OrderSplatlingReplica: new MainWeapon("Order Splatling Replica", MAIN_TYPES.Splatling, "order_splatling_replica", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.WaveBreaker),
    OrderStringerReplica: new MainWeapon("Order Stringer Replica", MAIN_TYPES.Stringer, "order_stringer_replica", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.KillerWail),
    PainbrushNouveau: new MainWeapon("Painbrush Nouveau", MAIN_TYPES.Brush, "painbrush_nouveau", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.TentaMissiles),
    Painbrush: new MainWeapon("Painbrush", MAIN_TYPES.Brush, "painbrush", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.WaveBreaker),
    RangeBlaster: new MainWeapon("Range Blaster", MAIN_TYPES.Blaster, "range_blaster", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.WaveBreaker),
    RapidBlasterDeco: new MainWeapon("Rapid Blaster Deco", MAIN_TYPES.Blaster, "rapid_blaster_deco", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.InkJet),
    RapidBlaster: new MainWeapon("Rapid Blaster", MAIN_TYPES.Blaster, "rapid_blaster", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.TripleInkstrike),
    RapidBlasterPro: new MainWeapon("Rapid Blaster Pro", MAIN_TYPES.Blaster, "rapid_blaster_pro", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.InkVac),
    RapidBlasterProDeco: new MainWeapon("Rapid Blaster Pro Deco", MAIN_TYPES.Blaster, "rapid_blaster_pro_deco", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.KillerWail),
    RecycledBrella24MKI: new MainWeapon("Recycled Brella 24 MK I", MAIN_TYPES.Brella, "recycled_brella_24_mk_I", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.BigBubbler),
    RecycledBrella24MKII: new MainWeapon("Recycled Brella 24 MK II", MAIN_TYPES.Brella, "recycled_brella_24_mk_II", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.TripleSplashdown),
    ReefLux450Deco: new MainWeapon("REEF-LUX 450 Deco", MAIN_TYPES.Stringer, "reef_lux_450_deco", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.ReefSlider),
    ReefLux450: new MainWeapon("REEF-LUX 450", MAIN_TYPES.Stringer, "reef_lux_450", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.TentaMissiles),
    SBlast91: new MainWeapon("S-Blast '91", MAIN_TYPES.Blaster, "s_blast_91", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.BooyahBomb),
    SBlast92: new MainWeapon("S-Blast '92", MAIN_TYPES.Blaster, "s_blast_92", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.ReefSlider),
    SlosherDeco: new MainWeapon("Slosher Deco", MAIN_TYPES.Slosher, "slosher_deco", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.Zipcaster),
    Slosher: new MainWeapon("Slosher", MAIN_TYPES.Slosher, "slosher", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.TripleInkstrike),
    SloshingMachineNeo: new MainWeapon("Sloshing Machine Neo", MAIN_TYPES.Slosher, "sloshing_machine_neo", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.Trizooka),
    SloshingMachine: new MainWeapon("Sloshing Machine", MAIN_TYPES.Slosher, "sloshing_machine", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.BooyahBomb),
    Snipewriter5H: new MainWeapon("Snipewriter 5H", MAIN_TYPES.Charger, "snipewriter_5h", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.Tacticooler),
    Smipewriter5B: new MainWeapon("Snipewriter 5B", MAIN_TYPES.Charger, "snipewriter_5b", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.InkStorm),
    SorellaBrella: new MainWeapon("Sorella Brella", MAIN_TYPES.Brella, "sorella_brella", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.InkJet),
    SplatBrella: new MainWeapon("Splat Brella", MAIN_TYPES.Brella, "splat_brella", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.TripleInkstrike),
    SplatCharger: new MainWeapon("Splat Charger", MAIN_TYPES.Charger, "splat_charger", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.InkVac),
    SplatDualies: new MainWeapon("Splat Dualies", MAIN_TYPES.Dualies, "splat_dualies", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.CrabTank),
    SplashOMatic: new MainWeapon("Splash-o-matic", MAIN_TYPES.Shooter, "splash_o_matic", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.CrabTank),
    SplatRoller: new MainWeapon("Splat Roller", MAIN_TYPES.Roller, "splat_roller", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.BigBubbler),
    SplatanaStamperNouveau: new MainWeapon("Splatana Stamper Nouveau", MAIN_TYPES.Splatana, "splatana_stamper_nouveau", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.CrabTank),
    SplatanaStamper: new MainWeapon("Splatana Stamper", MAIN_TYPES.Splatana, "splatana_stamper", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.Zipcaster),
    SplatanaWiperDeco: new MainWeapon("Splatana Wiper Deco", MAIN_TYPES.Splatana, "splatana_wiper_deco", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.TentaMissiles),
    SplatanaWiper: new MainWeapon("Splatana Wiper", MAIN_TYPES.Splatana, "splatana_wiper", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.UltraStamp),
    Splatterscope: new MainWeapon("Splatterscope", MAIN_TYPES.Charger, "splatterscope", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.InkVac),
    SplattershotJR: new MainWeapon("Splattershot Jr.", MAIN_TYPES.Shooter, "splattershot_jr", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.BigBubbler),
    SplattershotNova: new MainWeapon("Splattershot Nova", MAIN_TYPES.Shooter, "splattershot_nova", SUB_WEAPONS.PointSensor, SPECIAL_WEAPONS.KillerWail),
    SplattershotPro: new MainWeapon("Splattershot Pro", MAIN_TYPES.Shooter, "splattershot_pro", SUB_WEAPONS.AngleShooter, SPECIAL_WEAPONS.CrabTank),
    Splattershot: new MainWeapon("Splattershot", MAIN_TYPES.Shooter, "splattershot", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.Trizooka),
    SplooshOMatic: new MainWeapon("Sploosh-o-matic", MAIN_TYPES.Shooter, "sploosh_o_matic", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.UltraStamp),
    Squeezer: new MainWeapon("Squeezer", MAIN_TYPES.Shooter, "squeezer", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.Trizooka),
    TentaBrella: new MainWeapon("Tenta Brella", MAIN_TYPES.Brella, "tenta_brella", SUB_WEAPONS.SquidBeakon, SPECIAL_WEAPONS.InkVac),
    TentaSorellaBrella: new MainWeapon("Tenta Sorella Brella", MAIN_TYPES.Brella, "tenta_sorella_brella", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.Trizooka),
    TentatekSplattershot: new MainWeapon("Tentatek Splattershot", MAIN_TYPES.Shooter, "tentatek_splattershot", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.TripleInkstrike),
    TriSlosherNouveau: new MainWeapon("Tri-Slosher Nouveau", MAIN_TYPES.Slosher, "tri_slosher_nouveau", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.Tacticooler),
    TriSlosher: new MainWeapon("Tri-Slosher", MAIN_TYPES.Slosher, "tri_slosher", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.InkJet),
    TriStringer: new MainWeapon("Tri-Stringer", MAIN_TYPES.Stringer, "tri_stringer", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.KillerWail),
    UndercoverBrella: new MainWeapon("Undercover Brella", MAIN_TYPES.Brella, "undercover_brella", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.ReefSlider),
    UndercoverSorellaBrella: new MainWeapon("Undercover Sorella Brella", MAIN_TYPES.Brella, "undercover_sorella_brella", SUB_WEAPONS.Torpedo, SPECIAL_WEAPONS.SplattercolorScreen),
    WellstringV: new MainWeapon("Wellstring V", MAIN_TYPES.Stringer, "wellstring_v", SUB_WEAPONS.AutoBomb, SPECIAL_WEAPONS.UltraStamp),
    ZnFSplatCharger: new MainWeapon("Z+F Splat Charger", MAIN_TYPES.Charger, "z+f_splat_charger", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.TripleInkstrike),
    ZnFSplatterscope: new MainWeapon("Z+F Splatterscope", MAIN_TYPES.Charger, "z+f_splatterscope", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.TripleInkstrike),
    ZinkMiniSplatling: new MainWeapon("Zink Mini Splatling", MAIN_TYPES.Splatling, "zink_mini_splatling", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.BigBubbler),
}

/**
 * Object containing all of the color chips.
 * @see {@link ColorChip}
 */
export const COLOR_CHIPS = {
  Drone: new ColorChip("Drone"),
  Lucky: new ColorChip("Lucky"),
  Mobility: new ColorChip("Mobility"),
  Power: new ColorChip("Power"),
  Range: new ColorChip("Range"),
  Support: new ColorChip("Support"),
}

/**
 * Object containing all of the side order weapons.
 * @see {@link SideOrderWeapon}
 */
export const ORDER_WEAPONS = {
  Dualies: new SideOrderWeapon("Order Dualies", MAIN_TYPES.Dualies, "order_dualie_replicas", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.ReefSlider, COLOR_CHIPS.Lucky, COLOR_CHIPS.Support),
  Brella: new SideOrderWeapon("Order Brella", MAIN_TYPES.Brella, "order_brella_replica", SUB_WEAPONS.Sprinkler, SPECIAL_WEAPONS.InkStorm, COLOR_CHIPS.Drone, COLOR_CHIPS.Power),
  Shot: new SideOrderWeapon("Order Shot", MAIN_TYPES.Shooter, "order_shot_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.Trizooka, COLOR_CHIPS.Range, COLOR_CHIPS.Mobility),
  Roller: new SideOrderWeapon("Order Roller", MAIN_TYPES.Roller, "order_roller_replica", SUB_WEAPONS.BurstBomb, SPECIAL_WEAPONS.KrakenRoyale, COLOR_CHIPS.Power, COLOR_CHIPS.Lucky),
  Charger: new SideOrderWeapon("Order Charger", MAIN_TYPES.Charger, "order_charger_replica", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.TripleInkstrike, COLOR_CHIPS.Support, COLOR_CHIPS.Range),
  Stringer: new SideOrderWeapon("Order Stringer", MAIN_TYPES.Stringer, "order_stringer_replica", SUB_WEAPONS.ToxicMist, SPECIAL_WEAPONS.KillerWail, COLOR_CHIPS.Mobility, COLOR_CHIPS.Range),
  Splatana: new SideOrderWeapon("Order Splatana", MAIN_TYPES.Splatana, "order_splatana_replica", SUB_WEAPONS.FizzyBomb, SPECIAL_WEAPONS.CrabTank, COLOR_CHIPS.Lucky, COLOR_CHIPS.Drone),
  Slosher: new SideOrderWeapon("Order Slosher", MAIN_TYPES.Slosher, "order_slosher_replica", SUB_WEAPONS.SuctionBomb, SPECIAL_WEAPONS.TripleInkstrike, COLOR_CHIPS.Support, COLOR_CHIPS.Drone),
  Blaster: new SideOrderWeapon("Order Blaster", MAIN_TYPES.Blaster, "order_blaster_replica", SUB_WEAPONS.CurlingBomb, SPECIAL_WEAPONS.UltraStamp, COLOR_CHIPS.Range, COLOR_CHIPS.Power),
  Brush: new SideOrderWeapon("Orderbrush", MAIN_TYPES.Brush, "order_brush_replica", SUB_WEAPONS.InkMine, SPECIAL_WEAPONS.UltraStamp, COLOR_CHIPS.Mobility, COLOR_CHIPS.Lucky),
  Splatling: new SideOrderWeapon("Order Splatling", MAIN_TYPES.Splatling, "order_splatling_replica", SUB_WEAPONS.SplashWall, SPECIAL_WEAPONS.BooyahBomb, COLOR_CHIPS.Drone, COLOR_CHIPS.Support),
  OctoShot: new SideOrderWeapon("Octo Shot", MAIN_TYPES.Shooter, "octo_shot_replica", SUB_WEAPONS.SplatBomb, SPECIAL_WEAPONS.TripleSplashdown, COLOR_CHIPS.Power, COLOR_CHIPS.Mobility)
}

/**
 * Sort the weapon list by type.
 * @see {@link MAIN_WEAPONS}
 * @type {Object.<string, MainWeapon>}
 */
export const SORTED_WEAPONS = Object.entries(MAIN_WEAPONS)
  .sort((a, b) => a[1].type.name.localeCompare(b[1].type.name))
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

/**
 * Array containing all splat SVG images.
 * @example 'splat_01.svg' to 'splat_18.svg'
 */
export const ALL_SPLAT_IMGS = [
  'splat_01.svg',
  'splat_02.svg',
  'splat_03.svg',
  'splat_04.svg',
  'splat_05.svg',
  'splat_06.svg',
  'splat_07.svg',
  'splat_08.svg',
  'splat_09.svg',    
  'splat_10.svg',
  'splat_11.svg',
  'splat_12.svg',
  'splat_13.svg',
  'splat_14.svg',
  'splat_15.svg',
  'splat_16.svg',
  'splat_17.svg',
  'splat_18.svg',
]
/**
 * Array containing all splat SVG images that are used for the weapon splat image
 */
export const WEAPON_SPLAT = [
  ALL_SPLAT_IMGS[1],
  ALL_SPLAT_IMGS[3],
  ALL_SPLAT_IMGS[6],
  ALL_SPLAT_IMGS[8],
  ALL_SPLAT_IMGS[11],
  ALL_SPLAT_IMGS[12],
  ALL_SPLAT_IMGS[13],
  ALL_SPLAT_IMGS[14],
  ALL_SPLAT_IMGS[15],
]

/**
 * Object containing all of the side order colors.
 * @see {@link Color}
 */
export const SIDE_ORDER_COLORS = {
  Drone:  new Color(112, 245, 186),
  Lucky: new Color(213, 246, 119),
  Mobility: new Color(120, 156, 247),
  Power: new Color(249, 128, 116),
  Range: new Color(246, 182, 115),
  Support: new Color(194, 117, 246)
}

//===== Presets =====
const SideOrderPreset = {
  customColor: new Color(242, 154, 255),
  customBravoColor: new Color(213,89,238),
  weaponHex: "27FF000000000000"
}

const NoDLCPreset = {
  weaponHex: "7FFFFFFFFFFFFFFFFFFFD800FFFFFFFFFFFF"
}

const OriginalKitsPreset = {
  weaponHex: "C66AA000EFB0B4AA4F4080B6D2ACFAFF8E8"
}

const AltKitsPreset = {
  weaponHex: "739955FFF104F4B15B0BF20092D530500717"
}
const CustomBrandKitsPreset = {
  weaponHex: "1FFA000000000000000000000000000"
}

const ScopedPreset = {
  weaponHex: "200010000000000000000000040002"
}

const HeavyPreset = {
  weaponHex: "180000BAA23A040200000004E00000600C08"
}

const ShortRangePreset = {
  weaponHex: "3060001800000181C084000060001821B1"
}

const RetroPreset = {
  weaponHex: "4001840180000001E1E1C0046"
}
/**
 * Object containing all of the presets.
 * Each preset is an object that contains some settings from the Config class.
 */
export const PRESETS = {
  SideOrder: SideOrderPreset,
  NoDLC: NoDLCPreset,
  Orginal: OriginalKitsPreset,
  AltKits: AltKitsPreset,
  CustomKits: CustomBrandKitsPreset,
  Scoped: ScopedPreset,
  Heavy: HeavyPreset,
  ShortRange: ShortRangePreset,
  Retro: RetroPreset
};
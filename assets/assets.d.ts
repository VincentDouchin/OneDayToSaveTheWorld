type battleSprites = 'flowerPurple' | 'flowerRed' | 'flowerWhite' | 'herb1' | 'herb2' | 'herb3' | 'herb4' | 'trees'
type fonts = 'dogicapixel-bold' | 'dogicapixel' | 'm5x7'
type levels = 'battle' | 'overworld' | 'tavern'
type mapIcons = 'arrowDown' | 'arrowDownSelected' | 'arrowLeft' | 'arrowLeftSelected' | 'arrowRight' | 'arrowRightSelected' | 'arrowUp' | 'arrowUpSelected' | 'battleIcon' | 'houseIcon' | 'nodeIcon' | 'smallNodeIcon'
type sprites = 'sign'
type tilesets = 'Compilation-Building' | 'GB-LandTileset' | 'GB-Trees-and-Mountains' | 'Minifantasy_CraftingAndProfessionsLogging' | 'Minifantasy_CraftingAndProfessionsLoggingShadows' | 'Minifantasy_ForgottenPlainsProps' | 'Minifantasy_ForgottenPlainsTiles' | 'Minifantasy_TownsIIBrickBuildingOutdoorTileset' | 'Minifantasy_TownsIIWoodenPlankBuildingOutdoorTileset' | 'Minifantasy_TownsProps' | 'Minifantasy_TownsPropsShadows' | 'Minifantasy_TownsTileset' | 'Minifantasy_TownsTilesetShadows' | 'StatsIcons' | 'TavernIndoorAll' | 'TavernIndoorAllShadows' | 'Tents' | 'TentsShadows' | 'TileasetAndPremadeZiggurats' | 'TileasetAndPremadeZigguratsProps' | 'TileasetAndPremadeZigguratsPropsShadows' | 'TileasetAndPremadeZigguratsShadows' | 'Universal-Road-Tileset' | 'WallOfTrees' | 'WallOfTreesShadows'
type ui = 'beer' | 'coin' | 'dialogIcon' | 'frameborder' | 'frameornate' | 'hpbar' | 'itemspot-selected' | 'itemspot' | 'label' | 'selectorleft' | 'setting-selected' | 'setting' | 'sliderBar' | 'sliderHandle' | 'textbox'
type uiSounds = 'Hover_01' | 'Hover_06'
interface battleEffects {
	paladin: `blades-dictum-effect` | `blades-end` | `blades-middle` | `blades-start`
}
interface characters {
	bandit: `axe` | `axe-charged` | `bow` | `dagger` | `dagger-charged` | `die` | `dmg` | `` | `idle` | `pitchfork` | `pitchfork-charged` | `slingshot` | `spear` | `spear-charged` | `sword` | `sword-charged` | `walk` | ``
	banditLeader: `dagger` | `dagger-charged` | `die` | `dmg` | `idle` | `walk`
	banditoldman: `die` | `dmg` | `idle` | `walk`
	bat: `attack` | `die` | `dmg` | `idle` | `sleep` | `walk`
	bear: `attack` | `die` | `dmg` | `idle` | `sleep` | `walk`
	gnomeforest: `attack` | `die` | `dmg` | `idle` | `walk`
	howard: `die` | `dmg` | `idle` | `walk`
	lumberjack: `axe` | `charged-axe` | `die` | `dmg` | `idle` | `logging` | `walk` | `woodwork`
	paladin: `attack` | `dictum` | `die` | `dmg` | `idle` | `jump` | `longidle-end` | `longidle-middle` | `longidle-start` | `walk`
	wolf: `attack` | `die` | `dmg` | `idle` | `jump` | `walk`
}
interface sounds {
	bat: `attack1` | `attack2` | `cry-long` | `damage-a` | `damage-b` | `death` | `wing-flap-loop-fast` | `wing-flap-loop-slow` | `wing-flap-single1` | `wing-flap-single2`
	bear: `minotaur-attack` | `minotaur-damage1` | `minotaur-damage2` | `minotaur-death` | `minotaur-idle1` | `minotaur-idle2`
	paladin: `attack` | `bladesof-justice-cast` | `bladesof-justice-cast-effect-only` | `bladesof-justice-end` | `bladesof-justice-loop` | `damage` | `death` | `dictum-armor-noises` | `dome-of-rightfulness-cast` | `dome-of-rightfulness-cast-effect-only` | `dome-of-rightfulness-end` | `dome-of-rightfulness-loop` | `holy-hammer-hit` | `holy-hammer-loop` | `holy-hammer-throw` | `idle` | `jump` | `land` | `shield-bash-hit` | `shield-bashwitheffect` | `shield-bashwithouteffect` | `walk-loop`
	wolf: `attack1a` | `attack1b` | `attack2a` | `attack2b` | `damage1` | `damage2` | `death` | `growl1` | `growl2` | `walk-loop1` | `walk-loop2-raw` | `walk-loop3-raw`
}

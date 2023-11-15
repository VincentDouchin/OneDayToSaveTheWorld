type battleSprites = 'flowerPurple' | 'flowerRed' | 'flowerWhite' | 'herb1' | 'herb2' | 'herb3' | 'herb4' | 'trees'
type characters = 'bat' | 'battleEffects' | 'paladin' | 'wolf'
type fonts = 'dogicapixel-bold' | 'dogicapixel' | 'm5x7'
type levels = 'battle' | 'overworld' | 'tavern'
type mapIcons = 'arrowDown' | 'arrowDownSelected' | 'arrowLeft' | 'arrowLeftSelected' | 'arrowRight' | 'arrowRightSelected' | 'arrowUp' | 'arrowUpSelected' | 'battleIcon' | 'houseIcon' | 'nodeIcon' | 'smallNodeIcon'
type sounds = 'bat' | 'paladin' | 'wolf'
type tilesets = 'Compilation-Building' | 'GB-LandTileset' | 'GB-Trees-and-Mountains' | 'Minifantasy_CraftingAndProfessionsLogging' | 'Minifantasy_CraftingAndProfessionsLoggingShadows' | 'Minifantasy_ForgottenPlainsProps' | 'Minifantasy_ForgottenPlainsTiles' | 'Minifantasy_TownsIIBrickBuildingOutdoorTileset' | 'Minifantasy_TownsIIWoodenPlankBuildingOutdoorTileset' | 'Minifantasy_TownsProps' | 'Minifantasy_TownsPropsShadows' | 'Minifantasy_TownsTileset' | 'Minifantasy_TownsTilesetShadows' | 'StatsIcons' | 'TavernIndoorAll' | 'TavernIndoorAllShadows' | 'Tents' | 'TentsShadows' | 'TileasetAndPremadeZiggurats' | 'TileasetAndPremadeZigguratsProps' | 'TileasetAndPremadeZigguratsPropsShadows' | 'TileasetAndPremadeZigguratsShadows' | 'Universal-Road-Tileset' | 'WallOfTrees' | 'WallOfTreesShadows'
type ui = 'frameborder' | 'frameornate' | 'hpbar' | 'itemspot-selected' | 'itemspot' | 'label' | 'selectorleft' | 'textbox'
interface characterAnimations {
	bat: 'attack' | 'die' | 'dmg' | 'idle' | 'sleep' | 'walk'
	battleEffects: 'blades-dictum-effect' | 'blades-end' | 'blades-middle' | 'blades-start'
	paladin: 'attack' | 'dictum' | 'die' | 'dmg' | 'idle' | 'jump' | 'longidle-end' | 'longidle-middle' | 'longidle-start' | 'walk'
	wolf: 'attack' | 'die' | 'dmg' | 'idle' | 'jump' | 'walk'
}
interface soundEffects {
	bat: `attack-1` | `attack-2` | `cry-long` | `cry-short-a` | `cry-short-b` | `death` | `wing-flap-loop-fast` | `wing-flap-loop-slow` | `wing-flap-single-1` | `wing-flap-single-2`
	paladin: `attack` | `blades-of-justice-cast` | `blades-of-justice-cast-effect-only` | `blades-of-justice-end` | `blades-of-justice-loop` | `damage` | `death` | `dictum-armor-noises` | `dome-of-rightfulness-cast` | `dome-of-rightfulness-cast-effect-only` | `dome-of-rightfulness-end` | `dome-of-rightfulness-loop` | `holy-hammer-hit` | `holy-hammer-loop` | `holy-hammer-throw` | `idle` | `idle-end` | `idle-start` | `jump` | `land` | `shield-bash-hit` | `shield-bash-without-effect` | `shield-bash-with-effect` | `walk-1` | `walk-2` | `walk-loop`
	wolf: `attack-1a` | `attack-1b` | `attack-2a` | `attack-2b` | `damage-1` | `damage-2` | `death` | `growl-1` | `growl-2` | `walk-loop3-raw` | `walk-loop-1` | `walk-loop-2-raw`
}

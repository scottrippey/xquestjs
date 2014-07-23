module.exports = function(grunt) {
	var sources = {
		common: {
			vendor: [
				'../common/lib/easeljs-0.6.1.min.js'
				,'../common/lib/lodash.2.2.1.js'
				,'../common/lib/smoothsort.js'
			]
			,Smart: [
				'../common/src/Smart/Smart.js'
				,'../common/src/Smart/Smart.Class.js'
				,'../common/src/Smart/Smart.Color.js'
				,'../common/src/Smart/Smart.Disposable.js'
				,"../common/src/Smart/Smart.Drawing.js"
				,'../common/src/Smart/Smart.Events.js'
				,'../common/src/Smart/Smart.Physics.js'
				,'../common/src/Smart/Smart.Point.js'
				,'../common/src/Smart/Smart.Sort.js'
			]
			,SmartAnimation: [
				'../common/src/Smart/Animation/Smart.Animation.js'
				,'../common/src/Smart/Animation/Smart.Animation.easeljs.js'
				,'../common/src/Smart/Animation/Smart.Animation.easing.js'
				,'../common/src/Smart/Animation/Smart.Animation.timing.js'
				,'../common/src/Smart/Animation/Smart.Animations.js'
				,'../common/src/Smart/Animation/Smart.Interpolate.js'
				,'../common/src/Smart/Animation/Smart.Keyframes.js'
			]
			,extensions: [
				'../common/src/extensions/console.js'
				,'../common/src/extensions/EaselJS.js'
				,'../common/src/extensions/lodash-extensions.js'
			]
		}
		,XQuestGame: [
			"../XQuestGame/XQuestGame.js"

			,"../XQuestGame/scenes/BaseScene.js"
			,"../XQuestGame/scenes/ArcadeGame.js"
			,"../XQuestGame/scenes/HostScene.js"
			,"../XQuestGame/scenes/MenuScene.js"
			,"../XQuestGame/characters/BombCrystal.js"
			,"../XQuestGame/characters/Player.js"
			,"../XQuestGame/characters/PowerCrystal.js"
			,"../XQuestGame/characters/enemies/BaseEnemy.js"
			,"../XQuestGame/characters/enemies/Locust.js"
			,"../XQuestGame/characters/enemies/Mantis.js"
			,"../XQuestGame/characters/enemies/Slug.js"
			,"../XQuestGame/components/ActivePowerups.js"
			,"../XQuestGame/components/CrystalFactory.js"
			,"../XQuestGame/components/EnemyFactory.js"
			,"../XQuestGame/components/GameDebugger.js"
			,"../XQuestGame/components/Hud.js"
			,"../XQuestGame/components/LevelFactory.js"
			,"../XQuestGame/components/PowerupFactory.js"
			,"../XQuestGame/components/Projectiles.js"
			,"../XQuestGame/options/Balance.js"
			,"../XQuestGame/menus/BaseMenu.js"
			,"../XQuestGame/menus/CommonMenus.js"
			,"../XQuestGame/menus/GraphicsTestMenu.js"
			,"../XQuestGame/menus/StartMenu.js"
		]
		,XQuestGraphics: [
			"../XQuestGraphics/EaselJS/EaselJSGraphics.js"
			,"../XQuestGraphics/EaselJS/EaselJSTimer.js"
			,"../XQuestGraphics/EaselJS/utils/Drawing.js"
			,"../XQuestGraphics/EaselJS/Graphics.js"
			,"../XQuestGraphics/EaselJS/characters/PlayerGraphics.js"
			,"../XQuestGraphics/EaselJS/characters/enemies/BaseEnemyGraphics.js"
			,"../XQuestGraphics/EaselJS/characters/enemies/LocustGraphics.js"
			,"../XQuestGraphics/EaselJS/characters/enemies/MantisGraphics.js"
			,"../XQuestGraphics/EaselJS/characters/enemies/SlugGraphics.js"
			,"../XQuestGraphics/EaselJS/effects/BulletsGraphics.js"
			,"../XQuestGraphics/EaselJS/effects/ExplosionGraphics.js"
			,"../XQuestGraphics/EaselJS/effects/SpecialEffects.js"
			,"../XQuestGraphics/EaselJS/effects/TextGraphics.js"
			,"../XQuestGraphics/EaselJS/game/BackgroundGraphics.js"
			,"../XQuestGraphics/EaselJS/game/BombCrystalGraphic.js"
			,"../XQuestGraphics/EaselJS/game/BombGraphic.js"
			,"../XQuestGraphics/EaselJS/game/CrystalGraphic.js"
			,"../XQuestGraphics/EaselJS/game/LevelGraphics.js"
			,"../XQuestGraphics/EaselJS/game/PowerCrystalGraphic.js"
			,"../XQuestGraphics/EaselJS/hud/HudGraphics.js"
			,"../XQuestGraphics/EaselJS/hud/HudOverlay.js"
			,"../XQuestGraphics/EaselJS/hud/HudPauseButton.js"
			,"../XQuestGraphics/EaselJS/menus/MenuGraphics.js"
			,"../XQuestGraphics/EaselJS/menus/MenuButton.js"
			,"../XQuestGraphics/EaselJS/menus/XQuestLogoGraphic.js"
		]
		,XQuestInput: [
			"../XQuestInput/XQuestInput.js"
			,"../XQuestInput/menus/MenuInputKeyboard.js"
			,"../XQuestInput/player/PlayerInputKeyboard.js"
			,"../XQuestInput/player/PlayerInputMouse.js"
			,"../XQuestInput/player/PlayerInputTouch.js"
		]
		,XQuestHost: [
			"../XQuestHost/XQuestHost.js",
			"../XQuestHost/Settings.js"
		]
	};
	sources.allSources = concatAll(
		sources.common.vendor,
		sources.common.Smart,
		sources.common.SmartAnimation,
		sources.common.extensions,
		sources.XQuestGame,
		sources.XQuestGraphics,
		sources.XQuestInput,
		sources.XQuestHost
	);
	function concatAll(args_) {
		var results = [];
		for (var i = 0; i < arguments.length; i++) {
			var array = arguments[i];
			results.push.apply(results, array);
		}
		return results;
	}

	grunt.mergeConfig({
		sources: sources
	});

};
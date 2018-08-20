//=============================================================================
// SAN_TouchAnimation.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================
// GitHub  : https://github.com/rev2nym
// Twitter : https://twitter.com/rev2nym
//=============================================================================

/*:
 * @plugindesc 目標地点アニメーション 1.0.0
 * マップ上の目標地点にアニメーションを表示します。
 * @author Sanshiro https://github.com/rev2nym
 * 
 * @param Visible
 * @desc 表示有効フラグです。
 * OFF のとき目標地点を表示しません。(ON/OFF)
 * @default ON
 * 
 * @param AnimationID
 * @desc 目標地点に表示するアニメーションのIDです。
 * 0 のときはデフォルトのアニメーションを表示します。
 * @default 1
 * 
 * @param Scale
 * @desc 目標地点に表示するアニメーションの縮尺です。
 * 100で等倍です。
 * @default 100
 * 
 * @param Opacity
 * @desc 不透明度です。
 * 255で完全不透明です。(0～255)
 * @default 255
 * 
 * @param Loop
 * @desc ループ設定フラグです。
 * ON のときアニメーションをループします。(ON/OFF)
 * @default ON
 * 
 * @help
 * ■概要
 * 目標地点表示にアニメーションを表示します。
 * 表示するアニメーションはプラグインパラメータで設定します。
 * ループ設定が ON の場合はプレイヤーが目標地点に到達するまで
 * アニメーションをループ再生します。
 * 
 * ■ゲーム実行中のパラメータの取得
 * このプラグインのパラメータは以下のスクリプトで取得できます。
 * 
 * ・表示有効フラグ
 * $gameMap.destinationAnimation().isVisible();
 * 
 * ・アニメーションID
 * $gameMap.destinationAnimation().animationId();
 * 
 * ・拡大率
 * $gameMap.destinationAnimation().scale();
 * 
 * ・不透明度
 * $gameMap.destinationAnimation().opacity();
 * 
 * ・ループ設定フラグ
 * $gameMap.destinationAnimation().isLoop();
 * 
 * ■ゲーム実行中のパラメータの変更
 * このプラグインのパラメータをゲーム中に変更するには
 * 以下のスクリプトコマンドを実行してください。
 * 
 * ・表示有効フラグ
 * 有効化/無効化
 * $gameMap.destinationAnimation().setVisible(true);
 * $gameMap.destinationAnimation().setVisible(false);
 * 
 * ・アニメーションID
 * アニメーションIDを10に変更
 * $gameMap.destinationAnimation().setAnimationId(10);
 * 
 * ・拡大率
 * 拡大率を50%に変更
 * $gameMap.destinationAnimation().setScale(50);
 * 
 * ・不透明度
 * 不透明度を128に変更
 * $gameMap.destinationAnimation().setOpacity(128);
 * 
 * ・ループ設定フラグ
 * 有効化/無効化
 * $gameMap.destinationAnimation().setLoop(true);
 * $gameMap.destinationAnimation().setLoop(false);
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */


var Imported = Imported || {};
Imported.SAN_DestinationAnimation = true;

var Sanshiro = Sanshiro || {};
Sanshiro.DestinationAnimation = Sanshiro.DestinationAnimation || {};
Sanshiro.DestinationAnimation.version = '1.0.0';

(function(root) {
'use strict';

var $pluginName = 'SAN_DestinationAnimation';
var $pluginParams = PluginManager.parameters($pluginName);

//-----------------------------------------------------------------------------
// DestinationAnimation
//
// 目標地点アニメーション設定

function DestinationAnimation() {
    this.initialize.apply(this, arguments);
}

// オブジェクト初期化
DestinationAnimation.prototype.initialize = function() {
    this.setVisible($pluginParams['Visible'] === 'ON'); // 表示可否フラグ (ON/OFF)
    this.setAnimationId(Number($pluginParams['AnimationID'])); // アニメーションID
    this.setScale(Number($pluginParams['Scale'])); // 拡大率 (100で等倍)
    this.setOpacity(Number($pluginParams['Opacity'])); // 不透明度 (0～255)
    this.setLoop($pluginParams['Loop'] === 'ON'); // ループフラグ (ON/OFF)
};

// 表示フラグ
DestinationAnimation.prototype.isVisible = function() {
    return this._visible;
};

// アニメーションID
DestinationAnimation.prototype.animationId = function() {
    return this._animationId;
};

// 拡大率 (100で等倍)
DestinationAnimation.prototype.scale = function() {
    return this._scale;
};

// 不透明度 (0～255)
DestinationAnimation.prototype.opacity = function() {
    return this._opacity;
};

// ループフラグ
DestinationAnimation.prototype.isLoop = function() {
    return this._loop;
};

// 表示フラグの設定
DestinationAnimation.prototype.setVisible = function(visible) {
    this._visible = visible;
};

// アニメーションIDの設定
DestinationAnimation.prototype.setAnimationId = function(animationId) {
    this._animationId = animationId;
};

// 拡大率の設定 (100で等倍)
DestinationAnimation.prototype.setScale = function(scale) {
    this._scale = scale;
};

// 不透明度の設定 (0～255)
DestinationAnimation.prototype.setOpacity = function(opacity) {
    this._opacity = Math.max(0, Math.min(opacity, 255));
};

// ループフラグの設定
DestinationAnimation.prototype.setLoop = function(loop) {
    this._loop = loop;
};

//-----------------------------------------------------------------------------
// Game_Map
//
// マップ

// オブジェクト初期化
var _Game_Map_initialize =
    Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    _Game_Map_initialize.call(this);
    this._destinationAnimation = new DestinationAnimation();
};

// 目標地点アニメーション
Game_Map.prototype.destinationAnimation = function() {
    return this._destinationAnimation;
};

//-----------------------------------------------------------------------------
// Sprite_Destination
//
// 目標地点スプライト

var _Sprite_Destination_initialize =
    Sprite_Destination.prototype.initialize;
Sprite_Destination.prototype.initialize = function() {
    _Sprite_Destination_initialize.call(this);
    this.createAnimationSprite();
    this._animationStarted = false; // アニメーション開始済フラグ
    this._lastTileX = null; // 前回 X タイル座標
    this._lastTileY = null; // 前回 Y タイル座標
};

// アニメーションスプライトの生成
Sprite_Destination.prototype.createAnimationSprite = function() {
    this._animationBaseSprite = new Sprite();
    this._animationSprite = new Sprite_Base();
    this._animationBaseSprite.addChild(this._animationSprite);
    this.addChild(this._animationBaseSprite);
};

// アニメーション再生中判定
Sprite_Destination.prototype.isAnimationPlaying = function() {
    return this._animationSprite.isAnimationPlaying();
};

// アニメーション開始済判定
Sprite_Destination.prototype.isAnimationStarted = function() {
    return this._animationStarted;
};

// 目標地点タイル座標変化判定
Sprite_Destination.prototype.isPositionChanged = function() {
    return (
        this._lastTileX !== $gameTemp._destinationX ||
        this._lastTileY !== $gameTemp._destinationY
    );
};

// 表示フラグ
Sprite_Destination.prototype.isAnimationVisible = function() {
    return $gameMap.destinationAnimation().isVisible();
};

// アニメーションID
Sprite_Destination.prototype.animationId = function() {
    return $gameMap.destinationAnimation().animationId();
};

// 拡大率
Sprite_Destination.prototype.animationScale = function() {
    return $gameMap.destinationAnimation().scale();
};

// 不透明度
Sprite_Destination.prototype.animationOpacity = function() {
    return $gameMap.destinationAnimation().opacity();
};

// ループフラグ
Sprite_Destination.prototype.isAnimationLoop = function() {
    return $gameMap.destinationAnimation().isLoop();
};

// デフォルトアニメーション判定
Sprite_Destination.prototype.isDefaultAnimation = function() {
    return this.animationId() === 0;
};

// フレーム更新
var _Sprite_Destination_update =
    Sprite_Destination.prototype.update;
Sprite_Destination.prototype.update = function() {
    if (this.isAnimationVisible()) {
        if (this.isDefaultAnimation()) {
            _Sprite_Destination_update.call(this);
        } else {
            Sprite.prototype.update.call(this);
            this.updateDestinationAnimation();
            this.updateDestinationAnimationPosition();
        }
    } else {
        this.clearDestinationAnimation();
    }
};

// 目標地点アニメーションのフレーム更新
Sprite_Destination.prototype.updateDestinationAnimation = function() {
    if (this.shouldStartDestinationAnimation()) {
        this.startDestinationAnimation();
    } else if (this.shouldEndDestinationAnimation()) {
        this.endDestinationAnimation();
    }
};

// 目標地点アニメーション開始必要判定
Sprite_Destination.prototype.shouldStartDestinationAnimation = function() {
    if (!$gameTemp.isDestinationValid()) {
        return false;
    } else if (!this.isAnimationStarted()) {
        return true;
    } else if (this.isAnimationPlaying()) {
        return false;
    } else if (this.isAnimationLoop()) {
        return true;
    } else {
        return false;
    }
};

// 目標地点アニメーションの開始
Sprite_Destination.prototype.startDestinationAnimation = function() {
    this.clearDestinationAnimation();
    var animationId = this.animationId();
    var scale = this.animationScale();
    var opacity = this.animationOpacity();
    var animation = $dataAnimations[animationId];
    var mirror = false;
    var delay = 0;
    this._animationBaseSprite.scale.x = scale / 100.0;
    this._animationBaseSprite.scale.y = scale / 100.0;
    this._animationBaseSprite.opacity = opacity;
    this._animationSprite.startAnimation(
        animation,
        mirror,
        delay
    );
    this.memorizeLastPosition();
    this.visible = true;
    this._animationStarted = true;
};

// 前回目標地点タイル座標の記録
Sprite_Destination.prototype.memorizeLastPosition = function() {
    this._lastTileX = $gameTemp._destinationX;
    this._lastTileY = $gameTemp._destinationY;
};

// 目標地点アニメーション終了必要判定
Sprite_Destination.prototype.shouldEndDestinationAnimation = function() {
    return (
        !$gameTemp.isDestinationValid() &&
        !this.isAnimationPlaying()
    );
};

// 目標地点アニメーションの終了
Sprite_Destination.prototype.endDestinationAnimation = function() {
    this.createBitmap();
    this.visible = false;
    this._animationStarted = false;
};

// 目標地点アニメーション位置座標のフレーム更新
Sprite_Destination.prototype.updateDestinationAnimationPosition = function() {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    var x = this._lastTileX;
    var y = this._lastTileY;
    this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
    this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
};

// 目標地点アニメーションのクリア
Sprite_Destination.prototype.clearDestinationAnimation = function() {
    this.bitmap.clear();
    this.visible = false;
    this.opacity = 255;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this._frameCount = 0;
    this._animationStarted = false;
    this._lastTileX = null;
    this._lastTileY = null;
};

//-----------------------------------------------------------------------------
// 新規定義クラスのルート領域登録

root.DestinationAnimation = DestinationAnimation;

})(this);

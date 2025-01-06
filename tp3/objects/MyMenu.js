/**
 * @file MyMenu.js
 * @class MyMenu
 * @extends THREE.Object3D
 */

import * as THREE from "three";
import {MySprite} from '../utils/MySprite.js'
import {MyButton} from './MyButton.js'

/**
 * @class
 * @classdesc Represents the main menu interface of the application, providing options to configure gameplay settings.
 */

class MyMenu extends THREE.Object3D{
    /**
     * Constructs a new MyMenu instance. 
     * @constructor
     * @param {THREE.Material} material - The material for the menu background.
     * @param {number} currentLayer - The rendering layer for this menu.
     */
    constructor(material, currentLayer){
        super();
        this.level = 1;
        this.objects = [];
        this.playerName = "null";
        this.userBalloon = "Pink";
        this.botBalloon = "Blue";
        this.trackSide = "A";
        this.loops = 1
        this.geometry = new THREE.BoxGeometry( 50, 25, 2 );
        this.material = material
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.layer = currentLayer;
        
        this.sprite = MySprite.loadSpritesheet(0x00174c);
        this.blueSprite = MySprite.loadSpritesheet(0x1255ca);
        this.startButton = MySprite.createTextFromSpritesheet("start", 1.5, 1.5, this.sprite);
        this.startButton.position.set(-3.45, -10.4, 1.2);
        this.startButton.name = "start";
        this.mesh.add(this.startButton);

        this.author1 = MySprite.createTextFromSpritesheet("Madalena Ye - 202108795 | Manuel Serrano - 202402793", 0.5, 0.8, this.blueSprite);
        this.author1.position.set(-13, 2.6, 1.2);
        this.mesh.add(this.author1);
        
        this.logo = new THREE.Mesh(
            new THREE.PlaneGeometry( 20, 20, 2 ), 
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("scenes/textures/feup-logo.png"), transparent: true })
        );
        this.mesh.add(this.logo);
        this.logo.position.set(0, 4.5, 1.2);
        this.logo.scale.set(0.45, 0.1, 0.3);

        this.name = MySprite.createTextFromSpritesheet("Rising", 2.8, 2.8, this.sprite);
        this.name.position.set(-8, 9.5, 1.2)
        this.mesh.add(this.name);
        this.name1 = MySprite.createTextFromSpritesheet("Rivals", 2.5, 2.5, this.blueSprite);
        this.name1.position.set(-6, 7, 1.2)
        this.mesh.add(this.name1);

        this.playerText = MySprite.createTextFromSpritesheet(`Player Name: ${this.playerName}`, 1, 1, this.sprite);
        this.playerText.position.set(-18, 1, 1.2);
        this.mesh.add(this.playerText);

        this.changeName = new MyButton("Change", this.blueSprite, 1, 1, 8, 3, "changeName");
        this.changeName.position.set(10, 1, 1.2);
        this.changeName.layers.set(this.layer);
        this.mesh.add(this.changeName);

        this.levelText = MySprite.createTextFromSpritesheet(`Level: ${this.level}`, 1, 1, this.sprite);
        this.levelText.position.set(-12, -0.7, 1.2);
        this.mesh.add(this.levelText);

        this.levelDown = new MyButton("-", this.blueSprite, 1, 1, 1, -0.05, "levelDown");
        this.levelDown.position.set(10, -0.7, 1.2);
        this.levelDown.layers.set(this.layer);
        this.mesh.add(this.levelDown);

        this.levelUp = new MyButton("+", this.blueSprite, 1, 1, 1, -0.05, "levelUp");
        this.levelUp.position.set(12, -0.7, 1.2);
        this.levelUp.layers.set(this.layer);
        this.mesh.add(this.levelUp);

        this.userBalloonText = MySprite.createTextFromSpritesheet(`User Balloon: ${this.userBalloon}`, 1, 1, this.sprite);
        this.userBalloonText.position.set(-19, -2.5, 1.2);
        this.mesh.add(this.userBalloonText);

        this.pickBalloon = new MyButton("Pick", this.blueSprite, 1, 1, 8, 3, "pickBalloon");
        this.pickBalloon.position.set(10, -2.5, 1.2);
        this.pickBalloon.layers.set(this.layer);
        this.mesh.add(this.pickBalloon);

        this.botBalloonText = MySprite.createTextFromSpritesheet(`Bot balloon: ${this.botBalloon}`, 1, 1, this.sprite);
        this.botBalloonText.position.set(-18, -4.5, 1.2);
        this.mesh.add(this.botBalloonText);

        this.pickBotBalloon = new MyButton("Pick", this.blueSprite, 1, 1, 8, 3, "pickBotBalloon");
        this.pickBotBalloon.position.set(10, -4.5, 1.2);
        this.pickBotBalloon.layers.set(this.layer);
        this.mesh.add(this.pickBotBalloon);

        this.trackText = MySprite.createTextFromSpritesheet(`Track: ${this.trackSide}`, 1, 1, this.sprite);
        this.trackText.position.set(-12, -6.5, 1.2);
        this.mesh.add(this.trackText);

        this.track = new MyButton("Change", this.blueSprite, 1, 1, 8, 3, "track");
        this.track.position.set(10, -6.5, 1.2);
        this.track.layers.set(this.layer);
        this.mesh.add(this.track);

        this.loopText = MySprite.createTextFromSpritesheet(`Loops: ${this.loops}`, 1, 1, this.sprite);
        this.loopText.position.set(-12, -8.5, 1.2);
        this.mesh.add(this.loopText);

        this.loopDown = new MyButton("-", this.blueSprite, 1, 1, 1, -0.05, "loopDown");
        this.loopDown.position.set(10, -8.5, 1.2);
        this.loopDown.layers.set(this.layer);
        this.mesh.add(this.loopDown);

        this.loopUp = new MyButton("+", this.blueSprite, 1, 1, 1, -0.05, "loopUp");
        this.loopUp.position.set(12, -8.5, 1.2);
        this.loopUp.layers.set(this.layer);
        this.mesh.add(this.loopUp);

        this.add(this.mesh);
        this.objects.push(this.startButton, this.changeName, this.levelDown, this.levelUp, this.pickBalloon, this.pickBotBalloon, this.track, this.loopDown, this.loopUp);
    }

    /**
     * @method
     * Updates the player name text.
     * @param {string} text - The new player name.
     */
    updatePlayerName(text){
        MySprite.updateSpritesheetText(this.playerText, `Player Name: ${text}`, 1, 1, this.sprite);
        this.playerName = text;
    }

    /**
     * @method
     * Updates the level text.
     * @param {string} text - The new level value.
     */
    updateLevel(text){
        MySprite.updateSpritesheetText(this.levelText, `Level: ${text}`, 1, 1, this.sprite);
        this.level = text;
    }

    /**
     * @method
     * Updates the user balloon text.
     * @param {string} text - The new user balloon selection.
     */
    updateUserBalloon(text){
        MySprite.updateSpritesheetText(this.userBalloonText, `User Balloon: ${text}`, 1, 1, this.sprite);
    }

    /**
     * @method
     * Updates the bot balloon text.
     * @param {string} text - The new bot balloon selection.
     */
    updateBotBalloon(text){
        MySprite.updateSpritesheetText(this.botBalloonText, `Bot balloon: ${text}`, 1, 1, this.sprite);
    }

    /**
     * @method
     * Updates the track text.
     * @param {string} text - The new track selection.
     */
    updateTrack(text){
        MySprite.updateSpritesheetText(this.trackText, `Track: ${text}`, 1, 1, this.sprite);
    }

    /**
     * @method
     * Updates the loops text.
     * @param {string} text - The new number of loops.
     */
    updateLoops(text){
        MySprite.updateSpritesheetText(this.loopText, `Loops: ${text}`, 1, 1, this.sprite);
    }
}

export {MyMenu};
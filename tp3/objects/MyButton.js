/**
 * @file MyButton.js
 * @class MyButton
 * @extends THREE.Object3D
 */

import * as THREE from 'three';
import {MySprite} from '../utils/MySprite.js'

/**
 * @class
 * @classdesc Represents a button object with text rendered from a sprite sheet.
 */

class MyButton extends THREE.Object3D{
    /**
     * Constructs a new MyButton instance.
     * @constructor
     * @param {string} text - The text displayed on the button.
     * @param {THREE.Texture} sprite - The sprite sheet used to render the text.
     * @param {number} charWidth - The width of each character in the sprite sheet.
     * @param {number} charHeight - The height of each character in the sprite sheet.
     * @param {number} width - The width multiplier for the button based on the number of characters.
     * @param {number} x - The x-coordinate position of the button.
     * @param {string} name - The name of the button.
     */
    constructor(text, sprite, charWidth, charHeight, width, x, name){
        super();
        this.sprite = sprite;
        this.name = name;
        this.buttonText = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        this.buttonText.position.set(0,0,0.05);
    
        this.button = new THREE.Mesh(
            new THREE.PlaneGeometry( charWidth*width, charHeight, 23 ),
            new THREE.MeshBasicMaterial({color: 0x556280, transparent: true, opacity: 0.2})
        );
        this.button.position.set(x,0,0.2);
        this.add(this.buttonText);
        this.add(this.button);
    }
}
export {MyButton};
import * as THREE from 'three';
import {MySprite} from '../utils/MySprite.js'

class MyButton extends THREE.Object3D{
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
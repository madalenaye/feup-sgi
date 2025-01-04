import * as THREE from "three";
import {MySprite} from '../utils/MySprite.js'

class MyMenu extends THREE.Object3D{
    constructor(){
        super();
        this.geometry = new THREE.PlaneGeometry( 40, 20, 1 );
        this.material = new THREE.MeshBasicMaterial( {color: 0x0e0957, side: THREE.DoubleSide} );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.add(this.mesh);

        this.sprite = MySprite.loadSpritesheet(0xffffff);
        this.startButton = MySprite.createTextFromSpritesheet("start", 2, 2, this.sprite);

    }
}

export {MyMenu};
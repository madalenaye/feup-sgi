import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

class ShopSign extends THREE.Object3D{
    constructor(text){
        super();
        this.text = text;
        const fontLoader = new FontLoader();
        fontLoader.load('fonts/Poppins_Bold.json', (font) => {
            this.font = font;
       
            this.textGeometry = new TextGeometry(this.text, {
                font: this.font,
                size: 0.3,
                height: 0.01,
            });
            this.textMaterial = new THREE.MeshPhongMaterial({color: "black"});
            this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
            shadowDefinitions.objectShadow(this.textMesh, false, true);
            this.textMesh.rotation.y = Math.PI;
            this.add(this.textMesh);
        });
    }
}

export { ShopSign };
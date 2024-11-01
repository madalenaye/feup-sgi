/**
 * @file Rug.js
 * @class Rug
 * @extends THREE.Object3D
 * @desc This class aims to represent a Rug. 
 */


import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc The rug object is represented by a box
 */

 class Rug extends THREE.Object3D{
    /**
     * Constroi um objeto que representa um tapete.
     * @constructor
     * @param {number} with - 
     * @param {number} height - 
     * @param {number} depth -
     * @param {THREE.Material} material -
     * @param {number} positionX -
     * @param {number} positionY -
     * @param {number} positionZ -
     */
    constructor(width, height, depth, material, positionX, positionY, positionZ){
        super();
       
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const rugMesh = new THREE.Mesh(geometry, material);
        shadowDefinitions.objectShadow(rugMesh, true, false);
        rugMesh.position.set(positionX, positionY, positionZ)

        this.add(rugMesh);
        
    }

}

export { Rug };
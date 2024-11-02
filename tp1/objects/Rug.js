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
     * Constructs an object representing a rug.
     * @constructor
     * @param {number} width - The width of the rug.
     * @param {number} height - The height (thickness) of the rug.
     * @param {number} depth - The depth of the rug.
     * @param {THREE.Material} material - The material of the rug.
     * @param {number} positionX - The X-coordinate for the rug's position.
     * @param {number} positionY - The Y-coordinate for the rug's position.
     * @param {number} positionZ - The Z-coordinate for the rug's position.
     */
    constructor(width, height, depth, material, positionX, positionY, positionZ){
        super();
       
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const rugMesh = new THREE.Mesh(geometry, material);
        shadowDefinitions.objectShadow(rugMesh, true, true);
        rugMesh.position.set(positionX, positionY, positionZ)

        this.add(rugMesh);
        
    }

}

export { Rug };
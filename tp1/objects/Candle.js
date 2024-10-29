/**
 * @file Candle.js
 * @class Candle
 * @extends THREE.Object3D
 * @desc This class aims to represent a candle. 
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a 3D candle object that can be added to a scene. The candle consists of a cylinder and a cone.
 */

class Candle extends THREE.Object3D{

    /**
     * Constructs an object representing a candle.
     * @constructor
     * @param {number} cylinderHeight - The height of the candle.
     * @param {number} cylinderRadius - The radius of the candle.
     * @param {THREE.Material} cylinderMaterial - The material to apply to the candle.
     * @param {number} coneHeight - The height of the flame.
     * @param {number} coneRadius - The radius of the flame.
     * @param {THREE.Material} coneMaterial - The material to apply to the flame.
     * @param {Object} position - Represents the position of the candle relative to the three axes.
     */
    constructor(cylinderHeight, cylinderRadius, cylinderMaterial, coneHeight, coneRadius, coneMaterial, position = { x: 0, y: 0, z: 0 }) {

        super();
        this.cylinderRadius = cylinderRadius;
        this.positionX = position.x;
        this.positionY = position.y;
        this.positionZ = position.z;

        // Create the candle body (cylinder)
        const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight);
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.position.set(position.x, position.y + cylinderHeight / 2, position.z); // origin of the cylinder is in the center
        this.add(cylinderMesh); 

        
        // Create the flame (cone)
        const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight);
        const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
        coneMesh.position.set(0, cylinderHeight/2 + coneHeight /2 , 0);
        
        cylinderMesh.add(coneMesh); // The cone is "children" of the cylinder
        
    }

}

export { Candle };
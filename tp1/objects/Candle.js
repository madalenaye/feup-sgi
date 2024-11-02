/**
 * @file Candle.js
 * @class Candle
 * @extends THREE.Object3D
 * @desc This class aims to represent a candle. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js';  

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
     * @param {number} flameRadius - The radius of the flame.
     * @param {THREE.Material} flameMaterial - The material to apply to the flame.
     * @param {Object} position - Represents the position of the candle relative to the three axes.
     */
    constructor(cylinderHeight, cylinderRadius, cylinderMaterial, flameRadius, flameMaterial, position = { x: 0, y: 0, z: 0 }) {

        super();
        this.cylinderRadius = cylinderRadius;
        this.positionX = position.x;
        this.positionY = position.y;
        this.positionZ = position.z;

        // Create the candle body (cylinder)
        const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight);
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        shadowDefinitions.objectShadow(cylinderMesh);
        cylinderMesh.position.set(position.x, position.y + cylinderHeight / 2, position.z); // origin of the cylinder is in the center
        this.add(cylinderMesh); 

        
        // Create the flame
        const flameGeometry = new THREE.SphereGeometry(flameRadius, 32, 32);
        const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
        shadowDefinitions.objectShadow(flameMesh, false, true);

        flameMesh.scale.set(1, 2.4, 1);
        flameMesh.position.set(0, cylinderHeight / 2 + 0.017, 0);

        const flameLight = new THREE.PointLight(0xbd7c04, 1.5, 0.5);
        shadowDefinitions.propertiesLightShadow(flameLight);
        flameLight.position.set(0, cylinderHeight / 2 + 0.010, 0);

        cylinderMesh.add(flameMesh);
        flameMesh.add(flameLight);
        
    }

}

export { Candle };
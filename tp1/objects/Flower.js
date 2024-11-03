/**
 * @file Flower.js
 * @class Flower
 * @extends THREE.Object3D
 * @desc This class aims to represent a flower. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a flower that is made up of the stem, core and petals. The stem is made with tube geometry. While the core is made with a circle. The petals are made with flattened spheres.
 */

class Flower extends THREE.Object3D{


    /**
     * Constructs an object representing a flower.
     * @constructor
     * @param {number} tubularSegments - The number of segmented tubular shapes used to create the flower. 
     * @param {number} radius - The radius of the stem.
     * @param {number} radialSegments - The number of segments around the stem.
     * @param {number} positionX - The position of the flower on the x-axis.
     * @param {number} positionY - The position of the flower on the y-axis.
     * @param {number} positionZ - The position of the flower on the z-axis.
     * @param {THREE.Material} stemMaterial - The material to be applied to the stem.
     * @param {THREE.Material} flowerCenterMaterial - The material to be applied to the centre of the flower.
     * @param {THREE.Material} petalMaterial - The material to be applied to the petals.
     * @param {number} scale - The scaling factor that allows changing the size of the flower.
     */
    constructor(tubularSegments, radius, radialSegments, positionX, positionY, positionZ, stemMaterial, flowerCenterMaterial, petalMaterial, scale, numPetals) {

        super();
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;

        const flowerGroup = new THREE.Group();

        // 1. Create the flower stem
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0), 
            new THREE.Vector3(0.5, 2, 0.2),
            new THREE.Vector3(0, 4, 0),
        ]);

        const stemGeometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        shadowDefinitions.objectShadow(stem, false, true);

        // 2. Create the flower core 
        const flowerCenterGeometry = new THREE.CircleGeometry(0.5, 32);
        const flowerCenter = new THREE.Mesh(flowerCenterGeometry, flowerCenterMaterial);
        shadowDefinitions.objectShadow(flowerCenter, false, true);
        flowerCenter.position.set(0, 4.025, 0);  
        flowerCenter.rotation.x = -Math.PI / 2; 

        // 3. Create the petals
        const petalGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        
        const petalRadius = 1;
        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2; // Angle to distribute the petals
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            shadowDefinitions.objectShadow(petal);
            
            petal.position.set(petalRadius * Math.cos(angle), 4, petalRadius * Math.sin(angle));
            petal.scale.set(0.6, 1.2, 0.2);

            const rotationAngle = -angle - Math.PI/2;
            petal.rotation.set(-Math.PI / 2, 0, rotationAngle);

            flowerGroup.add(petal); 
        }
        
        flowerGroup.add(stem);
        flowerGroup.add(flowerCenter);

        flowerGroup.scale.set(scale, scale, scale);
        flowerGroup.position.set(positionX, positionY, positionZ);

        this.add(flowerGroup); 
    }

}

export { Flower };
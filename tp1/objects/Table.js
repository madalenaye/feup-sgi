/**
 * @file Table.js
 * @class Table
 * @extends THREE.Object3D
 * @desc This class aims to create a table, in which the top is made up of a parallelepiped, and the legs are made of cylinders.
 */


import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a 3D table object that can be added to a scene.
 */

class Table extends THREE.Object3D{

    /**
     * Constructs an object representing a table
     * @constructor
     * @param {number} width - The width of the tabletop.
     * @param {number} height - The height of the tabletop.
     * @param {number} depth - The thickness of the tabletop.
     * @param {Object} position - The position of the table relative to the three axes.
     * @param {THREE.Material} topMaterial - The material to be applied to the tabletop.
     * @param {THREE.Material} legsMaterial - The material to be applied to the legs of the table.
     */
    constructor(width = 1, height = 1, depth = 1, position = { x: 0, y: 0, z: 0 }, topMaterial, legsMaterial) {

        super();

        this.width = width;
        this.height = height; // thickness
        this.depth = depth;

        this.positionX = position.x;
        this.positionY = position.y;
        this.positionZ = position.z;

        // Create geometry and mesh for the top
        const topGeometry = new THREE.BoxGeometry(width, height, depth);
        const topMesh = new THREE.Mesh(topGeometry, topMaterial);
        shadowDefinitions.objectShadow(topMesh);
        topMesh.position.set(position.x, position.y + height / 2 - 0.075, position.z);
        this.add(topMesh);

        // Create geometry and mesh for the legs (cylinders)
        const legsGeometry = new THREE.CylinderGeometry(0.1, 0.1, position.y);
        const legsHeight = position.y;

        // Position of legs
        const legsPositions = [
            { x: (width / 2.0) - 0.2, y: -legsHeight / 2.0, z: (depth / 2.0) - 0.2},  // Leg 1
            { x: (-width / 2.0) + 0.2, y: -legsHeight / 2.0, z: (depth / 2.0) - 0.2}, // Leg 2
            { x: (width / 2.0) -0.2, y: -legsHeight / 2.0, z: (-depth / 2.0) + 0.2}, // Leg 3
            { x: (-width / 2.0) + 0.2, y: -legsHeight / 2.0, z: (-depth / 2.0) + 0.2}  // Leg 4
        ];
       
        // Create and add each leg to the table (children of the table top)
        for (let i = 0; i < legsPositions.length; i++) {
            const pos = legsPositions[i];
            const legMesh = new THREE.Mesh(legsGeometry, legsMaterial);
            shadowDefinitions.objectShadow(legMesh,false, true);
            legMesh.position.set(pos.x, pos.y, pos.z);
            topMesh.add(legMesh); // The legs are "children" of the top
        }
        
    }


}

export { Table };
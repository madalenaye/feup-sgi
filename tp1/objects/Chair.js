/**
 * @file Chair.js
 * @class Chair
 * @extends THREE.Object3D
 * @desc This class aims to represent a Chair. 
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc It represents a chair that is made up of parallelepipeds and cylinders. The parallelepipeds for seat and back. While the cylinders for the chair legs
 */

class Chair extends THREE.Object3D {

    /**
     * Constructs an object representing a chair.
     * @constructor
     * @param {number} seatWidth - The width of the chair's seat.
     * @param {number} seatDepth - The depth of the chair's seat.
     * @param {number} seatHeight - The height of the seat from the ground.
     * @param {THREE.Material} material - The material to apply to the seat.
     * @param {number} legRadius - The radius of the chair's legs.
     * @param {number} legHeight - The height of the chair's legs.
     * @param {number} angle - The orientation of the chair.
     */
    constructor(seatWidth, seatDepth, seatHeight, seatMaterial, legRadius, legHeight, positionX, positionZ, angle) {
        super();
        this.positionX = positionX;
        this.positionZ = positionZ;

        const chairGroup = new THREE.Group();

        const seatGeometry = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
        const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
        seatMesh.position.y = legHeight;
        chairGroup.add(seatMesh);

        const legPositions = [
            [-seatWidth / 2 + legRadius, 0.01, -seatDepth / 2 + legRadius], 
            [seatWidth / 2 - legRadius, 0.01, -seatDepth / 2 + legRadius],   
            [-seatWidth / 2 + legRadius, 0.01, seatDepth / 2 - legRadius], 
            [seatWidth / 2 - legRadius, 0.01, seatDepth / 2 - legRadius]   
        ];

        legPositions.forEach(([x, y, z], index) => {
            const heightMultiplier = (index === 0 || index === 1) ? 1.8 : 1;
            const legGeometry = new THREE.CylinderGeometry(legRadius, legRadius, legHeight * heightMultiplier);
            const legMesh = new THREE.Mesh(legGeometry, seatMaterial);
            legMesh.position.set(x, y + (legHeight * heightMultiplier) / 2, z);
            chairGroup.add(legMesh);
        });

        const backrestWidth = seatWidth - 0.1;
        const backrestHeight = 0.04;
        const backrestDepth = seatDepth / 8;

        const backrestGeometry = new THREE.BoxGeometry(backrestWidth, backrestHeight, backrestDepth);
        
        const backrestMesh1 = new THREE.Mesh(backrestGeometry, seatMaterial);
        backrestMesh1.position.set(0, 2 * legHeight - 0.5, -(seatDepth / 2 - legRadius));
        backrestMesh1.rotation.x = Math.PI / 2;

        const backrestMesh2 = new THREE.Mesh(backrestGeometry, seatMaterial);
        backrestMesh2.position.set(0, 2 * legHeight - 0.8, -(seatDepth / 2 - legRadius));
        backrestMesh2.rotation.x = Math.PI / 2;

        chairGroup.add(backrestMesh1);
        chairGroup.add(backrestMesh2);

        chairGroup.rotation.y = angle;
        chairGroup.position.set(positionX, 0, positionZ);

        this.add(chairGroup);
        
    }
}

export { Chair };
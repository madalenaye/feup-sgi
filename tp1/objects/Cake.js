/**
 * @file Cake.js
 * @class Cake
 * @extends THREE.Object3D
 * @desc This class aims to represent a Cake.
 */
import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a Cake made up of a cylinder and two planes.
 * The cylinder represents the cake itself, while the planes are used to close the cake.
 */
class Cake extends THREE.Object3D{
    /**
     * Constructs an object representing a cake.
     * @constructor
     * @param {number} radius - The radius of the cake.
     * @param {number} height - The height of the cake.
     * @param {number} angle  - The angle of the cake.
     * @param {THREE.Texture} frosting - The texture of the frosting.
     * @param {THREE.Texture} insideTexture - The texture of the inside of the cake.
     * @param {string} color - The color of the filling.
     */
    constructor(radius, height, angle, frosting, insideTexture, color) {

        super();

        this.radius = radius
        this.height = height
        this.angle = 2*Math.PI - angle     
        this.color = color
        // cake
        this.cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, this.angle)
        this.cakeMaterial = new THREE.MeshStandardMaterial({map: frosting, roughness: 1})
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial)
        this.add(this.cakeMesh)

        // Cake planes
        this.insideMaterials = [
            new THREE.MeshStandardMaterial({ color: "#850101", map: insideTexture, roughness: 1, side: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: this.color, map: insideTexture, roughness: 1, side: THREE.FrontSide }),
            new THREE.MeshStandardMaterial({ color: "#d69292", map: insideTexture, roughness: 1, side: THREE.FrontSide })
        ];


        const addPlaneSegment = (side, yOffset, material, rotationY) => {
            const plane = new THREE.PlaneGeometry(this.radius, this.height / 3, 1, 1);
            const mesh = new THREE.Mesh(plane, material);
            
            // Set positions based on side
            mesh.position.set(
                side === 'A' ? Math.sin(this.angle) * (this.radius / 2) : 0,
                yOffset,
                side === 'A' ? Math.cos(this.angle) * (this.radius / 2) : this.radius / 2
            );
            
            // Rotate plane to face cake center
            mesh.rotateY(rotationY);
            this.add(mesh);
        };

        const yOffsets = [- this.height / 3, 0, this.height / 3];

        // Loop to create and add planes for Side A and Side B
        for (let i = 0; i < 3; i++) {
            addPlaneSegment('A', yOffsets[i], this.insideMaterials[i], Math.PI / 2 + this.angle);
            addPlaneSegment('B', yOffsets[i], this.insideMaterials[i], -Math.PI / 2);
        }

        // filling
        this.fillingRadius = this.radius + 0.0001; 
        this.fillingHeight = this.height/3;
        this.fillingGeometry = new THREE.CylinderGeometry(this.fillingRadius, this.fillingRadius, this.fillingHeight, 32, 1, false, 0, this.angle);
        this.fillingMaterial = new THREE.MeshStandardMaterial({ color: this.color, map: frosting, roughness: 1 });
        this.fillingMesh = new THREE.Mesh(this.fillingGeometry, this.fillingMaterial);
        this.fillingMesh.position.y = 0;
        this.add(this.fillingMesh);

        
    }
    

}

export { Cake }
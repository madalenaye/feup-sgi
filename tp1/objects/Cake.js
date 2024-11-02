/**
 * @file Cake.js
 * @class Cake
 * @extends THREE.Object3D
 * @desc This class aims to represent a Cake.
 */
import * as THREE from 'three';
import { Candle } from './Candle.js';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

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
    constructor(radius, height, angle, frosting, insideTexture, color, candleMaterial, flameMaterial) {

        super();

        this.radius = radius
        this.height = height
        this.angle = 2*Math.PI - angle     
        this.color = color
        // cake
        this.cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, this.angle)
        this.cakeMaterial = new THREE.MeshStandardMaterial({map: frosting, roughness: 1})
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial)
        shadowDefinitions.objectShadow(this.cakeMesh);
   
        // Cake planes - different layers
        const layerColors = ["#850101", this.color, "#d69292"];
        this.insideMaterials = layerColors.map(color => 
            new THREE.MeshStandardMaterial({ color, map: insideTexture, roughness: 1, side: THREE.FrontSide })
        );
     
        const createPlaneSegment = (side, y_offset, material, rotationY) => {
            let plane = new THREE.PlaneGeometry(this.radius, this.height / 3, 1, 1);
            let mesh = new THREE.Mesh(plane, material);
            shadowDefinitions.objectShadow(mesh, false, true);
            
            let x = side === 'A' ? Math.sin(this.angle) * (this.radius / 2) : 0;
            let z = side === 'A' ? Math.cos(this.angle) * (this.radius / 2) : this.radius / 2;
            mesh.position.set(x, y_offset, z);
            
            mesh.rotateY(rotationY);
            return mesh;
        };

        let heights = [-this.height / 3, 0, this.height / 3];
        let angles = { A: Math.PI / 2 + this.angle, B: -Math.PI / 2 };

        heights.forEach((height, i) => {
            let material = this.insideMaterials[i];
            this.cakeMesh.add(createPlaneSegment('A', height, material, angles.A));
            this.cakeMesh.add(createPlaneSegment('B', height, material, angles.B));
        });

        // decorations

        this.pearl = new THREE.SphereGeometry(0.018, 32, 32);
        this.pearlMaterial = new THREE.MeshPhysicalMaterial({ color: "#c7c7c7", emissive: '#757474', roughness: 0.313, reflectivity: 1, iridescence: 1, iridescenceIOR: 1.65, clearcoat: 1, clearcoatRoughness: 0.39 })
        this.pearlMesh = new THREE.Mesh(this.pearl, this.pearlMaterial);
        shadowDefinitions.objectShadow(this.pearlMesh, false, true);
        

        // Function to create a pearl ring group
        let createPearlRing = (y, radius) => {
            const pearlRingGroup = new THREE.Group(); 

            for (let angle = 0; angle < this.angle; angle += 0.028 / radius) {
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                // Create and position each pearl
                const pearlMesh = new THREE.Mesh(this.pearl, this.pearlMaterial);
                shadowDefinitions.objectShadow(pearlMesh, false, true);
                pearlMesh.position.set(x, y, z);
                pearlMesh.rotateZ(-Math.PI / 2);

                // Add each pearl to the pearl ring group
                pearlRingGroup.add(pearlMesh);
            }

            return pearlRingGroup;
        };

        // Create and add pearl rings at the top and bottom
        const topPearlRing = createPearlRing(this.height / 2, this.radius);     // Top ring of pearls
        const bottomPearlRing = createPearlRing(-this.height / 2, this.radius); // Bottom ring of pearls


        topPearlRing.rotateY(this.angle - Math.PI/2 - 0.018);
        bottomPearlRing.rotateY(this.angle - Math.PI/2 - 0.018);
        this.cakeMesh.add(topPearlRing);
        this.cakeMesh.add(bottomPearlRing);
        
        // Candle
        this.candle = new Candle(0.15, 0.015, candleMaterial, 0.009, flameMaterial, { x: 0, y: this.height/2, z:-0.1} );  
        this.cakeMesh.add(this.candle)
        this.add(this.cakeMesh);
        
    }
    

}

export { Cake }
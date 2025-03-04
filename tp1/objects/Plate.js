/**
 * @file Plate.js
 * @class Plate
 * @extends THREE.Object3D
 * @desc This class aims to represent a Plate.
 */
import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a Plate made up of a cylinder and a plane.
 * The cylinder represents the plate itself, while the plane is used to close the plate.
 * The plate is made up of a white material.
 */
class Plate extends THREE.Object3D{
    /**
     * Constructs an object representing a plate.
     * @constructor
     * @param {number} radius - The radius of the plate.
     * @param {number} segments - The number of segments of the plate.
     */
    constructor(radius, segments){
        super();
        this.radius = radius
        this.segments = segments
        
        this.plate = new THREE.CylinderGeometry(this.radius * 1.4, this.radius, this.radius / 4, this.segments, 1, true)
        this.plateMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 20, side: THREE.DoubleSide});
        this.plateMesh = new THREE.Mesh(this.plate, this.plateMaterial)
        this.plateMesh.castShadow = true
        this.plateMesh.receiveShadow = false
        this.plateBase = new THREE.CylinderGeometry(this.radius, this.radius, 0.0001, this.segments)
        this.plateBaseMesh = new THREE.Mesh(this.plateBase, this.plateMaterial)
        this.plateBaseMesh.position.y = - this.radius / 8
        
        this.add(this.plateMesh)
        this.add(this.plateBaseMesh)
    }

}

export { Plate };
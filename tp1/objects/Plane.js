/**
 * @file Plane.js
 * @class Plane
 * @extends THREE.Object3D
 * @desc This class aims to represent a plane. 
 */


import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc The plane can be used to create the floor as well as the walls.
 */

class Plane extends THREE.Object3D{

    /**
     * Constructs an object representing the floor or wall.
     * @constructor
     * @param {number} width - The width of the plane.
     * @param {number} height - The height of the plane.
     * @param {THREE.Material} material - The material to be applied to the plane.
     */
    constructor(width = 1, height = 1, material = null) {

        super();

        this.width = width;
        this.height = height;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        
        this.planeMesh = new THREE.Mesh(geometry, material);
        shadowDefinitions.objectShadow(this.planeMesh,true, false);
        this.add(this.planeMesh);
        
    }

    /**
     * Method to position the plane as a left wall
     * @method
     * @param {number} floorHeight - The height of the floor.
     */
    buildLeftWall(floorHeight){
        this.position.y = this.height / 2.0;
        this.position.z = floorHeight / 2.0;
        this.rotation.y = Math.PI;
    }

    /**
     * Method to position the plane as a right wall
     * @method 
     * @param {number} floorHeight - The height of the floor.
     */
    buildRightWall(floorHeight){
        this.position.y = this.height / 2.0;
        this.position.z = -(floorHeight / 2.0);
    }

    /**
     * Method to position the plane as a front wall
     * @method
     * @param {number} floorWidth - The width of the floor.
     */
    buildFrontWall(floorWidth){
        this.position.y = this.height / 2.0;
        this.position.x = floorWidth / 2.0;
        this.rotation.y = -Math.PI / 2;
    }

    /**
     * Method to position the plane as a back wall
     * @method
     * @param {number} floorWidth - The width of the floor.
     */
    buildBackWall(floorWidth){
        this.position.y = this.height / 2.0;
        this.position.x = -(floorWidth / 2.0);
        this.rotation.y = Math.PI / 2;
    }

    /**
     * Method to position the plane as a floor
     * @method
     */
    buildFloor(){
        this.position.y = 0;
        this.rotation.x = -Math.PI / 2;
    }
}

export { Plane };


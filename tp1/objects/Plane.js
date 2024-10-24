/**
 * @file Plane.js
 * @class Plane
 * @extends THREE.Object3D
 * @desc This class aims to represent a plane. 
 */


import * as THREE from 'three';

/**
 * @class
 * @classdesc The plane can be used to create the floor as well as the walls.
 */

class Plane extends THREE.Object3D{

    constructor(width = 1, height = 1, material = null) {

        super();

        this.width = width;
        this.height = height;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        
        this.planeMesh = new THREE.Mesh(geometry, material || new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        }));
    
        this.add(this.planeMesh);
        
    }

    /**
     * Method to position the plane as a left wall
     */
    buildLeftWall(floorHeight){
        this.position.y = this.height / 2.0;
        this.position.z = floorHeight / 2.0;
    }

    /**
     * Method to position the plane as a right wall
     */
    buildRightWall(floorHeight){
        this.position.y = this.height / 2.0;
        this.position.z = -(floorHeight / 2.0);
    }

    /**
     * Method to position the plane as a front wall
     */
    buildFrontWall(floorWidth){
        this.position.y = this.height / 2.0;
        this.position.x = floorWidth / 2.0;
        this.rotation.y = Math.PI / 2;
    }

    /**
     * Method to position the plane as a back wall
     */
    buildBackWall(floorWidth){
        this.position.y = this.height / 2.0;
        this.position.x = -(floorWidth / 2.0);
        this.rotation.y = Math.PI / 2;
    }

    /**
     * Method to position the plane as a floor
     */
    buildFloor(){
        this.position.y = 0;
        this.rotation.x = -Math.PI / 2;
    }
}

export { Plane };


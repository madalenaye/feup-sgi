/**
 * @file Baseboard.js
 * @class Baseboard
 * @extends THREE.Object3D
 * @desc This class aims to represent a baseboard. 
 */


import * as THREE from 'three';

/**
 * @class
 * @classdesc The baseboard will be represented by a parallelepiped.
 */

class Baseboard extends THREE.Object3D{

    /**
     * Constructs an object representing a baseboard.
     * @constructor
     * @param {number} width - The width of the baseboard.
     * @param {number} height - The height of the baseboard.
     * @param {number} depth - The depth of the baseboard.
     * @param {THREE.Material} material - The material applied to the baseboard. 
     */
    constructor(width = 1, height = 1, depth, material) {

        super();

        this.width = width;
        this.height = height;
        this.depth = depth;

        const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

        const mesh = new THREE.Mesh(geometry, material);

        this.add(mesh);
    }

    /**
     * Method to position the parallelepiped as a left baseborad
     * @method
     * @param {number} planeY - Position on the y-axis of the floor.
     * @param {number} floorHeight - The height of the floor.
     */
    buildLeftBaseboard(planeY, floorHeight){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.z = (floorHeight / 2.0) - (this.depth - 0.02);
    }

    /**
     * Method to position the parallelepiped as a right baseboard
     * @method
     * @param {number} planeY - Position on the y-axis of the floor.
     * @param {number} floorHeight - The height of the floor.
     */
    buildRightBaseboard(planeY, floorHeight){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.z = -((floorHeight / 2.0) - (this.depth - 0.02));
    }

    /**
     * Method to position the parallelepiped as a front baseboard
     * @method
     * @param {number} planeY - Position on the y-axis of the floor.
     * @param {number} floorWidth - The width of the floor.
     */
    buildFrontBaseboard(planeY, floorWidth){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.x = (floorWidth / 2.0) - (this.depth - 0.02);
        this.rotation.y = Math.PI / 2;
    }

    /**
     * Method to position the parallelepiped as a back baseboard
     * @method
     * @param {number} planeY - Position on the y-axis of the floor.
     * @param {number} floorWidth - The width of the floor.
     */
    buildBackBaseboard(planeY, floorWidth){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.x = -((floorWidth / 2.0) - (this.depth - 0.02));
        this.rotation.y = Math.PI / 2;
    }

}

export { Baseboard };


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
     */
    buildLeftBaseboard(planeY){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.z = (this.width / 2.0) - (this.depth - 0.02);
    }

    /**
     * Method to position the parallelepiped as a right baseboard
     */
    buildRightBaseboard(planeY){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.z = -((this.width / 2.0) - (this.depth - 0.02));
    }

    /**
     * Method to position the parallelepiped as a front baseboard
     */
    buildFrontBaseboard(planeY){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.x = (this.width / 2.0) - (this.depth - 0.02);
        this.rotation.y = Math.PI / 2;
    }

    /**
     * Method to position the parallelepiped as a back baseboard
     */
    buildBackBaseboard(planeY){
        this.position.y = (planeY + this.height/2) + 0.01;
        this.position.x = -((this.width / 2.0) - (this.depth - 0.02));
        this.rotation.y = Math.PI / 2;
    }

}

export { Baseboard };


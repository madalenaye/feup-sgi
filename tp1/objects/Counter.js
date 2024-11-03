/**
 * @file Counter.js
 * @class Counter
 * @extends THREE.Object3D
 * @desc This class aims to represent a Counter. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc A 3D representation of a Counter object, built using multiple box geometries to form the main counter, sides, and top.
 */

class Counter extends THREE.Object3D{

    /**
     * Constructs an object representing a Counter.
     * @constructor
     * @param {THREE.Texture} woodTexture - The texture to be applied to the counter's sides.
     * @param {THREE.Texture} counterTexture - The texture to be applied to the counter's top.
     */
    constructor(woodTexture){
        super();
        this.counter = new THREE.BoxGeometry(5, 2, 1.5);
        this.woodTexture = woodTexture;

        this.counterTexture = new THREE.TextureLoader().load('textures/counter.jpeg');
        this.counterTexture.wrapS = THREE.RepeatWrapping;
        this.counterTexture.wrapT = THREE.RepeatWrapping;
        this.counterTexture.repeat.set(2, 2);
        this.counterMaterial = new THREE.MeshStandardMaterial({ map: this.counterTexture});
        this.counterMesh = new THREE.Mesh(this.counter, this.counterMaterial);
        shadowDefinitions.objectShadow(this.counterMesh);

        this.counterRight = new THREE.BoxGeometry(1.5, 0.16, 0.3);
        this.counterTopMaterial = new THREE.MeshStandardMaterial({ map: this.woodTexture});
        this.counterRightMesh = new THREE.Mesh(this.counterRight, this.counterTopMaterial);
        shadowDefinitions.objectShadow(this.counterRightMesh);
        this.counterRightMesh.rotation.y = Math.PI / 2;
        this.counterRightMesh.position.set(2.35, 1.07, 0);


        this.counterLeft = new THREE.BoxGeometry(1.5, 0.16, 0.3);
        this.counterLeftMesh = new THREE.Mesh(this.counterLeft, this.counterTopMaterial);
        shadowDefinitions.objectShadow(this.counterLeftMesh);
        this.counterLeftMesh.rotation.y = Math.PI / 2;
        this.counterLeftMesh.position.set(-2.35, 1.07, 0);


        this.counterTop = new THREE.BoxGeometry(4.4, 0.16, 0.3);
        this.counterTopMesh = new THREE.Mesh(this.counterTop, this.counterTopMaterial);
        shadowDefinitions.objectShadow(this.counterTopMesh);
        this.counterTopMesh.position.set(0, 1.07, 0.6);


        this.counterMesh.add(this.counterRightMesh);
        this.counterMesh.add(this.counterLeftMesh);
        this.counterMesh.add(this.counterTopMesh);
        this.counterMesh.rotation.y = -Math.PI / 2;
        this.add(this.counterMesh);

    }
}

export { Counter };
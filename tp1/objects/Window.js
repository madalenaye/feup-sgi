/**
 * @file Window.js
 * @class Window
 * @extends THREE.Object3D
 * @desc This class aims to represent a Window. 
 * This class represents a window that has a texture as its background.
 */


import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a window that is made up of 1 plane, and 4 parallelepipeds which represent the friezes
 */

class Window extends THREE.Object3D{

    constructor(width, height, frameThickness, imagePath) {

        super();

        // Total size of the window
        this.width = width;
        this.height = height;
        this.frameThickness = frameThickness;

        const textureLoader = new THREE.TextureLoader();
        const windowTexture = textureLoader.load(imagePath);
        
        // Size of the landscape
        const glassWidth = this.width - 2 * this.frameThickness;
        const glassHeight = this.height - 2 * this.frameThickness;
        const glassGeometry = new THREE.PlaneGeometry(glassWidth, glassHeight);
        const glassMaterial = new THREE.MeshBasicMaterial({map: windowTexture, side: THREE.DoubleSide});
        const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);

        // Create the window frame using parallelepipeds
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

        // Create geometries for each side of the frame (parallelepipeds)
        const topFrameGeometry = new THREE.BoxGeometry(this.width, this.frameThickness, this.frameThickness);
        const bottomFrameGeometry = new THREE.BoxGeometry(this.width, this.frameThickness, this.frameThickness);
        const leftFrameGeometry = new THREE.BoxGeometry(this.frameThickness, this.height - 2 * this.frameThickness, this.frameThickness);
        const rightFrameGeometry = new THREE.BoxGeometry(this.frameThickness, this.height - 2 * this.frameThickness, this.frameThickness);

        const topFrameMesh = new THREE.Mesh(topFrameGeometry, frameMaterial);
        const bottomFrameMesh = new THREE.Mesh(bottomFrameGeometry, frameMaterial);
        const leftFrameMesh = new THREE.Mesh(leftFrameGeometry, frameMaterial);
        const rightFrameMesh = new THREE.Mesh(rightFrameGeometry, frameMaterial);

        // Position the frame parts relative to the origin of the glass
        topFrameMesh.position.set(0, this.height / 2 - this.frameThickness / 2, 0);
        bottomFrameMesh.position.set(0, -this.height / 2 + this.frameThickness / 2, 0);
        leftFrameMesh.position.set(-this.width / 2 + this.frameThickness / 2, 0, 0);
        rightFrameMesh.position.set(this.width / 2 - this.frameThickness / 2, 0, 0);

        // Position the glass in the centre
        glassMesh.position.set(0, 0, 0);

        // Create a group for the window
        const windowGroup = new THREE.Group();
        windowGroup.add(glassMesh);
        windowGroup.add(topFrameMesh);
        windowGroup.add(bottomFrameMesh);
        windowGroup.add(leftFrameMesh);
        windowGroup.add(rightFrameMesh);

        this.add(windowGroup);

    }


}

export { Window };
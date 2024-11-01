/**
 * @file Window.js
 * @class Window
 * @extends THREE.Object3D
 * @desc This class aims to represent a Window. 
 * This class represents a window that has a texture as its background.
 */


import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a window that is made up of 1 plane, and 4 parallelepipeds which represent the friezes
 */

class Window extends THREE.Object3D{

    /**
     * Constructs an object representing a window.
     * @constructor
     * @param {number} width - The width of the window.
     * @param {number} height - The height of the window.
     * @param {number} frameThickness - The thickness of the window frame. 
     * @param {string} imagePath - The path to the landscape image.
     */
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
        const glassMaterial = new THREE.MeshBasicMaterial({map: windowTexture});
        const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
        shadowDefinitions.objectShadow(glassMesh, true, false);

        // Create the window frame using parallelepipeds
        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

        // Create geometries for each side of the frame (parallelepipeds)
        const topFrameGeometry = new THREE.BoxGeometry(this.width, this.frameThickness, this.frameThickness);
        const bottomFrameGeometry = new THREE.BoxGeometry(this.width, this.frameThickness, this.frameThickness);
        const leftFrameGeometry = new THREE.BoxGeometry(this.frameThickness, this.height - 2 * this.frameThickness, this.frameThickness);
        const rightFrameGeometry = new THREE.BoxGeometry(this.frameThickness, this.height - 2 * this.frameThickness, this.frameThickness);

        const topFrameMesh = new THREE.Mesh(topFrameGeometry, frameMaterial);
        shadowDefinitions.objectShadow(topFrameMesh, false, true);
        const bottomFrameMesh = new THREE.Mesh(bottomFrameGeometry, frameMaterial);
        shadowDefinitions.objectShadow(bottomFrameMesh, false, true);
        const leftFrameMesh = new THREE.Mesh(leftFrameGeometry, frameMaterial);
        shadowDefinitions.objectShadow(leftFrameMesh, false, true);
        const rightFrameMesh = new THREE.Mesh(rightFrameGeometry, frameMaterial);
        shadowDefinitions.objectShadow(rightFrameMesh, false, true);

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

    /**
     * Method responsible for activating the light coming from the window.
     * @method
     * @returns {THREE.RectAreaLight} - A rectangular area light positioned to simulate light from the window.
     */
    activateWindowLight(){

        const width = this.width/1.5; 
        const height = this.height/1.5;
        const intensity = 5;

        const rectLight = new THREE.RectAreaLight(0xf5ac3d, intensity, width, height);
        rectLight.position.set(this.position.x, this.position.y, this.position.z); 
        rectLight.lookAt(0, this.position.y, 0); 

        return rectLight
    }
    
     /**
     * Method responsible for activating a directional shadow light to complement the rectangular area light.
     * @method
     * @returns {THREE.DirectionalLight} -  A directional light source configured for casting shadows, 
     *                                      positioned to enhance the area lighting.
     */
    activateShadowLight(){

        const shadowLight = new THREE.DirectionalLight(0xf5ac3d, 0.3);
        shadowDefinitions.propertiesLightShadow(shadowLight, 2048, 2048, 0.5, 16, -3, 3, -3, 3);
        shadowLight.position.set(this.position.x - 1, this.position.y, this.position.z); 
        shadowLight.target.position.set(0, 2.1, 0); 
        
        return shadowLight
    }

}

export { Window };
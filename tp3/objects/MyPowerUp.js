/**
 * @file MyPowerUp.js
 * @class MyPowerUp
 * @extends THREE.Object3D
 */

import * as THREE from 'three';
import { MyShader } from './MyShader.js';

/**
 * @class
 * @classdesc Represents a power-up object in the scene with custom shader effects and rotation animation.
 */

class MyPowerUp extends THREE.Object3D {

    /**
     * Constructs a new MyPowerUp instance.
     * @constructor
     * @param {Object} parameters - Configuration parameters for the power-up.
     * @param {number} parameters.width - The width of the power-up.
     * @param {THREE.Material} material - The material used for the power-up.
     * @param {boolean} castShadow - Determines if the power-up casts shadows.
     * @param {boolean} receiveShadow - Determines if the power-up receives shadows.
     */
    constructor(parameters, material, castShadow, receiveShadow) {
            super();
            this.width = parameters.width;
            this.canCollide = true;
            this.powerup = new THREE.BoxGeometry(this.width, this.width, this.width);
            this.powerup = new THREE.Mesh(this.powerup, material);
            this.powerup.rotation.set(Math.PI/4, 0, Math.PI/4);
          
            const vertexShader = 'shaders/powerup.vert';
            const fragmentShader = 'shaders/powerup.frag';
            const texture1 = new THREE.TextureLoader().load('scenes/textures/powerup.png');
            const texture2 = new THREE.TextureLoader().load('scenes/textures/powerup_bump.png');
            this.shader = new MyShader( vertexShader, fragmentShader, {
                texture1: { type: 'sampler2D', value: texture1 },
                bumpmap: { type: 'sampler2D', value: texture2 },
                time: { type: 'float', value: 0.0 }
            });
            
            this.waitForShaders();
            this.add(this.powerup);
            this.animateRotation();

    }

    /**
     * @method
     * Creates a bounding volume for collision detection.
     */
    createBoundingVolume(){
        this.matrixWorldNeedsUpdate = true;
        this.updateMatrixWorld(true);
        this.powerupBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.powerupBB.setFromObject(this.powerup, true);
    }

    /**
     * @method
     * Retrieves the bounding volume of the power-up.
     * @returns {THREE.Box3} The bounding box for collision detection.
     */
    getBoundingVolume(){
        return this.powerupBB;
    }

    /**
     * @method
     * Waits for shaders to load and applies them to the power-up material.
     */
    waitForShaders() {
        if (!this.shader.ready) {
            setTimeout(this.waitForShaders.bind(this), 100);
            return;
        }
        this.powerup.material = this.shader.material;
        this.powerup.material.needsUpdate = true;
    }

    /**
     * @method
     * Animates the rotation of the power-up and updates shader time uniforms.
     */
    animateRotation() {
        const clock = new THREE.Clock();
        const update = () => {
            const elapsedTime = clock.getElapsedTime();
            this.shader.updateUniformsValue('time', elapsedTime);  // Pass the time to shader
            requestAnimationFrame(update);
        };
        update();
    }

    /**
     * @method
     * Calculates and returns the effective distance for interactions based on width.
     * @returns {number} The interaction distance.
     */
    getDistance(){
        return (2 * this.width);
    }

}
export { MyPowerUp };
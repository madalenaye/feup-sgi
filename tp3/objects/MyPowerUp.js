import * as THREE from 'three';
import { MyShader } from './MyShader.js';
class MyPowerUp extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
            super();
            this.width = parameters.width;

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

    createBoundingVolume(){
        this.matrixWorldNeedsUpdate = true;
        this.updateMatrixWorld(true);
        this.powerupBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.powerupBB.setFromObject(this.powerup, true);
    }

    getBoundingVolume(){
        return this.powerupBB;
    }

    waitForShaders() {
        if (!this.shader.ready) {
            setTimeout(this.waitForShaders.bind(this), 100);
            return;
        }
        this.powerup.material = this.shader.material;
        this.powerup.material.needsUpdate = true;
    }
    animateRotation() {
        const clock = new THREE.Clock();
        const update = () => {
            const elapsedTime = clock.getElapsedTime();
            this.shader.updateUniformsValue('time', elapsedTime);  // Pass the time to shader
            requestAnimationFrame(update);
        };
        update();
    }

}
export { MyPowerUp };
import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
            super();
            this.width = parameters.width;

            this.powerup = new THREE.BoxGeometry(this.width, this.width, this.width);
            this.powerup = new THREE.Mesh(this.powerup, material);
            this.powerup.rotation.set(Math.PI/4, 0, Math.PI/4);
          
            const vertexShader = 'shaders/obstacle.vert';
            const fragmentShader = 'shaders/obstacle.frag';
            this.shader = new MyShader( vertexShader, fragmentShader, {
                time: { type: 'float', value: 0.0 },         // Tracks time for animation
                amplitude: { type: 'float', value: 0.2 },   // Adjust pulsation intensity
            });
            
            this.add(this.powerup);
            this.waitForShaders();

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
        this.animatePulsation();
    }
    animatePulsation() {
        const clock = new THREE.Clock();
        console.log("animatePulsation");
        const update = () => {
            const elapsedTime = clock.getElapsedTime();
            this.shader.updateUniformsValue('time', elapsedTime);
            requestAnimationFrame(update);
        };
        update();
    }
}
export { MyPowerUp };
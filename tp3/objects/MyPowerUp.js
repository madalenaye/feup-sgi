import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
            super();
            this.width = parameters.width;

            this.powerup = new THREE.BoxGeometry(this.width, this.width, this.width);
            this.powerup = new THREE.Mesh(this.powerup, material);
            this.powerup.rotation.set(Math.PI/4, 0, Math.PI/4);
          
            this.add(this.powerup);

    }
}
export { MyPowerUp };
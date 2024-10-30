import * as THREE from 'three';

class CeilingLight extends THREE.Object3D{
    constructor(target){
        super();
        this.target = target;
        this.light = new THREE.SpotLight(0xffffff, 1, 100);
        this.light.target = this.target;
        this.light.castShadow = true;
    }

    build(){
        this.lightBulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), new THREE.MeshStandardMaterial({color: 0xffffff}));
        this.lightBulb.castShadow = true;

        this.lightBase = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 32), new THREE.MeshStandardMaterial({color: 0x000000}));
        this.lightBase.position.y = 0.2;
        this.lightBase.castShadow = true;
        this.add(this.lightBase);
        this.add(this.lightBulb);

        this.lightCord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.2, 32), new THREE.MeshStandardMaterial({color: 0x000000}));
        this.lightCord.position.y = 0.6;
        this.lightCord.castShadow = true;
        this.add(this.lightCord);
    }
}

export { CeilingLight };
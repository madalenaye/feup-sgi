import * as THREE from 'three';

class Cake extends THREE.Object3D{

    constructor(radius = 1, height = 1, material = null) {

        super();

        this.radius = radius;
        this.height = height;
        
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        
        this.cakeMesh = new THREE.Mesh(geometry, material || new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        }));
    
        this.add(this.cakeMesh);
        
    }

}

export { Cake };
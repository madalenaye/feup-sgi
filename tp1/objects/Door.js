import * as THREE from 'three';


class Door extends THREE.Object3D{
    constructor(){
        super();
        this.doorMaterial = new THREE.MeshStandardMaterial({color: 0x7a5230});
        this.door = new THREE.BoxGeometry(1, 2, 0.1);
        this.doorMesh = new THREE.Mesh(this.door, this.doorMaterial);
        this.add(this.doorMesh)
    }
}

export { Door };
import * as THREE from "three";

class MyBillboardBalloon extends THREE.Object3D {
    constructor(material){
        super();
        this.material = material;
        this.geometry = new THREE.PlaneGeometry(10, 10);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.add(this.mesh);
    }
}

export { MyBillboardBalloon };
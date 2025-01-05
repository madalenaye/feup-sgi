import * as THREE from "three";

class MyBillboardBalloon extends THREE.Object3D {
    constructor(app, material){
        super();
        this.material = material;
        this.app = app;
        this.geometry = new THREE.PlaneGeometry(15, 15);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.mesh.lookAt(this.app.activeCamera.position);   
        this.add(this.mesh);
    }
}

export { MyBillboardBalloon };
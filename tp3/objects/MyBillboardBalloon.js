import * as THREE from "three";

class MyBillboardBalloon extends THREE.Object3D {
    constructor(app, material){
        super();
        this.material = material;
        this.billboard = new THREE.Group();
        this.app = app;
        this.geometry = new THREE.PlaneGeometry(15, 15);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        //this.mesh.lookAt(this.app.activeCamera.position);   
        this.billboard.add(this.mesh);
        this.add(this.billboard);
    }
}

export { MyBillboardBalloon };
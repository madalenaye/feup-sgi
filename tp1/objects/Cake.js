import * as THREE from 'three';

class Cake extends THREE.Object3D{

    constructor(radius, height, angle, topMaterial) {

        super();

        this.radius = radius
        this.height = height
        this.angle = 2*Math.PI - angle        
        // cake
        this.cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, this.angle)
        this.cakeMesh = new THREE.Mesh(this.cake, topMaterial)
        this.add(this.cakeMesh)

        // cake planes
        this.plane = new THREE.PlaneGeometry(this.radius, this.height,1,1)
        this.planeAMesh = new THREE.Mesh(this.plane, topMaterial)
        this.planeBMesh = new THREE.Mesh(this.plane, topMaterial)

        this.planeAMesh.position.x = Math.sin(this.angle) * (this.radius / 2);
        this.planeAMesh.position.z = Math.cos(this.angle) * (this.radius / 2);
        this.planeBMesh.position.z = this.radius / 2;
        this.planeAMesh.rotateY(Math.PI / 2 + this.angle);
        this.planeBMesh.rotateY(-Math.PI / 2);

        this.add(this.planeAMesh)
        this.add(this.planeBMesh)
    }

}

export { Cake }
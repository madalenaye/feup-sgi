import * as THREE from 'three';

class Plate extends THREE.Object3D{
    constructor(radius, segments){
        super();
        this.radius = radius
        this.segments = segments
        
        this.plate = new THREE.CylinderGeometry(this.radius * 1.5, this.radius, this.radius / 4, this.segments, 1, true)
        this.plateMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: this.plateShininess, side: THREE.DoubleSide});
        this.plateMesh = new THREE.Mesh(this.plate, this.plateMaterial)

        this.plateBase = new THREE.CylinderGeometry(this.radius, this.radius, 0.0001, this.segments)
        this.plateBaseMesh = new THREE.Mesh(this.plateBase, this.plateMaterial)
        this.plateBaseMesh.position.y = - this.radius / 8
        
        this.add(this.plateBaseMesh)
        this.add(this.plateMesh)
    }

}

export { Plate };
import * as THREE from 'three';


class Door extends THREE.Object3D{
    constructor(width, height){
        super();
        this.width = width;
        this.height = height;
        this.doorTexture = new THREE.TextureLoader().load('textures/light_wood.jpg');
        this.doorTexture.wrapS = THREE.RepeatWrapping;
        this.doorTexture.wrapT = THREE.RepeatWrapping;
        this.doorTexture.repeat.set(1, 1);
        this.doorMaterial = new THREE.MeshStandardMaterial({ map: this.doorTexture, side: THREE.FrontSide, opacity: 1, transparent: true });
        this.doorGlass = new THREE.MeshPhysicalMaterial({color: "#ffffff", transmission: 1, thickness: 1.5, roughness: 0.07, envMapIntensity: 1.5});
        
        this.door = new THREE.BoxGeometry(this.width, this.height, 0.1);
        this.doorMesh = new THREE.Mesh(this.door, this.doorMaterial);
        this.doorMesh.rotation.y = Math.PI / 2;
        this.doorMesh.position.set(0, this.height / 2 + 0.05, 0);
        this.add(this.doorMesh)

        this.glass = new THREE.BoxGeometry(this.width/1.45, this.height/2.3, 0.2);
        this.glassMesh = new THREE.Mesh(this.glass, this.doorGlass);
        this.glassMesh.rotation.y = Math.PI / 2;
        this.glassMesh.position.set(0.015, this.height / 2 + 0.95, 0);
        this.add(this.glassMesh)

        this.doorHandle = new THREE.BoxGeometry(0.15, 0.3, 0.02);
        this.doorHandleMaterial = new THREE.MeshStandardMaterial({ color: "#dedcdc" });
        this.doorHandleMesh = new THREE.Mesh(this.doorHandle, this.doorHandleMaterial);
        this.doorHandleMesh.rotation.y = Math.PI / 2;
        this.doorHandleMesh.position.set(0.1, this.height / 2 - 0.12, this.width / 2 - 0.24);
        this.add(this.doorHandleMesh);

        this.doorKnob = new THREE.TorusGeometry(0.03, 0.02, 16, 100);
        this.doorKnobMesh = new THREE.Mesh(this.doorKnob, this.doorHandleMaterial);
        this.doorKnobMesh.rotation.y = Math.PI / 2;
        this.doorKnobMesh.position.set(0.1, this.height / 2 - 0.12, this.width / 2 - 0.24);
        this.add(this.doorKnobMesh);

        this.doorKnob2 = new THREE.SphereGeometry(0.05, 16, 100);
        this.doorKnobMesh2 = new THREE.Mesh(this.doorKnob2, this.doorHandleMaterial);
        this.doorKnobMesh2.rotation.y = Math.PI / 2;
        this.doorKnobMesh2.position.set(0.14, this.height / 2 - 0.12, this.width / 2 - 0.24);
        this.add(this.doorKnobMesh2);
    
    }
}

export { Door };
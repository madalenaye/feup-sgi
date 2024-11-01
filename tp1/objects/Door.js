import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 


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
        this.doorGlass = new THREE.MeshPhysicalMaterial({color: "#ffffff", transmission: 1, thickness: 1.5, roughness: 0.07, envMapIntensity: 1.5, reflectivity:0});
        
        this.door = new THREE.BoxGeometry(this.width, this.height, 0.1);
        this.doorMesh = new THREE.Mesh(this.door, this.doorMaterial);
        shadowDefinitions.objectShadow(this.doorMesh, true, true);
        this.doorMesh.rotation.y = Math.PI / 2;
        this.doorMesh.position.set(0, this.height / 2 + 0.05, 0);
        this.add(this.doorMesh)

        this.glass = new THREE.BoxGeometry(this.width/1.45, this.height/2.3, 0.15);
        this.glassMesh = new THREE.Mesh(this.glass, this.doorGlass);
        //shadowDefinitions.objectShadow(this.glassMesh, true, true);
        this.glassMesh.rotation.y = Math.PI / 2;
        this.glassMesh.position.set(0.005, this.height / 2 + 0.95, 0);
        this.add(this.glassMesh)

        this.doorHandleMaterial = new THREE.MeshStandardMaterial({ color: "#ebebeb" });

        this.doorBase = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 50);
        this.doorBaseMesh = new THREE.Mesh(this.doorBase, this.doorHandleMaterial);
        shadowDefinitions.objectShadow(this.doorBaseMesh, true, true);
        this.doorBaseMesh.rotation.z = Math.PI / 2;
        this.doorBaseMesh.position.set(0.06, this.height / 2 - 0.1, this.width / 2 - 0.25);
    

        this.doorHandleHelper = new THREE.CylinderGeometry(0.025, 0.025, 0.2, 50);
        this.doorHandleHelperMesh = new THREE.Mesh(this.doorHandleHelper, this.doorHandleMaterial);
        shadowDefinitions.objectShadow(this.doorHandleHelperMesh, true, true);
        this.doorHandleHelperMesh.rotation.z = Math.PI / 2;
        this.doorHandleHelperMesh.position.set(0.08, this.height / 2 - 0.1, this.width / 2 - 0.25);

        this.doorHandle = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 50);
        this.doorHandleMesh = new THREE.Mesh(this.doorHandle, this.doorHandleMaterial);
        shadowDefinitions.objectShadow(this.doorHandleMesh, true, true);
        this.doorHandleMesh.rotation.x = -Math.PI / 2;
        this.doorHandleMesh.position.set(0.16, this.height / 2 - 0.1, this.width / 2 - 0.45);

        this.doorHandleGroup = new THREE.Group();
        this.doorHandleGroup.add(this.doorBaseMesh);
        this.doorHandleGroup.add(this.doorHandleHelperMesh);
        this.doorHandleGroup.add(this.doorHandleMesh);
        this.add(this.doorHandleGroup);

        this.otherDoorHandleGroup = this.doorHandleGroup.clone();
        this.otherDoorHandleGroup.rotation.y = -Math.PI;
        this.otherDoorHandleGroup.rotation.x = Math.PI;
        this.otherDoorHandleGroup.position.set(0, this.height - 0.2, this.width/2 - 1.5);
        this.add(this.otherDoorHandleGroup);
    
    }
}

export { Door };
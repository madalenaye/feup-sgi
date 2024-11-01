/**
 * @file CoffeeMachine.js
 * @class CoffeeMachine
 * @extends THREE.Object3D
 * @desc This class aims to represent a CoffeeMachine. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a coffee machine composed of many objects, including boxes, cylinders, torus, spheres, etc.
 */

class CoffeeMachine extends THREE.Object3D{

    /**
     * Constructs an object representing a coffee machine
     * @constructor
     * @param {number} positionX - Position of the machine along the x-axis.
     * @param {number} positionY - Position of the machine along the y-axis.
     * @param {number} positionZ - Position of the machine along the z-axis.
     * @param {number} scale - Scale factor to adjust the size of the machine.
     */
    constructor(positionX, positionY, positionZ, scale = 1) {

        super();
        this.positionX = positionX;
        this.positionY = positionY;
        this.positionZ = positionZ;

        this.position.set(positionX, positionY, positionZ);
        this.scale.set(scale, scale, scale);

        // Machine main body
        const boxGeometry = new THREE.BoxGeometry(0.5, 1, 1);
        const material2 = new THREE.MeshPhongMaterial({ color: 0xeb301e, shininess: 3,specular: 0xeb301e });
        const baseBox = new THREE.Mesh(boxGeometry, material2);
        shadowDefinitions.objectShadow(baseBox);

        baseBox.position.y = 0;
        this.add(baseBox);

        // Top: Half Cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32, 1, false, 0, Math.PI);
        const halfCylinder = new THREE.Mesh(cylinderGeometry, material2);
        shadowDefinitions.objectShadow(halfCylinder);
        halfCylinder.position.y = 0.5;
        halfCylinder.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        this.add(halfCylinder);

        // Exit nozzle
        const sphereGeometry = new THREE.SphereGeometry(0.08, 32, 16);
        const material1 = new THREE.MeshPhongMaterial({specular:"#b4aaaa", color: 0x1a1717, shininess: 3 });
        const sphere = new THREE.Mesh(sphereGeometry, material1);
        shadowDefinitions.objectShadow(sphere, false, true);
        sphere.rotation.x = Math.PI / 2;
        sphere.position.set(0, 0.5, 0.5);
        sphere.scale.set(1, 1.7, 1);
        baseBox.add(sphere);

        const spoutGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32, 1, true);
        const spoutMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
        const spout = new THREE.Mesh(spoutGeometry, spoutMaterial);
        shadowDefinitions.objectShadow(spout, false, true);
        spout.rotation.x = Math.PI / 2;
        spout.position.set(0, 0.03, 0.06);
        sphere.add(spout);

        // Control Buttons
        const buttonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.006, 32);
        const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x4f3b3b });
        const button1 = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button1.position.set(-0.05, 0.75, -0.30);
        baseBox.add(button1);

        const button2 = button1.clone();
        button2.position.set(0.05, 0.75, -0.30);
        baseBox.add(button2);

        // Capsule
        const semicircleGeometry2 = new THREE.CircleGeometry(0.07, 32, 0, Math.PI);
        const material8 = new THREE.MeshStandardMaterial({ color: 0x1a1717, side: THREE.DoubleSide });
        const semicircle2 = new THREE.Mesh(semicircleGeometry2, material8);
        semicircle2.rotation.x = -Math.PI / 2;
        semicircle2.position.set(0, 0.755, 0.5);
        semicircle2.scale.set(0.8, 1.5, 0.8);
        baseBox.add(semicircle2);

        // Handle to open the machine
        const torusGeometry = new THREE.TorusGeometry(0.3, 0.02, 18, 100, 2 * Math.PI);
        const torusMaterial = new THREE.MeshPhongMaterial({specular:"#685a5a", color: 0x1a1717, shininess: 3, side: THREE.DoubleSide  });
        const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
        shadowDefinitions.objectShadow(torusMesh, false, true);
        torusMesh.rotation.x = Math.PI / 2;
        torusMesh.position.set(0, 0.5, 0.32);
        torusMesh.scale.set(1, 1.5, 1);
        baseBox.add(torusMesh);

        // Plastic net
        const netGeometry = new THREE.BoxGeometry(0.42, 0.001, 0.5);
        const netBox = new THREE.Mesh(netGeometry, torusMaterial);
        netBox.rotation.x = Math.PI / 2;
        netBox.position.z = 0.51;
        baseBox.add(netBox);

        // Water Tank
        const waterTankGeometry = new THREE.BoxGeometry(0.3, 1, 0.2);
        const waterTankMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 });
        const waterTank = new THREE.Mesh(waterTankGeometry, waterTankMaterial);
        shadowDefinitions.objectShadow(waterTank, true, false);
        waterTank.position.set(0, 0.01, -0.60);
        baseBox.add(waterTank);

        // Tank caps
        const capGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.2);
        const capMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1717 });
        const topCap = new THREE.Mesh(capGeometry, capMaterial);
        //shadowDefinitions.objectShadow(topCap);
        topCap.position.set(0, 0.5, 0);
        waterTank.add(topCap);

        const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
        //shadowDefinitions.objectShadow(bottomCap);
        bottomCap.position.set(0, -0.5, 0);
        waterTank.add(bottomCap);

        // Cup holder
        const radius = 0.21;
        const widthSegments = 48;
        const heightSegments = 16;
        const phiLength = Math.PI / 2;

        const sphereGeometry2 = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, phiLength);
        const sphereSlice = new THREE.Mesh(sphereGeometry2, torusMaterial);
        shadowDefinitions.objectShadow(sphereSlice, false, true);

        const semicircleGeometry = new THREE.CircleGeometry(radius, 48, 0, Math.PI);
        const semicircle = new THREE.Mesh(semicircleGeometry, torusMaterial);
        shadowDefinitions.objectShadow(semicircle, false, true);
        semicircle.rotation.z = Math.PI / 2;
        sphereSlice.add(semicircle);
        sphereSlice.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
        sphereSlice.position.set(0, -0.23, 0.5);
        this.add(sphereSlice);
    }

}

export { CoffeeMachine };
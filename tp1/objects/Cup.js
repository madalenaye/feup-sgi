/**
 * @file Cup.js
 * @class Cup
 * @extends THREE.Object3D
 * @desc This class aims to represent a Cup. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc Represents a cup that contains coffee inside. The cup is composed of two cylinders and a torus.
 */

class Cup extends THREE.Object3D {

    /**
     * Constructs an object representing a cup.
     * @constructor
     * @param {number} radiusTop - The radius of the body of the cup.
     * @param {number} radiusBottom - The radius of the base of the cup.
     * @param {number} cupHeight - The height of the body of the cup.
     * @param {number} baseHeight - The height of the base of the cup.
     * @param {THREE.Material} material - The material to be applied to the body of the cup.
     * @param {number} positionX - The position of the cup along the x-axis.
     * @param {number} positionY - The position of the cup along the y-axis.
     * @param {number} positionZ - The position of the cup along the z-axis.
     * @param {boolean} show - Indicates whether the coffee inside the cup should be displayed.
     * @param {number} angleZ - The angle of rotation of the cup around the z-axis.
     */
    constructor(radiusTop, radiusBottom, cupHeight, baseHeight, material, positionX, positionY, positionZ, show, angleZ = 0) {
        super();

        const baseMaterial = new THREE.MeshPhongMaterial({color: 0xffa500,shininess: 200,side: THREE.DoubleSide });
        const baseGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, baseHeight, 32);
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        shadowDefinitions.objectShadow(baseMesh, false, true);
        baseMesh.position.y = baseHeight / 2;

        const bodyGeometry = new THREE.CylinderGeometry(radiusTop, radiusTop, cupHeight, 32, 1, true);
        const bodyMesh = new THREE.Mesh(bodyGeometry, material);
        shadowDefinitions.objectShadow(bodyMesh, false, true);
        bodyMesh.position.y = baseHeight + cupHeight / 2; 

        const cupGroup = new THREE.Group();
        cupGroup.add(bodyMesh);
        cupGroup.add(baseMesh);

        const material2 = new THREE.MeshStandardMaterial({ color: 0xffa500 });
        const handleRadius = baseHeight - 0.02; 
        const handleTube = 0.01;  
        const handleGeometry = new THREE.TorusGeometry(handleRadius, handleTube, 16, 100, Math.PI);
        const handleMesh = new THREE.Mesh(handleGeometry, material2);
        shadowDefinitions.objectShadow(handleMesh, false, true);
        handleMesh.position.set(-(radiusTop), baseHeight + (cupHeight / 2), 0); 
        handleMesh.rotation.z = Math.PI / 2; 

        cupGroup.add(handleMesh);

        if(show === true){
            const coffeeRadius = radiusTop; 
            const coffeeGeometry = new THREE.CircleGeometry(coffeeRadius, 32);

            const textureLoader = new THREE.TextureLoader();
            const coffeeTexture = textureLoader.load('Textures/coffee.jpg');
            const coffeeMaterial = new THREE.MeshStandardMaterial({
                map: coffeeTexture,
                side: THREE.DoubleSide
            });
            const coffeeMesh = new THREE.Mesh(coffeeGeometry, coffeeMaterial);
            shadowDefinitions.objectShadow(coffeeMesh,true, false);
            coffeeMesh.position.y = baseHeight + cupHeight - 0.05;
            coffeeMesh.rotation.x = Math.PI / 2;

            cupGroup.add(coffeeMesh);
        }
        else{
            cupGroup.rotation.x = (Math.PI/2);
            cupGroup.rotation.z = -(Math.PI/2 - angleZ);
        }

        cupGroup.position.set(positionX, positionY, positionZ);
        this.add(cupGroup);

    }

     /**
     * Method 
     * Method to create a coffee stain shape and return it as a mesh.
     * @method
     * @param {number} positionX - The x-coordinate position of the stain in the 3D scene.
     * @param {number} positionY - The y-coordinate position of the stain in the 3D scene.
     * @param {number} positionZ - The z-coordinate position of the stain in the 3D scene.
     * @returns {THREE.Mesh} The mesh representing the coffee stain, which can be added to the scene. 
     */
    createCoffeeStain(positionX, positionY, positionZ){
        const stainShape = new THREE.Shape();
        stainShape.moveTo(0, 0);
        stainShape.bezierCurveTo(0.5, 0.2, 1.5, 0.2, 1, 0);
        stainShape.bezierCurveTo(1.5, -0.5, 0.5, -0.5, 0, 0);
        
        const stainGeometry = new THREE.ShapeGeometry(stainShape);
        const textureLoader = new THREE.TextureLoader();
        const stainTexture = textureLoader.load('Textures/coffee.jpg');
        stainTexture.wrapS = THREE.MirroredRepeatWrapping;
        stainTexture.wrapT = THREE.MirroredRepeatWrapping;
        stainTexture.repeat.set(3, 1);
        stainTexture.offset.set(0, 0); 

        const stainMaterial = new THREE.MeshStandardMaterial({ map: stainTexture, transparent: true, opacity: 0.6 });
        const stainMesh = new THREE.Mesh(stainGeometry, stainMaterial);
        
        stainMesh.position.set(positionX, positionY, positionZ);
        stainMesh.rotation.x = -Math.PI / 2; 
        return stainMesh;
    }

}

export { Cup };
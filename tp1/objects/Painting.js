/**
 * @file Painting.js
 * @class Painting
 * @extends THREE.Object3D
 * @desc This class aims to represent a Painting.
 */
import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a Painting made up of a plane and four frames made up of boxes.
 * The plane represents the image of the painting, while the frames are used to hold the painting
 */
class Painting extends THREE.Object3D{
    /**
     * Constructs an object representing a painting and its frames.
     * @constructor
     * @param {number} width - The width of the painting.
     * @param {number} height - The height of the painting.
     * @param {number} depth - The depth of the frames.
     * @param {string} imagePath - The path to the image of the painting.
     */
    constructor(width, height, depth, imagePath){
        super();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.imagePath = imagePath ?? null;

        this.woodTexture = new THREE.TextureLoader().load('textures/wood.jpg');
        this.woodTexture.wrapS = THREE.RepeatWrapping;
        this.woodTexture.wrapT = THREE.RepeatWrapping;

        const textureLoader = new THREE.TextureLoader();
        this.imageTexture = textureLoader.load(imagePath);

        this.paintingMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 50, side: THREE.FrontSide, map: this.woodTexture});
        this.imageMaterial = new THREE.MeshBasicMaterial({map: this.imageTexture});

        this.back = new THREE.PlaneGeometry(this.width, this.height);
        this.backMesh = new THREE.Mesh(this.back, this.paintingMaterial);

        this.frameA = new THREE.BoxGeometry(this.width, this.depth, this.depth);
        this.frameB = new THREE.BoxGeometry(this.height, this.depth, this.depth);
        this.image = new THREE.PlaneGeometry(this.width, this.height);

        this.imageMesh = new THREE.Mesh(this.image, this.imageMaterial);
        this.topFrameMesh = new THREE.Mesh(this.frameA, this.paintingMaterial);
        this.bottomFrameMesh = new THREE.Mesh(this.frameA, this.paintingMaterial);
        this.leftFrameMesh = new THREE.Mesh(this.frameB, this.paintingMaterial);
        this.rightFrameMesh = new THREE.Mesh(this.frameB, this.paintingMaterial);


        this.backMesh.rotateY(Math.PI);
        this.add(this.imageMesh);
        this.add(this.topFrameMesh);
        this.add(this.bottomFrameMesh);
        this.add(this.leftFrameMesh);
        this.add(this.rightFrameMesh);
        
        this.leftFrameMesh.rotateZ(Math.PI / 2);
        this.rightFrameMesh.rotateZ(Math.PI / 2);
        this.topFrameMesh.position.y = this.height / 2;
        this.bottomFrameMesh.position.y = -this.height / 2;
        this.leftFrameMesh.position.x = -this.width / 2 + this.depth / 2;
        this.rightFrameMesh.position.x = this.width / 2 - this.depth / 2;
        this.topFrameMesh.position.z = this.depth / 2;
        this.bottomFrameMesh.position.z = this.depth / 2;
        this.leftFrameMesh.position.z = this.depth / 2;
        this.rightFrameMesh.position.z = this.depth / 2;

        this.add(this.backMesh);
    }
}

export { Painting };
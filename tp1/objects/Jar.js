/**
 * @file Jar.js
 * @class Jar
 * @extends THREE.Object3D
 * @desc This class aims to represent a jar.
 */
import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';

/**
 * @class
 * @classdesc Represents a jar that consists of a front and a back surface. These surfaces are represented by a NURBS surface.
 * The jar is made up of a glass texture.
 */
class Jar extends THREE.Object3D{
    /**
     * Constructs an object representing a jar.
     * @constructor
     */
    constructor(){
        super();
        this.jarTexture = new THREE.TextureLoader().load("Textures/glass.png");
        this.jarMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, map: this.jarTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.8});
        this.controlPoints = [
            // U = 0
            [
                // V = 0..1;
                [-0.1, -0.5, 0.0, 1],
                [-0.5, -0.5, 0.0, 1],
                [-0.5, -0.4, 0.0, 1],
                [-0.5, 0.4, 0.0, 1],
                [-0.5, 0.5, 0.0, 1],
                [-0.5 * 0.8, 0.5, 0.0, 1]
            ],

            // U = 1
            [
                // V = 0..1
                [-0.1, -0.5, 0, 1],
                [-0.5, -0.5, 2 / 3, 1],
                [-0.5, -0.4, 2 / 3, 1],
                [-0.5, 0.4, 2 / 3, 1],
                [-0.5, 0.5, 2 / 3, 1],
                [-0.5 * 0.8, 0.5, 0.8 * (2 / 3), 1]
            ],

            // U = 2
            [
                // V = 0..1
                [0.1, -0.5, 0, 1],
                [0.5, -0.5, 2 / 3, 1],
                [0.5, -0.4, 2 / 3, 1],
                [0.5, 0.4, 2 / 3, 1],
                [0.5, 0.5, 2 / 3, 1],
                [0.5 * 0.8, 0.5, 0.8 * (2 / 3), 1]
            ],

            [
                // V = 0..1
                [0.1, -0.5, 0.0, 1],
                [0.5, -0.5, 0.0, 1],
                [0.5, -0.4, 0.0, 1],
                [0.5, 0.4, 0.0, 1],
                [0.5, 0.5, 0.0, 1],
                [0.5 * 0.8, 0.5, 0.0, 1]
            ]
        ];
        this.builder = new MyNurbsBuilder();
        this.nurbsSurface = this.builder.build(this.controlPoints, 3, 5, 20, 20, this.jarMaterial);
        this.front = new THREE.Mesh(this.nurbsSurface, this.jarMaterial);
        this.back = new THREE.Mesh(this.nurbsSurface, this.jarMaterial);
        this.back.rotation.y = Math.PI;
        this.add(this.front)
        this.add(this.back)
    }

}
export { Jar };
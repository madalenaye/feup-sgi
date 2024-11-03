/**
 * @file Spring.js
 * @class Spring
 * @extends THREE.Object3D
 * @desc This class aims to represent a Spring.
 */
import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 
/**
 * @class
 * @classdesc Represents a Spring made up of a CatmullRomCurve3 and a Line.
 * The CatmullRomCurve3 represents the curve of the spring, while the Line is used to draw the spring.
 */
class Spring extends THREE.Object3D{
    /**
     * Constructs an object representing a spring.
     * @constructor
     * @param {number} radius - The radius of the spring.
     * @param {number} npoints - The number of points for each coil of the spring.
     * @param {number} step - The step between each coil of the spring.
     * @param {number} ncoils - The number of coils of the spring.
     */
    constructor(radius, npoints, step, ncoils){
        super();
        this.radius = radius;
        this.npoints = npoints;
        this.step = step;
        this.ncoils = ncoils;

        this.points = [];
        this.height = this.step / this.npoints;

        for (let coil = 0; coil < this.ncoils; coil++){
            for (let i = 0; i < this.npoints; i++){
                let angle = (i / this.npoints) * 2 * Math.PI;
                let x = this.radius * Math.cos(angle);
                let y = this.height * i + coil * this.step;
                let z = this.radius * Math.sin(angle);
                this.points.push(new THREE.Vector3(x, y, z));
            }
        }
        this.curve = new THREE.CatmullRomCurve3(this.points);
        this.geometry = new THREE.BufferGeometry().setFromPoints(this.curve.getPoints(this.npoints * this.ncoils));

        this.springMaterial = new THREE.LineBasicMaterial({ color: 0xcfcfcf});
        this.spring = new THREE.Line(this.geometry, this.springMaterial);
        shadowDefinitions.objectShadow(this.spring);

        this.add(this.spring);

    }
}

export { Spring };
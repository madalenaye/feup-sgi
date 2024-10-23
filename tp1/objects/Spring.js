import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';


class Spring extends THREE.Object3D{
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

        this.springMaterial = new THREE.LineBasicMaterial({ color: 0xffffff});
        this.spring = new THREE.Line(this.geometry, this.springMaterial);

        this.add(this.spring);

    }
}

export { Spring };
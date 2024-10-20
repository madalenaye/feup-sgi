/**
 * @file Beetle.js
 * @class Beetle
 * @extends THREE.Object3D
 * @desc This class aims to represent a Beetle. 
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a Beetle made up of 5 circular arcs. In turn, the circumference arcs are made from cubic Bezier curves
 */

class Beetle extends THREE.Object3D{

    constructor(positionX, positionY, positionZ, scale, numberOfSamples) {

        super();

        //Curve 1
        const ratio1 = 8;
        const h1 = (4/3) * (Math.sqrt(2) -1) * ratio1;

        //Curve 2
        const ratio2 = 4;
        const h2 = (4/3) * (Math.sqrt(2) -1) * ratio2;

        //Curve 3
        const ratio3 = 4;
        const h3 = (4/3) * (Math.sqrt(2) -1) * ratio3;

        //Curve 4
        const ratio4 = 3;
        const h4 = (4/3) * ratio4;

        //Curve 5
        const ratio5 = 3;
        const h5 = (4/3) * ratio5;

        const curvesData = [
            {points : [new THREE.Vector3(0, ratio1 , 0), new THREE.Vector3(h1, 8, 0), new THREE.Vector3(ratio1, h1, 0), new THREE.Vector3(ratio1, 0, 0)]} ,
            {points : [new THREE.Vector3(0, ratio1 , 0), new THREE.Vector3(-h2, ratio1, 0), new THREE.Vector3(-ratio2, ratio1 - h2, 0), new THREE.Vector3(-ratio2, ratio2, 0)]} ,
            {points : [new THREE.Vector3(-ratio2, ratio2, 0), new THREE.Vector3(-ratio2 - h3, ratio2, 0), new THREE.Vector3(-ratio1, ratio2 - h3, 0), new THREE.Vector3(-ratio1, 0, 0)]} ,
            {points : [new THREE.Vector3(ratio1, 0, 0), new THREE.Vector3(ratio1, h4, 0), new THREE.Vector3(ratio1 - (2 * ratio4), h4, 0), new THREE.Vector3(ratio1 - (2 * ratio4), 0, 0)]} ,
            {points : [new THREE.Vector3(-(ratio1 - (2*ratio5)), 0, 0), new THREE.Vector3(-(ratio1 - (2*ratio5)), h5, 0), new THREE.Vector3(-ratio1, h5, 0), new THREE.Vector3(-ratio1, 0, 0)]} 
        ];

        curvesData.forEach((data) => {
            const curve = this.createCurve(data.points, numberOfSamples, positionX, positionY, positionZ, scale);
            this.add(curve);
        });
    }

    createCurve(points, numberOfSamples, positionX, positionY, positionZ, scale) {
        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        const sampledPoints = curve.getPoints(numberOfSamples);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x4fc4f0 });
        const lineObj = new THREE.Line(curveGeometry, lineMaterial);
        lineObj.position.set(positionX, positionY, positionZ);
        lineObj.scale.set(scale, scale, scale);
        lineObj.rotation.y = -Math.PI / 2;
        return lineObj;
    }

}

export { Beetle };
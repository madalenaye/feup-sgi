/**
 * @file Beetle.js
 * @class Beetle
 * @extends THREE.Object3D
 * @desc This class aims to represent a Beetle. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js';

/**
 * @class
 * @classdesc Represents a Beetle made up of 5 circular arcs. In turn, the circumference arcs are made from cubic Bezier curves
 */

class Beetle extends THREE.Object3D{

    /**
     * Constructs an object representing a Beetle.
     * @constructor
     * @param {number} positionX - The Beetle's position on the x-axis.
     * @param {number} positionY - The Beetle's position on the y-axis.
     * @param {number} positionZ - The Beetle's position on the z-axis.
     * @param {number} scale - Scaling factor relative to the Beetle's size.
     * @param {number} numberOfSamples - Level of detail for the curves of the Beetle's shape.
     */
    constructor(positionX, positionY, positionZ, scale, numberOfSamples) {

        super();
         
        this.frameGroup = new THREE.Group();

        const paintingWidth = 4.5;
        const paintingHeight = 3;
        const paintingDepth = 0.1;

        const paintingGeometry = new THREE.BoxGeometry(paintingWidth, paintingHeight, paintingDepth);
        const paintingMaterial = new THREE.MeshBasicMaterial({ color: 0xecf2f4 }); 
        const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
        shadowDefinitions.objectShadow(painting);
        painting.position.set(0, 0, 0);
        this.frameGroup.add(painting);

        const frameThickness = 0.1;
        const frameDepth = 0.2;

        const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

        const frameTopBottomGeometry = new THREE.BoxGeometry(paintingWidth + frameThickness * 2, frameThickness, frameDepth);
        const frameSideGeometry = new THREE.BoxGeometry(frameThickness, paintingHeight + frameThickness * 2, frameDepth);

        const frameTop = new THREE.Mesh(frameTopBottomGeometry, frameMaterial);
        shadowDefinitions.objectShadow(frameTop);
        frameTop.position.set(0, (paintingHeight / 2 + frameThickness / 2), 0);
        this.frameGroup.add(frameTop);

        const frameBottom = new THREE.Mesh(frameTopBottomGeometry, frameMaterial);
        shadowDefinitions.objectShadow(frameBottom);
        frameBottom.position.set(0, -(paintingHeight / 2 + frameThickness / 2), 0);
        this.frameGroup.add(frameBottom);

        const frameLeft = new THREE.Mesh(frameSideGeometry, frameMaterial);
        shadowDefinitions.objectShadow(frameLeft);
        frameLeft.position.set(-(paintingWidth / 2 + frameThickness / 2), 0, 0);
        this.frameGroup.add(frameLeft);

        const frameRight = new THREE.Mesh(frameSideGeometry, frameMaterial);
        shadowDefinitions.objectShadow(frameRight);
        frameRight.position.set((paintingWidth / 2 + frameThickness / 2), 0, 0);
        this.frameGroup.add(frameRight);

        this.frameGroup.position.set(positionX + 0.15, positionY + 0.7, positionZ);
        this.frameGroup.rotation.y = Math.PI / 2;
        this.add(this.frameGroup);

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
            const curve = this.createCurve(data.points, numberOfSamples, positionX + 0.2, positionY, positionZ, scale);
            this.add(curve);
        });
    }

    /**
     * Method to create a 3D curve based on control points and other parameters.
     * @method
     * @param {Array<THREE.Vector3>} points - Control points defining the shape of the curve. 
     * @param {number} numberOfSamples - Number of points sampled along the curve for higher detail.
     * @param {number} positionX - Position of the curve along the x-axis.
     * @param {number} positionY - Position of the curve along the y-axis.
     * @param {number} positionZ - Position of the curve along the z-axis.
     * @param {number} scale - Scale factor applied to the curve in all axes.
     * @returns {THREE.Line} - A line object representing the 3D curve
     */
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
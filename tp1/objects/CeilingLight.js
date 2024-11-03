/**
 * @file CeilingLight.js
 * @class CeilingLight
 * @extends THREE.Object3D
 * @desc This class aims to represent a CeilingLight. 
 */

import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

/**
 * @class
 * @classdesc A class for creating a ceiling light with a customisable light shape, colour, intensity, and shadow properties.
 */

class CeilingLight extends THREE.Object3D{

    /**
     * Constructs an object representing a Ceiling Light.
     * @constructor
     * @param {string|number} lightColor - The colour of the light (can be a hex value or colour name).
     * @param {number} innerRadius - The inner radius of the light shape.
     * @param {number} outerRadius - The outer radius of the light shape.
     * @param {number} lightIntensity - The intensity of the light.
     */
    constructor(lightColor, innerRadius, outerRadius, lightIntensity){
        super();
        this.lightColor = lightColor;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.lightIntensity = lightIntensity;


        const shape = new THREE.Shape();
        const angleStep = Math.PI / 5; 
        const startAngle = Math.PI / 2;

        for (let i = 0; i < 10; i++) {
            
            const radius = i % 2 === 0 ? outerRadius : innerRadius;


            const x = radius * Math.cos(startAngle + i * angleStep);
            const y = radius * Math.sin(startAngle + i * angleStep);

            if (i === 0) {
                shape.moveTo(x, y);  
            } else {
                shape.lineTo(x, y);  
            }
        }
        shape.closePath();

        const geometry = new THREE.ShapeGeometry(shape);
        this.lightMaterial = new THREE.MeshBasicMaterial({ color: "#cccccc", side: THREE.DoubleSide, opacity: 0.7 });
        this.lightMesh = new THREE.Mesh(geometry, this.lightMaterial);
        shadowDefinitions.objectShadow(this.lightMesh);
        this.add(this.lightMesh);

        this.light = new THREE.PointLight(this.lightColor, this.lightIntensity, 3, 2);
        shadowDefinitions.propertiesLightShadow(this.light);
        this.light.position.y = 0.02;
        this.add(this.light);
        
    }
}

export { CeilingLight };
import * as THREE from 'three';
import { shadowDefinitions } from '../utils/ShadowDefinitions.js'; 

class CeilingLight extends THREE.Object3D{
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
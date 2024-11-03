import * as THREE from 'three';

class CeilingLight extends THREE.Object3D{
    constructor(lightColor, innerRadius, outerRadius, lightIntensity){
        super();
        this.lightColor = lightColor;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.lightIntensity = lightIntensity;

        /*this.lightBase = new THREE.CylinderGeometry(this.radius, this.radius, 0.01, 50);
        this.lightMaterial = new THREE.MeshBasicMaterial({ color: "#cccccc" });
        this.lightMesh = new THREE.Mesh(this.lightBase, this.lightMaterial);

        this.add(this.lightMesh);*/

        const shape = new THREE.Shape();
        const angleStep = Math.PI / 5;  // 36 degrees in radians
        const startAngle = Math.PI / 2; // Start pointing up

        for (let i = 0; i < 10; i++) {
            // Calculate the radius for outer or inner points
            const radius = i % 2 === 0 ? outerRadius : innerRadius;

            // Calculate x and y position of each point
            const x = radius * Math.cos(startAngle + i * angleStep);
            const y = radius * Math.sin(startAngle + i * angleStep);

            if (i === 0) {
                shape.moveTo(x, y);  // Start at the first point
            } else {
                shape.lineTo(x, y);  // Draw a line to the next point
            }
        }
        shape.closePath();

        const geometry = new THREE.ShapeGeometry(shape);
        this.lightMaterial = new THREE.MeshBasicMaterial({ color: "#cccccc", side: THREE.DoubleSide, opacity: 0.7 });
        this.lightMesh = new THREE.Mesh(geometry, this.lightMaterial);
        this.add(this.lightMesh);

        this.light = new THREE.PointLight(this.lightColor, this.lightIntensity, 3, 2);
        this.light.position.y = 0.02;
        this.add(this.light);
        
    }
}

export { CeilingLight };
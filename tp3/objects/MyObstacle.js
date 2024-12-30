import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {

    constructor(parameters, material, castShadow, receiveShadow) {
        super();
        this.height = parameters.height;
        this.radius = parameters.radius;
        this.penalty = parameters.penalty;

        this.rocket = new THREE.Group();

        this.groupMasterCylinder = new THREE.Group();
        let masterCylinderGeo = new THREE.CylinderGeometry(this.radius, this.radius, this.height)
        let masterCylinder = new THREE.Mesh(masterCylinderGeo, material); 
        this.groupMasterCylinder.add(masterCylinder);

        this.rocket.add(this.groupMasterCylinder);

        this.groupIntermediateCylinder = new THREE.Group();
        let newHeight = this.height/15;
        let intermediateCylinderGeo = new THREE.CylinderGeometry(this.radius/1.2, this.radius/1.2, newHeight);
        let intermediateCylinder = new THREE.Mesh(intermediateCylinderGeo, material);
        intermediateCylinder.position.set(0, -(this.height/2 + newHeight/2), 0);
        this.groupIntermediateCylinder.add(intermediateCylinder);

        this.rocket.add(this.groupIntermediateCylinder);

        this.groupLowCylinder = new THREE.Group();
        let newHeight2 = this.height;
        let lowCylinderGeo = new THREE.CylinderGeometry(this.radius/1.2, this.radius, newHeight2);
        let lowCylinder = new THREE.Mesh(lowCylinderGeo, material);
        lowCylinder.position.set(0, -(newHeight/2 + newHeight2/2), 0);
        this.groupLowCylinder.add(lowCylinder);
        this.groupIntermediateCylinder.add(this.groupLowCylinder);

        this.groupSphere = new THREE.Group();
        let sphereGeometry = new THREE.SphereGeometry(this.radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
        let sphereMesh = new THREE.Mesh(sphereGeometry, material);
        sphereMesh.position.set(0, this.height/2, 0);
        this.groupSphere.add(sphereMesh);

        this.rocket.add(this.groupSphere);

        //Eye1
        this.groupEye1 = new THREE.Group();
        let eye1Geometry = new THREE.SphereGeometry(this.radius/6, 32, 16);
        let eyeMaterial = new THREE.MeshPhysicalMaterial({color: 0xf9f4f4, 
                                                          emissive: 0x101010, 
                                                          emissiveIntensity: 0.1, 
                                                          metalness: 0.0, 
                                                          roughness: 0.1,
                                                          clearcoat: 1.0, 
                                                          clearcoatRoughness: 0.05, 
                                                          wireframe: false})
        let eyeMesh1 = new THREE.Mesh(eye1Geometry, eyeMaterial);
        this.groupEye1.add(eyeMesh1);
        

        this.groupIris1 = new THREE.Group();
        let iris1Geometry = new THREE.SphereGeometry(this.radius/10, 32, 16)
        let irisMaterial = new THREE.MeshStandardMaterial({color: 0x101010, 
                                                           roughness: 0.5,  
                                                           metalness: 0.6,
                                                           emissive: 0x000000});
        let iris1Mesh = new THREE.Mesh(iris1Geometry, irisMaterial);
        iris1Mesh.position.set(0, 0.08,0);
        this.groupIris1.add(iris1Mesh);
        this.groupEye1.add(this.groupIris1);

        this.groupEye1.position.set(-this.radius/2.3, (this.height/2 + this.radius) - 0.1, this.radius/4);
        this.rocket.add(this.groupEye1);

        //Eye2
        this.groupEye2 = new THREE.Group();
        let eyeMesh2 = new THREE.Mesh(eye1Geometry, eyeMaterial);
        this.groupEye2.add(eyeMesh2);

        this.groupIris2 = new THREE.Group();
        let iris2Mesh = new THREE.Mesh(iris1Geometry, irisMaterial);
        iris2Mesh.position.set(0, 0.08,0);
        this.groupIris2.add(iris2Mesh);
        this.groupEye2.add(this.groupIris2);

        this.groupEye2.position.set(this.radius/2.3, (this.height/2 + this.radius) - 0.1, this.radius/4);
        this.rocket.add(this.groupEye2);


        this.rocket.castShadow = castShadow ?? false;
        this.rocket.receiveShadow = receiveShadow ?? false;

        this.obstacleBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.obstacleBB.setFromObject(this.rocket, true);

        this.add(this.rocket);
       
    }

    getBoundingVolume(){
        return this.obstacleBB;
    }

}

export { MyObstacle };

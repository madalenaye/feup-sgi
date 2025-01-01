import * as THREE from 'three';

class MyOutdoor extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        this.groupOutdoor = new THREE.Group();

        this.groupCylinder1 = new THREE.Group();
        let cylinder1Geo = new THREE.CylinderGeometry(0.5, 0.5, parameters.height);
        let cylinder1Mesh = new THREE.Mesh(cylinder1Geo, material);
        this.groupCylinder1.add(cylinder1Mesh);
        this.groupOutdoor.add(this.groupCylinder1);

        this.groupCylinder2 = new THREE.Group();
        this.groupCylinder2.position.set(parameters.width, 0, 0);
        let cylinder2Geo = new THREE.CylinderGeometry(0.5, 0.5, parameters.height);
        let cylinder2Mesh = new THREE.Mesh(cylinder2Geo, material);
        this.groupCylinder2.add(cylinder2Mesh);
        this.groupOutdoor.add(this.groupCylinder2);

        this.groupScreen = new THREE.Group();
        this.groupScreen.position.set(parameters.width/2 , parameters.height/2 - 5, 0);
        let boxGeo = new THREE.BoxGeometry(parameters.width - 1, 10, 0.5);
        let boxMaterial = new THREE.MeshStandardMaterial({color: 0xd3effa, metalness: 0.5, roughness: 0.5});
        let boxMesh = new THREE.Mesh(boxGeo, boxMaterial);
        this.groupScreen.add(boxMesh);
        this.groupOutdoor.add(this.groupScreen);

        let frameMaterial = new THREE.MeshStandardMaterial({color: 0x3d85a2, metalness: 0.5, roughness: 0.5});
        this.groupRightFrame = new THREE.Group();
        this.groupRightFrame.position.set(parameters.width/20,parameters.height/2 - 5, -0.33);
        let rightFrameGeo = new THREE.BoxGeometry(parameters.width/20, 10, 0.0);
        let rightFrameMesh = new THREE.Mesh(rightFrameGeo, frameMaterial);
        this.groupRightFrame.add(rightFrameMesh);
        this.groupOutdoor.add(this.groupRightFrame);

        this.groupLeftFrame = new THREE.Group();
        this.groupLeftFrame.position.set(parameters.width - parameters.width/20,parameters.height/2 - 5, -0.33);
        let leftFrameGeo = new THREE.BoxGeometry(parameters.width/20, 10, 0.0);
        let leftFrameMesh = new THREE.Mesh(leftFrameGeo, frameMaterial);
        this.groupLeftFrame.add(leftFrameMesh);
        this.groupOutdoor.add(this.groupLeftFrame);

        this.groupTopFrame = new THREE.Group();
        this.groupTopFrame.rotation.set(0, 0, Math.PI/2);
        this.groupTopFrame.position.set((parameters.width - parameters.width/20)/2, parameters.width/2 - (parameters.width/20)/2, -0.33);
        let topFrameGeo = new THREE.BoxGeometry(parameters.width/20, parameters.width, 0.0);
        let topFrameMesh = new THREE.Mesh(topFrameGeo, frameMaterial);
        this.groupTopFrame.add(topFrameMesh);
        this.groupOutdoor.add(this.groupTopFrame);

        this.groupBottomFrame = new THREE.Group();
        this.groupBottomFrame.rotation.set(0, 0, Math.PI/2);
        this.groupBottomFrame.position.set((parameters.width - parameters.width/20)/2, -2.12, -0.33);
        let bottomFrameGeo = new THREE.BoxGeometry(parameters.width/20, parameters.width, 0.0);
        let bottomFrameMesh = new THREE.Mesh(bottomFrameGeo, frameMaterial);
        this.groupBottomFrame.add(bottomFrameMesh);
        this.groupOutdoor.add(this.groupBottomFrame);

        
        this.groupOutdoor.castShadow = castShadow ?? false;
        this.groupOutdoor.receiveShadow = receiveShadow ?? false;

        this.add(this.groupOutdoor);

    }

}
export { MyOutdoor };
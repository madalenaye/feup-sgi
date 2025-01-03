import * as THREE from 'three';

class MyOutdoor2 extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        this.groupOutdoor2 = new THREE.Group();

        this.groupDisplay = new THREE.Group();
        let panelGeometry = new THREE.BoxGeometry(parameters.width, parameters.height, 0.4);
        let panelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        let panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
        this.groupDisplay.add(panelMesh);
        this.groupOutdoor2.add(this.groupDisplay);

        const supportWidth = 0.2; 
        const supportHeight = parameters.height / 2;
        const supportDepth = 0.4;

        const supportMaterial = material

        const createSupport = (x, y) => {
            const supportGeometry = new THREE.BoxGeometry(supportWidth, supportHeight, supportDepth);
            const supportMesh = new THREE.Mesh(supportGeometry, supportMaterial);
            supportMesh.position.set(x, -1.5*supportHeight, 0);
            supportMesh.castShadow = castShadow ?? false;
            supportMesh.receiveShadow = receiveShadow ?? false;
            this.groupOutdoor2.add(supportMesh);
        };

        createSupport(-parameters.width / 2 + supportWidth / 2, -parameters.width / 2);
        createSupport(parameters.width / 2 - supportWidth / 2, -parameters.width / 2);
        createSupport(-parameters.width / 4, -parameters.width / 2);
        createSupport(parameters.width / 4, -parameters.width / 2);

        this.groupOutdoor2.castShadow = castShadow ?? false;
        this.groupOutdoor2.receiveShadow = receiveShadow ?? false;

        this.add(this.groupOutdoor2);
    }

}
export { MyOutdoor2 };
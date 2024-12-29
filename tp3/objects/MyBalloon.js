import * as THREE from 'three';

class MyBalloon extends THREE.Object3D {

    constructor() {
        super();
        this.radius = 4;
        this.height = 7;
        this.texture = new THREE.TextureLoader().load('./scenes/textures/balloon_1.png');
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1, 1);

        this.material = new THREE.MeshStandardMaterial({ map: this.texture, roughness: 1, side: THREE.DoubleSide });
        this.buildBalloon();
    }
    buildBalloon() {

        this.groupBalloon = new THREE.Group();

        /* Basket */

        // Texture
        this.basketTexture = new THREE.TextureLoader().load('./scenes/textures/basket.png');
        this.basketTexture.wrapS = THREE.RepeatWrapping;
        this.basketTexture.wrapT = THREE.RepeatWrapping;
        this.basketTexture.repeat.set(1, 1);

        // Material
        this.basketMaterial = new THREE.MeshStandardMaterial({ map: this.basketTexture, roughness: 1, side: THREE.DoubleSide });
        
        const extrudeSettings = {
            depth: 1.5,
            amount : 2,
            steps : 1,
            bevelEnabled: false,
            curveSegments: 16
        };
        this.arcShape = new THREE.Shape();
        this.arcShape.absarc(0, 0, this.radius/4, 0, Math.PI * 2, 0, false);
        
        this.holePath = new THREE.Path();
        this.holePath.absarc(0, 0, this.radius/4 - 0.2, 0, Math.PI * 2, true);
        this.arcShape.holes.push(this.holePath);
        
        this.basketGeometry = new THREE.ExtrudeGeometry(this.arcShape, extrudeSettings);
        this.basket = new THREE.Mesh(this.basketGeometry, this.basketMaterial);
        this.basket.rotation.set(Math.PI/2, 0, 0);
        this.basket.position.set(0, extrudeSettings.depth, 0);

        this.basketGroup = new THREE.Group();
        this.basketGroup.add(this.basket);

        // Basket base
        this.basketBaseGeometry = new THREE.CylinderGeometry(this.radius/4, this.radius/4, 0.04, 32);
        this.basketBase = new THREE.Mesh(this.basketBaseGeometry, this.basketMaterial);
        this.basketBase.position.set(0, -0.02, 0);
        this.basketGroup.add(this.basketBase);

        /* Basket Strings */
        const numStrings = 5;
        const stringRadius = 0.05;
        const stringHeight = 1.5;

        this.stringGroup = new THREE.Group();
        const angleStep = 2 * Math.PI / numStrings;

        for (let i = 0; i < numStrings; i++){
            const angle = i * angleStep;
            const x = Math.cos(angle) * (this.radius/4 - 0.1);
            const z = Math.sin(angle) * (this.radius/4 - 0.1);

            const stringGeometry = new THREE.CylinderGeometry(stringRadius, stringRadius, stringHeight, 32);
            const string = new THREE.Mesh(stringGeometry, this.basketMaterial);
            string.position.set(x, extrudeSettings.depth + stringHeight/2, z);
            
            this.stringGroup.add(string);
        }
        this.basketGroup.add(this.stringGroup);

        /* Balloon */
        this.balloonGeometry = new THREE.SphereGeometry(this.radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
        this.balloon = new THREE.Mesh(this.balloonGeometry, this.material);
        this.balloon.position.set(0, this.height - 0.4, 0);
        this.groupBalloon.add(this.balloon);

        this.balloonBaseGeometry = new THREE.CylinderGeometry(this.radius * 0.81, this.radius/3, 1.5, 32, 32, true);
        this.balloonBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1 });
        this.balloonBase = new THREE.Mesh(this.balloonBaseGeometry, this.balloonBaseMaterial);
        this.balloonBase.position.set(0, this.height/2, 0);
        this.groupBalloon.add(this.balloonBase);
        this.groupBalloon.add(this.basketGroup);
        this.add(this.groupBalloon);

    }
}
export { MyBalloon };
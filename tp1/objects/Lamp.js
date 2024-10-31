import * as THREE from 'three';

class Lamp extends THREE.Object3D{

    constructor(target, lightColor){
        super();
        this.target = target;
        this.lightColor = lightColor;


        this.woodTexture = new THREE.TextureLoader().load('textures/light_wood.jpg');
        this.woodTexture.wrapS = THREE.RepeatWrapping;
        this.woodTexture.wrapT = THREE.RepeatWrapping;
        this.woodTexture.repeat.set(1, 1);
        this.woodMaterial = new THREE.MeshStandardMaterial({ map: this.woodTexture });

        this.lampTexture = new THREE.TextureLoader().load('textures/lamp.png');
        this.lampTexture.wrapS = THREE.RepeatWrapping;
        this.lampTexture.wrapT = THREE.RepeatWrapping;
        this.lampTexture.repeat.set(1, 1);
        this.lampMaterial = new THREE.MeshStandardMaterial({ map: this.lampTexture });

        this.lampBase = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 50);
        this.lampBaseMesh = new THREE.Mesh(this.lampBase, this.woodMaterial);
        this.add(this.lampBaseMesh);

        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.8, 0),
            new THREE.Vector3(0, 1.4, 0.05),
            new THREE.Vector3(0, 1.6, 0.27),
        ]);

        this.tubeGeometry = new THREE.TubeGeometry(this.curve, 32, 0.03, 8, false);
        this.lampPole = new THREE.Mesh(this.tubeGeometry, this.lampMaterial);
        this.lampPole.position.z = - 0.2

        this.lampHead = new THREE.CylinderGeometry(0.11, 0.11, 0.1, 32);
        this.lampHeadMesh = new THREE.Mesh(this.lampHead, this.woodMaterial);
        this.lampHeadMesh.position.set(0, 1.67, 0.15);
        this.lampHeadMesh.rotation.x = -Math.PI / 4;

        this.lampLight = new THREE.CylinderGeometry(0.11, 0.3, 0.4, 32, 32, true);
        this.lampLightMesh = new THREE.Mesh(this.lampLight, this.lampMaterial);
        this.lampLightMesh.position.set(0, 1.5, 0.32);
        this.lampLightMesh.rotation.x = -Math.PI / 4;

        this.lamp = new THREE.Group();
        this.lamp.add(this.lampPole);
        this.lamp.add(this.lampHeadMesh);
        this.lamp.add(this.lampLightMesh);
        this.add(this.lamp);

        this.lampGlowMaterial = new THREE.MeshPhongMaterial({color: this.lightColor, specular: "#ffffff", emissive: this.lightColor, shininess: 0,});
        this.lampGlow = new THREE.CylinderGeometry(0.25, 0.25, 0.01, 32);
        this.lampGlowMesh = new THREE.Mesh(this.lampGlow, this.lampGlowMaterial);
        this.lampGlowMesh.position.set(0, 1.37, 0.42);
        this.lampGlowMesh.rotation.x = -Math.PI / 4;
        this.add(this.lampGlowMesh);

        this.light = new THREE.SpotLight(this.lightColor, 15, 3, Math.PI / 6, 0.2, 1);
        this.light.target = this.target;
        this.light.castShadow = true;

        this.add(this.light);
       
    }
}

export { Lamp };
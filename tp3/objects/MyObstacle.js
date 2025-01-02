import * as THREE from 'three';
import { MyShader } from './MyShader.js';
class MyObstacle extends THREE.Object3D {

    constructor(parameters, material, castShadow, receiveShadow) {
        super();
        this.height = parameters.height;
        this.radius = parameters.radius;
        this.penalty = parameters.penalty;
        this.obstacleBB = null;
        this.shader = this.shader;

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
        sphereMesh.position.set(0, this.height/2 - 0.05, 0);
        this.groupSphere.add(sphereMesh);

        this.rocket.add(this.groupSphere);

        this.rocket.castShadow = castShadow ?? false;
        this.rocket.receiveShadow = receiveShadow ?? false;
        const vertexShader = 'shaders/obstacle.vert';
        const fragmentShader = 'shaders/obstacle.frag';
        const baseTexture = new THREE.TextureLoader().load('scenes/textures/bullet.jpg');
        this.shader = new MyShader( vertexShader, fragmentShader, {
            time: { type: 'float', value: 0.1 },         
            amplitude: { type: 'float', value: 0.05 },  
            frequency: { type: 'float', value: 7 },
            baseTexture: { type: 'sampler2D', value: baseTexture }, 
        });
        
        this.waitForShaders();
        this.add(this.rocket);
        this.animatePulsation();
    }

    createBoundingVolume(){
        this.matrixWorldNeedsUpdate = true;
        this.updateMatrixWorld(true);
        this.obstacleBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.obstacleBB.setFromObject(this.rocket, true);
    }

    getBoundingVolume(){
        return this.obstacleBB;
    }

    getPenalty(){
        return this.penalty;
    }

    waitForShaders() {
        if (!this.shader.ready) {
            setTimeout(this.waitForShaders.bind(this), 100);
            return;
        }
        this.rocket.traverse(child => {
            if (child.isMesh) {
                child.material = this.shader.material;
                child.material.needsUpdate = true;
            }
        });
    }
    animatePulsation() {
        const clock = new THREE.Clock();
        console.log("animatePulsation");
        const update = () => {
            const elapsedTime = clock.getElapsedTime();
            this.shader.updateUniformsValue('time', elapsedTime);
            requestAnimationFrame(update);
        };
        update();
    }
}

export { MyObstacle };

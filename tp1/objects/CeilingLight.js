import * as THREE from 'three';
/*
class CeilingLight extends THREE.Object3D{
    constructor(target, lightColor, radius){
        super();
        this.light = new THREE.SpotLight(0x343deb, 1, 100);
        this.target = new THREE.Object3D();
        this.target.position.set(0, 5, 0);
        this.light.target = this.target;
        this.light.castShadow = true;
        this.lightColor = lightColor;
        this.radius = radius;
    }

    build(){
        this.lightBulb = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 32), new THREE.MeshStandardMaterial({color: 0xffffff}));
        this.lightBulb.castShadow = true;

        this.lightBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 32), new THREE.MeshStandardMaterial({color: 0x000000}));
        this.lightBase.position.y = 0.16;
        this.lightBase.castShadow = true;
        //this.add(this.lightBase);
        this.add(this.light);
        //this.add(this.lightBulb);

        this.lightCord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.2, 32), new THREE.MeshStandardMaterial({color: 0x000000}));
        this.lightCord.position.y = 0.6;
        this.lightCord.castShadow = true;
        this.add(this.lightCord);
    }
}

export { CeilingLight }; */
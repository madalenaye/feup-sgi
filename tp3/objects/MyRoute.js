import * as THREE from 'three';

class MyRoute extends THREE.Object3D {

    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        let vectorPoints = parameters.controlpoints_time.map(point => new THREE.Vector3(point.x, point.y, point.z));
        let path = new THREE.CatmullRomCurve3(vectorPoints);

        this.controlPoints = vectorPoints;
        this.rotatedControlPoints = this.rotatePointsZ(vectorPoints);
        this.times = parameters.controlpoints_time.map(point => point.time);

        material.transparent = true;
        material.opacity = 0; 
        let trackGeometry = new THREE.TubeGeometry(path, 200, 10, 3 , true);
        let trackMesh = new THREE.Mesh(trackGeometry, material);

        this.curve = new THREE.Group();
        this.curve.add(trackMesh);
        this.curve.rotateZ(Math.PI);

        this.curve.castShadow = castShadow ?? false;
        this.curve.receiveShadow = receiveShadow ?? false;

        this.add(this.curve);
    }

    rotatePointsZ(points) {
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(Math.PI);
      
        return points.map(point => point.clone().applyMatrix4(rotationMatrix));
    }

}

export { MyRoute };

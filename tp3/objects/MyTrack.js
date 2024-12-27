import * as THREE from 'three';

class MyTrack extends THREE.Object3D {

    constructor(parameters, material, castShadow, receiveShadow) {
        super();
        this.width = parameters.width;
        this.controlpoints = parameters.controlpoints;

        let vectorPoints = parameters.controlpoints.map(point => new THREE.Vector3(point.x, point.y, point.z));
        let path = new THREE.CatmullRomCurve3(vectorPoints);
        this.adjustedControlPoints = vectorPoints;

        let lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000});
        let trackGeometry = new THREE.TubeGeometry(path, parameters.segments, parameters.width, 3 , parameters.closed);
        let trackMesh = new THREE.Mesh(trackGeometry, material);

        let points = path.getPoints(parameters.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(bGeometry, lineMaterial);

        this.curve = new THREE.Group();

        line.position.y = -2.7;

        this.curve.add(trackMesh);
        this.curve.add(line);

        this.curve.rotateZ(Math.PI);

        this.curve.castShadow = castShadow ?? false;
        this.curve.receiveShadow = receiveShadow ?? false;

        this.add(this.curve);
       
    }

}

export { MyTrack };

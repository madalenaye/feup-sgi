import * as THREE from 'three';

class MyTrack extends THREE.Object3D {

    constructor(parameters, material, castShadow, receiveShadow) {
        super();
        this.width = parameters.width;
        this.controlpoints = parameters.controlpoints;
        this.segments = parameters.segments;
        this.penalty = parameters.penalty;

        let vectorPoints = parameters.controlpoints.map(point => new THREE.Vector3(point.x, point.y, point.z));
        let path = new THREE.CatmullRomCurve3(vectorPoints);

        this.adjustedControlPoints = vectorPoints;
        this.rotatedControlPoints = this.rotatePathZ(path);
        this.sampledPoints = this.pointsOnTheCurve();

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

    rotatePathZ(path) {
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(Math.PI);
    
        const rotatedPoints = path.points.map(point => point.clone().applyMatrix4(rotationMatrix));
    
        return new THREE.CatmullRomCurve3(rotatedPoints, path.closed);
    }

    pointsOnTheCurve(){
        const sampledPoints = [];
        for (let i = 0; i <= this.segments; i++) {
          sampledPoints.push(this.rotatedControlPoints.getPointAt(i / this.segments));
        }
  
        return sampledPoints;
    }

    isObjectInsideTrack(object) {

        const position = new THREE.Vector3();
        object.getWorldPosition(position);
        position.y = 0;
        
        const curveSamplePoints = this.pointsOnTheCurve();
  
        curveSamplePoints.sort(function (pointA, pointB) {
          return position.distanceTo(pointA) - position.distanceTo(pointB);
        });
  
        let closestPoint1 = curveSamplePoints[0];
        let closestPoint2 = curveSamplePoints[1];
        if (closestPoint1.equals(closestPoint2)) {
            closestPoint2 = curveSamplePoints[2];
        }
  
        const direction = new THREE.Vector3().subVectors(closestPoint2, closestPoint1);
        const vectorToClosestPoint1 = new THREE.Vector3().subVectors(closestPoint1, position);
        const projection = vectorToClosestPoint1.dot(direction);
        const projectionVector = direction.clone().multiplyScalar(projection / direction.lengthSq());
        const projectedPoint = new THREE.Vector3().subVectors(closestPoint1, projectionVector);
        const distance = projectedPoint.distanceTo(position);
  
        return distance <= this.width;
    }

}

export { MyTrack };

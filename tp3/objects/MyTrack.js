/**
 * @file MyTrack.js
 * @class MyTrack
 * @extends THREE.Object3D
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a 3D track with geometry, collision detection, and object management.
 */

class MyTrack extends THREE.Object3D {

    /**
     * Constructs a new MyTrack instance.
     * @constructor
     * @param {Object} parameters - Configuration parameters for the track.
     * @param {number} parameters.width - Width of the track.
     * @param {Array} parameters.controlpoints - Control points defining the track path.
     * @param {number} parameters.segments - Number of segments in the track geometry.
     * @param {number} parameters.penalty - Penalty applied for leaving the track.
     * @param {THREE.Material} material - Material used for the track.
     * @param {boolean} [castShadow=false] - Determines if the track casts shadows.
     * @param {boolean} [receiveShadow=false] - Determines if the track receives shadows.
     */
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
        trackMesh.receiveShadow = true;

        let points = path.getPoints(parameters.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(bGeometry, lineMaterial);

        this.curve = new THREE.Group();

        line.position.y = -5.5;

        this.curve.add(trackMesh);
        this.curve.add(line);

        this.curve.rotateZ(Math.PI);

        this.curve.castShadow = castShadow ?? false;
        this.curve.receiveShadow = receiveShadow ?? false;

        this.add(this.curve);
       
    }

    /**
     * @method
     * Rotates the path around the Z-axis.
     * @param {THREE.CatmullRomCurve3} path - The path to rotate.
     * @returns {THREE.CatmullRomCurve3} - Rotated path.
     */
    rotatePathZ(path) {
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(Math.PI);
    
        const rotatedPoints = path.points.map(point => point.clone().applyMatrix4(rotationMatrix));
    
        return new THREE.CatmullRomCurve3(rotatedPoints, path.closed);
    }

    /**
     * @method
     * Samples points along the track curve.
     * @returns {Array<THREE.Vector3>} - Points sampled on the curve.
     */
    pointsOnTheCurve(){
        const sampledPoints = [];
        for (let i = 0; i <= this.segments; i++) {
          sampledPoints.push(this.rotatedControlPoints.getPointAt(i / this.segments));
        }
  
        return sampledPoints;
    }

    /**
     * @method
     * Checks if an object is inside the track boundaries.
     * @param {THREE.Object3D} object - The object to check.
     * @returns {boolean} - True if inside, false otherwise.
     */
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

    /**
     * @method
     * Moves an object back to the track if it is outside.
     * @param {THREE.Object3D} balloon - The object to reposition.
     * @param {Array} obstacles - List of obstacles.
     * @param {Array} powerups - List of power-ups.
     */
    putObjectOnTrack(balloon, obstacles, powerups){
        let value = this.isObjectInsideTrack(balloon);
        if(value == false){
            let vouchers = balloon.getVouchers();
            if(vouchers == 0){
                balloon.freezeBalloon(this.penalty);
            }
            else{
                balloon.decreaseVouchers();
            }
            let closestPoint = this.findClosestPointOnTrack(balloon);

            let safePoint = this.findSafePoint(closestPoint, balloon, obstacles, powerups);

            balloon.position.set(safePoint.x, safePoint.y, safePoint.z);
        }
    }

    /**
     * @method
     * Finds the closest point on the track to a given balloon.
     * @param {THREE.Object3D} balloon - The object to check.
     * @returns {THREE.Vector3} - The closest point on the track.
     */
    findClosestPointOnTrack(balloon) {
        const position = new THREE.Vector3();
        balloon.getWorldPosition(position);
    
        let closestPoint = this.sampledPoints[0];
        closestPoint.y = balloon.position.y;
        let minDistance = position.distanceTo(closestPoint);
    
        for (let i = 1; i < this.sampledPoints.length; i++) {
            let point = this.sampledPoints[i];
            point.y = balloon.position.y;
            const distance = position.distanceTo(point);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        }
    
        return closestPoint;
    }
    
    /**
     * @method
     * Finds a safe point on the track, avoiding collisions with obstacles and power-ups.
     * @param {THREE.Vector3} startPoint - Starting point for the search.
     * @param {THREE.Object3D} balloon - The balloon object.
     * @param {Array} obstacles - List of obstacles.
     * @param {Array} powerups - List of power-ups.
     * @returns {THREE.Vector3} - A safe point on the track.
     */
    findSafePoint(startPoint, balloon, obstacles, powerups) {
        let safePoint = startPoint.clone();
        let index = this.sampledPoints.indexOf(startPoint);
    
        while (this.checkCollisionAtPoint(safePoint, balloon, obstacles, powerups)) {
            index--; 
    
            if (index < 0) { 
                index = this.sampledPoints.length - 1;
            }
    
            safePoint = this.sampledPoints[index];
        }
    
        return safePoint;
    }

    /**
     * @method
     * Checks for collisions at a given point with obstacles and power-ups.
     * @param {THREE.Vector3} point - The point to check.
     * @param {THREE.Object3D} balloon - The balloon object.
     * @param {Array} obstacles - List of obstacles.
     * @param {Array} powerups - List of power-ups.
     * @returns {boolean} - True if there is a collision, false otherwise.
     */
    checkCollisionAtPoint(point, balloon, obstacles, powerups) {
        const tempPosition = new THREE.Vector3(point.x, point.y, point.z);

        const checkCollision = (objects, radius) => {
            for (const key in objects) {
                const object = objects[key];
                const objectPosition = new THREE.Vector3();
                object.getWorldPosition(objectPosition);

                const distance = tempPosition.distanceTo(objectPosition);
                let collisionRadius = object.getDistance();
                if (distance < radius + collisionRadius) {
                    return true; 
                }
            }
            return false; 
        };

        const balloonRadius = balloon.getDistance();

        if (checkCollision(obstacles, balloonRadius) || checkCollision(powerups, balloonRadius)) {
            return true;
        }

        return false; 
    }
    
}

export { MyTrack };

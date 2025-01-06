/**
 * @file MyRoute.js
 * @class MyRoute
 * @extends THREE.Object3D
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a route path with animations and transformations for 3D objects.
 */

class MyRoute extends THREE.Object3D {

    /**
     * Constructs a new MyRoute instance.
     * @constructor
     * @param {Object} parameters - Configuration parameters.
     * @param {Array} parameters.controlpoints_time - Control points with position and time.
     * @param {THREE.Material} material - Material for the route.
     * @param {boolean} castShadow - Determines if the route casts shadows.
     * @param {boolean} receiveShadow - Determines if the route receives shadows.
     */
    constructor(parameters, material, castShadow, receiveShadow) {
        super();
        let vectorPoints = parameters.controlpoints_time.map(point => new THREE.Vector3(point.x, point.y, point.z));
        let path = new THREE.CatmullRomCurve3(vectorPoints);

        this.controlPoints = vectorPoints;
        this.rotatedControlPoints = this.rotatePointsZ(vectorPoints);
        this.balloonRoute = this.rotatePointsZ(vectorPoints);
   
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

        this.mixer = null;
        this.positionAction = null;
        this.mixerTime = 0;
        this.mixerPause = false;
    
        this.enableAnimationRotation = true;
        this.enableAnimationPosition = true;
        this.clock = new THREE.Clock();

        this.add(this.curve);
    }

    /**
     * @method
     * Rotates points around the Z-axis.
     * @param {Array<THREE.Vector3>} points - The points to rotate.
     * @returns {Array<THREE.Vector3>} Rotated points.
     */
    rotatePointsZ(points) {
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(Math.PI);
      
        return points.map(point => point.clone().applyMatrix4(rotationMatrix));
    }

    /**
     * @method
     * Changes the initial point of the route.
     * @param {THREE.Vector3} point - The new initial point.
     */
    changeInitialPoint(point){
        this.balloonRoute[0] = point;
        this.balloonRoute[this.balloonRoute.length -1] = point;
    }

    /**
     * @method
     * Sets up the animation for the given object.
     * @param {THREE.Object3D} object - The object to animate.
     */
    setupAnimation(object){

        const positionKeyframes = [];
        const quaternionKeyframes = [];
    
        for (let i = 0; i < this.balloonRoute.length; i++) {
            const point = this.balloonRoute[i];
            positionKeyframes.push(point.x, point.y, point.z);
    
            const nextIndex = i === this.balloonRoute.length - 1 ? i : i + 1;
            const currentPoint = this.balloonRoute[i];
            const nextPoint = this.balloonRoute[nextIndex];
    
            const direction = new THREE.Vector3()
                .subVectors(nextPoint, currentPoint)
                .normalize();
    
            const quaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1), 
                direction 
            );
    
            quaternionKeyframes.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
    
        const positionKF = new THREE.VectorKeyframeTrack('.position', this.times, positionKeyframes, THREE.InterpolateSmooth);
    
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', this.times, quaternionKeyframes);
    
        const positionClip = new THREE.AnimationClip('positionAndRotationAnimation', this.times[this.times.length - 1], [positionKF, quaternionKF]);
    
        this.mixer = new THREE.AnimationMixer(object);
        this.positionAction = this.mixer.clipAction(positionClip);
    }

    /**  
     * @method
     * Starts the animation.
     */
    play() {
        if (this.mixer) {
            this.positionAction.play();
            this.mixerPause = false;
        }
    }

    /**
     * @method 
     * Stops the animation. */
    stop() {
        if (this.mixer) {
            this.positionAction.stop();
            this.mixerPause = true;
        }
    }

    /**
     * @method 
     * Resumes the animation. */
    resume(){
        if (this.mixer) {
            this.mixerPause = false;
            this.clock.getDelta();
        }
    }

    /**
     * @method 
     * Pauses the animation. */
    pause(){
        if(this.mixer){
            this.mixerPause = true;
        }
    }

    /**
     * @method 
     * Sets the mixer time for animation. */
    setMixerTime() {
        this.mixer.setTime(this.mixerTime);
    }

    /**
     * @method 
     * Checks whether the animation state is paused and adjusts time scale. */
    checkAnimationStateIsPause() {
        if (this.mixerPause)
            this.mixer.timeScale = 0;
        else
            this.mixer.timeScale = 1;
    }

    checkTracksEnabled() {

        const actions = this.mixer._actions;
        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0];

            if (track.name === '.quaternion' && this.enableAnimationRotation === false) {
                actions[i].stop();
            }
            else if (track.name === '.position' && this.enableAnimationPosition === false) {
                actions[i].stop();
            }
            else {
                if (!actions[i].isRunning())
                    actions[i].play();
            }
        }
    }

    /**
     * @method 
     * Updates the animation state. */
    update() {

        if (!this.mixerPause) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
    
        this.checkAnimationStateIsPause();
        this.checkTracksEnabled();

    }

    /**
     * @method
     * Restart the animation.
     */
    resetAnimation() {
        if (this.mixer && this.positionAction) {
            this.positionAction.stop();
    
            this.mixer.setTime(0);
    
        }
    }

}

export { MyRoute };

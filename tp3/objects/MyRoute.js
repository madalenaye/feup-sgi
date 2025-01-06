import * as THREE from 'three';

class MyRoute extends THREE.Object3D {

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

    rotatePointsZ(points) {
        const rotationMatrix = new THREE.Matrix4().makeRotationZ(Math.PI);
      
        return points.map(point => point.clone().applyMatrix4(rotationMatrix));
    }

    changeInitialPoint(point){
        this.balloonRoute[0] = point;
        this.balloonRoute[this.balloonRoute.length -1] = point;
    }

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

    play() {
        if (this.mixer) {
            this.positionAction.play();
            this.mixerPause = false;
        }
    }

    stop() {
        if (this.mixer) {
            this.positionAction.stop();
            this.mixerPause = true;
        }
    }

    resume(){
        if (this.mixer) {
            this.mixerPause = false;
            this.clock.getDelta();
        }
    }

    pause(){
        if(this.mixer){
            this.mixerPause = true;
        }
    }

    setMixerTime() {
        this.mixer.setTime(this.mixerTime);
    }

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

    update() {

        if (!this.mixerPause) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
    
        this.checkAnimationStateIsPause();
        this.checkTracksEnabled();

    }
    resetAnimation() {
        if (this.mixer && this.positionAction) {
            this.positionAction.stop();
    
            this.mixer.setTime(0);
    
        }
    }

}

export { MyRoute };

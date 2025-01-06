/**
 * @file MyBalloon.js
 * @class MyBalloon
 * @extends THREE.Object3D
 */


import * as THREE from 'three';

/**
 * @class
 * @classdesc Represents a 3D balloon object with interactive features such as collisions, movement, and height adjustment.
 */


class MyBalloon extends THREE.Object3D {

    /**
     * Constructs a new MyBalloon instance.
     * @constructor
     * @param {Float} radius - The radius of the balloon.
     * @param {THREE.Material} material - The material used for the balloon.
     * @param {String} baseColor - The base color of the balloon.
     * @param {Number} type - The type of the balloon, affecting its shape.
     * @param {String} name - The name of the balloon.
     * @param {String} nameUser - The name of the user controlling the balloon.
     */
    constructor(radius, material, baseColor, type, name, nameUser) {
        super();
        this.radius = radius;
        this.basketRadius = radius/3;
        this.material = material;
        this.baseColor = baseColor;
        this.isCollidingMap = new Map();
        this.type = type;
        this.name = name;
        this.windLayer = 0;
        this.nameUser = nameUser;
        this.maxLayers = 5;
        this.cooldownTime = 300;
        this.canChangeLayer = true;
        this.layerHeight = 2;
        this.targetY = 0; 
        this.smoothFactor = 0.05

        this.vouchers = 0;
        this.currentLap = 0;
        this.canMove = true;
        this.hasCrossedLine = false;
        
        this.groupBalloon = new THREE.Group();
        this.groupBalloon.name = this.name;
        this.buildBalloon();
    }

    /**
     * @method
     * Builds the 3D structure of the balloon, including the base, basket, and strings.
     */
    buildBalloon() {

        /* Balloon */

        // Base
        const balloonBaseHeight = this.radius * 0.4;
        const balloonBaseRadius = this.radius * 0.75;
        this.balloonBaseGeometry = new THREE.CylinderGeometry(balloonBaseRadius, this.basketRadius, balloonBaseHeight, 32, 16, true);
        
        const edgesGeometry = new THREE.EdgesGeometry(this.balloonBaseGeometry);

        const edgesMaterial = new THREE.LineBasicMaterial({
            color: this.baseColor,
        });
     
        this.balloonBaseEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.balloonBaseEdges.computeLineDistances();
        this.groupBalloon.add(this.balloonBaseEdges);
    
        
        // Balloon
        this.balloonGeometry = new THREE.SphereGeometry(this.radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);
        this.balloon = new THREE.Mesh(this.balloonGeometry, this.material);
        this.balloon.position.set(0, balloonBaseRadius + 0.35, 0);

        if (this.type === 1){
            this.balloon.scale.set(1.15, 1.4, 1.15);
            this.balloon.position.set(0, (balloonBaseRadius + 0.35) * 1.5, 0);
        }
        
        if (this.type === 2){
            this.balloon.scale.set(0.6, 1,0.6)
            this.balloonBaseEdges.scale.set(0.5, 0.5,0.5)
        }

        this.groupBalloon.add(this.balloon);
        // Basket

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
        this.arcShape.absarc(0, 0, this.basketRadius, 0, Math.PI * 2, 0, false);
        
        this.holePath = new THREE.Path();
        this.holePath.absarc(0, 0, this.basketRadius - 0.2, 0, Math.PI * 2, true);
        this.arcShape.holes.push(this.holePath);
        
        this.basketGeometry = new THREE.ExtrudeGeometry(this.arcShape, extrudeSettings);
        this.basket = new THREE.Mesh(this.basketGeometry, this.basketMaterial);
        this.basket.rotation.set(Math.PI/2, 0, 0);
        this.basket.position.set(0, -balloonBaseHeight, 0);

        this.groupBalloon.add(this.basket);

        // Basket base  
        this.basketBaseGeometry = new THREE.CylinderGeometry(this.basketRadius, this.basketRadius, 0.04, 32);
        this.basketBase = new THREE.Mesh(this.basketBaseGeometry, this.basketMaterial);
        this.basketBase.position.set(0, -balloonBaseHeight - extrudeSettings.depth - 0.02, 0);
        this.groupBalloon.add(this.basketBase);

        // Strings
        const numStrings = 5;
        const stringRadius = 0.05;
        const stringHeight = balloonBaseHeight;

        this.stringGroup = new THREE.Group();
        const angleStep = 2 * Math.PI / numStrings;

        for (let i = 0; i < numStrings; i++){
            const angle = i * angleStep;
            const x = Math.cos(angle) * (this.basketRadius - 0.25);
            const z = Math.sin(angle) * (this.basketRadius - 0.25);

            const stringGeometry = new THREE.CylinderGeometry(stringRadius, stringRadius, stringHeight, 32);
            const string = new THREE.Mesh(stringGeometry, this.basketMaterial);
            string.position.set(x, - balloonBaseHeight + stringHeight/2 - 0.15, z);
            
        
            const lookAtPos = new THREE.Vector3(0, -1.2, 0);

            string.lookAt(lookAtPos);

            this.stringGroup.add(string);
        }

        //Shadows
        this.balloonBaseEdges.castShadow = true;
        this.balloon.castShadow = true;
        this.basket.castShadow = true;
        this.basketBase.castShadow = true;

        this.groupBalloon.add(this.stringGroup);
        this.add(this.groupBalloon);
    }

    /**
     * @method
     * Creates and adds a directional light source to simulate illumination from the balloon.
     */
    createBalloonLight(){
        this.balloonLight = new THREE.DirectionalLight(0xffcd00, 0.4); 
        this.balloonLight.position.set(0, 7, 0);
        this.balloonLight.target = this.basketBase; 
        this.balloonLight.castShadow = true;

        this.balloonLight.shadow.mapSize.width = 1024; 
        this.balloonLight.shadow.mapSize.height = 1024;
        this.balloonLight.shadow.camera.near = 0.5;
        this.balloonLight.shadow.camera.far = 200;
        this.balloonLight.shadow.camera.left = -10;
        this.balloonLight.shadow.camera.right = 10;
        this.balloonLight.shadow.camera.top = 10;
        this.balloonLight.shadow.camera.bottom = -10;

        this.add(this.balloonLight);
    }

    /**
     * @method
     * Creates bounding volumes for collision detection.
     */
    createBoundingVolume(){
        this.matrixWorldNeedsUpdate = true;
        this.updateMatrixWorld(true);

        this.balloonBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.balloonBB.setFromObject(this.groupBalloon, true);
    
        this.balloonBB_box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.balloonBB_box.setFromObject(this.basket, true);
    
        this.balloonBB_sphere = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.balloonBB_sphere.setFromObject(this.balloon, true);
    }

    /**
     * @method
     * Retrieves the balloon's bounding volume.
     * @returns {THREE.Box3} The bounding volume.
     */
    getBoundingVolume(){
        return this.balloonBB;
    }

    /**
     * @method
     * Updates the bounding volume for collision detection.
     */
    updateBoundingBoxBalloon(){
        if(this.groupBalloon){
          this.balloonBB.setFromObject(this.groupBalloon, true);
          this.balloonBB_box.setFromObject(this.basket, true);
          this.balloonBB_sphere.setFromObject(this.balloon, true);
        }
    }

    /**
     * @method
     * Checks for collisions using detailed testing with bounding boxes.
     * @param {THREE.Box3} objectBB - The bounding box of the object to test.
     * @returns {Boolean} True if a collision is detected, otherwise false.
     */
    exhaustiveTest(objectBB){
        if (this.balloonBB_box.intersectsBox(objectBB)) {
            return true;
        }
    
        if (this.balloonBB_sphere.intersectsBox(objectBB)) {
            return true;
        }

        return false;
    }

    /**
     * @method
     * Checks for collisions with another object's bounding box.
     * @param {THREE.Object3D} object - The object to test for collisions.
     * @returns {Boolean} True if a collision occurs, otherwise false.
     */
    checkCollision(object) {
        const objectBB = object.getBoundingVolume();
        if (this.balloonBB && objectBB) {
          const isIntersecting = this.balloonBB.intersectsBox(objectBB);
    
          const objectID = object.uuid || object.id;
    
          const wasColliding = this.isCollidingMap.get(objectID) || false;
    
          if (isIntersecting && !wasColliding) {
            const detailedCollision = this.exhaustiveTest(objectBB);
            this.isCollidingMap.set(objectID, detailedCollision);
            return detailedCollision; 
          }
    
          if (!isIntersecting) {
            this.isCollidingMap.set(objectID, false);
          }
          return false;
        }
    
        return false;
    }

    /**
     * @method
     * Performs a simple collision check using bounding boxes.
     * @param {THREE.Object3D} object - The object to test for collisions.
     * @returns {Boolean} True if a collision occurs, otherwise false.
     */
    simpleCheckCollision(object){
        const objectBB = object.getBoundingVolume();
        if(this.balloonBB && objectBB){
            const isIntersecting = this.balloonBB.intersectsBox(objectBB);
            return isIntersecting;
        }
        return false;
    }

    /**
     * @method
     * Checks for collisions with obstacles and applies penalties or consumes vouchers.
     * @param {Object} obstacles - The obstacles to check for collisions.
     * @param {Object} outdoor - The outdoor environment to update vouchers.
     */
    checkCollisionObstacles(obstacles, outdoor){
        for (const key in obstacles){
            const obstacle = obstacles[key];
            if (obstacle.cooldown && Date.now() < obstacle.cooldown) {
                continue;
            }
            let value = this.checkCollision(obstacle);
            if(value){
                if(this.vouchers == 0){
                    let penalty = obstacle.getPenalty();
                    obstacle.cooldown = Date.now() + (penalty + 8) * 1000;
                    this.freezeBalloon(penalty);
                }
                else{
                    this.vouchers--;
                    outdoor.setVouchers(this.vouchers);
                }
            }   
        }
    }

    /**
     * @method
     * Checks for collisions with power-ups and updates vouchers.
     * @param {Object} powerups - The power-ups to check for collisions.
     * @param {Object} outdoor - The outdoor environment to update vouchers.
     */
    checkCollisionPowerups(powerups, outdoor){
        for (const key in powerups){
            const powerup = powerups[key];
            let value = this.checkCollision(powerup);
            if(value && powerup.canCollide){
                powerup.canCollide = false;
                this.vouchers++;
                outdoor.setVouchers(this.vouchers);
            }
        }        
    }

    /**
     * @method
     * Checks for collisions with other balloons and applies penalties.
     * @param {Object} balloon - The balloon to check for collisions.
     * @param {Object} outdoor - The outdoor environment to update vouchers.
     */
    checkCollisionBalloon(balloon, outdoor){
        let value = this.checkCollision(balloon);
        if(value){
            if(this.vouchers == 0){
                this.freezeBalloon(3);
            }
            else{
                this.vouchers--;
                outdoor.setVouchers(this.vouchers);
            }
        }
    }

    /**
     * @method
     * Marks the balloon as selected.
     */
    selected(){
        this.isSelected = true;
    }

    /**
     * @method
     * Freezes the balloon's movement for a specified duration.
     * @param {Number} penalty - The duration in seconds for which the balloon is frozen.
     */
    freezeBalloon(penalty) {
        this.canMove = false;
    
        console.log(`Balloon stopped for ${penalty} seconds!`);
    
        setTimeout(() => {
            this.canMove = true;
            console.log("Balloon reactivated.");
        }, penalty * 1000);
    }

    /**
     * @method
     * Moves the balloon upward by one layer if allowed.
     */
    ascend(){
        if (this.canChangeLayer){
            if (this.windLayer < this.maxLayers - 1){
                this.windLayer += 1;
                this.updatePosition(this.layerHeight);
            }
            else{
                console.log("Balloon reached maximum height!");
            }
            this.startCooldown();
        }
    }

    /**
     * @method
     * Moves the balloon downward by one layer if allowed.
     */
    descend(){
        if (this.canChangeLayer){
            if (this.windLayer > 0){
                this.windLayer -= 1;
                this.updatePosition(-this.layerHeight);
            }
            else{
                console.log("Balloon reached minimum height!");
            }
            this.startCooldown();
        }
    }

    /**
     * @method
     * Starts a cooldown period before another layer change is allowed.
     */
    startCooldown(){
        this.canChangeLayer = false;
        setTimeout(() => {
            this.canChangeLayer = true;
        }, this.cooldownTime);
    }

    /**
     * @method
     * Updates the position of the balloon based on layer height.
     * @param {Number} offset - The height offset to adjust.
     */
    updatePosition(offset) {
        const targetY = this.position.y + offset;
        this.smoothTransition(targetY);
    }

    /**
     * @method
     * Performs linear interpolation between two values.
     * @param {Number} start - The starting value.
     * @param {Number} end - The ending value.
     * @param {Number} t - The interpolation factor (0 to 1).
     * @returns {Number} The interpolated value.
     */
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    /**
     * @method
     * Performs smooth interpolation between positions for smooth transitions.
     * @param {Number} targetY - The target Y position.
     * @param {Number} [duration=0.5] - Duration of the transition.
     */
    smoothTransition(targetY, duration = 0.5) {
        const startY = this.position.y;
        const startTime = performance.now();
    
        const animate = (time) => {
            const elapsed = (time - startTime) / 1000;
            const t = Math.min(elapsed / duration, 1);
            this.position.y = this.lerp(startY, targetY, t);
    
            if (t < 1) {
                requestAnimationFrame(animate);
            }
        };
    
        requestAnimationFrame(animate);
    }  

    /**
     * @method
     * Gets the number of vouchers the balloon has.
     * @returns {Number} The number of vouchers.
     */
    getVouchers(){
        return this.vouchers;
    }

    /**
     * @method
     * Decreases the number of vouchers by one.
     */
    decreaseVouchers(){
        this.vouchers--;
    }

    /**
     * @method
     * Gets the distance factor used for collision detection.
     * @returns {Float} The distance factor.
     */
    getDistance(){
        return (this.radius * 1.7);
    }

    /**
     * @method
     * Checks if the balloon is allowed to move.
     * @returns {Boolean} True if the balloon can move, otherwise false.
     */
    getCanMove(){
        return this.canMove;
    }

    /**
     * @method
     * Increases the number of laps completed and updates the outdoor display.
     * @param {Object} outdoor - The outdoor environment object.
     */
    increaseLaps(outdoor){
        let myPosition = new THREE.Vector3();
        this.getWorldPosition(myPosition);
        let approximationZ = Math.round(myPosition.z);

        if (myPosition.x > 0 && approximationZ === -2) {
            if (!this.hasCrossedLine) {
                this.currentLap++;
                outdoor.setCurrentLap(this.currentLap);
                this.hasCrossedLine = true;
            }
        }   
        else {
            this.hasCrossedLine = false;
        }
    }

    /**
     * @method
     * Checks if the race has ended based on total laps.
     * @param {Number} totalLaps - The total number of laps required.
     * @returns {Boolean} True if the race is complete, otherwise false.
     */
    checkEndOfRace(totalLaps){
        return this.currentLap === totalLaps;
    }

    /**
     * @method
     * Resets the balloon's properties to their initial state.
     */
    resetBalloon() {
        this.windLayer = 0;
        this.targetY = 0;
        this.vouchers = 0;
        this.currentLap = 0;
        this.canMove = true;
        this.hasCrossedLine = false;
        this.isCollidingMap = new Map();
        this.canChangeLayer = true;
    }

}
export { MyBalloon };
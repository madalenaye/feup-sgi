import * as THREE from 'three';

class MyBalloon extends THREE.Object3D {

    constructor(radius, material, baseColor, type, name) {
        super();
        this.radius = radius;
        this.basketRadius = radius/3;
        this.material = material;
        this.baseColor = baseColor;
        this.isCollidingMap = new Map();
        this.type = type;
        this.name = name;
        this.isSelected = false;
        this.currentLayer = 0;
        this.maxLayers = 5;
        this.cooldownTime = 300;
        this.canChangeLayer = true;
        this.layerHeight = 4;
        this.targetY = 0; 
        this.smoothFactor = 0.05

        this.vouchers = 0;
        this.canMove = true;
        
        this.groupBalloon = new THREE.Group();
        this.groupBalloon.name = this.name;
        this.buildBalloon();
    }
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

    create3PersonCamera(app){
        this.thirdPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
        const initialOffset = new THREE.Vector3(0, 10, -30);
        this.thirdPersonCamera.position.copy(initialOffset); 
        
        const initialTarget = new THREE.Vector3(0, 5, 0);
        this.thirdPersonCamera.lookAt(initialTarget);
        this.thirdPersonCamera.userData.offset = initialOffset.clone();
        
        app.scene.add(this.thirdPersonCamera);

        this.thirdName = `third_${this.uuid}`;
        app.cameras[this.thirdName] = this.thirdPersonCamera;
    }

    updateCameraPosition() {
        const balloonMatrix = this.groupBalloon.matrixWorld;

        const rotatedOffset = this.thirdPersonCamera.userData.offset.clone();
        rotatedOffset.applyMatrix4(new THREE.Matrix4().extractRotation(balloonMatrix)); 

        const balloonPosition = new THREE.Vector3().setFromMatrixPosition(balloonMatrix);
        this.thirdPersonCamera.position.copy(balloonPosition).add(rotatedOffset);

        const lookAtTarget = new THREE.Vector3().setFromMatrixPosition(balloonMatrix);
        this.thirdPersonCamera.lookAt(lookAtTarget);
    }

    createFirstPersonCamera(app) {
        this.firstPersonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.firstPersonCamera.position.set(0, 0, 0);
        this.firstPersonCamera.rotation.set(0, Math.PI, 0);
    
        this.groupBalloon.add(this.firstPersonCamera);

        this.firstName = `first_${this.uuid}`;
        app.cameras[this.firstName] = this.firstPersonCamera;
    }

    updateFirstPersonCamera() {
        this.firstPersonCamera.rotation.set(0, Math.PI, 0);
    }

    setupCameraSwitching(app) {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case '1':
                    app.setActiveCamera(this.firstName);
                    break;
    
                case '3': 
                    app.setActiveCamera(this.thirdName);
                    break;
    
                case 'c':
                    app.setActiveCamera("cam1");
                    break;
    
                default:
                    break;
            }
    
        });
    }


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

    getBoundingVolume(){
        return this.balloonBB;
    }

    updateBoundingBoxBalloon(){
        if(this.groupBalloon){
          this.balloonBB.setFromObject(this.groupBalloon, true);
          this.balloonBB_box.setFromObject(this.basket, true);
          this.balloonBB_sphere.setFromObject(this.balloon, true);
        }
    }

    exhaustiveTest(objectBB){
        if (this.balloonBB_box.intersectsBox(objectBB)) {
            return true;
        }
    
        if (this.balloonBB_sphere.intersectsBox(objectBB)) {
            return true;
        }

        return false;
    }
    
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

    simpleCheckCollision(object){
        const objectBB = object.getBoundingVolume();
        if(this.balloonBB && objectBB){
            const isIntersecting = this.balloonBB.intersectsBox(objectBB);
            return isIntersecting;
        }
        return false;
    }

    checkCollisionObstacles(obstacles){
        for (const key in obstacles){
            const obstacle = obstacles[key];
            if (obstacle.cooldown && Date.now() < obstacle.cooldown) {
                continue;
            }
            let value = this.checkCollision(obstacle);
            if(value){
                if(this.vouchers == 0){
                    let penalty = obstacle.getPenalty();
                    obstacle.cooldown = Date.now() + (penalty + 4) * 1000;
                    this.freezeBalloon(penalty);
                }
                else{
                    this.vouchers--;
                }
            }   
        }
    }

    checkCollisionPowerups(powerups, outdoor){
        for (const key in powerups){
            const powerup = powerups[key];
            let value = this.checkCollision(powerup);
            if(value){
                this.vouchers++;
                outdoor.setVouchers(this.vouchers);
            }
        }        
    }

    checkCollisionBalloon(balloon){
        let value = this.checkCollision(balloon);
        if(value){
            if(this.vouchers == 0){
                this.freezeBalloon(3);
            }
            else{
                this.vouchers--;
            }
        }
    }

    selected(){
        this.isSelected = true;
    }

    freezeBalloon(penalty) {
        this.canMove = false;
    
        console.log(`Balloon stopped for ${penalty} seconds!`);
    
        setTimeout(() => {
            this.canMove = true;
            console.log("Balloon reactivated.");
        }, penalty * 1000);
    }
    ascend(){
        if (this.canChangeLayer){
            if (this.currentLayer < this.maxLayers - 1){
                this.currentLayer += 1;
                this.updatePosition(this.layerHeight);
            }
            else{
                console.log("Balloon reached maximum height!");
            }
            this.startCooldown();
        }
    }
    descend(){
        if (this.canChangeLayer){
            if (this.currentLayer > 0){
                this.currentLayer -= 1;
                this.updatePosition(-this.layerHeight);
            }
            else{
                console.log("Balloon reached minimum height!");
            }
            this.startCooldown();
        }
    }
    startCooldown(){
        this.canChangeLayer = false;
        setTimeout(() => {
            this.canChangeLayer = true;
        }, this.cooldownTime);
    }

    updatePosition(offset) {
        const targetY = this.position.y + offset;
        this.smoothTransition(targetY);
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

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

    getVouchers(){
        return this.vouchers;
    }

    decreaseVouchers(){
        this.vouchers--;
    }

    getDistance(){
        return (this.radius * 1.7);
    }
}
export { MyBalloon };
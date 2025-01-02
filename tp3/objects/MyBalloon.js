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

        this.vouchers = 0;
        
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
        this.groupBalloon.add(this.stringGroup);
        this.groupBalloon.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI/4);
        this.add(this.groupBalloon);

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
            console.log("Colisão caixa");
            return true;
        }
    
        if (this.balloonBB_sphere.intersectsBox(objectBB)) {
            console.log("Colisão esfera");
            return true;
        }

        return false;
    }
    
    checkCollision(object) {
        const objectBB = object.getBoundingVolume()
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

    checkCollisionObstacles(obstacles){
        for (const key in obstacles){
            const obstacle = obstacles[key];
            let value = this.checkCollision(obstacle);
            if(value){
                //TODO: obstacle logic
            }
        }
    }

    checkCollisionPowerups(powerups){
        for (const key in powerups){
            const powerup = powerups[key];
            let value = this.checkCollision(powerup);
            if(value){
                this.vouchers++;
            }
        }        
    }

    checkCollisionBalloon(balloon){
        let value = this.checkCollision(balloon);
        if(value){
            //TODO: logic of collision with autonomous balloon
        }
    }
    selected(){
        this.isSelected = true;
    }
}
export { MyBalloon };
import * as THREE from 'three';
import {MySprite} from '../utils/MySprite.js'

class MyOutdoor extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        this.groupOutdoor = new THREE.Group();
        this.sprite = MySprite.loadSpritesheet();

        this.groupCylinder1 = new THREE.Group();
        let cylinder1Geo = new THREE.CylinderGeometry(0.5, 0.5, parameters.height);
        let cylinder1Mesh = new THREE.Mesh(cylinder1Geo, material);
        this.groupCylinder1.add(cylinder1Mesh);
        this.groupOutdoor.add(this.groupCylinder1);

        this.groupCylinder2 = new THREE.Group();
        this.groupCylinder2.position.set(parameters.width, 0, 0);
        let cylinder2Geo = new THREE.CylinderGeometry(0.5, 0.5, parameters.height);
        let cylinder2Mesh = new THREE.Mesh(cylinder2Geo, material);
        this.groupCylinder2.add(cylinder2Mesh);
        this.groupOutdoor.add(this.groupCylinder2);

        this.groupScreen = new THREE.Group();
        this.groupScreen.position.set(parameters.width/2 , parameters.height/2 - 5, 0);
        let boxGeo = new THREE.BoxGeometry(parameters.width - 1, 10, 0.5);
        let boxMaterial = new THREE.MeshStandardMaterial({color: 0x000000, metalness: 0.5, roughness: 0.5});
        let boxMesh = new THREE.Mesh(boxGeo, boxMaterial);
        this.groupScreen.add(boxMesh);
        this.groupOutdoor.add(this.groupScreen);

        let frameMaterial = new THREE.MeshStandardMaterial({color: 0x3d85a2, metalness: 0.5, roughness: 0.5});
        this.groupRightFrame = new THREE.Group();
        this.groupRightFrame.position.set(parameters.width/20 - 0.1,parameters.height/2 - 5, -0.33);
        let rightFrameGeo = new THREE.BoxGeometry(parameters.width/20, 10, 0.0);
        let rightFrameMesh = new THREE.Mesh(rightFrameGeo, frameMaterial);
        this.groupRightFrame.add(rightFrameMesh);
        this.groupOutdoor.add(this.groupRightFrame);

        this.groupLeftFrame = new THREE.Group();
        this.groupLeftFrame.position.set((parameters.width - parameters.width/20) + 0.1, parameters.height/2 - 5, -0.33);
        let leftFrameGeo = new THREE.BoxGeometry(parameters.width/20, 10, 0.0);
        let leftFrameMesh = new THREE.Mesh(leftFrameGeo, frameMaterial);
        this.groupLeftFrame.add(leftFrameMesh);
        this.groupOutdoor.add(this.groupLeftFrame);

        this.groupTopFrame = new THREE.Group();
        this.groupTopFrame.rotation.set(0, 0, Math.PI/2);
        this.groupTopFrame.position.set((parameters.width - parameters.width/20)/2 + 0.5, parameters.height/2 - (parameters.width/20)/2, -0.33);
        let topFrameGeo = new THREE.BoxGeometry(parameters.width/20, parameters.width-1, 0.0);
        let topFrameMesh = new THREE.Mesh(topFrameGeo, frameMaterial);
        this.groupTopFrame.add(topFrameMesh);
        this.groupOutdoor.add(this.groupTopFrame);

        this.groupBottomFrame = new THREE.Group();
        this.groupBottomFrame.rotation.set(0, 0, Math.PI/2);
        this.groupBottomFrame.position.set((parameters.width - parameters.width/20)/2 + 0.5, -1.98, -0.33);
        let bottomFrameGeo = new THREE.BoxGeometry(parameters.width/20, parameters.width-1, 0.0);
        let bottomFrameMesh = new THREE.Mesh(bottomFrameGeo, frameMaterial);
        this.groupBottomFrame.add(bottomFrameMesh);
        this.groupOutdoor.add(this.groupBottomFrame);

        
        this.groupOutdoor.castShadow = castShadow ?? false;
        this.groupOutdoor.receiveShadow = receiveShadow ?? false;

        this.add(this.groupOutdoor);
        this.createAllElements();
    }

    createElapsedTime(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5,5.7,-0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    createLapsCompleted(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 4.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    createAirLayer(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 2.7, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    createVouchers(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 1.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    createGameStatus(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, -0.3, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);        
    }

    createGameStatusRunning(text, charWidth = 0.7, charHeight = 0.7){
        this.status = text;
        let textMesh = MySprite.createTextFromSpritesheet(this.status, charWidth, charHeight, this.sprite);
        textMesh.position.set(11.0, -0.3, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.gameStatusTextMesh = textMesh;
        this.add(textMesh);

    }

    setTotalLaps(laps, charWidth = 0.7, charHeight = 0.7){
        this.totalLaps = laps;
        const text = `/${this.totalLaps}`;
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(8.0, 4.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    setCurrentLap(currentLap, charWidth = 0.7, charHeight = 0.7){
        this.currentLap = currentLap;
        let text = `${this.currentLap}`
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(8.8, 4.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);
    }

    setAirLayer(airLayer, charWidth = 0.7, charHeight = 0.7){
        this.airLayer = airLayer;
        if (this.airLayerTextMesh) {
            this.remove(this.airLayerTextMesh);
        }
        let textMesh = MySprite.createTextFromSpritesheet(this.airLayer, charWidth, charHeight, this.sprite);
        textMesh.position.set(12.5, 2.7, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.airLayerTextMesh = textMesh;
        this.add(textMesh);
    }

    setVouchers(vouchers, charWidth = 0.7, charHeight = 0.7){
        this.vouchers = vouchers
        let text = `${this.vouchers}`
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(13.0, 1.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        this.add(textMesh);

    }

    setGameStatus(charWidth = 0.7, charHeight = 0.7){
        this.status = this.status === "Running" ? "Paused" : "Running";

        if (this.gameStatusTextMesh) {
            this.remove(this.gameStatusTextMesh);
        }
    
        this.gameStatusTextMesh = MySprite.createTextFromSpritesheet(this.status, charWidth, charHeight, this.sprite);
        this.gameStatusTextMesh.position.set(11.0, -0.3, -0.33);
        this.gameStatusTextMesh.rotation.set(0, 0, Math.PI);
    
        this.add(this.gameStatusTextMesh);
    }

    createAllElements(){
        this.createElapsedTime("Elapsed Time:");
        this.createLapsCompleted("Laps Completed:");
        this.createAirLayer("Air layer:");
        this.createVouchers("Vouchers:");
        this.createGameStatus("Game Status:");
        this.createGameStatusRunning("Running");
        this.setTotalLaps("?");
        this.setCurrentLap(0);
        this.setAirLayer("none");
    }

}
export { MyOutdoor };
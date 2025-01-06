import * as THREE from 'three';
import {MySprite} from '../utils/MySprite.js'

class MyOutdoor extends THREE.Object3D {
    constructor(parameters, material, castShadow, receiveShadow) {
        super();

        this.groupOutdoor = new THREE.Group();
        this.sprite = MySprite.loadSpritesheet(0xffffff);
        this.elapsedTime = 0;
        this.isPlaying = false;
        this.lastTime = null;
        this.timeTextMesh = null;

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
        textMesh.scale.set(1, -1, 1);
        this.add(textMesh);
    }

    createLapsCompleted(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 4.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.add(textMesh);
    }

    createAirLayer(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 2.7, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.add(textMesh);
    }

    createVouchers(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, 1.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.add(textMesh);
    }

    createGameStatus(text, charWidth = 0.7, charHeight = 0.7){
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(19.5, -0.3, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.add(textMesh);        
    }

    createGameStatusRunning(text, charWidth = 0.7, charHeight = 0.7){
        this.status = text;
        let textMesh = MySprite.createTextFromSpritesheet(this.status, charWidth, charHeight, this.sprite);
        textMesh.position.set(11.0, -0.3, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.gameStatusTextMesh = textMesh;
        this.add(textMesh);

    }

    setElapsedTime(text, charWidth = 0.7, charHeight = 0.7){
        if (this.timeTextMesh) {
            this.remove(this.timeTextMesh);
        }
        this.timeTextMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        this.timeTextMesh.position.set(10.3, 5.7, -0.33);
        this.timeTextMesh.rotation.set(0, 0, Math.PI);
        this.timeTextMesh.scale.set(1, -1, 1);
        this.add(this.timeTextMesh);
    }

    setTotalLaps(laps, charWidth = 0.7, charHeight = 0.7){
        if(this.totalLapsMesh){
            this.remove(this.totalLapsMesh);
        }
        this.totalLaps = laps;
        const text = `/${this.totalLaps}`;
        this.totalLapsMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        this.totalLapsMesh.position.set(8.0, 4.2, -0.33);
        this.totalLapsMesh.rotation.set(0,0,Math.PI);
        this.totalLapsMesh.scale.set(1, -1, 1);
        this.add(this.totalLapsMesh);
    }

    setCurrentLap(currentLap, charWidth = 0.7, charHeight = 0.7){
        this.currentLap = currentLap;
        if(this.currentLapTextMesh){
            this.remove(this.currentLapTextMesh);
        }
        let text = `${this.currentLap}`
        let textMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        textMesh.position.set(8.8, 4.2, -0.33);
        textMesh.rotation.set(0,0,Math.PI);
        textMesh.scale.set(1, -1, 1);
        this.currentLapTextMesh = textMesh;
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
        textMesh.scale.set(1, -1, 1);
        this.airLayerTextMesh = textMesh;
        this.add(textMesh);
    }

    setVouchers(vouchers, charWidth = 0.7, charHeight = 0.7){
        if (this.vouchersTextMesh) {
            this.remove(this.vouchersTextMesh);
        }
        this.vouchers = vouchers
        let text = `${this.vouchers}`
        this.vouchersTextMesh = MySprite.createTextFromSpritesheet(text, charWidth, charHeight, this.sprite);
        this.vouchersTextMesh.position.set(13.0, 1.2, -0.33);
        this.vouchersTextMesh.rotation.set(0,Math.PI,0);
        //this.vouchersTextMesh.scale.set(1, -1, 1);
        this.add(this.vouchersTextMesh);

    }

    setGameStatus(charWidth = 0.7, charHeight = 0.7){
        this.status = this.status === "Running" ? "Paused" : "Running";

        if (this.gameStatusTextMesh) {
            this.remove(this.gameStatusTextMesh);
        }
    
        this.gameStatusTextMesh = MySprite.createTextFromSpritesheet(this.status, charWidth, charHeight, this.sprite);
        this.gameStatusTextMesh.position.set(11.0, -0.3, -0.33);
        this.gameStatusTextMesh.rotation.set(0, 0, Math.PI);
        this.gameStatusTextMesh.scale.set(1, -1, 1);
    
        this.add(this.gameStatusTextMesh);
    }

    getTotalTime(){
        const minutes = Math.floor(this.elapsedTime / 60);
        const seconds = Math.floor(this.elapsedTime % 60);
        const timeText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return timeText;
    }

    play(){
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.lastTime = performance.now();
        }
    }

    pause(){
        if (this.isPlaying) {
            this.isPlaying = false;
            const now = performance.now();
            this.elapsedTime += (now - this.lastTime) / 1000;
            this.lastTime = null;
        }
    }

    resume(){
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.lastTime = performance.now();
        }
    }

    update() {
        if (this.isPlaying) {
            const now = performance.now();
            const delta = (now - this.lastTime) / 1000;
            this.elapsedTime += delta;
            this.lastTime = now;

            const timeText = this.getTotalTime();

            this.setElapsedTime(timeText);
        }
    }

    createAllElements(){
        this.createElapsedTime("Elapsed Time:");
        this.createLapsCompleted("Laps Completed:");
        this.createAirLayer("Air layer:");
        this.createVouchers("Vouchers:");
        this.createGameStatus("Game Status:");
        this.createGameStatusRunning("Running");
        this.setElapsedTime("00:00");
        this.setTotalLaps("?");
        this.setCurrentLap(0);
        this.setAirLayer("none");
        this.setVouchers(0);
    }

    resetTime() {
        this.elapsedTime = 0;
        this.lastTime = null;
        this.isPlaying = false;
    
        this.setElapsedTime("00:00");
    }

    resetLapsCompleted(){
        this.setCurrentLap(0);
    }

    resetAirLayer(){
        this.setAirLayer("none");
    }

    resetVouchers(){
        this.setVouchers(0);
    }

    resetTotalLaps(){
        this.setTotalLaps("?");
    }

    reset(){
        this.resetTime();
        this.resetLapsCompleted();
        this.resetAirLayer();
        this.resetVouchers();
        this.resetTotalLaps();
    }

}
export { MyOutdoor };
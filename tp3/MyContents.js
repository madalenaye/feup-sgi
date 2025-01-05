/**
 * @file MyContents.js
 * @class MyContents
 * @desc 
 */

import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {loadCameras} from './loaders/LoadCameras.js'
import { loadGlobals } from './loaders/LoadGlobals.js';
import { loadTextures } from './loaders/LoadTextures.js';
import { loadMaterials } from './loaders/LoadMaterials.js';
import {loadObjects} from './loaders/LoadObjects.js';
import { MyBalloon } from './objects/MyBalloon.js';
import { MyFirework } from './objects/MyFirework.js';
import { MyBillboardBalloon } from './objects/MyBillboardBalloon.js';
import { MyMenu } from './objects/MyMenu.js';


/**
 * @class
 * @classdesc This class contains the contents of out application
 */

class MyContents {

    // todo
    layers = {
        NONE: 0,
        MENU: 1,
        USER_BALLOON: 2,
        ENEMY_BALLOON: 3,   
    }
    // todo
    state = {
        GAME: 0,
        MENU: 1,
        GAME_OVER: 2,
        USER_BALLOON: 3,
        ENEMY_BALLOON: 4,
        CHANGE_NAME: 5
    }
    /**
       constructs the object
       @constructor
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null
        this.objects = null
        this.lights = null;
        this.balloons = [];
        this.billboards = [];
        this.textureLoader = new THREE.TextureLoader();
        this.fireworks = [];

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/GameScene.json");

        // Picking
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 0.1;
        this.raycaster.far = 40;

        this.pointer = new THREE.Vector2();
        this.intersected = null;
        this.pickingColor = "0x00ff00"

        this.selectedLayer = this.layers.NONE;
        document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));

        this.playerBalloon = null;
        this.playerName = null;
        this.enemyBalloon = null;
        this.previousPlayerBalloon = null;
        this.previousEnemyBalloon = null;
        
        // Main Menu
        const menuTexture = this.textureLoader.load('./scenes/textures/menu.jpg');
        const menuMaterial = new THREE.MeshStandardMaterial({ map: menuTexture, side: THREE.DoubleSide });
        this.menu = new MyMenu(menuMaterial, this.layers.MENU);
        this.menu.position.set(0, 32, -74);
        this.app.scene.add(this.menu);
        this.currentState = this.state.MENU;
        this.currentLayer = this.layers.NONE

        this.hudWind = document.getElementById("wind");
        this.hudWind.style.display = "none";
        this.windSpeed = 0.05;

        // Game configuration
        this.level = 1;
        this.track = "A";
        this.loops = 1;
        this.pointA = new THREE.Vector3(35, 10, 0);
        this.pointB = new THREE.Vector3(25, 10, 0);
        this.thirdPerson = true;

    }
    /**
     * initializes the contents
     * @method
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
            this.axis.visible = false
        }

        // init balloons
        this.initBalloons()
        
        this.userBalloons = [this.balloons[0], this.balloons[1], this.balloons[2], this.billboards[0], this.billboards[1], this.billboards[2]];
        this.enemyBalloons = [this.balloons[3], this.balloons[4], this.balloons[5], this.billboards[3], this.billboards[4], this.billboards[5]];

        this.userBalloons.forEach(balloon => balloon.layers.set(this.layers.USER_BALLOON));
        this.enemyBalloons.forEach(balloon => balloon.layers.set(this.layers.ENEMY_BALLOON));

        this.playerBalloon = this.userBalloons[0];
        this.previousPlayerBalloon = this.userBalloons[0];
        this.enemyBalloon = this.enemyBalloons[0];
        this.previousEnemyBalloon = this.enemyBalloons[0];
    }

    /**
     * Called when the scene JSON file load is completed
     * @method
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Recursively prints the properties of the given object to the console with indentation for nested objects.
     * @method
     * @param {Object} data - The object to be printed.
     * @param {string} [indent=''] - A string used for indentation in nested levels (default is an empty string).
     */
    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    /**
     * Processes the scene after it is loaded, initializing cameras, lights, and scene objects.
     * @method
     * @param {Object} data - The scene object containing all elements, including cameras, lights, textures, and materials.
     */
    onAfterSceneLoadedAndBeforeRender(data) {
        //this.printYASF(data)
        
        let camerasList = loadCameras.createCameras(data.cameras);
        let activeCameraId = data.getActiveCameraID(); 

        camerasList.forEach(camera => {
            this.app.cameras[camera.name] = camera;
        });

        if (activeCameraId && this.app.cameras[activeCameraId]) {
            this.app.activeCamera = this.app.cameras[activeCameraId];
            this.app.setActiveCamera(activeCameraId);
        }

        if (this.app.gui) {
            this.app.gui.onContentsReady();
        }

        let globalsStructure = loadGlobals.loadGlobals(data);
        this.app.scene.background = globalsStructure.background;
        this.app.scene.add(globalsStructure.ambient);
        this.app.lights["ambient"] = globalsStructure.ambient;
        this.app.scene.fog = globalsStructure.fog
        this.app.scene.add(globalsStructure.skybox);

        let textures = loadTextures.loadTextures(data.getTextures());
        let organizeMaterials = loadMaterials.organizeProperties(textures, data.getMaterials());
        let rootId = data.getRootId();
        let rootNode = data.getNode(rootId);
        let myScene = loadObjects.load(rootNode, organizeMaterials);
        this.objects = loadObjects.getObjects();

        this.lights = loadObjects.getLights();
        this.app.scene.add(myScene);

        this.routes = loadObjects.getRoutes();
        this.obstacles = loadObjects.getObstacles();
        this.powerups = loadObjects.getPowerups();
        this.currentRoute = this.routes["route_level" + this.level];
        this.outdoor = this.objects["outdoor"];
        this.track_2 = this.objects["track_1"];
        
        // Outdoor display
        this.outdoor2 = this.objects["outdoor_2"];
        this.outdoor2.startUpdatingTextures(this.app, this.app.activeCamera, 15000);
    }

    update() {
        if(this.currentState == this.state.GAME){
            this.updateOutdoorTime();
            this.updateCamera();
            this.updateBoundingVolumes();
            this.updateEnemyAnimation();
            this.putObjectOnTrack();
            this.moveMyBalloon();
            this.setCurrentLap(this.playerBalloon);
            let value = this.verifyFinalRace(this.playerBalloon);
            this.setCurrentLap(this.enemyBalloon);
            let value2 = this.verifyFinalRace(this.enemyBalloon);
            this.collisionPowerups();
            this.collisionObstacles();
            this.collisionEnemyBalloon();
        }
        // provisório
  
        // if(Math.floor(Math.random() * 20) + 1 === 1) {
        //     const firework = new MyFirework(this.app, this.balloons[0].position)
        //     this.fireworks.push(firework)
        //     console.log("firework added")
        // }

        // // for each fireworks 
        // for( let i = 0; i < this.fireworks.length; i++ ) {
        //     // is firework finished?
        //     if (this.fireworks[i].done) {
        //         // remove firework 
        //         this.fireworks.splice(i,1) 
        //         console.log("firework removed")
        //         continue 
        //     }
        //     // otherwise update  firework
        //     this.fireworks[i].update()
        // }
    }

    /**
     * Initializes the balloons
     * @method
     */
    initBalloons() {
        const balloonConfigs = [
            { texturePath: './scenes/textures/balloon_1.png', color: 0x550b3d, position: [-65, 17, 10], type: 0, name: "player_balloon1", billboardTexture: './scenes/textures/billboard_1.png'},
            { texturePath: './scenes/textures/balloon_2.png', color: 0x37505A, position: [-65, 17, 25], type: 2, name: "player_balloon2", billboardTexture: './scenes/textures/billboard_2.png'},
            { texturePath: './scenes/textures/balloon_3.png', color: 0x4F5D4A, position: [-65, 17, 40], type: 1, name: "player_balloon3", billboardTexture: './scenes/textures/billboard_3.png'},
            { texturePath: './scenes/textures/balloon_1.png', color: 0x550b3d, position: [-40, 17, 65], type: 0, name: "enemy_balloon1", billboardTexture: './scenes/textures/billboard_1.png'},
            { texturePath: './scenes/textures/balloon_2.png', color: 0x37505A, position: [-25, 17, 65], type: 2, name: "enemy_balloon2", billboardTexture: './scenes/textures/billboard_2.png'},
            { texturePath: './scenes/textures/balloon_3.png', color: 0x4F5D4A, position: [-10, 17, 65], type: 1, name: "enemy_balloon3", billboardTexture: './scenes/textures/billboard_3.png'},
        ];
    
        balloonConfigs.forEach((config) => {
        
            const balloonTexture = this.textureLoader.load(config.texturePath);
            const balloonMaterial = new THREE.MeshStandardMaterial({
                map: balloonTexture,
                transparent: false,
                side: THREE.DoubleSide,
            });
    
            const balloon = new MyBalloon(4, balloonMaterial, config.color, config.type || 0, config.name);
            const lod = new THREE.LOD();

            lod.addLevel(balloon, 0);

            const billboardTexture = this.textureLoader.load(config.billboardTexture);
            const billboardMaterial = new THREE.MeshBasicMaterial({
                map: billboardTexture,
                transparent: true,
                side: THREE.DoubleSide,
            });
            const billboard = new MyBillboardBalloon(this.app, billboardMaterial);
            lod.addLevel(billboard, 200);
    
            lod.position.set(...config.position);
            this.app.scene.add(lod);
            this.balloons.push(balloon);
            this.billboards.push(billboard);
    
        });
    }
    
    onPointerDown(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
      
        if (intersects.length > 0) {  
            const obj = intersects[0].object;
            switch (this.currentState) {
                case this.state.USER_BALLOON:
                    this.userSelectionBalloon(obj);
                    break;
                case this.state.ENEMY_BALLOON:
                    this.enemySelectionBalloon(obj);
                    break;
                case this.state.MENU:
                    this.selectMenuOption(obj);
                    break;
                default:
                    break;
            }
        }
    }
    userSelectionBalloon(obj) {
        switch (obj.parent.parent.name.split("_")[0]) {
            case "player":
                this.playerBalloon = obj.parent.parent;
                this.previousPlayerBalloon = this.playerBalloon;
                const balloonName = this.playerBalloon.name.split("_")[1];
                switch (balloonName) {
                    case "balloon1":
                        this.menu.updateUserBalloon("Pink");
                        break;
                    case "balloon2":
                        this.menu.updateUserBalloon("Blue");
                        break;
                    case "balloon3":
                        this.menu.updateUserBalloon("Green");
                        break;
                }
                this.changeTo(this.state.MENU);
                break;
        }
    }
    enemySelectionBalloon(obj) {
        switch (obj.parent.parent.name.split("_")[0]) {
            case "enemy":
                this.enemyBalloon = obj.parent.parent;
                this.previousEnemyBalloon = this.enemyBalloon;
                const balloonName = this.enemyBalloon.name.split("_")[1];
                switch (balloonName) {
                    case "balloon1":
                        this.menu.updateBotBalloon("Pink");
                        break;
                    case "balloon2":
                        this.menu.updateBotBalloon("Blue");
                        break;
                    case "balloon3":
                        this.menu.updateBotBalloon("Green");
                        break;
                }
                this.changeTo(this.state.MENU);
                break;
        }
    }
    selectMenuOption(obj) {
        switch (obj.parent.name) {
            case "start":
                this.changeTo(this.state.GAME);
                break;
            case "changeName":
                this.currentState = this.state.CHANGE_NAME;
                this.changeName();
                break;
            case "levelDown":
                if (this.level > 1) this.level--;
                this.menu.updateLevel(this.level);
                break;
            case "levelUp":
                if (this.level < 3) this.level++;
                this.menu.updateLevel(this.level);
                break;
            case "pickBalloon":
                this.changeTo(this.state.USER_BALLOON);
                break;
            case "pickBotBalloon":
                this.changeTo(this.state.ENEMY_BALLOON);
                break;
            case "track":
                if (this.track === "A") this.track = "B";
                else this.track = "A";
                this.menu.updateTrack(this.track);
                break;
            case "loopDown":
                if (this.loops > 1) this.loops--;
                this.menu.updateLoops(this.loops);
                break;
            case "loopUp":
                this.loops++;
                this.menu.updateLoops(this.loops);
                break;
            default:
                break;
        }
    }
    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        if (intersects.length > 0){
            const obj = intersects[0].object;
            switch (this.currentState) {
                case this.state.USER_BALLOON:
                    this.userHoverBalloon(obj);
                    break;
                case this.state.ENEMY_BALLOON:
                    this.enemyHoverBalloon(obj);
                    break;
                case this.state.MENU:
                    this.menuHover(obj);
                    break;
                default:
                    break;
            }
        }
        else{
            if (this.lastObj){
                switch (this.currentState) {
                    case this.state.USER_BALLOON:
                        this.userHoverBalloon(this.lastObj, false);
                        break;
                    case this.state.ENEMY_BALLOON:
                        this.enemyHoverBalloon(this.lastObj, false);
                        break;
                    case this.state.MENU:
                        this.menuHover(this.lastObj, false);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    menuHover(obj, hovering = true){
        let menuObjects = this.menu.objects;
        if (hovering){
            if (this.lastObj != obj.parent){
                if (this.lastObj){
                    this.lastObj.scale.set(1, 1, 1);
                }
                this.lastObj = obj.parent;
                if (menuObjects.includes(this.lastObj)){
                    this.lastObj.scale.set(1.2, 1.2, 1.2);
                }
            }
        }
        else{
            this.lastObj.scale.set(1, 1, 1);
            this.lastObj = null;
        }
    }
    userHoverBalloon(obj, hovering = true){
        if (hovering){
            if (this.lastObj != obj.parent.parent){
                if (this.lastObj){
                    this.lastObj.scale.set(1, 1, 1);
                }
                this.lastObj = obj.parent.parent;
                if (this.userBalloons.includes(this.lastObj)){
                    this.lastObj.scale.set(1.2, 1.2, 1.2);
                }
            }
        }
        else{
            this.lastObj.scale.set(1, 1, 1);
            this.lastObj = null;
        }
    }
    enemyHoverBalloon(obj, hovering = true){
        if (hovering){
            if (this.lastObj != obj.parent.parent){
                if (this.lastObj){
                    this.lastObj.scale.set(1, 1, 1);
                }
                this.lastObj = obj.parent.parent;
                if (this.enemyBalloons.includes(this.lastObj)){
                    this.lastObj.scale.set(1.2, 1.2, 1.2);
                }
            }
        }
        else{
            this.lastObj.scale.set(1, 1, 1);
            this.lastObj = null;
        }
    }
    windLayers() {
        switch(this.playerBalloon.windLayer){
            case 0:
                this.hudWind.innerHTML = "No wind";
                this.setAirLayer("No wind");
                break;
            case 1:
                this.hudWind.innerHTML = "North ↑";
                this.setAirLayer("North");
                this.playerBalloon.position.z += this.windSpeed;
                break;
            case 2:
                this.hudWind.innerHTML = "South ↑";
                this.setAirLayer("South");
                this.playerBalloon.position.z -= this.windSpeed;
                break;
            case 3:
                this.hudWind.innerHTML = "East →";
                this.setAirLayer("East");
                this.playerBalloon.position.x -= this.windSpeed;
                break;
            case 4:
                this.hudWind.innerHTML = "West ←";
                this.setAirLayer("West");
                this.playerBalloon.position.x += this.windSpeed;
                break;
            default:
                break;
        }
    }
    changeName(){
        if (this.currentState === this.state.CHANGE_NAME){
            const keyboardHandler = (e) => {
                const isAlphaNumeric = /^[a-zA-Z0-9 ]$/.test(e.key);
                if (isAlphaNumeric || (e.key === 'Backspace' && this.playerName)){
                    if (e.key === 'Backspace') this.playerName = this.playerName.slice(0, -1);
                    else this.playerName = (this.playerName || '') + e.key;
                    this.playerName = this.playerName.slice(0, 10);
                    this.menu.updatePlayerName(this.playerName);
                }
                else if(e.key === 'Enter'){
                    this.currentState = this.state.MENU;
                    this.menu.updatePlayerName(this.playerName);
                    document.removeEventListener('keydown', keyboardHandler);
                }
            };
            document.addEventListener('keydown', keyboardHandler);
        }
    }

    setCamera(camera){
        this.app.setActiveCamera(camera);
    }
    changeTo(state){
        switch(state){
            case this.state.MENU:
                this.selectedLayer = this.layers.MENU;
                this.updateLayer()
                this.currentState = this.state.MENU;
                this.setCamera("menu");
                break;
            case this.state.GAME:
                this.setTotalLaps();
                this.createBalloonShadow();
                this.positionMyBalloon();
                this.positionEnemyBalloon();
                this.createBoundingVolumes();
                this.setCameras();
                this.changeCamera();
                this.changeEnemyStartingPoint();
                this.enemyAnimationSetup();
                this.outdoorTimePlay();
                this.hudWind.style.display = "block";
                this.currentState = this.state.GAME;
                break;
            case this.state.GAME_OVER:
                //TODO
                console.log("Game over");
                break;
            case this.state.USER_BALLOON:
                this.selectedLayer = this.layers.USER_BALLOON;
                this.updateLayer()
                this.currentState = this.state.USER_BALLOON;
                this.setCamera("user_balloon");
                break;
            case this.state.ENEMY_BALLOON:
                this.selectedLayer = this.layers.ENEMY_BALLOON;
                this.updateLayer()
                this.currentState = this.state.ENEMY_BALLOON;
                this.setCamera("enemy_balloon");
                break;
        }
    }

    updateLayer(){
        switch(this.selectedLayer){
            case this.layers.NONE:
                this.raycaster.layers.enableAll();
                this.currentLayer = this.selectedLayer;
                break;
            default:
                this.raycaster.layers.enable(this.selectedLayer);
                this.currentLayer = this.selectedLayer;
                break;
        }
    }

    createBalloonShadow(){
        this.playerBalloon.createBalloonLight();
    }

    createBoundingVolumes(){
        this.playerBalloon.createBoundingVolume();
        this.balloonBB = this.playerBalloon.getBoundingVolume();
        
        // const balloonBBHelper = new THREE.Box3Helper(this.playerBalloon.balloonBB, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBBHelper);
      
        // const balloonBB2Helper = new THREE.Box3Helper(this.playerBalloon.balloonBB_box, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBB2Helper);
      
        // const balloonBB3Helper = new THREE.Box3Helper(this.playerBalloon.balloonBB_sphere, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBB3Helper);

        this.enemyBalloon.createBoundingVolume();
        this.balloonBB2 = this.enemyBalloon.getBoundingVolume();
        
        // const balloonBB1Helper = new THREE.Box3Helper(this.enemyBalloon.balloonBB, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBB1Helper);
      
        // const balloonBB21Helper = new THREE.Box3Helper(this.enemyBalloon.balloonBB_box, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBB21Helper);
      
        // const balloonBB31Helper = new THREE.Box3Helper(this.enemyBalloon.balloonBB_sphere, 0xff0000); // Cor vermelha
        // this.app.scene.add(balloonBB31Helper);

    }

    positionMyBalloon(){
        const targetPoint = this.track === "A" ? this.pointA : this.pointB;
        this.playerBalloon.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
        this.app.scene.add(this.playerBalloon);
    }

    positionEnemyBalloon(){
        const targetPoint = this.track === "A" ? this.pointB : this.pointA;
        this.enemyBalloon.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
        this.app.scene.add(this.enemyBalloon);
    }

    changeEnemyStartingPoint(){
        const targetPoint = this.track === "A" ? this.pointB : this.pointA;
        this.currentRoute.changeInitialPoint(targetPoint);
    }

    enemyAnimationSetup(){
        this.currentRoute.setupAnimation(this.enemyBalloon);
        this.currentRoute.play();
    }

    updateEnemyAnimation(){
        this.currentRoute.update();
    }

    updateBoundingVolumes(){
        this.playerBalloon.updateBoundingBoxBalloon();
        this.enemyBalloon.updateBoundingBoxBalloon();
    }

    moveMyBalloon(){
        if(this.playerBalloon.getCanMove()){
            if (this.app.keys.includes("w")) this.playerBalloon.ascend();

            if (this.app.keys.includes("s")) this.playerBalloon.descend();

            this.windLayers();
        }
    }

    outdoorTimePlay(){
        this.outdoor.play();
    }

    outdoorTimePause(){
        this.outdoor.pause();
    }

    outdoorTimeResume(){
        this.outdoor.resume();
    }

    updateOutdoorTime(){
        this.outdoor.update();
    }

    setTotalLaps(){
        this.outdoor.setTotalLaps(this.loops);
    }

    setAirLayer(layer){
        this.outdoor.setAirLayer(layer);
    }

    setCurrentLap(balloon){
        balloon.increaseLaps(this.outdoor);
    }

    verifyFinalRace(balloon){
        return balloon.checkEndOfRace(this.loops);
    }

    putObjectOnTrack(){
        let value = this.track_2.isObjectInsideTrack(this.playerBalloon);
        if(!value){
            this.track_2.putObjectOnTrack(this.playerBalloon, this.obstacles, this.powerups);
        }
    }

    collisionPowerups(){
        this.playerBalloon.checkCollisionPowerups(this.powerups, this.outdoor);
    }

    collisionObstacles(){
        this.playerBalloon.checkCollisionObstacles(this.obstacles, this.outdoor);
    }

    collisionEnemyBalloon(){
        this.playerBalloon.checkCollisionBalloon(this.enemyBalloon, this.outdoor);
    }

 
    setCameras(){
        if (this.thirdPerson){
            this.setCamera("third_person");
            const pos = new THREE.Vector3();
            this.playerBalloon.getWorldPosition(pos);
            this.app.activeCamera.position.set(pos.x + 5, pos.y + 2, pos.z - 15);
            this.app.updateNewCameraTarget(pos);
        }
        else {
            this.setCamera("first_person");
            const pos = new THREE.Vector3();
            this.playerBalloon.getWorldPosition(pos);
            this.app.activeCamera.position.set(pos.x + 0.1, pos.y - 0.1, pos.z - 1);
            this.app.updateNewCameraTarget(pos);
        }
    }

    changeCamera(){
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case '1':
                    this.thirdPerson = false;
                    break;
    
                case '3': 
                    this.thirdPerson = true;
                    break;
                default:
                    break;
            }
        });
        this.setCameras();
    }

    updateCamera(){
        const pos = new THREE.Vector3();
        this.playerBalloon.getWorldPosition(pos);
        const targetCameraPosition = new THREE.Vector3();
        if (this.thirdPerson){
            switch(this.playerBalloon.windLayer){
                case 0:
                    targetCameraPosition.set(pos.x + 5, pos.y + 2, pos.z - 15);
                    break;
                case 1:
                    targetCameraPosition.set(pos.x + 5, pos.y + 2, pos.z - 20);
                    break;
                case 2:
                    targetCameraPosition.set(pos.x + 5, pos.y + 2, pos.z + 20);
                    this.windHud
                    break;
                case 3:
                    targetCameraPosition.set(pos.x + 15, pos.y + 2, pos.z - 25);
                    break;
                case 4:
                    targetCameraPosition.set(pos.x - 15, pos.y + 2, pos.z - 25);
                    break;
            }
            this.app.activeCamera.position.lerp(targetCameraPosition, 0.05);
            this.app.updateNewCameraTarget(pos);
        }
        else{
            switch(this.playerBalloon.windLayer){
                case 2:
                    targetCameraPosition.set(pos.x + 0.1, pos.y - 0.1, pos.z + 1);
                    break;
                case 3:
                    targetCameraPosition.set(pos.x + 0.4, pos.y - 0.1, pos.z - 1);
                    break;
                case 4:
                    targetCameraPosition.set(pos.x - 0.4, pos.y - 0.1, pos.z - 1);
                    break;
                default:
                    targetCameraPosition.set(pos.x + 0.1, pos.y - 0.1, pos.z - 1);
            }
            this.app.activeCamera.position.lerp(targetCameraPosition, 0.05);
            this.app.updateNewCameraTarget(pos);
        }
    }
}

export { MyContents };

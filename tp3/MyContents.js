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
        ENEMY_BALLOON: 4
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
        this.balloons = {}
        this.textureLoader = new THREE.TextureLoader();

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
        //document.addEventListener('pointermove', this.onPointerMove.bind(this));
        document.addEventListener('pointerdown', this.onPointerDown.bind(this));

        this.playerBalloon = null;
        this.enemyBalloon = null;
        this.previousPlayerBalloon = null;
        this.previousEnemyBalloon = null;

        // provisório
        this.currentState = this.state.USER_BALLOON;

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

        
        // this.powerupTex = new THREE.TextureLoader().load('./scenes/textures/powerup.png');
        // this.powerupTex.wrapS = THREE.RepeatWrapping;
        // this.powerupTex.wrapT = THREE.RepeatWrapping;
        // this.powerupTex.repeat.set(1, 1);
        // this.powerupMaterial = new THREE.MeshStandardMaterial({ map: this.powerupTex, roughness: 1, side: THREE.DoubleSide });
        // this.powerup = new MyPowerUp({width: 2}, this.powerupMaterial, true, true);
        // this.powerup.position.set(0, 5, 25);
        // this.app.scene.add(this.powerup);
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
  
    }

    update() {
    }


    turnOnLights(){
        for (let i of this.lights){
            i.visible = true
        } 
    }
    turnOffLights(){
        for (let i of this.lights){
            i.visible = false
        }
    }

    /**
     * Initializes the balloons
     * @method
     */
    initBalloons(){
        const balloonConfigs = [
            { texturePath: './scenes/textures/balloon_1.png', color: 0x550b3d, position: [-47, 15, 5], type: 0, name: "player_balloon1" },
            { texturePath: './scenes/textures/balloon_2.png', color: 0x37505A, position: [-47, 15, 17], type: 2, name: "player_balloon2" },
            { texturePath: './scenes/textures/balloon_3.png', color: 0x4F5D4A, position: [-47, 15, 29], type: 1, name: "player_balloon3" },
            { texturePath: './scenes/textures/balloon_1.png', color: 0x550b3d, position: [-28, 15, 47], type: 0, name: "enemy_balloon1" },
            { texturePath: './scenes/textures/balloon_2.png', color: 0x37505A, position: [-16, 15, 47], type: 2, name: "enemy_balloon2" },
            { texturePath: './scenes/textures/balloon_3.png', color: 0x4F5D4A, position: [-4, 15, 47], type: 1, name: "enemy_balloon3" },
        ];
        
        this.balloons = [];
        
        balloonConfigs.forEach((config, index) => {
            const texture = this.textureLoader.load(config.texturePath);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 1,
                metalness: 0.5,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
            });
            const balloon = new MyBalloon(4, material, config.color, config.type || 0, config.name);
            balloon.position.set(...config.position);
            this.app.scene.add(balloon);
            this.balloons[index] = balloon;
        });
        
    }
    onPointerDown(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);
        console.log("Intersects: " + intersects.length);
        console.log(intersects[0]);
        if (intersects.length > 0) {  
            const obj = intersects[0].object;
            if (obj.parent.name.split("_")[0] === "player" || obj.parent.name.split("_")[0] === "enemy") {
                const object = obj.parent;
                switch (this.currentState) {
                    case this.state.USER_BALLOON:
                        console.log("User balloon state");
                        this.userSelectionBalloon(object);
                        break;
                    case this.state.ENEMY_BALLOON:
                        this.enemySelectionBalloon(object);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    userSelectionBalloon(obj) {
        switch (obj.name.split("_")[0]) {
            case "player":
                this.playerBalloon = obj;
                this.previousPlayerBalloon = this.playerBalloon;
                console.log("Player balloon selected: " + this.playerBalloon.name);
                break;
        }
    }
    enemySelectionBalloon(obj) {
        switch (obj.name.split("_")[0]) {
            case "enemy":
                this.enemyBalloon = obj;
                this.previousEnemyBalloon = this.enemyBalloon;
                console.log("Enemy balloon selected: " + this.enemyBalloon.name);
                break;
        }
    }
}

export { MyContents };

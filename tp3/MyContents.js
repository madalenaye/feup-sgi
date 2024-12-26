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


/**
 * @class
 * @classdesc This class contains the contents of out application
 */

class MyContents {

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

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/PokemonScene.json");
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

    /**
     * Enables wireframe mode for all objects in the scene by setting the `wireframe` property
     * of their materials to `true`.
     * @method
     */
    activeWireframe(){
        for (let object of this.objects) {
            if (object.material) { 
                let materials = object.material;
                if (Array.isArray(materials)) {
                    for (let material of materials) {
                        material.wireframe = true;
                    }
                } else {
                    materials.wireframe = true;
                }
            }
            
        }
    }

    /**
     * Disables wireframe mode for all objects in the scene by setting the `wireframe` property
     * of their materials to `false`.
     * @method
     */
    disableWireframe(){
        for (let object of this.objects) {
            if (object.material) { 
                let materials = object.material;
                if (Array.isArray(materials)) {
                    for (let material of materials) {
                        material.wireframe = false;
                    }
                } else {
                    materials.wireframe = false;
                }
            }
        }
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
}

export { MyContents };

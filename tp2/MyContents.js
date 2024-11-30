import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {loadCameras} from './loaders/LoadCameras.js'
import { loadGloabls } from './loaders/LoadGlobals.js';
import { loadTextures } from './loaders/LoadTextures.js';
import { loadMaterials } from './loaders/LoadMaterials.js';
import {loadObjects} from './loaders/LoadObjects.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null
        this.objects = null

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/SGI_TP1_T04_G01_v02.json");
    }

    /**
     * initializes the contents
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
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

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

        let globalsStructure = loadGloabls.loadGloabls(data);
        this.app.scene.background = globalsStructure.background;
        this.app.scene.add(globalsStructure.ambient);
        this.app.lights["ambient"] = globalsStructure.ambient;
        this.app.scene.fog = globalsStructure.fog
        this.app.scene.add(globalsStructure.skybox);

        let textures = loadTextures.loadTextures(data.getTextures());
        let organizeMaterials = loadMaterials.organizeProporties(textures, data.getMaterials());
        let result = loadObjects.loadObjects(data.getRootId(), data.getNodes(), organizeMaterials);
        this.objects = result.objects;
        this.app.scene.add(result.scene);
        
    }

    update() {
    }

    activeWireframe(){
        for (let object of this.objects) {
            for (let child of object.children) {
                if (child.material) { 
                    let materials = child.material;
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
    }

    disableWireframe(){
        for (let object of this.objects) {
            for (let child of object.children) {
                if (child.material) { 
                    let materials = child.material;
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
    }
}

export { MyContents };

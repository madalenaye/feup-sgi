/**
 * @file MyGuiInterface.js
 * @class MyGuiInterface
 * @desc This class manages and customizes the graphical user interface (GUI) for the application.
 */

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
 * @class
 * @classdesc This class customizes the gui interface for the app
 */

class MyGuiInterface  {

    /**
     * Constructs a GUI interface for the application, enabling user interaction with the scene.
     * @constructor
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
        this.wireframeEnabled = false;
        this.lightsEnabled = true;
    }

    onContentsReady() {
        console.info("Contents ready. Initializing GUI.");
        this.init();
    }

    /**
     * Set the contents object
     * @method
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     * @method
     */
    init() {


        let cameras = (this.app.cameras);
        delete cameras.PerspectiveError;
        this.cameraNames = Object.keys(cameras);

        const cameraFolder = this.datgui.addFolder('Camera');

        cameraFolder.add(this.app, 'activeCameraName', this.cameraNames)
            .name('Active Camera')
            .onChange((cameraName) => {
                this.app.setActiveCamera(cameraName);
            });
        cameraFolder.add(this.app.activeCamera.position, 'x', -50, 50).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', -50, 50).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', -50, 50).name("z coord")
        cameraFolder.add(this.contents.axis, "visible", false).name("Axis")

        cameraFolder.open();
        
        /*
        this.datgui.add(this, 'wireframeEnabled')
        .name('Wireframe') 
        .onChange((value) => {
            if (value) {
                this.contents.activeWireframe(); 
            } else {
                this.contents.disableWireframe();
            }
        });
        
        this.datgui.add(this, 'lightsEnabled').name('Lights').onChange( (value) =>{
            if (value){this.contents.turnOnLights();}
            else {this.contents.turnOffLights();}
        })
            */

    }
}

export { MyGuiInterface };
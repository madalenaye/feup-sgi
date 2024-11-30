import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
        this.wireframeEnabled = false;
    }

    onContentsReady() {
        console.info("Contents ready. Initializing GUI.");
        this.init();
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {


        let cameras = (this.app.cameras);
        delete cameras.PerspectiveError;
        this.cameraNames = Object.keys(cameras);

        const cameraFolder = this.datgui.addFolder('Camera');

        // Adiciona o controle "Active Camera" dentro do folder
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

        this.datgui.add(this, 'wireframeEnabled')
        .name('Wireframe') 
        .onChange((value) => {
            if (value) {
                this.contents.activeWireframe(); 
            } else {
                this.contents.disableWireframe();
            }
        });
        
    }
}

export { MyGuiInterface };
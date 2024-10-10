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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // adds a folder to the gui interface for the light
        const lightFolder = this.datgui.addFolder('Light')
        lightFolder.addColor({ color: this.contents.spotLight.color.getHex() }, 'color').name("Spotlight color").onChange((value) => { this.contents.updateSpotLightColor(value); });
        lightFolder.add(this.contents.spotLight, "intensity", 0, 100).name("Intensity").onChange( (value) => { this.contents.updateSpotLightIntensity(value) } );
        lightFolder.add(this.contents.spotLight, "distance", 0, 100).name("Limit Distance").onChange( (value) => { this.contents.updateSpotLightDistance(value) } );
        lightFolder.add(this.contents.spotLight, "angle", 0, 180).name("Angle").onChange( (value) => { this.contents.updateSpotLightAngle(value) } );
        lightFolder.add(this.contents.spotLight, "penumbra", 0, 1).name("Penumbra").onChange( (value) => { this.contents.updateSpotLightPenumbra(value) } );
        lightFolder.add(this.contents.spotLight, "decay", 0, 5).name("Decay").onChange( (value) => { this.contents.updateSpotLightDecay(value) } );
        lightFolder.add(this.contents.lightPosition, "x", 0, 10).name("Position X").onChange( (value) => { this.contents.updateSpotLightPositionX(value) } );
        lightFolder.add(this.contents.lightPosition, "y", 0, 10).name("Position Y").onChange( (value) => { this.contents.updateSpotLightPositionY(value) } );

        lightFolder.open()
    }
}

export { MyGuiInterface };
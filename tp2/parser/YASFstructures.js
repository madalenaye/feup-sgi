

class YASFstructures{

    constructor(){

        this.options = null;
        this.fog = null;

        this.materials = []
        this.lights = [];
        this.textures = [];
        
        this.cameras = [];
        this.activeCameraId = null;
        
        this.nodes = [];
        this.rootId = null;
    
        this.descriptors = [];

        this.customAttributeName = "custom"

        this.descriptors["fog"] = [
            {name: "color", type: "rgb"},
            {name: "near", type: "float"},
            {name: "far", type: "float"},
        ]

        this.descriptors["orthogonal"] = [
            {name: "id", type: "string"},
            {name: "type", type: "string"},
            {name: "near", type: "float"},
            {name: "far", type: "float"},
            {name: "location", type: "vector3"},
            {name: "target", type: "vector3"},
            {name: "left", type: "float"},
            {name: "right", type: "float"},
            {name: "bottom", type: "float"},
            {name: "top", type: "float"},
        ]
      
        this.descriptors["perspective"] = [
            {name: "id", type: "string"},
            {name: "type", type: "string"},
            {name: "angle", type: "float"},
            {name: "near", type: "float"},
            {name: "far", type: "float"},
            {name: "location", type: "vector3"},
            {name: "target", type: "vector3"}
        ]

        this.primaryNodeIds = ["globals", "fog" ,"textures", "materials", "cameras", "graph"]
    }

    createCustomAttributeIfNotExists(obj) {
        if (obj[this.customAttributeName] === undefined || obj[this.customAttributeName] === null) obj[this.customAttributeName] = {}
    }

    setFog(fog) {
        this.fog = fog;
        this.createCustomAttributeIfNotExists(fog)
        console.debug("added fog " + JSON.stringify(fog));
    }

    getFog() {
        return this.fog;
    }

    getCamera(id) {
        let value = this.cameras[id]
        if (value === undefined) return null
        return value
    };

    setActiveCamera(id) {
        this.activeCameraId = id;
    }

    getActiveCameraID(){
        return this.activeCameraId;
    }

    addCamera(camera) {
        if (camera.type !== "orthogonal" && camera.type !== "perspective") {
            throw new Error("inconsistency: unsupported camera type " + camera.type + "!");
        }

        let obj = this.getCamera(camera.id);
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a camera with id " + camera.id + " already exists!");
        }
        this.cameras[camera.id] = camera
        this.createCustomAttributeIfNotExists(camera)
        console.debug("added camera " + JSON.stringify(camera))
    }

}
export { YASFstructures };
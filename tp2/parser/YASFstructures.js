

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

}
export { YASFstructures };
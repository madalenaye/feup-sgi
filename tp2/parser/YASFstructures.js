

class YASFstructures{

    constructor(){

        this.options = null;
        this.fog = null;

        this.materials = []
        this.lights = [];
        this.textures = ["tableTex", "leftWallTex", "rightWallTex", "floorTex", "crimeWeaponTex", "tapeTex", "tapeSupportTex", "pineTex", "vaseTex"];
        
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

        this.descriptors["material"] = [
            {name: "id", type: "string"},
            {name: "color", type: "rgb"},
            {name: "specular", type: "rgb"},
            {name: "emissive", type: "rgb"},
            {name: "shininess", type: "float"},
            {name: "transparent", type: "boolean"},
            {name: "opacity", type: "float"},
            {name: "wireframe", type: "boolean", required: false, default: false},
            {name: "shading", type: "boolean", required: false, default: false},
            {name: "textureref", type: "string", required: false, default: null}, // The color map. May optionally include an alpha channel. The texture map color is modulated by the diffuse color. Default null.
            {name: "texlength_s", type: "float", required: false, default: 1.0},
            {name: "texlength_t", type: "float", required: false, default: 1.0},
            {name: "twosided", type: "boolean", required: false, default: false},
            {name: "bumpref", type: "string", required: false, default: null}, // bump map is to be used in later classes
            {name: "bumpscale", type: "float", required: false, default: 1.0},
            {name: "specularref", type: "string", required: false, default: null} // bump map is to be used in later classes
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

    getMaterial(id) {
        let value = this.materials[id]
        if (value === undefined) return null
        return value
    }

    addMaterial(material) {
        let obj = this.getMaterial(material.id); 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a material with id " + material.id + " already exists!");		
        }

        if(material.textureref !== null){
            if(!this.textures.includes(material.textureref)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.textureref + " identifier set incorrectly. The texture with the identifier " + material.textureref +" does not exist.");
            }
        }
        if(material.bumpref !== null){
            if(!this.textures.includes(material.bumpref)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.bumpref + " identifier set incorrectly. The texture with the identifier " + material.bumpref +" does not exist.");
            }
        }
        if(material.specularref !== null){
            if(!this.textures.includes(material.specularref)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.specularref + " identifier set incorrectly. The texture with the identifier " + material.specularref +" does not exist.");
            }
        }
        this.materials[material.id] = material;
        this.createCustomAttributeIfNotExists(material)
        console.debug("added material " + JSON.stringify(material));
    };

}
export { YASFstructures };
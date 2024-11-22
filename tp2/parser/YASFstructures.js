

class YASFstructures{

    constructor(){

        this.options = null;
        this.fog = null;
        this.skybox = null;

        this.materials = []
        this.lights = [];
        this.textures = [];
        
        this.cameras = [];
        this.activeCameraId = null;
        
        this.nodes = [];
        this.rootId = null;
    
        this.descriptors = [];

        this.customAttributeName = "custom"

        this.descriptors["globals"] = [
            {name: "background", type: "rgb"},
            {name: "ambient", type: "rgb"}
        ]

        this.descriptors["fog"] = [
            {name: "color", type: "rgb"},
            {name: "near", type: "float"},
            {name: "far", type: "float"},
        ]

        this.descriptors["skybox"] = [
            {name: "size", type: "vector3" },
            {name: "center", type: "vector3"},
            {name: "emissive", type: "rgb"},
            {name: "intensity", type: "float"},
            {name: "front", type: "string"}, // front
            {name: "back", type: "string"}, // back
            {name: "up", type: "string"}, // up
            {name: "down", type: "string"}, // down
            {name: "left", type: "string"}, // left
            {name: "right", type: "string"}, // right
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

        this.descriptors["texture"] = [
            {name: "id", type: "string" },
            {name: "filepath", type: "string"},
            {name: "isVideo", type: "boolean"}, // a nice way to see if the texture is a video or not            
            {name: "mipmap0", type: "string", required: false, default: "null"},
            {name: "mipmap1", type: "string", required: false, default: "null"},
            {name: "mipmap2", type: "string", required: false, default: "null"},
            {name: "mipmap3", type: "string", required: false, default: "null"},
            {name: "mipmap4", type: "string", required: false, default: "null"},
            {name: "mipmap5", type: "string", required: false, default: "null"},
            {name: "mipmap6", type: "string", required: false, default: "null"},
            {name: "mipmap7", type: "string", required: false, default: "null"},
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

        //Primitives
        this.descriptors["rectangle"] = [
            {name: "type", type: "string"},
            {name: "xy1", type: "vector2"},
            {name: "xy2", type: "vector2"},
            {name: "parts_x", type: "integer", required: false, default: 1},
            {name: "parts_y", type: "integer", required: false, default: 1},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["triangle"] = [
            {name: "type", type: "string"},
            {name: "xyz1", type: "vector3"},
            {name: "xyz2", type: "vector3"},
            {name: "xyz3", type: "vector3"},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["box"] = [
            {name: "type", type: "string"},
            {name: "xyz1", type: "vector3"},
            {name: "xyz2", type: "vector3"},
            {name: "parts_x", type: "integer", required: false, default: 1},
            {name: "parts_y", type: "integer", required: false, default: 1},
            {name: "parts_z", type: "integer", required: false, default: 1},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["cylinder"] = [
            {name: "type", type: "string"},
            {name: "base", type: "float"},
            {name: "top", type: "float"},
            {name: "height", type: "float"},
            {name: "slices", type: "integer"},
            {name: "stacks", type: "integer"},
            {name: "capsclose", type: "boolean", required: false, default: false},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["sphere"] = [
            {name: "type", type: "string"},
            {name: "radius", type: "float"},
            {name: "slices", type: "integer"},
            {name: "stacks", type: "integer"},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "phistart", type: "float", required: false, default: 0.0},
            {name: "philength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["polygon"] = [
            {name: "type", type: "string"},
            {name: "radius", type: "float"},
            {name: "stacks", type: "integer"},
            {name: "slices", type: "integer"},
            {name: "color_c", type: "rgb"},
            {name: "color_p", type: "rgb"},
        ]

        this.descriptors["ring"] = [
            {name: "type", type: "string"},
            {name: "inner", type: "float"},
            {name: "outer", type: "float"},
            {name: "thetasegments", type: "integer"},
            {name: "phisegments", type: "integer"},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        this.descriptors["circle"] = [
            {name: "type", type: "string"},
            {name: "radius", type: "float"},
            {name: "segments", type: "integer"},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]

        // to be used in final classes of TP2 or in TP3
        this.descriptors["model3d"] = [
            {name: "type", type: "string"},
            {name: "filepath", type: "string"},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]
        //---------------------

        // NURBS
        this.descriptors["nurbs"] = [
            {name: "type", type: "string"},
            {name: "degree_u", type: "integer"},
            {name: "degree_v", type: "integer"},
            {name: "parts_u", type: "integer"},
            {name: "parts_v", type: "integer"},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
            {name: "controlpoints", type: "list", listOf: "controlpoint"},
        ]

        this.descriptors["controlpoint"] = [
            {name: "position", type: "vector3"}
        ]

        // -------------------

        this.descriptors["pointlight"] = [
            {name: "id", type: "string"},
            {name: "type", type: "string"},
            {name: "enabled", type: "boolean", required: false, default: true},
            {name: "color", type: "rgb"},
            {name: "intensity", type: "float", required: false, default: 1.0},
            {name: "distance", type: "float", required: false, default: 1000},
            {name: "decay", type: "float", required: false, default: 2.0},
            {name: "position", type: "vector3"}, 
            {name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},		
        ]

        this.descriptors["spotlight"] = [
            {name: "id", type: "string"},
            {name: "type", type: "string"},
            {name: "enabled", type: "boolean", required: false, default: true},
            {name: "color", type: "rgb"},
            {name: "intensity", type: "float", required: false, default: 1.0},
            {name: "distance", type: "float", required: false, default: 1000},
            {name: "angle", type: "float"},
            {name: "decay", type: "float", required: false, default: 2.0},
            {name: "penumbra", type: "float", required: false, default: 1.0},
            {name: "position", type: "vector3"},
            {name: "target", type: "vector3"},
            {name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},
        ]

        this.descriptors["directionallight"] = [
            {name: "id", type: "string"},
            {name: "type", type: "string"},
            {name: "enabled", type: "boolean", required: false, default: true},
            {name: "color", type: "rgb"},
            {name: "intensity", type: "float", required: false, default: 1.0},
            {name: "position", type: "vector3"},
            {name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowleft", type: "float", required: false, default: -5.0},
            {name: "shadowright", type: "float", required: false, default: 5.0}, 
            {name: "shadowbottom", type: "float", required: false, default: -5.0},
            {name: "shadowtop", type: "float", required: false, default: 5.0}, 
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},
        ]

        this.primaryNodeIds = ["globals", "fog" ,"textures", "materials", "cameras", "graph"]
        this.primitiveIds = ["cylinder", "rectangle", "triangle", "sphere", "nurbs" , "box", "model3d", "skybox", "lod", "polygon", "ring", "circle"]
        this.lightIds = ["spotlight", "pointlight", "directionallight"]
    }

    createCustomAttributeIfNotExists(obj) {
        if (obj[this.customAttributeName] === undefined || obj[this.customAttributeName] === null) obj[this.customAttributeName] = {}
    }

    setOptions(options) {
        this.options = options;
        this.createCustomAttributeIfNotExists(options)
        console.debug("added options " + JSON.stringify(options));
    }

    getOptions() {
        return this.options;
    }

    setFog(fog) {
        this.fog = fog;
        this.createCustomAttributeIfNotExists(fog)
        console.debug("added fog " + JSON.stringify(fog));
    }

    getFog() {
        return this.fog;
    }

    setSkyBox(skybox){
        this.skybox = skybox;
        this.createCustomAttributeIfNotExists(skybox);
        console.debug("added skyBox " + JSON.stringify(skybox));
    }

    getSkyBox(){
        return this.skybox;
    }

    getRootId(){
        return this.rootId;
    }

    setRootId(rootId) {
        console.debug("set graph root id to '" + rootId + "'");
        this.rootId = rootId;
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

    getCameras(){
        return this.cameras;
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

    getMaterials(){
        return this.materials;
    }

    addMaterial(material) {
        let obj = this.getMaterial(material.id); 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a material with id " + material.id + " already exists!");		
        }

        if(material.textureref !== null){
            if(!(material.textureref in this.textures)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.textureref + " identifier set incorrectly. The texture with the identifier " + material.textureref +" does not exist.");
            }
        }
        if(material.bumpref !== null){
            if(!(material.bumpref in this.textures)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.bumpref + " identifier set incorrectly. The texture with the identifier " + material.bumpref +" does not exist.");
            }
        }
        if(material.specularref !== null){
            if(!(material.specularref in this.textures)){
                throw new Error("Inconsistency: Material " + material.id + " has the texture " + material.specularref + " identifier set incorrectly. The texture with the identifier " + material.specularref +" does not exist.");
            }
        }
        this.materials[material.id] = material;
        this.createCustomAttributeIfNotExists(material)
        console.debug("added material " + JSON.stringify(material));
    };

    addTexture(texture) {
        let obj = this.getTexture(texture.id); 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a texture with id " + texture.id + " already exists!");		
        }
        this.textures[texture.id] = texture;
        this.createCustomAttributeIfNotExists(texture)
        console.debug("added texture" + JSON.stringify(texture))
    };

    getTexture(id) {
        let value = this.textures[id]
        if (value === undefined) return null
        return value
    };

    getTextures(){
        return this.textures;
    }

    getLight(id) {	
        let value = this.lights[id]
        if (value === undefined) return null
        return value
    }

    addLight(light) {
        var obj = this.getLight(light.id);
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a light with id " + light.id + " already exists!");		
        }
        this.lights[light.id] = light;
        this.createCustomAttributeIfNotExists(light)
        console.debug("added light " + JSON.stringify(light));
    }

    getNodes(){
        return this.nodes;
    }

    getNode(id) {	
        let value = this.nodes[id];
        if (value === undefined) return null
        return value
    }

    createEmptyNode(id) {
        let obj = this.getNode(id) 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a node with id " + id + " already exists!");		
        }

		obj = {id: id, transformations: [], materialIds : [], children: [], loaded: false, type:"node"};
        this.addNode(obj);
        return obj;
	}

    addNode(node) {
        let obj = this.getNode(node.id) 
        if (obj !== null && obj !== undefined) {
            throw new Error("inconsistency: a node with id " + node.id + " already exists!");		
        }
        this.nodes[node.id] = node;
        this.createCustomAttributeIfNotExists(node)
        console.debug("added node " + JSON.stringify(node));
    }

    addChildToNode(node, child) {

        if (child === undefined) {
            throw new Error("inconsistency: undefined child add to node!");		
        }

        if (node.children === undefined) {
            throw new Error("inconsistency: a node has an undefined array of children!");		
        }
        node.children.push(child)
        this.createCustomAttributeIfNotExists(child)
        console.debug("added node child" + JSON.stringify(child));
    }

    createEmptyPrimitive() {
        let obj = { type : "primitive", subtype: null, representations: [], loaded : false}
        return obj
      }

    findParentById(searchId) {
        for (const key in this.nodes) {
            const node = this.nodes[key];
    
            // Verificar se o nó atual possui filhos e se algum tem o ID buscado
            if (node.children && node.children.some(child => child.id === searchId)) {
                return node.materialIds[0]; // Retorna o ID do nó pai
            }
        }
    
        return null; // Retorna null se o pai não for encontrado
    }

}
export { YASFstructures };
import * as THREE from 'three';
import { YASFstructures } from './YASFstructures.js';
/**
 *  This class contains the json parser
 *  Credits: Alexandre Valle (alexandre.valle@fe.up.pt)
 *  Version: 2023-10-13
 * 
 *  DO NOT CHANGE THIS FILE. IT WILL BE MODIFIED OR REPLACED DURING EVALUATION
 * 
 *  1. in a given class file MyWhateverNameClass.js in the constructor call:
 * 
 *  this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
 *  this.reader.open("scenes/<path to json file>.json");	
 * 
 *  The last argumet in the constructor is a method that is called when the json file is loaded and parsed (see step 2).
 * 
 *  2. in the MyWhateverNameClass.js class, add a method with signature: 
 *     onSceneLoaded(data) {
 *     }
 * 
 *  This method is called once the json file is loaded and parsed successfully. The data argument is the entire scene data object. 
 * 
 */

class MyFileReader  {

    /**
       constructs the object
    */ 
    constructor(onSceneLoadedCallback) {
      this.data = new YASFstructures();
      this.errorMessage = null;
      this.onSceneLoadedCallback = onSceneLoadedCallback;
    }

    open(jsonfile)  {
      fetch(jsonfile)
        .then((res) => {
            if (!res.ok) {
                throw new Error (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
          this.readJson(data);
		  console.log(this.data.getNodes());
          this.onSceneLoadedCallback(this.data);
        })
        .catch((error) =>
            console.error("Unable to fetch data:", error));
    };

	/**
     * Method to read the json file and loads the data
	 * @method
     * @param {Object} data - JSON data to read and organize.
     */
	readJson(data){
		try {
			let rootElement = data["yasf"];
			if (!rootElement) {
				throw new Error("Root element 'yasf' is missing in the JSON data.");
			}

			this.loadGlobals(rootElement);
			this.loadTextures(rootElement);
			this.loadMaterials(rootElement);
			this.loadCameras(rootElement);
			this.loadNodes(rootElement);
		}
		catch (error) {
			this.errorMessage = error;
			console.error("Error while reading JSON data:", error.message);
		}

	}

	/**
	 * Method that checks whether an identifier is written in lowercase letters
	 * @method
	 * @param {string} identifier - The identifier to be checked
	 * @param {string} element - The element where the identifier is
	 * @returns {boolean} returns a boolean that indicates whether it is in lowercase letters
	 */
	checkLowercase(identifier, element){
		let lowercase = identifier === identifier.toLowerCase();
		if(lowercase == false){
			throw new Error("Element " + element + ": The identifier " + identifier + " must be in lowercase letters");
		}
	}

	/**
	 * checks if any unknown node is child a given element
	 * @param {*} parentElem 
	 * @param {Array} list an array of strings with the valid node names
	 */
	checkForUnknownNodes(parentElem, list) {
		// for each of the elem's children
		for (let i=0; i< parentElem.children.length; i++) {	
			let elem = parentElem.children[i]
			// is element's tag name not present in the list?
			if (list.includes(elem.tagName) === false) {
				// unkown element. Report!
				throw new Error("unknown json element '" + elem.tagName + "' descendent of element '" + parentElem.tagName + "'")
			}
		}
	}

	/**
	 *  checks if any unknown attributes exits at a given element
	 * @param {*} elem 
	 *  @param {Array} list an array of strings with the valid attribute names	  
	*/
	checkForUnknownAttributes(elem, list, key) {
		// for each elem attributes
		for (let attrib in elem) {
				if (list.includes(attrib) === false) {
					// report!
					throw new Error("unknown attribute '" + attrib + "' in element " + key);
				}
		}
	}

	toArrayOfNames(descriptor) {
		let list = []
		// for each descriptor, get the value
		for (let i=0; i < descriptor.length; i++) {
			list.push(descriptor[i].name)
		}
		return list 
	}

	/**
	 * returns the index of a string in a list. -1 if not found
	 * @param {Array} list an array of strings
	 * @param {*} searchString the searched string
	 * @returns the zero-based index of the first occurrence of the specified string, or -1 if the string is not found
	 */
	indexOf(list, searchString) {
		if(Array.isArray(list)) {
			return list.indexOf(searchString)
		}
		return -1;
	}

	/**
	 * extracts the color (rgba) from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {String} attributeName the attribute name
	 * @param {Boolean} required if the attribte is required or not
	 * @returns {THREE.Color} the color encoded in a THREE.Color object
	 */
	getRGBA(element, attributeName, required, yasfAttribute) {
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("rgb attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + yasfAttribute + "': rgb value is null for attribute '" + attributeName + "'."); 
			}
			return null;
		}
		else{
			for (let component of ["r", "g", "b"]) {
				if (value[component] < 0 || value[component] > 255) {
					throw new Error(
						"'Invalid RGB value for '" +
						attributeName + "' in component '" + component +
						"' of element '" + yasfAttribute + "'. It must be between 0 and 255."
					);
				}
			}
		}

		return this.getVectorN(value, ["r", "g", "b"], yasfAttribute, attributeName);
	}

	getRGBI(element, attributeName, required, yasfAttribute){
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("rgb attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + yasfAttribute + "': rgb value is null for attribute '" + attributeName + "'."); 
			}
			return null;
		}
		else{
			for (let component of ["r", "g", "b"]) {
				if (value[component] < 0 || value[component] > 255) {
					throw new Error(
						"'Invalid RGB value for '" +
						attributeName + "' in component '" + component +
						"' of element '" + yasfAttribute + "'. It must be between 0 and 255."
					);
				}
			}
		}

		return this.getVectorN(value, ["r", "g", "b", "intensity"], yasfAttribute, attributeName);
	}

	/**
	 * returns a rectangle2D from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {String} attributeName the attribute name 
	 * @param {boolean} required if the attribte is required or not
	 * @returns {Array} an array object with 4 elements: x1, y1, x2, y2
	 */
	getRectangle2D(element, attributeName, required) {
		
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null.");
		}
		if (attributeName == null) {
			throw new Error("rectangle2D attribute name is null."); 
		}
			
		let value = element.getAttribute(attributeName);
		if (value == null) {
			if (required) {
				throw new Error("element '" + element.id + ": rectangle2D value is null for attribute " + attributeName + "."); 
			}
			return null;
		}
		
		let  temp = value.split(' ');
		if (temp.length != 4) {
			throw new Error("element '" + element.id + ": invalid " + temp.length + " number of components for a rectangle2D, in attribute " + attributeName + "."); 
		}
		
		let rect = {};
		rect.x1 = parseFloat(temp[0]);
		rect.y1 = parseFloat(temp[1]);
		rect.x2 = parseFloat(temp[2]);
		rect.y2 = parseFloat(temp[3]);
		return rect;
	}

  getVectorN(value, keys, yasfAttribute, attributeName) {
		let vector = new Array();
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const component = value[key];
      if (component === null || component === undefined) {
				throw new Error("element '" + yasfAttribute + "': vector" + keys.length + " value is null for '" + key + "'" + " in " + attributeName);
      }
			 vector.push(component);
    }
    return vector;
  }

	/**
	 * returns a vector3 from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the attribute name 
	 * @param {*} required if the attribte is required or not
	 * @returns {THREE.vector3} the vector3 encoded in a THREE.Vector3 object
	 */
	getVector3(element, attributeName, required, yasfAttribute) {
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("vector3 attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + yasfAttribute + "': vector3 value is null for attribute '" + attributeName + "' in element '" + yasfAttribute + "'."); 
			}
			return null;
		}
		return this.getVectorN(value, ["x", "y", "z"], yasfAttribute, attributeName);
	}

	/**
	 * returns a vector2 from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the attribute name 
	 * @param {*} required if the attribte is required or not
	 * @returns {THREE.vector3} the vector2 encoded in a THREE.Vector3 object
	 */
	getVector2(element, attributeName, required) {
		
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("vector3 attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + element.id + ": vector2 value is null for attribute " + attributeName + "."); 
			}
			return null;
		}
		
		return this.getVectorN(value, ["x", "y"]);
	}
	/**
	 * returns an item from an element for a particular attribute and checks if the item is in the list of choices
	 * @param {*} element the xml element
	 * @param {*} attributeName the
	 * @param {*} choices the list of choices
	 * @param {*} required if the attribte is required or not
	 * @returns {String} the item
	 */
	getItem (element, attributeName, choices, required) {
		
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("item attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + element.id + ": item value is null for attribute " + attributeName + "."); 
			}
			return null;		
		}
		
		value = value.toLowerCase();
		let index = this.indexOf(choices, value);
		if (index < 0) {
			throw new Error("element '" + element.id + ": value '" + value + "' is not a choice in [" + choices.toString() + "]"); 
		}
		
		return value;
	}
	
	/**
	 * returns a string from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the attribute name
	 * @param {*} required if the attribte is required or not
	 * @returns {String} the string
	 */
	getString (element, attributeName, required) {
		
		if (required == undefined) required = true;
		
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("string attribute name is null."); 
		}
			
		let value = element[attributeName];
		if (value == null) {
			if(required){
				throw new Error("element '" + element + ": in element '" + element + "' string value is null for attribute '" + attributeName + "'.");
			}
			return null;
		}
		return value;
	}
	
	/**
	 * checks if an element has a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName 
	 * @returns {boolean} if the element has the attribute
	 */
	hasAttribute (element, attributeName) {
		if (element == null) {
			throw new Error("element is null."); 
		}
		if (attributeName == null) {
			throw new Error("string attribute name is null."); 
		}
			
		let value = element.getAttribute(attributeName);
		return (value != null);
	}

	changeShadingValue(element, attributeName){
		if(element[attributeName] == false){
			element[attributeName] = "smooth";
		}
		else{
			element[attributeName] = "flat";
		}
		return element[attributeName]
	}
	
	/**
	 * returns a boolean from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the 
	 * @param {*} required if the attribte is required or not
	 * @returns {boolean} the boolean value
	 */
	getBoolean(element, attributeName, required, yasfAttribute) {
		if (required == undefined) required = true;

		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + yasfAttribute + ": in element '" + yasfAttribute + "' bool value is null for attribute '" + attributeName + "'."); 
			}
			return null;
		}
		if (typeof value !== "boolean") {
			throw new Error("element '" + yasfAttribute + ": in element '" + yasfAttribute + "' attribute '" + attributeName + "' should be bool but is '" + (typeof value) + "'")
		}
		if(attributeName == "shading"){
			return this.changeShadingValue(element, attributeName);
		}

		return value
	}
	
	/**
	 * returns a integer from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the 
	 * @param {*} required if the attribte is required or not
	 * @returns {Integer} the integer value
	 */
	getInteger(element, attributeName, required) {
		if (required == undefined) required = true;

		let value = element[attributeName];
		if (value == null) {
      if (required) {
        throw new Error("element '" + element + ": in element '" + element + "' integer value is null for attribute '" + attributeName + "'."); 
      }
      return null;
		}
    if (!Number.isInteger(value)) {
			throw new Error("element '" + element + ": in element '" + element + "' attribute '" + attributeName + "' should be integer but is '" + (typeof value) + "'")
    }

		return value
	}
	
	/**
	 * returns a float from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the 
	 * @param {*} required if the attribte is required or not
	 * @returns {Float} the float value
	 */
	getFloat(element, attributeName, required, yasfAttribute) {
		if (required == undefined) required = true;

		let value = element[attributeName];
		if (value == null) {
			if (required) {
				throw new Error("element '" + yasfAttribute + ": in element '" + yasfAttribute + "' float value is null for attribute '" + attributeName + "'."); 
			}
			return null;
		}
		if (typeof value !== "number") {
				throw new Error("element '" + element + ": in element '" + element + "' attribute '" + attributeName + "' should be float but is '" + (typeof value) + "'")
		}
		return value
	}

	/*
   * TODO: Fix commet
		Load a xml attributes item based on a descriptor:
		Example: options = {elem: elem, descriptor: descriptor, extras: [["type", "pointlight"]]}
		where elem is a xml element, descriptor is an array of all the attributes description and extras are extra
		attributes to add to the resulting object.

		Each attribute descriptor is an object with the following properties:
		- name: the name of the attribute
		- type: the type of the attribute (string, boolean, integer, float, vector3, vector2, rgba, rectangle2D, item)
		- required: true if the attribute is required, false otherwise
		- default: the default value if the attribute is not required and not present in the xml element
		- choices: an array of choices if the type is item

	*/
  loadJsonItem(options) {
		// create an empty object
		let obj = {}
		if (options === null || options === undefined) {
			throw new Error("unable to load json item because arguments are null or undefined");
		}

		if (options.elem === null || options.elem === undefined) {
			throw new Error("unable to load json item because json element is null or undefined");
		}
				
		if (options.descriptor === null || options.descriptor === undefined) {
			throw new Error("unable to load json item because descriptor to parse element '" + options.elem.id + "' is null or undefined");
		}

		if (options.elem.id !== null && options.elem.id !== undefined) {
		throw new Error("unable to load json item because id is already set in the item");
		}

		// Add the id to the element if the descriptor requires it
		for (let i in options.descriptor) {
			const attr = options.descriptor[i];
			if (attr.name == "id") {
				options.elem["id"] = options.key;
			}
		}

		if(options.key != "globals"){
			this.checkForUnknownAttributes(options.elem, this.toArrayOfNames(options.descriptor), options.key)
		}
		// for each descriptor, get the value
		for (let i=0; i < options.descriptor.length; i++) {
			let value = null;
			let descriptor = options.descriptor[i]

			if (descriptor.type==="string")  {
				value = this.getString(options.elem, descriptor.name, descriptor.required);
      }
			else if (descriptor.type==="boolean") {
				value = this.getBoolean(options.elem, descriptor.name, descriptor.required, options.key);
      }
			else if (descriptor.type==="integer") {
				value = this.getInteger(options.elem, descriptor.name, descriptor.required);	
      }
			else if (descriptor.type==="float") {
				value = this.getFloat(options.elem, descriptor.name, descriptor.required, options.key);	
      }
			else if (descriptor.type==="vector3") {
				value = this.getVector3(options.elem, descriptor.name, descriptor.required, options.key);
      }
			else if (descriptor.type==="vector2") {
				value = this.getVector2(options.elem, descriptor.name, descriptor.required);
      }
			else if (descriptor.type==="rgb") {
				value = this.getRGBA(options.elem, descriptor.name, descriptor.required, options.key);
      }
	  		else if (descriptor.type==="rgbi") {
				value = this.getRGBI(options.elem, descriptor.name, descriptor.required, options.key);
	  }
			else if (descriptor.type==="rectangle2D") {
				value = this.getRectangle2D(options.elem, descriptor.name, descriptor.required);
      }
			else if (descriptor.type==="item") {
				value = this.getItem(options.elem, descriptor.name, descriptor.choices, descriptor.required);
      }
      else if (descriptor.type==="list") {
        let newDescriptor = this.data.descriptors[descriptor.listOf];
        value = [];
        for (let key in options.elem[descriptor.name]) {
          let newObj = this.loadJsonItem({
            elem: options.elem[descriptor.name][key],
            descriptor: newDescriptor,
            extras: []
          });
          value.push(newObj);
        }
      }
			else {
				throw new Error("element '" + options.elem + " invalid type '" + descriptor.type + "' in descriptor");
			} 

			// if the value is null and the attribute is not required, then use the default value
			if (value == null && descriptor.required == false && descriptor.default != undefined) {
				if(descriptor.name == "shading"){
					value = "smooth";
				}
				else{
					value = descriptor.default;
				}

			}
			
			// store the value in the object
			obj[descriptor.name] = value;
		}
		// append extra parameters if any
		for (let i=0; i < options.extras.length; i++) {
			let extra = options.extras[i]
			obj[extra[0]] = extra[1]
		}

		// return the object
		return obj;
  }
	
  loadJsonItems(parentElemen, tagName, descriptor, extras, addFunc) {
    for (let elem in parentElemen) {
		this.checkLowercase(elem, tagName);
		let obj = this.loadJsonItem({
			key: elem,
			elem: parentElemen[elem],
			descriptor: descriptor,
			extras: extras
		});
		addFunc.bind(this.data)(obj);
    }
  }

	/*
	 * Load globals element
	 * 
	 */
  loadGlobals(rootElement) {
    let globals = rootElement["globals"];
	if (!globals) {
		throw new Error("Element 'globals' is missing in the JSON data and it is mandatory to have.");
	}
    this.data.setOptions(this.loadJsonItem({
      key: "globals",
      elem: globals,
      descriptor: this.data.descriptors["globals"],
      extras: [["type", "globals"]]
    }));
	this.loadFog(globals);
	this.loadSkyBox(globals);
  }

	/*
	 * Load fog element
	 * 
	 */
  loadFog(rootElement) {
    let fog = rootElement["fog"];
	if (!fog) {
		throw new Error("Element 'fog' is missing in the JSON data and it is mandatory to have.");
	}
	this.data.setFog(this.loadJsonItem({ key: "fog", elem: fog, descriptor: this.data.descriptors["fog"], extras: [["type", "fog"]]}))
  	}

	loadSkyBox(rootElement){
		let skybox = rootElement["skybox"];
		if(!skybox){
			throw new Error("Element 'skybox' is missing in the JSON data and it is mandatory to have.");
		}
		this.data.setSkyBox(this.loadJsonItem({ key: "skybox", elem: skybox, descriptor: this.data.descriptors["skybox"], extras: [["type", "skybox"]]}))
	}

	validateMipmaps(textures){
		Object.entries(textures).forEach(([key, texture]) => {
			const mipmapsDefined = [];
			for (let i = 0; i <= 7; i++) {
				if (`mipmap${i}` in texture) {
					mipmapsDefined.push(i);
				}
			}
	
			if (mipmapsDefined.length > 0) {
				for (let i = 0; i <= 7; i++) {
					if (!(`mipmap${i}` in texture)) {
						throw new Error(
							`Inconsistency in texture '${key}': 'mipmap${i}' is missing, but other mipmaps are defined (${mipmapsDefined.join(", ")}).`
						);
					}
				}
			}
		});
	}

	/**
	 * Load the textures element
	 * @param {*} rootElement 
	 */
	loadTextures(rootElement) {
		let elem = rootElement["textures"];
		if(!elem){
			throw new Error("Element 'textures' is missing in the JSON data and it is mandatory to have. However it may be empty");
		}
		this.validateMipmaps(elem);
		this.loadJsonItems(elem, 'texture', this.data.descriptors["texture"], [["type", "texture"]], this.data.addTexture)
	}

	/**
	 * Load the materials element
	 * @param {*} rootElement 
	 */
	loadMaterials(rootElement) {
		let elem = rootElement["materials"];
		if (!elem) {
			throw new Error("Element 'materials' is missing in the JSON data and it is mandatory to have.");
		}
		if(Object.keys(elem).length < 1){
			throw new Error("Element 'materials': you need to at least define a material.");
		}
		this.loadJsonItems(elem, 'materials', this.data.descriptors["material"], [["type", "material"]], this.data.addMaterial)
	}

	/**
	 * Load the cameras element
	 * @param {*} rootElement 
	 */
	loadCameras(rootElement) {
		//TODO: Verificar se os identificadores estão vazios.
		let camerasElem = rootElement["cameras"];
		if (!camerasElem) {
			throw new Error("Element 'cameras' is missing in the JSON data and it is mandatory to have.");
		}
		let initial = false;
		if(Object.keys(camerasElem).length < 2){
			throw new Error("Element 'cameras': you need to at least define a camera.");
		}

		for (let key in camerasElem) {
			let elem = camerasElem[key];
			if (key == "initial") {
				initial = true
				this.data.setActiveCamera(elem);
				continue;
			}

			let camType = elem["type"];
			if (camType == "orthogonal") {
				if (initial === false){
					throw new Error("Element 'cameras': 'cameras' element needs 'initial' attribute");
				}
				//TODO: Verificar se o ID vem vazio.
				this.checkLowercase(key, "'cameras'");
				this.data.addCamera(this.loadJsonItem({
				key: key,
				elem: elem,
				descriptor: this.data.descriptors["orthogonal"],
				extras: [["type", "orthogonal"]]
				}));
			}
			else if (camType == "perspective") {
				if (initial === false){
					throw new Error("Element 'cameras': 'cameras' element needs 'initial' attribute");
				}
				this.checkLowercase(key, "'cameras'");
				this.data.addCamera(this.loadJsonItem({
				key: key,
				elem: elem,
				descriptor: this.data.descriptors["perspective"],
				extras: [["type", "perspective"]]
				}));
			}
			else {
				throw new Error("Unrecognized camera type '" + camType + "' in camera '" + key + "'");
			}
		}
		if (!(this.data.getActiveCameraID() in camerasElem)){
			throw new Error("Element 'cameras': The 'initial' attribute must be filled with an existing camera.");
		} 
	}

	checkMaterialId(materialId, nodeId){
		let result = this.data.getMaterial(materialId);
		if(result == null){
			throw new Error("node " + nodeId + " has a materialId, " + materialId + ", which does not exist in the 'materials' section" );
		}
	}


	/**
	 * Load the nodes element
	 * @param {*} rootElement 
	 */
	loadNodes(rootElement) {
		let graphElem = rootElement["graph"];
	
		for (let key in graphElem) {
			this.checkLowercase(key, key);
			let elem = graphElem[key];

			if (key == "rootid") {
				this.data.setRootId(elem);
				continue;
			}

			let nodeType = elem["type"]
			if(!this.data.primitiveIds.includes(nodeType) && !this.data.lightIds.includes(nodeType)){
				this.loadNode(key, elem, graphElem);
			}
			
		}
	
	}
	
	/**
	 * Load the data for a particular node elemment
	 * @param {*} nodeElement the xml node element
	 */
	loadNode(id, nodeElement, graphElem) {
    let nodeType = nodeElement["type"];
	
		// get if node previously added (for instance because it was a child ref in other node)
		let obj = this.data.getNode(id);
		if (obj == null) {
			// otherwise add a new node
			obj = this.data.createEmptyNode(id);			
		}
		
		// load transformations
		let transforms =  nodeElement["transforms"];
		if (transforms !== null && transforms !== undefined) {
			this.loadTransforms(obj, transforms);
		}
	
		// load material refeences
		let materialsRef = nodeElement["materialref"];
		if (materialsRef != null) {
      		if (materialsRef["materialId"] === null || materialsRef["materialId"] === undefined) {
        		throw new Error("node " + id + " has a materialref but not a materialId");
			}
			let materialId = this.getString(materialsRef, "materialId");
			this.checkMaterialId(materialId, id);
			obj['materialIds'].push(materialId);
		}
		else{
			let materialParent = this.data.findParentById(id);
			if(materialParent != null){
				obj['materialIds'].push(materialParent);
			}
		}

		//Shadows
		let nodeParent = this.data.findParentById_node(id)

		if(nodeParent != null){
			
			let changedCastShadows = true;
			let changedReceiveShadows = true;
			
			if(nodeParent.castShadows == true){
				changedCastShadows = false;
			}
			if(nodeParent.receiveShadows == true){
				changedReceiveShadows = false;
			}

			let castShadows = this.getBoolean(nodeElement, "castshadows", false, id);
			if(changedCastShadows == true){
				obj.castShadows = castShadows;
			}
			else if(changedCastShadows == false){
				if(castShadows !=null){
					if(castShadows == true){
						obj.castShadows = castShadows;
					}
					else{
						throw new Error("The parent, " + nodeParent.id + ", of this node, " + id + ", has the 'castShadows' property set to 'true'. It cannot be changed");
					}
				}
				else{
					obj.castShadows = nodeParent.castShadows;
				}
			}

			let receiveShadows = this.getBoolean(nodeElement, "receiveshadows", false, id);
			if(changedReceiveShadows == true){
				obj.receiveShadows = receiveShadows;
			}
			else if(changedReceiveShadows == false){
				if(receiveShadows != null){
					if(receiveShadows == true){
						obj.receiveShadows = receiveShadows;
					}
					else{
						throw new Error("The parent, " + nodeParent.id + ", of this node, " + id + ", has the 'receiveShadows' property set to 'true'. It cannot be changed");
					}
				}
				else{
					obj.receiveShadows = nodeParent.receiveShadows;
				}
			}
			
		}
		else{
			let castShadows = this.getBoolean(nodeElement, "castshadows", false, id);
			obj.castShadows = castShadows;

			let receiveShadows = this.getBoolean(nodeElement, "receiveshadows", false, id);
			obj.receiveShadows = receiveShadows;
		}

		// load children (primitives or other node references)
		let children = nodeElement["children"];
		if (children == null) {
			throw new Error("in node " + id + ", a children node is required");
		}
		this.loadChildren(obj, children, graphElem);
		obj.loaded = true;
	}
	
	/**
	 * Load the transformations for a particular node element
	 * @param {*} obj the node object
	 * @param {*} transformsElement the transforms xml element
	 * @returns 
	 */
	loadTransforms(obj, transformsElement) {
    for (let i in transformsElement) {
      const transform = transformsElement[i];
      const transformType = transform["type"];
      if (!["translate", "rotate", "scale"].includes(transformType)) {
        return "unrecognized transformation " + transformType + ".";
      }
      if (transformType == "translate") {
        let translate = this.getVector3(transform, "amount");	
        // add a translation
        obj.transformations.push({type: "T", translate: translate});		
      }
      else if (transformType == "rotate") {
        let factor = this.getVector3(transform, "amount");
        // add a rotation
        obj.transformations.push({type: "R", rotation: factor});		
      }
      else if (transformType == "scale") {
        let factor = this.getVector3(transform, "amount");
        // add a scale
        obj.transformations.push({type: "S", scale: factor});
      }
    }
	}
	
	/**
	 * Load the children for a particular node element
	 * @param {*} nodeObj the node object
	 * @param {*} childrenElement the xml children element
	 */

	loadChildren(nodeObj, childrenElement, graphElem) {
		if (Array.isArray(childrenElement["nodesList"])){
			for (let nodeId of childrenElement["nodesList"]) {
				let childElement = graphElem[nodeId];

				if (!childElement) {
					throw new Error(`Node '${nodeId}' not found in 'graph'.`);
				}
				
				const nodeType = childElement["type"];

				if (nodeType == "node") {
					// add a node ref: if the node does not exist
					// create an empty one and reference it.
					let reference = this.data.getNode(nodeId);
					if (reference === null) {
					// does not exist, yet. create it!
					reference = this.data.createEmptyNode(nodeId);
					}
					// reference it.
					this.data.addChildToNode(nodeObj, reference)
				}
				else if (this.data.primitiveIds.includes(nodeType)) {
					let primitiveObj = this.data.createEmptyPrimitive();
					this.loadPrimitive(childElement, primitiveObj, nodeType);
					this.data.addChildToNode(nodeObj, primitiveObj);
				}
				else {
					throw new Error("unrecognized child type '" + nodeType + "'.");
				}
			}
		}

		for (let key in childrenElement) {
			if (key !== "nodesList") {
				const childElement = childrenElement[key];
				const nodeType = childElement["type"];
	
				if (this.data.lightIds.includes(nodeType)) {
					let lightObj = this.loadLight(key, childElement, nodeType);
					this.data.addChildToNode(nodeObj, lightObj);
				}
				else if(this.data.primitiveIds.includes(nodeType)){
					let primitiveObj = this.data.createEmptyPrimitive();
					this.loadPrimitive(childElement, primitiveObj, nodeType);
					this.data.addChildToNode(nodeObj, primitiveObj);
				}
			}
		}
	}

	/**
	 * Loads a light object into a new object
	 * @param {*} elem 
	 * @returns 
	 */
	loadLight(id, elem, lightType) {
		let descriptor = this.data.descriptors[lightType];
		let obj = this.loadJsonItem({
      elem: elem,
      key: id,
      descriptor: descriptor,
      extras: [["type", lightType]]
    })
		return obj;
	}

	checkControlPoints(degree_u, degree_v, lengthControlPoints){
		let correctPoints = (degree_u+1)*(degree_v+1)

		if(lengthControlPoints != correctPoints){
			throw new Error("The control points are poorly defined, you should have " + correctPoints + " control points and have " + lengthControlPoints);
		}
	}

	/**
	 * For a given primitive element, loads the available representations into the primitive object
	 * @param {XML element} parentElem 
	 * @param {*} primitiveObj the primitive object to load data into
	 */
	loadPrimitive(parentElem, primitiveObj, primType) {
    const descriptor = this.data.descriptors[primType];

    const obj = this.loadJsonItem({
      elem: parentElem,
      descriptor: descriptor,
      extras: [["type", "primitive"], ["subtype", primType]]
    })

	if(primType == "nurbs"){
		this.checkControlPoints(obj.degree_u, obj.degree_v, obj.controlpoints.length)
	}

    primitiveObj.subtype = primType;
    primitiveObj.representations.push(obj);
	
    return;
	}
}

export { MyFileReader };

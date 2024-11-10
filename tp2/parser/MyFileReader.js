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

			//this.loadGlobals(rootElement);
			this.loadFog(rootElement);
			//this.loadTextures(rootElement);
			//this.loadMaterials(rootElement);
			this.loadCameras(rootElement);
			//this.loadNodes(rootElement);
		}
		catch (error) {
			this.errorMessage = error;
			console.error("Error while reading JSON data:", error.message);
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
	checkForUnknownAttributes(elem, list) {
		// for each elem attributes
		for (let attrib in elem) {
				if (list.includes(attrib) === false) {
					// report!
					throw new Error("unknown attribute '" + attrib + "' in element");
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
		if (value == null && required) {
			throw new Error("element '" + element + ": in element '" + element + "' string value is null for attribute '" + attributeName + "'."); 
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
	
	/**
	 * returns a boolean from an element for a particular attribute
	 * @param {*} element the xml element
	 * @param {*} attributeName the 
	 * @param {*} required if the attribte is required or not
	 * @returns {boolean} the boolean value
	 */
	getBoolean(element, attributeName, required) {
		if (required == undefined) required = true;

		let value = element[attributeName];
		if (value == null) {
      if (required) {
        throw new Error("element '" + element + ": in element '" + element + "' bool value is null for attribute '" + attributeName + "'."); 
      }
      return null;
		}
    if (typeof value !== "boolean") {
			throw new Error("element '" + element + ": in element '" + element + "' attribute '" + attributeName + "' should be bool but is '" + (typeof value) + "'")
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

		this.checkForUnknownAttributes(options.elem, this.toArrayOfNames(options.descriptor))

		// for each descriptor, get the value
		for (let i=0; i < options.descriptor.length; i++) {
			let value = null;
			let descriptor = options.descriptor[i]
			if (descriptor.type==="string")  {
				value = this.getString(options.elem, descriptor.name, descriptor.required);
      }
			else if (descriptor.type==="boolean") {
				value = this.getBoolean(options.elem, descriptor.name, descriptor.required);
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
				value = descriptor.default;
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
    this.data.setOptions(this.loadJsonItem({
      key: "globals",
      elem: globals,
      descriptor: this.data.descriptors["globals"],
      extras: [["type", "globals"]]
    }));
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

	/**
	 * Load the textures element
	 * @param {*} rootElement 
	 */
	loadTextures(rootElement) {
		let elem = rootElement["textures"];
		this.loadJsonItems(elem, 'texture', this.data.descriptors["texture"], [["type", "texture"]], this.data.addTexture)
	}

	/**
	 * Load the materials element
	 * @param {*} rootElement 
	 */
	loadMaterials(rootElement) {
		let elem = rootElement["materials"];
		this.loadJsonItems(elem, 'material', this.data.descriptors["material"], [["type", "material"]], this.data.addMaterial)
	}

	/**
	 * Load the cameras element
	 * @param {*} rootElement 
	 */
	loadCameras(rootElement) {
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

	/**
	 * Load the nodes element
	 * @param {*} rootElement 
	 */
	loadNodes(rootElement) {
    let graphElem = rootElement["graph"];

    for (let key in graphElem) {
      let elem = graphElem[key];

      if (key == "rootid") {
        this.data.setRootId(elem);
        continue;
      }

      this.loadNode(key, elem);
    }
	}
	
	/**
	 * Load the data for a particular node elemment
	 * @param {*} nodeElement the xml node element
	 */
	loadNode(id, nodeElement) {
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
			obj['materialIds'].push(materialId);
		}

		// load children (primitives or other node references)
		let children = nodeElement["children"];
		if (children == null) {
			throw new Error("in node " + id + ", a children node is required");
		}
		this.loadChildren(obj, children);
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

	loadChildren(nodeObj, childrenElement) {
    for (let child in childrenElement) {
      let childElement = childrenElement[child];
      const nodeType = childElement["type"];

      if (nodeType == "noderef") {
        let id = this.getString(childElement, "nodeId");
        // add a node ref: if the node does not exist
        // create an empty one and reference it.
        let reference = this.data.getNode(id);
        if (reference === null) {
          // does not exist, yet. create it!
          reference = this.data.createEmptyNode(id);
        }
        // reference it.
        this.data.addChildToNode(nodeObj, reference)
      }
      else if (this.data.primitiveIds.includes(nodeType)) {
        let primitiveObj = this.data.createEmptyPrimitive();
        this.loadPrimitive(childElement, primitiveObj, nodeType);
        this.data.addChildToNode(nodeObj, primitiveObj);
      }
      else if (this.data.lightIds.includes(nodeType)) {
        let lightObj = this.loadLight(child, childElement, nodeType)					
        this.data.addChildToNode(nodeObj, lightObj)
      }
      else {
        throw new Error("unrecognized child type '" + nodeType + "'.");
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

    primitiveObj.subtype = primType;
    primitiveObj.representations.push(obj);

    return;
	}
}

export { MyFileReader };

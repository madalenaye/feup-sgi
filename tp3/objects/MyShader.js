/**
 * @file MyShader.js
 * @class MyShader
 * @extends THREE.Object3D
 */

import * as THREE from 'three';

/**
 * @class
 * @classdesc Handles the creation and management of custom shaders using vertex and fragment shader files.
 */

class MyShader {

    /**
     * Constructs a new MyShader instance.
     * @constructor
     * @param {string} vert_url - URL for the vertex shader file.
     * @param {string} frag_url - URL for the fragment shader file.
     * @param {Object} [uniformValues=null] - Optional initial values for shader uniforms.
     */
	constructor(vert_url, frag_url, uniformValues = null) {
		
        this.vert_url = vert_url;
        this.frag_url = frag_url;
        this.uniformValues = uniformValues
        this.material = null
        this.read(vert_url, true)
        this.read(frag_url, false)
    }

    /**
     * @method
     * Updates the value of a uniform variable.
     * @param {string} key - The name of the uniform.
     * @param {*} value - The new value for the uniform.
     */
    updateUniformsValue(key, value) {
        if (this.uniformValues[key]=== null || this.uniformValues[key] === undefined) {
            console.error("shader does not have uniform " + key)
            return;
        }
        this.uniformValues[key].value = value
        if (this.material !== null) {
            this.material.uniforms[key].value = value
        }
    }

    /**
     * @method
     * Reads the shader source code from a URL.
     * @param {string} theUrl - The URL of the shader file.
     * @param {boolean} isVertex - Indicates whether the file is a vertex shader.
     */
    read(theUrl, isVertex) {
        let xmlhttp = null
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        let obj = this
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                
                if (isVertex) { 
                    //console.log("loaded vs " + theUrl)  
                    obj.vertexShader = xmlhttp.responseText 
                }
                else { 
                    //console.log("loaded fs " + theUrl)  
                    obj.fragmentShader = xmlhttp.responseText
                }
                obj.buildShader.bind(obj)()
            }
        }
        xmlhttp.open("GET", theUrl, true)
        xmlhttp.send()
    }

    /**
     * @method
     * Builds the shader material once both vertex and fragment shaders are loaded.
     */
    buildShader() {
        // are both resources loaded? 
        if (this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            // build the shader material
            this.material = new THREE.ShaderMaterial({
                // load uniforms, if any
                uniforms: (this.uniformValues !== null ? this.uniformValues : {}),
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
            }) 
            // report built!
            //console.log("built shader from " + this.vert_url + ", " + this.frag_url)  
            this.ready = true
        }
    }

    /**
     * @method
     * Checks if a uniform variable exists in the shader.
     * @param {string} key - The name of the uniform.
     * @returns {boolean} True if the uniform exists, false otherwise.
     */
    hasUniform(key) {
        return this.uniformValues[key] !== undefined
    }
}
export {MyShader}


/**
 * @file MySprite.js
 * @desc Provides utility methods for handling sprite-based text rendering.
 */

import * as THREE from 'three';

export const MySprite = {

    /**
     * Loads a spritesheet with a specified color.
     * @param {number} color - The color to tint the spritesheet.
     * @returns {THREE.MeshBasicMaterial} - Material configured with the spritesheet texture.
     */
    loadSpritesheet(color) {
        const texture = new THREE.TextureLoader().load("utils/spritesheet2.png");

        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.transparent = true;
        texture.colorSpace = THREE.SRGBColorSpace;

        return new THREE.MeshBasicMaterial({
            map: texture,
            color,
            transparent: true,
            side: THREE.DoubleSide
        });
    },

    /**
     * Creates a single character mesh from the spritesheet.
     * @param {string} char - The character to create.
     * @param {number} charWidth - Width of the character.
     * @param {number} charHeight - Height of the character.
     * @param {THREE.Material} material - Material to apply to the character.
     * @param {number} [totalRows=16] - Total number of rows in the spritesheet.
     * @param {number} [totalColumns=16] - Total number of columns in the spritesheet.
     * @returns {THREE.Mesh} - Mesh representing the character.
     */
    createCharFromSpritesheet(char, charWidth, charHeight, material, totalRows = 16, totalColumns = 16) {

        const ascii = char.charCodeAt(0);
        const col = ascii % totalColumns;
        const row = Math.floor(ascii / totalColumns);

        const uSize = 1 / totalColumns;
        const vSize = 1 / totalRows;
        const uOffset = col * uSize;
        const vOffset = 1 - (row + 1) * vSize;

        const geometry = new THREE.PlaneGeometry(charWidth, charHeight);
        const uv = geometry.attributes.uv;

        uv.setXY(0, uOffset, vOffset + vSize);
        uv.setXY(1, uOffset + uSize, vOffset + vSize);
        uv.setXY(2, uOffset, vOffset);
        uv.setXY(3, uOffset + uSize, vOffset);

        uv.needsUpdate = true;

        return new THREE.Mesh(geometry, material);
    },

    /**
     * Creates a text string by combining multiple character meshes.
     * @param {string} text - The text to render.
     * @param {number} charWidth - Width of each character.
     * @param {number} charHeight - Height of each character.
     * @param {THREE.Material} material - Material to apply to each character.
     * @param {number} [spacing=0] - Spacing between characters.
     * @param {number} [totalRows=16] - Total rows in the spritesheet.
     * @param {number} [totalColumns=16] - Total columns in the spritesheet.
     * @returns {THREE.Group} - Group containing all character meshes.
     */
    createTextFromSpritesheet(text, charWidth, charHeight, material, spacing = 0, totalRows = 16, totalColumns = 16) {
        const group = new THREE.Group();
        let offsetX = 0;

        for (const char of text) {
            const charMesh = this.createCharFromSpritesheet(char, charWidth, charHeight, material, totalRows, totalColumns);
            charMesh.position.x = offsetX;
            group.add(charMesh);
            offsetX += charWidth + spacing;
        }

        return group;
    },

    /**
     * Creates a text string by combining multiple character meshes.
     * @param {string} text - The text to render.
     * @param {number} charWidth - Width of each character.
     * @param {number} charHeight - Height of each character.
     * @param {THREE.Material} material - Material to apply to each character.
     * @param {number} [spacing=0] - Spacing between characters.
     * @param {number} [totalRows=16] - Total rows in the spritesheet.
     * @param {number} [totalColumns=16] - Total columns in the spritesheet.
     * @returns {THREE.Group} - Group containing all character meshes.
     */
    updateSpritesheetText(group, newText, charWidth, charHeight, material, spacing = 0, totalRows = 16, totalColumns = 16) {
        // Remove all existing children
        while (group.children.length > 0) {
            group.remove(group.children[0]);
        }
    
        // Add new characters
        let offsetX = 0;
        for (const char of newText) {
            const charMesh = this.createCharFromSpritesheet(char, charWidth, charHeight, material, totalRows, totalColumns);
            charMesh.position.x = offsetX;
            group.add(charMesh);
            offsetX += charWidth + spacing;
        }
    }
    
    
}
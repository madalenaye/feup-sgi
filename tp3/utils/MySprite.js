import * as THREE from 'three';

export const MySprite = {

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
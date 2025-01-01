import * as THREE from 'three';

export const MySprite = {

    loadSpritesheet() {
        const texture = new THREE.TextureLoader().load("utils/spritesheet.png");

        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            side: THREE.DoubleSide
        });
    },

    createCharFromSpritesheet(char, charWidth, charHeight, material, totalRows = 16, totalColumns = 16) {

        const clonedMaterial = material.clone();
        clonedMaterial.map = material.map.clone();
        clonedMaterial.map.needsUpdate = true;

        const asciiCode = char.charCodeAt(0);

        const column = asciiCode % totalColumns;
        const row = Math.floor(asciiCode / totalColumns);

        const uOffset = column / totalColumns;
        const vOffset = 1 - (row + 1) / totalRows;

        const paddingY = 0.055;

        clonedMaterial.map.offset.set(uOffset, vOffset + paddingY);
        clonedMaterial.map.repeat.set(1 / totalColumns, 1 / totalRows - paddingY * 2);

        const charGeometry = new THREE.PlaneGeometry(charWidth, charHeight);
        return new THREE.Mesh(charGeometry, clonedMaterial);
    },

    createTextFromSpritesheet(text, charWidth, charHeight, material, spacing = 0, totalRows = 16, totalColumns = 16) {
        const group = new THREE.Group();
    
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charMesh = this.createCharFromSpritesheet(char, charWidth, charHeight, material, totalRows, totalColumns);
    
            charMesh.position.x = i * (charWidth + spacing);
    
            group.add(charMesh);
        }
    
        return group;
    }
}
import * as THREE from 'three';

export const loadTextures = {

    loadTextures(data){
        let textures = {};

        Object.keys(data).forEach(key => {
            let texture = data[key];
            const textureLoader = new THREE.TextureLoader();
            if (texture.isVideo) {

                const video = document.createElement('video');
                video.src = texture.filepath;
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.load();
                video.play();
                console.log(video)
                let videoTexture = new THREE.VideoTexture(video);
                textures[key] = videoTexture;
            }
            else{
                let textureImage = textureLoader.load(texture.filepath)
                textures[key] = textureImage;
            }

            if(texture.mipmap0 != "null"){
                textures[key].generateMipmaps = false;

                for (let i = 0; i <= 7; i++){
                    const mipmap =texture[(`mipmap${i}`)];
                    textures[key].mipmaps[i] = mipmap;
                }
            }
            
        });

        return textures;
    },

    /**
     * load an image and create a mipmap to be added to a texture at the defined level.
     * In between, add the image some text and control squares. These items become part of the picture
     * 
     * @param {*} parentTexture the texture to which the mipmap is added
     * @param {*} level the level of the mipmap
     * @param {*} path the path for the mipmap image
    // * @param {*} size if size not null inscribe the value in the mipmap. null by default
    // * @param {*} color a color to be used for demo
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }
   
}

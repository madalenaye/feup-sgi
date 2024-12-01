# SGI 2024/2025 - TP2

## Group: T06G02

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Madalena Ye         | 202108795 | up202108795@edu.fe.up.pt                |
| Manuel Serrano         | 202402793 | up202402793@edu.fe.up.pt                |

----
## Project information

- **Creativity and Originality**: The scene takes inspiration from Pokémon, presenting an open Poké Ball floating in the middle of the ocean — a calm and imaginative space where life thrives.
- **Efficient Structure**: All features required for the project were fully implemented, as we leveraged Three.js object hierarchies for smooth transformations and material management.
- **Immersive Atmosphere**: Thoughtful lighting and environmental elements like clouds and shadows enhance realism.

### Scene
This scene represents an open Poké Ball floating above the ocean. Within it:
	•	A lush environment with trees, grass, and small ponds, populated by Pokémon.
	•	Clouds hovering above the Poké Ball, adding depth and atmosphere.
	•	A reflective water plane as the surrounding ocean, enhancing realism.
	•	Pokémon characters scattered around the environment, bringing the scene to life.
  - [scene](/tp2/scenes/PokemonScene.json)
  - [screenshots](/tp2/screenshots)
----
## Screenshots
1. Main scene, with spotlight pointed to the lake and pokémons
![Main scene](/tp2/screenshots/scene.png)

2. Watched from afar
![Wide scene](/tp2/screenshots/wideScene.png)
3. Trees filled with fruits. The tree trunk and tree crown textures are bump mapped, the fireplace is made using the triangle primitive and video textures. The video texture is changed to a plain one as we move away from the scene (use of LOD)
![Right](/tp2/screenshots/right.png)

4. Implementation of LODs
![Lod](/tp2/screenshots/lod.png)

5. Lake and a leaf made using nurbs
![Lake and Leaf](/tp2/screenshots/lake.png)
## Issues/Problems
-	Texture Limitations: Some textures may appear flat when viewed closely.
-	Interactivity: The GUI is not as complete as we wished for. Lacks extensive controls, such as toggling clouds or modifying environmental elements like changing the color of the lights.
- Limited use of the polygon primitive: it was included primarily to meet the project requirements, but its potential could be explored further.



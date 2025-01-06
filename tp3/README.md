# SGI 2024/2025 - TP3

## Group: T06G02

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Madalena Ye         | 202108795 | up202108795@edu.fe.up.pt                |
| Manuel Serrano         | 202402793 | up202402793@edu.fe.up.pt                |

----
## Project information

This project features a fun and engaging hot air balloon racing game built in Three.js. The user can pilot their balloon through a sky-high racecourse, dodging obstacles and collecting powerups along the way. 
- **3 detailed balloon models to choose from**: we've put effort into creating 3 unique and detailed balloon models for the user to choose from.
- **Shaders**: we've implemented custom shaders to create unique visual effects for the obstacles, powerups and the outdoor display.
- **Smooth camera transitions**: the camera smoothly transitions between different views, providing a more immersive experience. 

### Scene
  - The race unfolds in a vibrant sky environment where players navigate their balloon by moving it up or down between wind layers. Each wind layer carries the balloon in a specific direction—North, South, East, or West—adding a strategic element to the race.
  - [scene](/tp3/scenes/GameScene.json)
  - [screenshots](/tp3/screenshots)

### Screenshots
1. Main menu, where the user can write their name and choose different game settings.

![Main menu](/tp3/screenshots/mainMenu.png)

2. The general view of the game, with the player's and opponent's balloons visible and obstacles and powerups scattered throughout the course.

![General view](/tp3/screenshots/generalView.png)

3. Paused game state

![Paused game](/tp3/screenshots/pausedGame.png)

4. Game over screen with fireworks celebrating the winner

![Game over](/tp3/screenshots/gameOver.png)

5. Balloon selection

![Balloon selection](/tp3/screenshots/balloonSelection.png)

6. Lod balloons in the distance

![Lod](/tp3/screenshots/lod.png)

7. Wind layer display

![Wind layer](/tp3/screenshots/layerDisplay.png)
----
## Issues/Problems
There are some issues that while we would have liked to address, we were unable to due to time constraints or performance concerns.
- Cameras Were Tricky - getting the camera to work smoothly was harder than we thought. It switches between first-person and third-person views, but it’s not perfect in tighter areas.

- LOD Balloons Stay Static - we added level-of-detail (LOD) optimization for the balloons, but animations for the lower-detail versions didn’t make the cut. Right now, they just hang there statically in the distance.

- Confusing Requirements - some parts of the project brief were vague, and it took us a while to interpret them, which slowed down progress early on.

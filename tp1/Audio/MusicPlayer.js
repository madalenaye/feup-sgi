/**
 * @file MusicPlayer.js
 * @class MusicPlayer
 * @desc This class handles music playback within the application, allowing for continuous looping of audio tracks.
 */

/**
 * @class
 * @classdesc Manages audio playback, supporting looped tracks and the ability to resume playback from the last paused position. 
 */


class MusicPlayer {
    /**
     * Constructs a MusicPlayer instance.
     * @constructor
     * @param {string} audioFile - The path to the audio file to be played.
     */
    constructor(audioFile) {
        this.audio = new Audio(audioFile); 
        this.audio.loop = true; 
        this.currentTime = 0;
    }

    /**
     * Starts playing the audio.
     * @method
     */
    play() {
        this.audio.currentTime = this.currentTime;
        this.audio.play().catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    /**
     * Stops the audio playback.
     * @method
     */
    stop() {
        this.currentTime = this.audio.currentTime;
        this.audio.pause();
    }
}

export { MusicPlayer }; 
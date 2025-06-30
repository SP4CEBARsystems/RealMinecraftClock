import ClockAnimator from "./clock-animator.js";
import SunriseSunset from "./SunriseSunset.js";

export default class MinecraftClock {
    /** @type {Date} */
    sunset;
    
    /** @type {Date} */
    sunrise;

    /** @type {number} A normalized value from 0 to 1 */
    currentDayCycle = 0;

    /** @type {number} A normalized value from 0 to 1 */
    targetDayCycle;

    /** @type {string} */
    imageId = 'minecraft-clock';

    /** @type {number} */
    intervalTime = 1000 * 60 * 20; // 20 minutes in milliseconds

    /** @type {number|undefined} */
    intervalId;

    /** @type {ClockAnimator} */
    animator;

    /**
     * Represents a clock element, the clock will be set to match the position of the sun given the current time and the sunrise and sunset times
     * @param {string} imageId 
     * @param {SunriseSunset} [sunriseSunset] 
     * @param {boolean} isInterval 
     */
    constructor(imageId, sunriseSunset, isInterval = true) {
        this.imageId = imageId;
        this.animator = new ClockAnimator(this.updateClockImage.bind(this));
        if (sunriseSunset?.sunrise === undefined || sunriseSunset?.sunset === undefined) {
            this.intervalId = setInterval(this.setRandomDayCycle.bind(this), 1000);
        } else {
            this.sunrise = sunriseSunset.sunrise;
            this.sunset = sunriseSunset.sunset;
            this.updateClock();
            if (isInterval) {
                setInterval(this.updateClock.bind(this), this.intervalTime)
            }
        }
    }

    /**
     * 
     * @param {SunriseSunset} sunriseSunset
     */
    setSunriseSunset(sunriseSunset) {
        this.clearIntervalIfExists();
        if (sunriseSunset.sunrise === undefined || sunriseSunset.sunset === undefined) {
            return
        }
        this.sunrise = sunriseSunset.sunrise;
        this.sunset = sunriseSunset.sunset;
        this.updateClock();
    }

    clearIntervalIfExists() {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    /**
     * Updates the clock with the with the given or current time and starts the animation
     * @param {Date} [clockTime] the time on the clock to, leave empty to use current time
     */
    updateClock(clockTime){
        if (clockTime === undefined) {
            clockTime = new Date();
        }
        this.setDayCycle(clockTime);
        this.animator.start();
    }

    getClockFrame() {
        return ((this.animator.currentDayCycle + 0.75) % 1) * 64;
    }

    /**
     * Maps the current time to a value from 0 to 1 based on sunrise and sunset times.
     * 0 = sunrise, 0.5 = sunset, 1 = next sunrise
     *
     * @param {Date} now - The current time
     */
    setDayCycle(now) {
        const dayMilliseconds = 24 * 60 * 60 * 1000;
        const dayDuration = this.sunset.getTime() - this.sunrise.getTime();
        const nightDuration = dayMilliseconds - dayDuration; // full day in ms - day

        const isNowDay = now >= this.sunrise && now < this.sunset;
        if (isNowDay) {
            // Daytime: map [sunrise, sunset] to [0, 0.5]
            this.animator.targetDayCycle = (now.getTime() - this.sunrise.getTime()) / dayDuration * 0.5;
        } else {
            // Nighttime: map [sunset, next sunrise] to [0.5, 1]
            // let nextSunrise = new Date(sunrise.getTime() + dayMilliseconds);
            if (now < this.sunrise) {
                // Before today's sunrise (early morning), treat as yesterday's sunset
                this.sunset = new Date(this.sunset.getTime() - dayMilliseconds);
            }
            const nightElapsed = (now.getTime() - this.sunset.getTime() + dayMilliseconds) % dayMilliseconds;
            this.animator.targetDayCycle = 0.5 + (nightElapsed / nightDuration) * 0.5;
        }
    }

    setRandomDayCycle() {
        // Set a random clock cycle between 0 and 1
        this.animator.setTargetDayCycle(Math.random());
    }

    updateClockImage() {
        const clockPhase = this.getClockFrame();
        const safeClockPhase = Math.floor(clockPhase);
        if (safeClockPhase < 0 || safeClockPhase > 63) {
            console.warn(`Clock with frame "${safeClockPhase}" not found.`);
            return;
        }
        MinecraftClock.replaceImage(this.imageId, `./assets/minecraft_clock_images/clock_${`${safeClockPhase}`.padStart(2, "0")}.png`);
    }

    /**
     * Sets the src and alt of an image given a DOM ID
     * @param {string} imageId DOM element ID of the image
     * @param {string} newSrc scr to set in the image element
     * @param {string|null} newAlt alt to set in the image element
     * @returns 
     */
    static replaceImage(imageId, newSrc, newAlt = null) {
        const img = /** @type {HTMLImageElement} */ (document.getElementById(imageId));
        if (!img) {
            console.warn(`Image with ID "${imageId}" not found.`);
            return;
        }
        img.src = newSrc;
        if (newAlt !== null) {
            img.alt = newAlt;
        }
    }
}
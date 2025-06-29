import { fetchJson, replaceImage, setIntervalWithTimeout } from "./index.js";
import Place from "./place.js";
import ClockAnimator from "./clock-animator.js"; // <-- Add this import

export default class MinecraftClock {
    /** @type {Place} */
    place;

    /**
     * @type {{
     *   results:
     *   {
     *     sunrise:string,
     *     sunset:string,
     *     solar_noon:string,
     *     day_length:number,
     *     civil_twilight_begin:string,
     *     civil_twilight_end:string,
     *     nautical_twilight_begin:string,
     *     nautical_twilight_end:string,
     *     astronomical_twilight_begin:string,
     *     astronomical_twilight_end:string
     *   },
     *   status:string,
     *   tzid:string
     * }}
     */
    sunriseSunsetObject;

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
     * 
     * @param {string} imageId 
     * @param {Place} place 
     * @param {boolean} isInterval 
     */
    constructor(imageId, place, isInterval = true) {
        this.imageId = imageId;
        this.place = new Place(place.latitude, place.longitude);
        this.animator = new ClockAnimator(this.updateClockImage.bind(this));
        if (this.place.latitude === null || this.place.longitude === null) {
            this.intervalId = setInterval(this.setRandomDayCycle.bind(this), 1000);
        } else {
            this.fetchSunsetSunrise().then(this.updateClock.bind(this));
            if (isInterval) {
                setInterval(this.updateClock.bind(this), this.intervalTime)
            }
        }
    }

    async fetchSunsetSunrise() {
        // API Reference https://sunrise-sunset.org/api
        const filePath = `https://api.sunrise-sunset.org/json?lat=${this.place.latitude}&lng=${this.place.longitude}&formatted=0`; 
        this.sunriseSunsetObject = await fetchJson(filePath);
        this.sunrise = new Date(this.sunriseSunsetObject.results.sunrise);
        this.sunset = new Date(this.sunriseSunsetObject.results.sunset);
    }

    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     */
    setPosition(latitude, longitude) {
        this.clearIntervalIfExists();
        this.place.setPosition(latitude, longitude);
        this.fetchSunsetSunrise().then(this.updateClock.bind(this));
    }

    clearIntervalIfExists() {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    /**
     * @param {Date} [clockTime] - The time on the clock
     */
    updateClock(clockTime){
        if (clockTime === undefined) {
            clockTime = new Date();
        }
        if (this.sunriseSunsetObject === undefined) {
            console.warn("Sunrise and sunset data not loaded yet.");
            return;
        }
        this.setDayCycle(clockTime);
        this.startClockAnimation();
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

    startClockAnimation() {
        this.animator.setTargetDayCycle(this.animator.targetDayCycle);
    }

    updateClockImage() {
        const clockPhase = this.getClockFrame();
        const safeClockPhase = Math.floor(clockPhase);
        if (safeClockPhase < 0 || safeClockPhase > 63) {
            console.warn(`Clock with frame "${safeClockPhase}" not found.`);
            return;
        }
        replaceImage(this.imageId, `./assets/minecraft_clock_images/clock_${`${safeClockPhase}`.padStart(2, "0")}.png`);
    }
}
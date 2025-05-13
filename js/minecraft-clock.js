import { getData, replaceImage } from "./index.js";
import Place from "./place.js";

export default class MinecraftClock {
    /** @type {Place} */
    place

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
    sunriseSunsetObject

    /** @type {Date} */
    sunset
    
    /** @type {Date} */
    sunrise

    /** @type {number} */
    dayCycle

    imageId = 'minecraft-clock'

    /**
     * 
     * @param {string} imageId 
     * @param {Place} place 
     */
    constructor(imageId, place) {
        this.imageId = imageId;
        this.place = place;
        this.fetchSunsetSunrise();
    }

    // setInterval(clockTick, 100)
    // function clockTick() {
    //     replaceClock("minecraft-clock", (Date.now() / 100) % 64);
    // }

    fetchSunsetSunrise() {
        // API Reference https://sunrise-sunset.org/api
        const filePath = `https://api.sunrise-sunset.org/json?lat=${this.place.latitude}&lng=${this.place.longitude}&formatted=0`; 
        getData(filePath).then(this.updateClock.bind(this));
    }

    /**
     * 
     * @param {{
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
     * }} sunriseSunsetObject 
     */
    updateClock(sunriseSunsetObject){
        this.sunriseSunsetObject = sunriseSunsetObject;
        this.sunrise = new Date(sunriseSunsetObject.results.sunrise);
        this.sunset = new Date(sunriseSunsetObject.results.sunset);
        console.log("sunrise, sunset", this.sunrise, this.sunset);
        this.mapTimeToDayCycle(new Date());
        // console.log("dayCycle", dayCycle);
        this.replaceClock();
    }

    mapdayCycleToClockFrame() {
        return ((this.dayCycle + 0.75) % 1) * 64;
    }

    /**
     * Maps the current time to a value from 0 to 1 based on sunrise and sunset times.
     * 0 = sunrise, 0.5 = sunset, 1 = next sunrise
     *
     * @param {Date} now - The current time
     * @returns {number} A normalized value from 0 to 1
     */
    mapTimeToDayCycle(now) {
        console.log("now, sunrise, sunset", now, this.sunrise, this.sunset);
        const dayMilliseconds = 24 * 60 * 60 * 1000;
        const dayDuration = this.sunset.getTime() - this.sunrise.getTime();
        const nightDuration = dayMilliseconds - dayDuration; // full day in ms - day

        const isNowDay = now >= this.sunrise && now < this.sunset;
        if (isNowDay) {
            // Daytime: map [sunrise, sunset] to [0, 0.5]
            this.dayCycle = (now.getTime() - this.sunrise.getTime()) / dayDuration * 0.5;
        } else {
            // Nighttime: map [sunset, next sunrise] to [0.5, 1]
            // let nextSunrise = new Date(sunrise.getTime() + dayMilliseconds);
            if (now < this.sunrise) {
                // Before today's sunrise (early morning), treat as yesterday's sunset
                this.sunset = new Date(this.sunset.getTime() - dayMilliseconds);
            }
            const nightElapsed = (now.getTime() - this.sunset.getTime() + dayMilliseconds) % dayMilliseconds;
            this.dayCycle = 0.5 + (nightElapsed / nightDuration) * 0.5;
        }
        console.log("dayCycle2", this.dayCycle);
    }

    replaceClock() {
        const clockPhase = this.mapdayCycleToClockFrame();
        const safeClockPhase = Math.floor(clockPhase);
        console.log('clockPhase', safeClockPhase);
        if (safeClockPhase < 0 || safeClockPhase > 63) {
            console.warn(`Clock with frame "${safeClockPhase}" not found.`);
            return;
        }
        replaceImage(this.imageId, `./assets/minecraft_clock_images/clock_${`${safeClockPhase}`.padStart(2, "0")}.png`);
    }
}
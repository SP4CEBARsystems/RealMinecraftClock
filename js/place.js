import MinecraftClock from "./minecraft-clock.js";
import SunriseSunset from "./SunriseSunset.js";

export default class Place {
    /**
     * 
     * @param {number|null} latitude 
     * @param {number|null} longitude 
     * @param {string} [name] 
     */
    constructor(latitude = null, longitude = null, name) {
        this.name = name ?? null;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     */
    setPosition(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    /**
     * @returns {string} the ID of the DOM element to display the clock on this place
     */
    getClockIdFromName() {
        return `minecraft-clock-${this.name}`;
    }

    /**
     * Fetches a SunriseSunset object from the sunrise-sunset api at this location
     * @returns {Promise<SunriseSunset>}
     */
    fetchSunriseSunset() { 
        return SunriseSunset.fetchSunriseSunset(this);
    }

    /**
     * Creates a MinecraftClock object after the sunrise and sunset times have been fetched from the sunrise-sunset api
     * @returns {Promise<MinecraftClock>} based on the sunrise and sunset times at this place
     */
    async createMinecraftClock(){
        try {
            const sunriseSunset = await this.fetchSunriseSunset()
            return new MinecraftClock(this.getClockIdFromName(), sunriseSunset);
        } catch (error) {
            throw error;
        }
    }
}
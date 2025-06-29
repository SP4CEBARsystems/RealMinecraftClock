import SunriseSunset from "./SunriseSunset.js";

export default class Place {
    /**
     * 
     * @param {number|null} latitude 
     * @param {number|null} longitude 
     */
    constructor(latitude = null, longitude = null) {
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
     * Fetches a SunriseSunset object from the sunrise-sunset api at this location
     * @returns {Promise<SunriseSunset>}
     */
    fetchSunriseSunset() { 
        return SunriseSunset.fetchSunriseSunset(this);
    }
}
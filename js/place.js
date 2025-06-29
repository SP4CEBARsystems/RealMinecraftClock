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

    async fetchSunriseSunset() { 
        try {
            return (await SunriseSunset.fetchSunriseSunset(this)).getTimes();
        } catch (error) {
            throw error;
        }
    }
}
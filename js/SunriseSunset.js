import { fetchJson } from "./index.js";
import Place from "./place.js";

export default class SunriseSunset {
    /**
     * @param sunriseSunsetObject {{
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
     * }} the object returned by the sunrise-sunset api
     */
    constructor(sunriseSunsetObject) {
        this.results = sunriseSunsetObject.results;
        this.status = sunriseSunsetObject.status;
        this.tzid = sunriseSunsetObject.tzid;
        this.sunrise = new Date(this.results.sunrise);
        this.sunset = new Date(this.results.sunset);
    }
    
    getTimes(){
        return {sunrise: this.sunrise, sunset: this.sunset};
    }
    
    /**
     * Fetches a SunriseSunset object from the sunrise-sunset api for a given place on earth.
     * API Reference: https://sunrise-sunset.org/api
     * @param {Place} place on earth to request the sunset-sunrise object of 
     * @returns {Promise<SunriseSunset>} sunset-sunrise object
     */
    static async fetchSunriseSunset(place){
        try {
            const url = `https://api.sunrise-sunset.org/json?lat=${place.latitude}&lng=${place.longitude}&formatted=0`;
            const sunriseSunsetObject = await fetchJson(url);
            return new SunriseSunset(sunriseSunsetObject);
        } catch (error) {
            throw error;
        }
    }
}
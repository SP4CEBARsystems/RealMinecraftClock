import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

export default class ClockLocation {
    /**
     *
     * @param {string} name of the clock element
     * @param {number|null} lat of the clock's location
     * @param {number|null} lon of the clock's location
     * @param {string} clockId Element ID of the clock element
     */
    constructor(name, lat, lon, clockId) {
        this.place = new Place(lat, lon, name);
        this.clock = undefined;
        this.place.fetchSunriseSunset().then((sunriseSunset) => {
            this.clock = new MinecraftClock(this.place.getClockIdFromName(), sunriseSunset);
        });
    }
}

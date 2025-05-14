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
}
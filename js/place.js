export default class Place {
    /**
     * 
     * @param {number} latitude 
     * @param {number} longitude 
     */
    constructor(latitude, longitude) {
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
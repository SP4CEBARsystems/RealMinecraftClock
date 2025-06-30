import GlobeSelector from "./GlobeSelector.js";
import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

export default class AdjustableMinecraftClock extends MinecraftClock {
    constructor() {
        super("minecraft-clock-custom");

        const setClockButton = document.getElementById("set-custom-clock-button");
        if (!setClockButton) {
            return;
        }
        
        setClockButton.addEventListener("click", () => {
            const lat = parseFloat(/** @type {HTMLInputElement} */(document.getElementById("custom-clock-latitude-input"))?.value);
            const lon = parseFloat(/** @type {HTMLInputElement} */(document.getElementById("custom-clock-longitude-input"))?.value);
            if (isNaN(lat) || isNaN(lon)) {
                alert("Please enter valid latitude and longitude values.");
                return;
            }
            const place = new Place(lat, lon);
            place.fetchSunriseSunset().then((sunriseSunset) => {
                this.setSunriseSunset(sunriseSunset);
            });
        });

        new GlobeSelector();
    }
}

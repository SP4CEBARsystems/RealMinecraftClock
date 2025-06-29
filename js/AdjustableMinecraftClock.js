import initGlobeSelector from "./globe-select.js";
import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

export class AdjustableMinecraftClock extends MinecraftClock {
    constructor() {
        super("minecraft-clock-custom", new Place());

        const setClockButton = document.getElementById("set-custom-clock-button");
        if (!setClockButton) {
            return;
        }
        setClockButton.addEventListener("click", () => {
            const lat = parseFloat(document.getElementById("custom-clock-latitude-input")?.value);
            const lon = parseFloat(document.getElementById("custom-clock-longitude-input")?.value);
            if (isNaN(lat) || isNaN(lon)) {
                alert("Please enter valid latitude and longitude values.");
                return;
            }
            this.setPosition(lat, lon);
        });
        console.log(initGlobeSelector());
    }
}

import AdjustableMinecraftClock from "./AdjustableMinecraftClock.js";
import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";
import { places } from "./places.js";
import ClockElement from "./ClockElement.js";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('id');
    console.log(pageId, places)
    const place = places.find(p => p.getClockIdFromName() === pageId);
    if (place) {
        ClockElement.loadFromPlaces([place]);
        place.createMinecraftClock();
    } else {
        console.error('404: Clock place not found');
    }

    new AdjustableMinecraftClock();
});

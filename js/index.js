import AdjustableMinecraftClock from "./AdjustableMinecraftClock.js";
import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";
import { places } from "./places.js";
import ClockElement from "./ClockElement.js";

document.addEventListener("DOMContentLoaded", () => {
    ClockElement.loadFromPlaces(places);
    const sunriseSunsetRequests = places.map(place => place.fetchSunriseSunset());
    Promise.all(sunriseSunsetRequests).then((sunriseSunsets) => {
        sunriseSunsets.map((sunriseSunset, index) => 
            new MinecraftClock(places[index]?.getClockIdFromName(), sunriseSunset)
        );
        console.log('all clocks created');
    });

    new AdjustableMinecraftClock();
});

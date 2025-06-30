import AdjustableMinecraftClock from "./AdjustableMinecraftClock.js";
import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

document.addEventListener("DOMContentLoaded", () => {
    const places = [
        // new Place(36.7201600, -4.4203400, "template"),
        new Place(51.495076717135845, 3.6094301071283614, "middelburg"),
        new Place(52.37048477035961, 4.8998282171669505, "amsterdam"),
        new Place(40.7108211146979, -73.89155503612763, "newyork"),
        new Place(35.68088000009859, 139.76736474196923, "tokyo"),
        new Place(55.757054002675325, 37.616568134408794, "moscow"),
    ];

    const sunriseSunsetRequests = places.map(place => place.fetchSunriseSunset());
    Promise.all(sunriseSunsetRequests).then((sunriseSunsets) => {
        sunriseSunsets.map((sunriseSunset, index) => 
            new MinecraftClock(places[index]?.getClockIdFromName(), sunriseSunset)
        );
        console.log('all clocks created', sunriseSunsets);
    });

    new AdjustableMinecraftClock();
});

// middelburgClock.updateClock(new Date("2025-05-13T12:00:00Z"));

/**
 * 
 * @param {string} filePath 
 * @returns {Promise<any>}
 */
export async function fetchJson(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

/**
 * Sets the src and alt of an image given a DOM ID
 * @param {string} imageId DOM element ID of the image
 * @param {string} newSrc scr to set in the image element
 * @param {string} newAlt alt to set in the image element
 * @returns 
 */
export function replaceImage(imageId, newSrc, newAlt = null) {
    const img = /** @type {HTMLImageElement} */ (document.getElementById(imageId));
    if (!img) {
        console.warn(`Image with ID "${imageId}" not found.`);
        return;
    }
    img.src = newSrc;
    if (newAlt !== null) {
        img.alt = newAlt;
    }
}

/**
 * 
 * @param {TimerHandler} callback 
 * @param {number} interval 
 * @param {number} timeout 
 */
export function setIntervalWithTimeout(callback, interval, timeout) {
    const intervalId = setInterval(callback, interval);
    setTimeout(() => clearInterval(intervalId), timeout);
}

/**
 * Maps a value between inMin and inMax to spread evenly between outMin and outMax
 * @param {number} value 
 * @param {number} inMin 
 * @param {number} inMax 
 * @param {number} outMin 
 * @param {number} outMax 
 * @returns {number}
 */
function linearMap(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Linear interpolation between two values
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 * @returns {number}
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

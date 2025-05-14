import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

const template = new Place(36.7201600, -4.4203400);
const middelburg = new Place(51.495076717135845, 3.6094301071283614);
const amsterdam = new Place(52.37048477035961, 4.8998282171669505);
const newyork = new Place(40.7108211146979, -73.89155503612763);
const tokyo = new Place(35.68088000009859, 139.76736474196923);
const moscow = new Place(55.757054002675325, 37.616568134408794);
const custom = new Place(0, 0);
const middelburgClock = new MinecraftClock("minecraft-clock-middelburg", middelburg);
const amsterdamClock = new MinecraftClock("minecraft-clock-amsterdam", amsterdam);
const newyorkClock = new MinecraftClock("minecraft-clock-newyork", newyork);
const tokyoClock = new MinecraftClock("minecraft-clock-tokyo", tokyo);
const moscowClock = new MinecraftClock("minecraft-clock-moscow", moscow);
const customClock = new MinecraftClock("minecraft-clock-custom", custom);


// middelburgClock.updateClock(new Date("2025-05-13T12:00:00Z"));

export async function getData(filePath) {
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

export function replaceImage(imageId, newSrc, newAlt = null) {
  const img = document.getElementById(imageId);
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
 * 
 * @param {TimerHandler} callback 
 * @param {number} interval 
 * @param {number} timeout 
 */
export function setIntervalWithTimeout(callback, interval, timeout) {
    const intervalId = setInterval(callback, interval);
    setTimeout(() => clearInterval(intervalId), timeout);
}

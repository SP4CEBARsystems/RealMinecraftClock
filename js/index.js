import MinecraftClock from "./minecraft-clock.js";
import Place from "./place.js";

const template = new Place(36.7201600, -4.4203400);
const middelburg = new Place(51.495076717135845, 3.6094301071283614);
const middelburgClock = new MinecraftClock("minecraft-clock", middelburg, false);


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

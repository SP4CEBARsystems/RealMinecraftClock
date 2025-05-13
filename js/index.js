// fetchSunsetSunrise(36.7201600, -4.4203400);
fetchSunsetSunrise(51.495076717135845, 3.6094301071283614);

// setInterval(clockTick, 100)

function clockTick() {
    replaceClock("minecraft-clock", (Date.now() / 100) % 64);
}

function fetchSunsetSunrise(latitude, longditude) {
    // API Reference https://sunrise-sunset.org/api
    const filePath = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longditude}&formatted=0`; 
    getData(filePath).then(updateClock);
}

/**
 * 
 * @param {{
 *   results:
 *   {
 *     sunrise:string,
 *     sunset:string,
 *     solar_noon:string,
 *     day_length:number,
 *     civil_twilight_begin:string,
 *     civil_twilight_end:string,
 *     nautical_twilight_begin:string,
 *     nautical_twilight_end:string,
 *     astronomical_twilight_begin:string,
 *     astronomical_twilight_end:string
 *   },
 *   status:string,
 *   tzid:string
 * }} sunriseSunsetObject 
 */
function updateClock(sunriseSunsetObject){
    const sunrise = sunriseSunsetObject.results.sunrise;
    const sunset = sunriseSunsetObject.results.sunset;
    console.log("sunrise, sunset", sunrise, sunset);
    // linearMap(value, inMin, inMax, outMin, outMax);
    const dayCycle = mapTimeToDayCycle(new Date(Date.now()), new Date(sunrise), new Date(sunset))
    console.log("dayCycle", dayCycle);
    replaceClock("minecraft-clock", mapdayCycleToClockFrame(dayCycle));
}

function mapdayCycleToClockFrame(dayCycle) {
    return ((dayCycle + 0.75) % 1) * 64;
}

/**
 * Maps the current time to a value from 0 to 1 based on sunrise and sunset times.
 * 0 = sunrise, 0.5 = sunset, 1 = next sunrise
 *
 * @param {Date} now - The current time
 * @param {Date} sunrise - The sunrise time (today)
 * @param {Date} sunset - The sunset time (today)
 * @returns {number} A normalized value from 0 to 1
 */
function mapTimeToDayCycle(now, sunrise, sunset) {
    console.log("now, sunrise, sunset", now, sunrise, sunset);
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    const dayDuration = sunset.getTime() - sunrise.getTime();
    const nightDuration = dayMilliseconds - dayDuration; // full day in ms - day

    const isNowDay = now >= sunrise && now < sunset;
    if (isNowDay) {
        // Daytime: map [sunrise, sunset] to [0, 0.5]
        return (now.getTime() - sunrise.getTime()) / dayDuration * 0.5;
    } else {
        // Nighttime: map [sunset, next sunrise] to [0.5, 1]
        // let nextSunrise = new Date(sunrise.getTime() + dayMilliseconds);
        if (now < sunrise) {
            // Before today's sunrise (early morning), treat as yesterday's sunset
            sunset = new Date(sunset.getTime() - dayMilliseconds);
        }
        const nightElapsed = (now.getTime() - sunset.getTime() + dayMilliseconds) % dayMilliseconds;
        return 0.5 + (nightElapsed / nightDuration) * 0.5;
    }
}

/**
 * 
 * @param {string} imageId 
 * @param {number} clockPhase 
 * @returns
 */
function replaceClock(imageId, clockPhase) {
    const safeClockPhase = Math.floor(clockPhase);
    console.log('clockPhase', safeClockPhase);
    if (safeClockPhase < 0 || safeClockPhase > 63) {
        console.warn(`Clock with frame "${safeClockPhase}" not found.`);
        return;
    }
    replaceImage(imageId, `./assets/minecraft_clock_images/clock_${`${safeClockPhase}`.padStart(2, "0")}.png`);
}

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

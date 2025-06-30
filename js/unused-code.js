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
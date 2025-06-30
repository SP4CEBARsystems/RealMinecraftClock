import Place from "./place.js";

export default class ClockElement {
    /**
     * Creates an element to represent a clock
     * @param {Place} place the location of the clock element on Earth
     * @returns {Element} the clock element
     */
    static newClockElement(place) {
        const article = document.createElement('article');

        const h1 = document.createElement('h1');
        h1.textContent = place.name;

        const img = document.createElement('img');
        img.id = place.getClockIdFromName();
        img.className = "minecraft-clock";
        img.src = "./assets/minecraft_clock_images/clock_00.png";
        img.alt = "Minecraft Clock";

        article.appendChild(h1);
        article.appendChild(img);
        return article;
    }

    /**
     * 
     * @param {Place[]} places on earth
     */
    static loadFromPlaces(places){
        const clockElements = document.getElementById('clocks');
        if (clockElements) {
            places.map(place => {
                clockElements.appendChild(ClockElement.newClockElement(place));
            });
        }
    }
}
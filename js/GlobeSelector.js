export default class GlobeSelector {
    /**
     * @type {CanvasRenderingContext2D} ctx of the globe canvas 
     */
    ctx
    
    /**
     * @type {HTMLCanvasElement} the globe canvas 
     */
    canvas

    constructor(){
        const canvas = /**@type {HTMLCanvasElement|null}*/ (document.getElementById('earthCanvas'));
        if (!canvas) {
            console.error("could not prepare globe selector, no canvas");
            return;
        }
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            console.error("could not prepare globe selector, no canvas.getContext('2d')");
            return;
        }
        this.ctx = ctx;
        const latitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-latitude-input'));
        const longitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-longitude-input'));
        if (!latitudeInput||!longitudeInput) {
            console.error("could not prepare globe selector, no input element");
            return;
        }

        this.resizeCanvasToDisplaySize();

        const img = new Image();
        img.src = './assets/earth/Azimuthal_equidistant_projection_SW.jpg';
        img.onload = loadImage;
        
        function loadImage(){
            if (!canvas || !ctx) {
                console.warn('no image defined');
                return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        this.canvas.addEventListener('click', (event) => {
            loadImage()
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            const dx = x - centerX;
            const dy = y - centerY;

            const { latitude, longitude } = this.getLatitudeLongitudeFromClick(dx, dy, centerX);

            this.plotGlobeLine(centerX, centerY, x, y);

            latitudeInput.value = latitude.toString();
            longitudeInput.value = longitude.toString();
        });
        // 'success'
        return;
    }

    resizeCanvasToDisplaySize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        const displayWidth = Math.round(rect.width * dpr);
        const displayHeight = Math.round(rect.height * dpr);

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            return true; // canvas was resized
        }

        return false; // no resize needed
    }

    /**
     * 
     * @param {number} centerX of the globe
     * @param {number} centerY of the globe
     * @param {number} x of the point
     * @param {number} y of the point
     */
    plotGlobeLine(centerX, centerY, x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    getLatitudeLongitudeFromClick(dx, dy, maxRadius) {
        const r = Math.sqrt(dx * dx + dy * dy);
        const normalized = Math.min(r / maxRadius, 1);
        const latitude = 90 - normalized * 180;
        let longitude = Math.atan2(dx, dy) * (180 / Math.PI);
        return { latitude, longitude };
    }
}
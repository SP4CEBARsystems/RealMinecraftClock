export default class GlobeSelector {
    constructor(){
        const canvas = /**@type {HTMLCanvasElement|null}*/ (document.getElementById('earthCanvas'));
        if (!canvas) {
            //'no canvas'
            return;
        }
        const ctx = canvas.getContext('2d');
        const latitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-latitude-input'));
        const longitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-longitude-input'));
        if (!ctx||!latitudeInput||!longitudeInput) {
            // 'no context or no input element'
            return;
        }

        this.resizeCanvasToDisplaySize(canvas);

        const img = new Image();
        img.src = './assets/earth/Azimuthal_equidistant_projection_SW.jpg';

        img.onload = loadImage;
        
        function loadImage(){
            if (!canvas || !ctx) return;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        canvas.addEventListener('click', (event) => {
            loadImage()
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const dx = x - centerX;
            const dy = y - centerY;

            const { latitude, longitude } = this.getLatitudeLongitudeFromClick(dx, dy, centerX);

            this.plotGlobeLine(ctx, centerX, centerY, x, y);

            latitudeInput.value = latitude.toString();
            longitudeInput.value = longitude.toString();
        });
        // 'success'
        return;
    }

    resizeCanvasToDisplaySize(canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        const displayWidth = Math.round(rect.width * dpr);
        const displayHeight = Math.round(rect.height * dpr);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            return true; // canvas was resized
        }

        return false; // no resize needed
    }

    plotGlobeLine(ctx, centerX, centerY, x, y) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    getLatitudeLongitudeFromClick(dx, dy, maxRadius) {
        const r = Math.sqrt(dx * dx + dy * dy);
        const normalized = Math.min(r / maxRadius, 1);
        const latitude = 90 - normalized * 180;
        let longitude = Math.atan2(dx, dy) * (180 / Math.PI);
        return { latitude, longitude };
    }
}
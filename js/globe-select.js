function resizeCanvasToDisplaySize(canvas) {
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

export default function initGlobeSelector(){
    const canvas = /**@type {HTMLCanvasElement|null}*/ (document.getElementById('earthCanvas'));
    if (!canvas) return 'no canvas';
    const ctx = canvas.getContext('2d');
    const latitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-latitude-input'));
    const longitudeInput = /**@type {HTMLInputElement|null}*/ (document.getElementById('custom-clock-longitude-input'));
    if (!ctx||!latitudeInput||!longitudeInput) return 'no context or no input element';

    // resizeCanvasToDisplaySize(canvas);

    const img = new Image();
    img.src = './assets/earth/Azimuthal_equidistant_projection_SW.jpg';
    // img.src = './assets/earth/500x500/earth-north-90n-0_500x500.png';

    img.onload = loadImage;
    
    function loadImage(){
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 500, 500);
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

        const { latitude, longitude } = getLatitudeLongitudeFromClick(x, y);

        plotGlobeLine(ctx, centerX, centerY, x, y); // Render the path

        console.log('x, y', x, y);

        latitudeInput.value = latitude.toString(); // Optional: round to 2 decimal places
        longitudeInput.value = longitude.toString(); // Optional: round to 2 decimal places
    });
    return 'success';
}

function plotGlobeLine(ctx, centerX, centerY, x, y) {
    ctx.beginPath(); // Start a new path
    ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
    ctx.lineTo(x, y); // Draw a line to (150, 100)
    ctx.stroke();
}

function getLatitudeLongitudeFromClick(x, y, canvasSize = 500) {
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  const dx = x - centerX;
  const dy = y - centerY;

  const r = Math.sqrt(dx * dx + dy * dy);
  const maxRadius = canvasSize / 2;
  const normalized = Math.min(r / maxRadius, 1);

  const latitude = 90 - normalized * 180;

  // Adjust longitude so that 0° is straight down (positive Y)
  let longitude = Math.atan2(dx, dy) * (180 / Math.PI); // Swap dx/dy
//   if (longitude < 0) longitude += 360;

  return { latitude, longitude };
}

// function getLatitudeLongitudeFromClick(x, y, width = 500, height = 100) {
//   const centerX = width / 2;
//   const centerY = height / 2;
//   const maxRadius = height / 2; // 50px

//   const dx = x - centerX;
//   const dy = y - centerY;

//   const r = Math.sqrt(dx * dx + dy * dy);

//   // Latitude: from -90 (pole) to 0 (equator)
//   const latitude = -90 + (r / maxRadius) * 90;

//   // Longitude: 0° is straight up, increase clockwise
//   let longitude = Math.atan2(dx, -dy) * (180 / Math.PI); // flipped dy because 0° is up
//   if (longitude < 0) longitude += 360;

//   return { latitude, longitude };
// }

// function getLatitudeLongitudeFromClick(x, y, canvasSize = 500) {
//     const centerX = canvasSize / 2;
//     const centerY = canvasSize / 2;

//     const dx = x - centerX;
//     const dy = y - centerY;

//     const r = Math.sqrt(dx * dx + dy * dy);
//     console.log('r', r)
//     const maxRadius = 195;

//     const latitude = Math.acos(r / maxRadius) * (180 / Math.PI);

//     // Longitude: 0° is straight down
//     let longitude = Math.atan2(dx, dy) * (180 / Math.PI); // Swapped for 0° = down
//     if (longitude < 0) longitude += 360;

//     return { latitude, longitude };
// }

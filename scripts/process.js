const d = {};

function process() {
  const t0 = performance.now();
  processFrame();
  if (ditherDropdownValue !== "none")
    printLog("Dithering took " + (performance.now() - t0) + "ms");
}

function processFrame() {
  ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
  const frame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const imageData = frame.data;
  if (useLinear) {
    for (let i = 0, length = imageData.length; i < length; i++) {
      imageData[i] = floor(linearLUT[imageData[i]]);
    }
  }

  d[ditherDropdownValue](imageData);

  ctx.putImageData(frame, 0, 0);
}

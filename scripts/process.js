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
    for (let i = imageData.length; i >= 0; i--) {
      imageData[i] = linearLUT[imageData[i]] | 0;
    }
  }

  let sqSz;
  let rChannel;
  let gChannel;
  let bChannel;

  if (useDBS) {
    sqSz = canvasWidth * canvasHeight;

    rChannel = new Uint8Array(sqSz);
    gChannel = new Uint8Array(sqSz);
    bChannel = new Uint8Array(sqSz);

    for (let i = 0; i < sqSz; i++) {
      const channelIdx = i * 4;

      rChannel[i] = imageData[channelIdx];
      gChannel[i] = imageData[channelIdx + 1];
      bChannel[i] = imageData[channelIdx + 2];
    }

    d[ditherDropdownValue](imageData);

    const rChannelDithered = new Uint8Array(sqSz);
    const gChannelDithered = new Uint8Array(sqSz);
    const bChannelDithered = new Uint8Array(sqSz);
    const customIndexesArray = new Uint32Array(sqSz);

    for (let i = 0; i < sqSz; i++) customIndexesArray[i] = i;
    BlueNoiseUtils.shuffle(customIndexesArray);

    for (let i = 0; i < sqSz; i++) {
      const channelIdx = i * 4;

      rChannelDithered[i] = imageData[channelIdx] > 127 ? 1 : 0;
      gChannelDithered[i] = imageData[channelIdx + 1] > 127 ? 1 : 0;
      bChannelDithered[i] = imageData[channelIdx + 2] > 127 ? 1 : 0;
    }

    for (let i = 0; i < DBSIterations; i++) {
      BlueNoiseFloat64.directBinarySearchInPlace(
        rChannel,
        rChannelDithered,
        customIndexesArray,
        canvasWidth,
        canvasHeight,
        DBSSigma,
        blueNoiseCustomKernel
      );

      BlueNoiseFloat64.directBinarySearchInPlace(
        gChannel,
        gChannelDithered,
        customIndexesArray,
        canvasWidth,
        canvasHeight,
        DBSSigma,
        blueNoiseCustomKernel
      );

      BlueNoiseFloat64.directBinarySearchInPlace(
        bChannel,
        bChannelDithered,
        customIndexesArray,
        canvasWidth,
        canvasHeight,
        DBSSigma,
        blueNoiseCustomKernel
      );
    }

    for (let i = 0; i < sqSz; i++) {
      const channelIdx = i * 4;

      imageData[channelIdx] = (rChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 1] = (gChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 2] = (bChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 3] = 255;
    }
  } else d[ditherDropdownValue](imageData);

  ctx.putImageData(frame, 0, 0);
}

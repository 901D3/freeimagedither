//const d = {};
const d = {
  none: () => {},
  matrixThreshold: bayer,
  arithmetic: arithmetic,
  errDiffs: errDiffs,
  varErrDiffs: varErrDiffs,
  dotDiffs: dotDiffs,
};

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
  }

  d[ditherDropdownValue](imageData);

  let rChannelDithered;
  let gChannelDithered;
  let bChannelDithered;

  if (useDBS) {
    rChannelDithered = new Uint8Array(sqSz);
    gChannelDithered = new Uint8Array(sqSz);
    bChannelDithered = new Uint8Array(sqSz);

    for (let i = 0; i < sqSz; i++) {
      const channelIdx = i * 4;

      rChannelDithered[i] = imageData[channelIdx] > 127 ? 1 : 0;
      gChannelDithered[i] = imageData[channelIdx + 1] > 127 ? 1 : 0;
      bChannelDithered[i] = imageData[channelIdx + 2] > 127 ? 1 : 0;
    }
  }

  if (useDBS) {
    blueNoiseFloat64.directBinarySearch(
      rChannel,
      rChannelDithered,
      canvasWidth,
      canvasHeight,
      DBSSigma,
      DBSIterations,
      blueNoiseCustomKernel
    );

    blueNoiseFloat64.directBinarySearch(
      gChannel,
      gChannelDithered,
      canvasWidth,
      canvasHeight,
      DBSSigma,
      DBSIterations,
      blueNoiseCustomKernel
    );

    blueNoiseFloat64.directBinarySearch(
      bChannel,
      bChannelDithered,
      canvasWidth,
      canvasHeight,
      DBSSigma,
      DBSIterations,
      blueNoiseCustomKernel
    );

    for (let i = 0; i < sqSz; i++) {
      const channelIdx = i * 4;

      imageData[channelIdx] = (rChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 1] = (gChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 2] = (bChannelDithered[i] * 255) | 0;
      imageData[channelIdx + 3] = 255;
    }
  }

  ctx.putImageData(frame, 0, 0);
}

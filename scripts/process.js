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
  if (telemetry) frameCounter();
  if (video.paused || video.ended || isRendering) return;
  setTimeout(process, max(0, frameTime - (performance.now() - t0)));
}

async function render() {
  if (isRecording == true) {
    printLog("Stop recording to start rendering");
    return false;
  }
  if (isRendering == true) {
    printLog("Rendering process has already started");
    return false;
  }
  isRendering = true;
  startRec.setAttribute("disabled", "");
  stopRec.setAttribute("disabled", "");
  pauseRec.setAttribute("disabled", "");
  resumeRec.setAttribute("disabled", "");

  printLog("Starting rendering");

  WebMMuxer.init({
    codec: "vp8", // Has to be VP8
    width: canvasWidth,
    height: canvasHeight,
    frameRate: recorderFrameRate,
    bufferSize: Number(gId("bufferSizeInput").value),
  });
  const chunks = [];

  const startPositionSeconds = Number(gId("rendererStartPosition").value ?? 0);
  const startFrame = floor(startPositionSeconds * recorderFrameRate);
  const totalFrames = ceil(video.duration * recorderFrameRate);
  printLog("Total frames:" + totalFrames);
  video.pause();
  video.currentTime = startPositionSeconds;
  video.muted = true;
  video.loop = false;
  canvas.style.hidden = true;

  performance.mark("renderStart");
  for (let frameIndex = startFrame; frameIndex < totalFrames && !video.ended; frameIndex++) {
    const frameTime = frameIndex / recorderFrameRate;

    performance.mark("videoDrawStart");
    await new Promise((resolve) => {
      video.currentTime = frameTime;
      video.addEventListener("seeked", resolve, {once: true});
    });
    processFrame();
    performance.mark("videoDrawEnd");

    performance.mark("toBlobStart");
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", blobQuality)
    );
    performance.mark("toBlobEnd");

    WebMMuxer.addFrameFromBlob(new Uint8Array(await blob.arrayBuffer()), chunks);

    if (isRendering == false) {
      printLog("Rendering stopped manually");
      isRendering = false;
      video.muted = false;
      video.loop = true;

      onComplete();
      return true;
    }

    if (telemetry) {
      performance.measure("videoDraw", "videoDrawStart", "videoDrawEnd");
      videoDraw = performance.getEntriesByName("videoDraw").at(-1)?.duration ?? 0;

      performance.measure("toBlob", "toBlobStart", "toBlobEnd");
      const toBlob = performance.getEntriesByName("toBlob").at(-1)?.duration ?? 0;

      printLog("Video draw: " + videoDraw + "ms\n" + "toBlob: " + toBlob + "ms\n");

      performance.clearMarks("videoDrawStart");
      performance.clearMarks("videoDrawEnd");
      performance.clearMarks("toBlobStart");
      performance.clearMarks("toBlobEnd");
      performance.clearMeasures("videoDraw");
      performance.clearMeasures("toBlob");
    }

    if (pausedRendering) await waitForResolve();

    // Yields so the UI stays responsive
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  performance.mark("renderEnd");
  performance.measure("render", "renderStart", "renderEnd");
  const renderTime = performance.getEntriesByName("render").at(-1)?.duration ?? 0;

  onComplete();

  async function onComplete() {
    isRendering = false;
    video.muted = false;
    video.loop = true;
    video.controls = true;

    const blob = WebMMuxer.finalize(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
    URL.revokeObjectURL(url);
    printLog(
      "Rendered video: " + "<a href='" + url + "' target='_blank'>" + url + "</a>",
      null
    );

    isRendering = false;
    startRend.removeAttribute("disabled", "");
    stopRend.setAttribute("disabled", "");

    startRec.removeAttribute("disabled");
    stopRec.setAttribute("disabled", "");
    pauseRec.setAttribute("disabled", "");
    resumeRec.setAttribute("disabled", "");
    return true;
  }

  printLog(
    "Elapsed: " +
      renderTime +
      "\n" +
      "Rendering takes " +
      (renderTime / (video.duration * 1000)) * 100 +
      "% of video duration"
  );
}

// WebCodecs seems to be screwing up
async function webCodecsRender() {
  if (isRecording == true) {
    printLog("Stop recording to start render");
    return false;
  }
  if (isRendering == true) {
    printLog("Rendering process has already started");
    return false;
  }
  isRendering = true;

  printLog("Starting rendering");

  const bufferSize = Number(gId("bufferSizeInput").value);

  const WebMMuxerConfig = {
    codec: gId("renderCodec").value === "vp09" ? "vp9" : gId("renderCodec").value,
    width: canvasWidth,
    height: canvasHeight,
    frameRate: recorderFrameRate,
    bufferSize: bufferSize,

    profile: 0,
    level: 0xff,
    bitDepth: 8,
    chromaSubsampling: 1,
    colorRange: 1,
    colorPrimaries: 1,
    transferCharacteristics: 1,
  };

  WebMMuxer.init(WebMMuxerConfig);
  const chunks = [];

  const startPositionSeconds = Number(gId("rendererStartPosition").value ?? 0);
  const startFrame = floor(startPositionSeconds * recorderFrameRate);
  const totalFrames = ceil(video.duration * recorderFrameRate);
  printLog("Total frames:" + totalFrames);
  video.pause();
  video.currentTime = startPositionSeconds;
  video.muted = true;
  video.loop = false;
  canvas.style.hidden = true;

  const init = {
    output(chunk) {
      const buffer = new Uint8Array(chunk.byteLength);
      chunk.copyTo(buffer);
      WebMMuxer.addFramePreEncoded(buffer, chunks);
    },
    error(err) {
      console.error(err);
    },
  };

  const config = {
    codec: gId("renderCodec").value === "vp09" ? "vp09.00.10.08" : "vp8",
    width: canvasWidth,
    height: canvasHeight,
    framerate: recorderFrameRate,
    bitrate: recorderVideoBitrate,
  };

  webCodecsEncoder = new VideoEncoder(init);
  console.log((await VideoEncoder.isConfigSupported(config)).supported);
  webCodecsEncoder.configure(config);

  performance.mark("renderStart");

  for (let frameIndex = startFrame; frameIndex < totalFrames && !video.ended; frameIndex++) {
    performance.mark("totalStart");
    const frameTime = frameIndex / recorderFrameRate;

    await new Promise((resolve) => {
      video.currentTime = frameTime;
      video.addEventListener("seeked", resolve, {once: true});
    });

    performance.mark("videoDrawStart");
    processFrame();
    performance.mark("videoDrawEnd");

    const videoFrame = new VideoFrame(canvas, {timestamp: frameTime * 1e6, format: "I420"});

    const keyframe = frameIndex % bufferSize === 0;
    webCodecsEncoder.encode(videoFrame, {keyframe});
    videoFrame.close();

    if (isRendering == false) {
      printLog("Rendering stopped manually");
      isRendering = false;
      video.muted = false;
      video.loop = true;

      onComplete();
      return true;
    }

    performance.mark("totalEnd");
    if (telemetry) {
      performance.measure("videoDraw", "videoDrawStart", "videoDrawEnd");
      performance.measure("toFrame", "toFrameStart", "toFrameEnd");
      performance.measure("total", "totalStart", "totalEnd");

      printLog(
        "Frames: " +
          frameIndex +
          "/" +
          totalFrames +
          "\n" +
          "Video draw: " +
          performance.getEntriesByName("videoDraw").at(-1)?.duration ??
          0 + "ms\n" + "toFrame: " + performance.getEntriesByName("toFrame").at(-1)?.duration ??
          0 + "ms\n" + "total: " + performance.getEntriesByName("toFrame").at(-1)?.duration ??
          0 + "ms\n"
      );

      performance.clearMarks("videoDrawStart");
      performance.clearMarks("videoDrawEnd");
      performance.clearMarks("toFrameStart");
      performance.clearMarks("toFrameEnd");
      performance.clearMeasures("videoDraw");
      performance.clearMeasures("toFrame");
      performance.clearMeasures("total");
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  performance.mark("renderEnd");
  performance.measure("render", "renderStart", "renderEnd");

  const renderTime = performance.getEntriesByName("render").at(-1)?.duration ?? 0;
  printLog(
    "Elapsed: " +
      renderTime +
      "\n" +
      "Rendering takes " +
      (renderTime / (video.duration * 1000)) * 100 +
      "% of video duration"
  );

  onComplete();

  async function onComplete() {
    await webCodecsEncoder.flush();
    webCodecsEncoder.close();

    isRendering = false;
    video.muted = false;
    video.loop = true;
    video.controls = true;

    const blob = WebMMuxer.finalize(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
    URL.revokeObjectURL(url);
    printLog(
      "Rendered video: " + "<a href='" + url + "' target='_blank'>" + url + "</a>",
      null
    );

    isRendering = false;
    startRend.removeAttribute("disabled", "");
    stopRend.setAttribute("disabled", "");

    startRec.removeAttribute("disabled");
    stopRec.setAttribute("disabled", "");
    pauseRec.setAttribute("disabled", "");
    resumeRec.setAttribute("disabled", "");
    return true;
  }
}

function processFrame() {
  ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
  const frame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const imageData = frame.data;

  if (useLinear) {
    for (let i = imageData.length; i >= 0; i--) {
      imageData[i] = linearLUT[imageData[i]];
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

  if (useDBS) {
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
  }

  ctx.putImageData(frame, 0, 0);
}

let lastUpdatedTime = 0;

function frameCounter() {
  frm++;
  let dlT = (performance.now() - lastUpdatedTime) / 1000;
  let currentFps = 1 / dlT;
  lastUpdatedTime = performance.now();
  if (performance.now() - lLT >= 1000) {
    printLog(
      "Fps: " +
        currentFps.toString().padEnd(22) +
        " | Latency: " +
        (dlT * 1000).toString().padEnd(22)
    );
    lLT = performance.now();
  }
}

video.addEventListener("play", function () {
  frm = 0;
  startTime = performance.now();
  lastUpdatedTime = startTime;
  lLT = startTime;
  process();
});

video.addEventListener("seeking", processFrame);

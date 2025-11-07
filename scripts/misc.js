gId("saveImage").addEventListener("click", function () {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "dithered_image.png";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

gId("rLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("rLvlsRange"), gId("rLvlsInput"), "rLvls", undefined, "slider");
  rLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});
gId("rLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("rLvlsRange"), gId("rLvlsInput"), "rLvls", 2, "input");
  rLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});

gId("gLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("gLvlsRange"), gId("gLvlsInput"), "gLvls", undefined, "slider");
  gLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});
gId("gLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("gLvlsRange"), gId("gLvlsInput"), "gLvls", 2, "input");
  gLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});

gId("bLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("bLvlsRange"), gId("bLvlsInput"), "bLvls", undefined, "slider");
  bLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});
gId("bLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("bLvlsRange"), gId("bLvlsInput"), "bLvls", 2, "input");
  bLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];
});

gId("rErrLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("rErrLvlsRange"), gId("rErrLvlsInput"), "rErrLvls", undefined, "slider");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});
gId("rErrLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("rErrLvlsRange"), gId("rErrLvlsInput"), "rErrLvls", 1, "input");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});

gId("gErrLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("gErrLvlsRange"), gId("gErrLvlsInput"), "gErrLvls", undefined, "slider");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});
gId("gErrLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("gErrLvlsRange"), gId("gErrLvlsInput"), "gErrLvls", 1, "input");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});

gId("bErrLvlsRange").addEventListener("input", function () {
  sliderInputSync(gId("bErrLvlsRange"), gId("bErrLvlsInput"), "bErrLvls", undefined, "slider");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});
gId("bErrLvlsInput").addEventListener("input", function () {
  sliderInputSync(gId("bErrLvlsRange"), gId("bErrLvlsInput"), "bErrLvls", 1, "input");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
});

gId("useLinear").addEventListener("input", function () {
  useLinear = gId("useLinear").checked;
  process();
});

gId("useSerpentine").addEventListener("input", function () {
  useSerpentine = gId("useSerpentine").checked;
  process();
});

gId("useBuffer").addEventListener("input", function () {
  useBuffer = gId("useBuffer").checked;
  if (useBuffer) {
    gId("bufferSelectDisp").classList.remove("disabled");
    errDiffsBuffer = bufferChange(canvasWidth, canvasHeight);
    setErrDiffsTarget = () => {
      errDiffsBufferTarget = errDiffsBuffer;
    };
    getBufferValue = (i, c) => errDiffsBuffer[i + c];
  } else {
    gId("bufferSelectDisp").classList.add("disabled");
    errDiffsBuffer = [];
    setErrDiffsTarget = (d) => {
      errDiffsBufferTarget = d;
    };
    getBufferValue = () => 0;
  }
  process();
});

gId("buffer").addEventListener("change", function () {
  buffer = gId("buffer").value;
  errDiffsBuffer = bufferChange(canvasWidth, canvasHeight);
});

function autoDivWrapper() {
  if (autoDiv) {
    divisionInput = findHighest(matrixInput.flat()) + 1;
    gId("divisionInput").value = findHighest(matrixInput.flat()) + 1;
  } else if (!autoDiv) {
    divisionInput = Number(gId("divisionInput").value);
  }
}

function errDiffsAutoDivWrapper() {
  if (errDiffsAutoDiv) {
    errDiffsDivisionInput = matrixSum_2D(errDiffsMatrixInput) + 1;
    gId("errDiffsDivisionInput").value = matrixSum_2D(errDiffsMatrixInput) + 1;
  } else if (!errDiffsAutoDiv) {
    errDiffsDivisionInput = Number(gId("errDiffsDivisionInput").value);
  }
}

function matrixInputLUTCreate() {
  const mY = matrixInput.length;
  const mX = matrixInput[0].length;
  const div = 255 / divisionInput;

  matrixInputLUT = new Float32Array(mY * mX);

  for (let y = 0; y < mY; y++) {
    const yOffs = y * mX;

    for (let x = 0; x < mX; x++) {
      matrixInputLUT[yOffs + x] = (matrixInput[y][x] * div) / 255;
    }
  }

  matrixInputLUT.mY = mY;
  matrixInputLUT.mX = mX;
}

gId("matrixInput").addEventListener("input", function () {
  try {
    matrixInput = JSON.parse(gId("matrixInput").value);
  } catch (e) {
    printLog(e, 1, "red", "red");
  }
  autoDiv = gId("autoDiv").checked;
  autoDivWrapper();
  matrixInputLUTCreate();
});

gId("divisionInput").addEventListener("input", function () {
  autoDivWrapper();
  matrixInputLUTCreate();
});

gId("autoDiv").addEventListener("input", function () {
  autoDiv = gId("autoDiv").checked;
  autoDivWrapper();
  matrixInputLUTCreate();
});

gId("arithmeticInput").addEventListener("input", function () {
  arithmeticInput = gId("arithmeticInput").value;
});

gId("errDiffsMatrixInput").addEventListener("input", function () {
  try {
    errDiffsMatrixInput = JSON.parse(gId("errDiffsMatrixInput").value);
  } catch (e) {
    printLog(e, 1, "red", "red");
  }

  errDiffsAutoDivWrapper();
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);
});

gId("errDiffsDivisionInput").addEventListener("input", function () {
  errDiffsAutoDivWrapper();
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);
});

gId("errDiffsAutoDiv").addEventListener("input", function () {
  errDiffsAutoDiv = gId("errDiffsAutoDiv").checked;
  errDiffsAutoDivWrapper();
});

gId("varErrDiffsMatrixInput").addEventListener("input", function () {
  try {
    varErrDiffsMatrixInput = JSON.parse(gId("varErrDiffsMatrixInput").value);
  } catch (e) {
    printLog(e, 1, "red", "red");
  }

  varErrDiffsKernel = parseKernelVarErrDiffs(varErrDiffsMatrixInput);
});

gId("useMirror").addEventListener("input", function () {
  useMirror = gId("useMirror").checked;
  varErrDiffsKernel = parseKernelVarErrDiffs(varErrDiffsMatrixInput);
});

gId("blueNoiseWidth").addEventListener("input", function () {
  blueNoiseWidth = Number(gId("blueNoiseWidth").value);
});

gId("blueNoiseHeight").addEventListener("input", function () {
  blueNoiseHeight = Number(gId("blueNoiseHeight").value);
});

gId("blueNoiseAlgo").addEventListener("change", function () {
  blueNoiseAlgo = gId("blueNoiseAlgo").value;
  if (blueNoiseAlgo === "VACluster") {
    gId("blueNoiseInitialSigmaScale").classList.add("disabled");
    gId("blueNoiseSigmaSample").classList.add("disabled");
    gId("blueNoiseIterations").classList.add("disabled");
  } else if (blueNoiseAlgo === "extendedVACluster" || blueNoiseAlgo === "extendedVACluster2") {
    gId("blueNoiseInitialSigmaScale").classList.remove("disabled");
    gId("blueNoiseSigmaSample").classList.add("disabled");
    gId("blueNoiseIterations").classList.add("disabled");
  } else if (blueNoiseAlgo === "bartWronskiVACluster") {
    gId("blueNoiseInitialSigmaScale").classList.remove("disabled");
    gId("blueNoiseSigmaSample").classList.add("disabled");
    gId("blueNoiseIterations").classList.add("disabled");
  } else if (blueNoiseAlgo === "georgievFajardo") {
    gId("blueNoiseInitialSigmaScale").classList.remove("disabled");
    gId("blueNoiseSigmaSample").classList.remove("disabled");
    gId("blueNoiseIterations").classList.remove("disabled");
  }
});

(function () {
  sliderInputSync(gId("rLvlsRange"), gId("rLvlsInput"), "rLvls", 2, "input");
  sliderInputSync(gId("gLvlsRange"), gId("gLvlsInput"), "gLvls", 2, "input");
  sliderInputSync(gId("bLvlsRange"), gId("bLvlsInput"), "bLvls", 2, "input");
  rLvls--;
  gLvls--;
  bLvls--;
  colorLimitArray = [rLvls, gLvls, bLvls];

  sliderInputSync(gId("rErrLvlsRange"), gId("rErrLvlsInput"), "rErrLvls", 1, "input");
  sliderInputSync(gId("gErrLvlsRange"), gId("gErrLvlsInput"), "gErrLvls", 1, "input");
  sliderInputSync(gId("bErrLvlsRange"), gId("bErrLvlsInput"), "bErrLvls", 1, "input");
  colorErrArray = [rErrLvls, gErrLvls, bErrLvls];

  useLinear = gId("useLinear").checked ? true : false;
  useSerpentine = gId("useSerpentine").checked ? true : false;
  useBuffer = gId("useBuffer").checked ? true : false;
  buffer = gId("buffer").value;
  autoDiv = gId("autoDiv").checked;
  errDiffsAutoDiv = gId("errDiffsAutoDiv").checked;
  useMirror = gId("useMirror").checked;
  autoDivWrapper();
  errDiffsAutoDivWrapper();
  matrixInputLUTCreate();

  errDiffsBuffer = [];
  setErrDiffsTarget = (d) => {
    errDiffsBufferTarget = d;
  };
  if (useBuffer) {
    getBufferValue = (i, c) => errDiffsBuffer[i + c]; // read from buffer
  } else {
    getBufferValue = () => 0; // always return 0
  }

  try {
    blueNoiseInitArray = JSON.parse(gId("blueNoiseInitArrayInput").value).flat();
  } catch {}
  blueNoiseWidth = Number(gId("blueNoiseWidth").value);
  blueNoiseHeight = Number(gId("blueNoiseHeight").value);
})();

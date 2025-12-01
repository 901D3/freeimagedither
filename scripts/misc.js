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

gId("matrixInput").addEventListener("input", function () {
  try {
    matrixInput = JSON.parse(gId("matrixInput").value);
  } catch (e) {
    printLog(e, 1, "red", "red");
  }
  autoDiv = gId("autoDiv").checked;
  autoDivWrapper();
  matrixInputLUTCreate();

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
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

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
});

gId("errDiffsDivisionInput").addEventListener("input", function () {
  errDiffsAutoDivWrapper();
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
});

gId("errDiffsAutoDiv").addEventListener("input", function () {
  errDiffsAutoDiv = gId("errDiffsAutoDiv").checked;
  errDiffsAutoDivWrapper();
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
});

gId("varErrDiffsMatrixInput").addEventListener("input", function () {
  try {
    varErrDiffsMatrixInput = JSON.parse(gId("varErrDiffsMatrixInput").value);
  } catch (e) {
    printLog(e, null, "red", "red");
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

function disableAll() {
  gId("matrix").classList.add("disabled");
  gId("uploadDitherImage").classList.add("disabled");
  gId("arithmetic").classList.add("disabled");
  gId("errDiffs").classList.add("disabled");
  gId("varErrDiffs").classList.add("disabled");
  gId("matrixThreshDisp").classList.add("disabled");
  gId("blueNoiseDisp").classList.add("disabled");
  gId("arithmeticDisp").classList.add("disabled");
  gId("errDiffsInputDisp").classList.add("disabled");
  gId("varErrDiffsInputDisp").classList.add("disabled");
  gId("lvlsDisp").classList.add("disabled");
  gId("errLvlsDisp").classList.add("disabled");
  gId("serpentineDisp").classList.add("disabled");
  gId("bufferDisp").classList.add("disabled");
  gId("mirrorDisp").classList.add("disabled");
}

gId("dither").addEventListener("change", function () {
  let dropdownValue = gId("dither").value;
  if (dropdownValue === "none") {
    disableAll();
  } else if (dropdownValue === "matrixThreshold") {
    disableAll();
    gId("matrix").classList.remove("disabled");
    gId("uploadDitherImage").classList.remove("disabled");
    gId("matrixThreshDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    if (gId("matrix").value === "blueNoise") {
      gId("blueNoiseDisp").classList.remove("disabled");
    }
  } else if (dropdownValue === "arithmetic") {
    disableAll();
    gId("arithmetic").classList.remove("disabled");
    gId("arithmeticDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
  } else if (dropdownValue === "errDiffs") {
    disableAll();
    gId("errDiffs").classList.remove("disabled");
    gId("errDiffsInputDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("errLvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    gId("serpentineDisp").classList.remove("disabled");
    gId("bufferDisp").classList.remove("disabled");
  } else if (dropdownValue === "varErrDiffs") {
    disableAll();
    gId("varErrDiffs").classList.remove("disabled");
    gId("varErrDiffsInputDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("errLvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    gId("serpentineDisp").classList.remove("disabled");
    gId("bufferDisp").classList.remove("disabled");
    gId("mirrorDisp").classList.remove("disabled");
  } else if (dropdownValue === "dotDiffs") {
    disableAll();
    gId("matrix").classList.remove("disabled");
    gId("uploadDitherImage").classList.remove("disabled");
    gId("matrixThreshDisp").classList.remove("disabled");

    gId("errDiffs").classList.remove("disabled");
    gId("errDiffsInputDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("errLvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    gId("bufferDisp").classList.remove("disabled");
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

  errDiffsBuffer = [];
  setErrDiffsTarget = (d) => {
    errDiffsBufferTarget = d;
  };
  if (useBuffer) {
    getBufferValue = (i, c) => errDiffsBuffer[i + c]; // read from buffer
  } else {
    getBufferValue = () => 0; // always return 0
  }

  blueNoiseWidth = Number(gId("blueNoiseWidth").value);
  blueNoiseHeight = Number(gId("blueNoiseHeight").value);

  try {
    blueNoiseInitArray = JSON.parse(gId("blueNoiseInitArrayInput").value).flat();
  } catch {}
})();

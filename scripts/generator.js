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

function bayerGen(size) {
  let seed = [
    [0, 2],
    [3, 1],
  ];

  while (seed.length < size) {
    let n = seed.length;
    let size = n << 1;
    let mat = [];

    for (let x = 0; x < size; x++) {
      mat[x] = [];
      for (let y = 0; y < size; y++) {
        let matVal = seed[x % n][y % n];
        if (x < n && y < n) {
          mat[x][y] = matVal * 4;
        } else if (x < n && y >= n) {
          mat[x][y] = matVal * 4 + 2;
        } else if (x >= n && y < n) {
          mat[x][y] = matVal * 4 + 3;
        } else {
          mat[x][y] = matVal * 4 + 1;
        }
      }
    }

    seed = mat;
  }

  return seed;
}

const dotDiffsClassInputLUTCreate = () => {
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;

  // Find max/min class values in the clas matrix input
  let minClassValue = Infinity;
  let maxClassValue = -Infinity;

  for (let y = 0; y < classHeight; y++) {
    for (let x = 0; x < classWidth; x++) {
      const v = matrixInput[y][x];

      if (v < minClassValue) minClassValue = v;
      if (v > maxClassValue) maxClassValue = v;
    }
  }

  // Save all available class values, ignore skipped class values
  dotDiffsAvailableClassValues = [];
  for (let i = minClassValue; i <= maxClassValue; i++) {
    let exists = false;

    for (let y = 0; y < classHeight && !exists; y++) {
      for (let x = 0; x < classWidth && !exists; x++) {
        if (matrixInput[y][x] === i) exists = true;
      }
    }

    if (exists) dotDiffsAvailableClassValues.push(i);
  }

  // [classValue][index of the class value tiled on the canvas]
  dotDiffsClassMatrixCanvasLUT = [];
  const classToIndex = [];

  for (let i = 0, length = dotDiffsAvailableClassValues.length; i < length; i++) {
    dotDiffsClassMatrixCanvasLUT[i] = [];
    classToIndex[dotDiffsAvailableClassValues[i]] = i;
  }

  for (let y = 0; y < canvasHeight; y++) {
    const yOffs = y * canvasWidth;
    const classY = y % classHeight;

    for (let x = 0; x < canvasWidth; x++) {
      const classIndex = classToIndex[matrixInput[classY][x % classWidth]];
      if (!dotDiffsClassMatrixCanvasLUT[classIndex]) {
        dotDiffsClassMatrixCanvasLUT[classIndex] = [];
      }

      dotDiffsClassMatrixCanvasLUT[classIndex].push((yOffs + x) << 2);
    }
  }
};

function blueNoiseWrapper() {
  blueNoiseCanvas.width = blueNoiseWidth;
  blueNoiseCanvas.height = blueNoiseHeight;
  const sqSz = blueNoiseWidth * blueNoiseHeight;
  const t0 = performance.now();
  let result;

  blueNoiseFloat32.gaussianSigmaRadiusMultiplier = Number(
    document.getElementById("blueNoiseGaussianSigmaRadiusMultiplier").value
  );

  blueNoiseUtils.gaussianSigmaRadiusMultiplier = Number(
    document.getElementById("blueNoiseGaussianSigmaRadiusMultiplier").value
  );

  blueNoiseFloat32.initialSigmaScale = Number(
    document.getElementById("blueNoiseInitialSigmaScale").value
  );

  if (blueNoiseAlgo === "VACluster") {
    result = blueNoiseFloat32.originalVoidAndCluster(
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      Number(document.getElementById("blueNoiseDensity").value)
    );
  } else if (blueNoiseAlgo === "extendedVACluster") {
    let kernel = null;
    if (document.getElementById("blueNoiseCustomKernel").value) {
      kernel = JSON.parse(document.getElementById("blueNoiseCustomKernel").value);
    }

    result = blueNoiseFloat32.extendedVoidAndCluster(
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      kernel,
      Number(document.getElementById("blueNoiseDensity").value)
    );
  } else if (blueNoiseAlgo === "bartWronskiVACluster") {
    result = blueNoiseFloat32.bartWronskiVoidAndCluster(
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      Number(document.getElementById("blueNoiseDensity").value)
    );
  } else if (blueNoiseAlgo === "georgievFajardo") {
    result = new Float32Array(sqSz);
    for (let i = 0; i < sqSz; i++) result[i] = Math.floor(Math.random() * sqSz);

    blueNoiseFloat32.georgievFajardoInPlace(
      result,
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      Number(document.getElementById("blueNoiseSigmaSample").value),
      Number(document.getElementById("blueNoiseIterations").value)
    );
  }

  const highest = findHighest(result);
  const denom = (1 / highest) * 255;

  printLog("Generating took " + (performance.now() - t0) + "ms");
  const frame = blueNoiseCtx.getImageData(0, 0, blueNoiseWidth, blueNoiseHeight);
  const imageData = frame.data;

  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;

    for (let x = 0; x < blueNoiseWidth; x++) {
      let i = yOffs + x;
      const v = Math.round(result[i] * denom);
      i <<= 2;
      imageData[i] = v;
      imageData[i + 1] = v;
      imageData[i + 2] = v;
      imageData[i + 3] = 255;
    }
  }

  blueNoiseCtx.putImageData(frame, 0, 0);

  matrixInput = [];
  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;
    if (!matrixInput[y]) matrixInput[y] = [];

    for (let x = 0; x < blueNoiseWidth; x++) {
      matrixInput[y][x] = result[yOffs + x];
    }
  }

  gId("matrixInput").value = formatNestedArray(matrixInput);
  gId("divisionInput").value = highest + 1;
  divisionInput = highest + 1;
  matrixInputLUTCreate();

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
}

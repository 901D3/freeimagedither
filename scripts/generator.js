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

function blueNoiseWrapper() {
  blueNoiseCanvas.width = blueNoiseWidth;
  blueNoiseCanvas.height = blueNoiseHeight;
  const sqSz = blueNoiseWidth * blueNoiseHeight;
  const t0 = performance.now();
  let result;

  blueNoiseFloat32.gaussianSigmaRadiusMultiplier = Number(
    document.getElementById("blueNoiseGaussianSigmaRadiusMultiplier").value
  );

  blueNoiseFloat32.initialSigmaScale = Number(document.getElementById("blueNoiseInitialSigmaScale").value);

  if (blueNoiseAlgo === "VACluster") {
    result = blueNoiseFloat32.originalVoidAndCluster(
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      Number(document.getElementById("blueNoiseDensity").value)
    );
  } else if (blueNoiseAlgo === "extendedVACluster") {
    result = blueNoiseFloat32.extendedVoidAndCluster(
      blueNoiseWidth,
      blueNoiseHeight,
      Number(document.getElementById("blueNoiseSigmaImage").value),
      null,
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
}

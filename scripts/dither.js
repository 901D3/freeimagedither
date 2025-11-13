const matrixThresholdPresets = () => {
  const a = gId("matrix").value;
  gId("blueNoiseDisp").classList.add("disabled");

  if (a === "threshold") {
    matrixInput = [[1]];
  } else if (a === "bayer2") {
    matrixInput = bayerGen(2);
  } else if (a === "bayer4") {
    matrixInput = bayerGen(4);
  } else if (a === "bayer8") {
    matrixInput = bayerGen(8);
  } else if (a === "bayer16") {
    matrixInput = bayerGen(16);
  } else if (a === "bayer32") {
    matrixInput = bayerGen(32);
  } else if (a === "bayer64") {
    matrixInput = bayerGen(64);
  } else if (a === "bayer128") {
    matrixInput = bayerGen(128);
  } else if (a === "bayer256") {
    matrixInput = bayerGen(256);
  } else if (a === "blueNoise") {
    gId("blueNoiseDisp").classList.remove("disabled");
  } else if (a === "cluster") {
    matrixInput = [
      [11, 5, 9, 3],
      [0, 15, 13, 6],
      [7, 12, 14, 1],
      [2, 8, 4, 10],
    ];
  } else if (a === "fishnet") {
    matrixInput = [
      [2, 0, 0, 0, 0, 0, 0, 2],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 2, 0, 0, 2, 0, 0],
      [0, 0, 0, 3, 3, 0, 0, 0],
      [0, 0, 0, 3, 3, 0, 0, 0],
      [0, 0, 2, 0, 0, 2, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [2, 0, 0, 0, 0, 0, 0, 2],
    ];
  } else if (a === "halftone") {
    matrixInput = [
      [24, 10, 12, 26, 35, 47, 49, 37],
      [8, 0, 2, 14, 45, 59, 61, 51],
      [22, 6, 4, 16, 43, 57, 63, 53],
      [30, 20, 18, 28, 33, 41, 55, 39],
      [34, 46, 48, 36, 25, 11, 13, 27],
      [44, 58, 60, 50, 9, 1, 3, 15],
      [42, 56, 62, 52, 23, 7, 5, 17],
      [32, 40, 54, 38, 31, 21, 19, 29],
    ];
  } else if (a === "cool1") {
    matrixInput = [
      [3, 2, 5, 1],
      [6, 0, 4, 2],
      [2, 4, 1, 5],
      [0, 6, 3, 4],
    ];
  } else if (a === "hatchLeft") {
    matrixInput = [
      [0, 1, 2, 1],
      [1, 0, 1, 2],
      [2, 1, 0, 1],
      [1, 2, 1, 0],
    ];
  } else if (a === "hatchRight") {
    matrixInput = [
      [1, 2, 1, 0],
      [2, 1, 0, 1],
      [1, 0, 1, 2],
      [0, 1, 2, 1],
    ];
  } else if (a === "hatchVertical") {
    matrixInput = [
      [0, 1, 2, 1],
      [0, 1, 2, 1],
      [0, 1, 2, 1],
      [0, 1, 2, 1],
    ];
  } else if (a === "hatchHorizontal") {
    matrixInput = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [2, 2, 2, 2],
      [1, 1, 1, 1],
    ];
  } else if (a === "crossHatchLeft") {
    matrixInput = [
      [3, 1, 2, 5],
      [6, 2, 0, 4],
      [2, 5, 4, 1],
      [0, 4, 6, 3],
    ];
  } else if (a === "crossHatchRight") {
    matrixInput = [
      [5, 2, 1, 3],
      [4, 0, 2, 6],
      [1, 4, 5, 2],
      [3, 6, 4, 0],
    ];
  } else if (a === "crossHatchVertical") {
    matrixInput = [
      [3, 1, 3, 5],
      [2, 0, 2, 4],
    ];
  } else if (a === "crossHatchHorizontal") {
    matrixInput = [
      [2, 3],
      [0, 1],
      [2, 3],
      [4, 5],
    ];
  } else if (a === "zigZag4") {
    matrixInput = [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [1, 2, 2, 1],
      [2, 1, 1, 2],
    ];
  } else if (a === "zigZag8") {
    matrixInput = [
      [2, 1, 0, 1, 1, 0, 1, 2],
      [1, 0, 1, 2, 2, 1, 0, 1],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [1, 2, 1, 0, 0, 1, 2, 1],
      [2, 1, 0, 1, 1, 0, 1, 2],
      [1, 0, 1, 2, 2, 1, 0, 1],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [1, 2, 1, 0, 0, 1, 2, 1],
    ];
  } else if (a === "zigZag16") {
    matrixInput = [
      [2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2],
      [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0],
      [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2],
      [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3],
      [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2],
      [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1],
      [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2],
      [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4],
      [2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2],
      [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0],
      [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2],
      [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3],
      [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2],
      [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1],
      [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2],
      [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4],
    ];
  } else if (a === "dot4") {
    matrixInput = [
      [0, 1, 2, 0],
      [1, 6, 3, 2],
      [2, 4, 5, 1],
      [0, 2, 1, 0],
    ];
  } else if (a === "dot8") {
    matrixInput = [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 4, 4, 3, 2, 1],
      [1, 2, 3, 4, 4, 3, 2, 1],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ];
  }

  const highest = findHighest(matrixInput.flat()) + 1;
  gId("matrixInput").value = formatNestedArray(matrixInput);
  gId("divisionInput").value = highest;
  divisionInput = highest;
  matrixInputLUTCreate();

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
};

const arithmeticPresets = () => {
  const a = gId("arithmetic").value;

  if (a === "arithmeticAdd") {
    arithmeticInput = "(((x + c * 67 + y * 236) * 119) & 255) / 256";
  } else if (a === "arithmeticAddConvariant") {
    arithmeticInput = "((x + y * 237) * 119 & 255) / 256";
  } else if (a === "arithmeticXor") {
    arithmeticInput = "(((x + c * 17) ^ y * 149) * 1234 & 255) / 256";
  } else if (a === "arithmeticXorConvariant") {
    arithmeticInput = "(((x ^ (y * 149)) * 1234) & 255) / 256";
  } else if (a === "halftone") {
    arithmeticInput = "0.5 + 0.5 * sin(0.8 * x) * sin(0.8 * y)";
  } else if (a === "colorShiftedHalftone") {
    arithmeticInput = "0.5 + 0.5 * sin(0.3 * x + 0.4 * c) * sin(0.3 * y + 0.4 * c)";
  }

  gId("arithmeticInput").value = arithmeticInput;
};

const errDiffsPresets = () => {
  const a = gId("errDiffs").value;

  if (a === "floydSteinberg") {
    errDiffsMatrixInput = [
      [0, -1, 7],
      [3, 5, 1],
    ];
  } else if (a === "falseFloydSteinberg") {
    errDiffsMatrixInput = [
      [-1, 3],
      [2, 3],
    ];
  } else if (a === "fan") {
    errDiffsMatrixInput = [
      [0, 0, -1, 7],
      [1, 3, 5],
    ];
  } else if (a === "shiauFan") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4],
      [1, 1, 2],
    ];
  } else if (a === "shiauFan2") {
    errDiffsMatrixInput = [
      [0, 0, 0, -1, 8],
      [1, 1, 2, 4],
    ];
  } else if (a === "atkinson") {
    errDiffsMatrixInput = [
      [0, 0, -1, 1, 1],
      [0, 1, 1, 1],
      [0, 0, 1],
    ];
  } else if (a === "burkes") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4, 2],
      [1, 2, 4, 2, 1],
    ];
  } else if (a === "javisJudiceNinke") {
    errDiffsMatrixInput = [
      [0, 0, -1, 7, 5],
      [3, 5, 7, 5, 3],
      [1, 3, 5, 3, 1],
    ];
  } else if (a === "stucki") {
    errDiffsMatrixInput = [
      [0, 0, -1, 8, 4],
      [2, 4, 8, 4, 2],
      [1, 2, 4, 2, 1],
    ];
  } else if (a === "sierra") {
    errDiffsMatrixInput = [
      [0, 0, -1, 5, 3],
      [2, 4, 5, 4, 2],
      [0, 2, 3, 2],
    ];
  } else if (a === "sierraLite") {
    errDiffsMatrixInput = [
      [0, -1, 2],
      [1, 1],
    ];
  } else if (a === "sierra2") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4, 3],
      [1, 2, 3, 2, 1],
    ];
  } else if (a === "box") {
    errDiffsMatrixInput = [
      [0, -1, 1],
      [1, 1, 1],
    ];
  } else if (a === "diagonal") {
    errDiffsMatrixInput = [
      [0, -1, 5],
      [2, 3, 6],
    ];
  } else if (a === "pigeon") {
    errDiffsMatrixInput = [
      [0, 0, -1, 2, 1],
      [0, 2, 2, 2],
      [1, 0, 1, 0, 1],
    ];
  } else if (a === "kist") {
    errDiffsMatrixInput = [
      [0, 0, -1, 90],
      [10, 20, 30, 20, 10],
      [10, 5, 10, 5, 10],
    ];
  } else if (a === "arce") {
    errDiffsMatrixInput = [
      [0, 0, 0, -1, 32],
      [6, 13, 10, 19, 10, 18, 8],
      [0, 0, 12, 26, 12],
      [3, 6, 4, 8, 4, 7, 2],
    ];
  } else if (a === "xot") {
    errDiffsMatrixInput = [
      [0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 4, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7],
      [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4],
      [0, 0, 2, 2, 0, 0, 3, 3, 0, 7, 8, 8, 7],
      [0, 3, 3, 3, 5, 6, 5, 5, 5, 7, 5, 5, 4],
      [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1],
      [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1, 1],
      [0, 3, 3, 3, 5, 6, 5, 5, 5, 5, 1, 1, 1, 1],
      [0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 0, 1, 1],
    ];
  } else if (a === "twoD") {
    errDiffsMatrixInput = [[-1, 1], [1]];
  } else if (a === "oneD") {
    random() > 0.5 ? (errDiffsMatrixInput = [[-1, 1]]) : (errDiffsMatrixInput = [[-1], [1]]);
  } else if (a === "knuth") {
    errDiffsMatrixInput = [
      [1, 2, 1],
      [2, -1, 2],
      [1, 2, 1],
    ];
  }

  errDiffsDivisionInput = matrixSum_2D(errDiffsMatrixInput) + 1;

  gId("errDiffsMatrixInput").value = formatNestedArray(errDiffsMatrixInput);
  gId("errDiffsDivisionInput").value = errDiffsDivisionInput;
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
};

const varErrDiffsPresets = () => {
  const a = gId("varErrDiffs").value;

  if (a === "ostromoukhov") {
    varErrDiffsMatrixInput = varErrDiffsRsrc.ostromoukhov();
  } else if (a === "zhouFang") {
    varErrDiffsMatrixInput = varErrDiffsRsrc.zhouFang();
  }

  gId("varErrDiffsMatrixInput").value = formatNestedArray(varErrDiffsMatrixInput);
  varErrDiffsKernel = parseKernelVarErrDiffs(varErrDiffsMatrixInput);

  process();
};

function formatNestedArray(arr, indent = 0) {
  const space = "  ".repeat(indent);
  if (!Array.isArray(arr)) return arr;

  const isAllPrimitives = arr.every((item) => !Array.isArray(item));

  if (isAllPrimitives) {
    return `[${arr.join(", ")}]`;
  }

  const items = arr.map((item) => formatNestedArray(item, indent + 1));
  return "[\n" + space + "  " + items.join(",\n" + space + "  ") + "\n" + space + "]";
}

gId("dither").addEventListener("change", () => {
  ditherDropdownValue = gId("dither").value;

  if (ditherDropdown.value === "matrixThreshold") {
    matrixThresholdPresets();
  } else if (ditherDropdown.value === "arithmetic") {
    arithmeticPresets();
  } else if (ditherDropdown.value === "errDiffs") {
    errDiffsPresets();
  } else if (ditherDropdown.value === "varErrDiffs") {
    varErrDiffsPresets();
  } else if (ditherDropdown.value === "dotDiffs") {
    matrixThresholdPresets();
    errDiffsPresets();
  }

  process();
});
gId("matrix").addEventListener("change", matrixThresholdPresets);
gId("arithmetic").addEventListener("change", arithmeticPresets);
gId("errDiffs").addEventListener("change", errDiffsPresets);
gId("varErrDiffs").addEventListener("change", varErrDiffsPresets);
//gId("dotDiffs").addEventListener("change", presets);

function toRGBMat(f) {
  let {width, height, data} = f,
    rgbMatrix = [];

  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < width; x++) {
      let i = (y * width + x) << 2,
        cl = data[i];
      row.push(cl);
    }
    rgbMatrix.push(row);
  }

  return rgbMatrix;
}

function bufferChange(w, h) {
  const sqSz4 = w * h * 4;
  const v = gIdV("buffer");
  if (v === "Int8Array") return new Int8Array(sqSz4);
  else if (v === "Int16Array") return new Int8Array(sqSz4);
  else if (v === "Int32Array") return new Int8Array(sqSz4);
  else if (v === "Float16Array") return new Float16Array(sqSz4); //new typed array
  else if (v === "Float32Array") return new Float32Array(sqSz4);
  else if (v === "Float64Array") return new Float32Array(sqSz4);
}

function parseKernelErrDiffs(matrix, division) {
  const start = findStart_2D(matrix, -1);
  const kernel = [];

  const originX = start.x;
  const originY = start.y;

  for (let y = 0, length = matrix.length; y < length; y++) {
    const row = matrix[y];

    for (let x = 0, length = row.length; x < length; x++) {
      const w = row[x];
      if (w === -1 || w === 0) continue;

      kernel.push({
        ox: x - originX,
        oy: y - originY,
        w: w / division,
      });
    }
  }

  return kernel;
}

function parseKernelVarErrDiffs(matrix) {
  const matrixLength = useMirror
    ? matrix.length === 256
      ? matrix.length
      : matrix.length * 2
    : matrix.length;
  const result = [];

  for (let i = 0; i < matrixLength; i++) {
    const idx = useMirror ? matrix[mirrorIdx(i, 128)] : matrix[i];
    const start = findStart_2D(idx[0], -1);
    const kernel = [];

    for (let y = 0, length = idx[0].length; y < length; y++) {
      const yIdx = idx[0];
      for (let x = 0, length = yIdx[y].length; x < length; x++) {
        const w = yIdx[y][x];
        if (w === -1 || w === 0) continue;

        kernel.push({
          ox: x - start.x,
          oy: y - start.y,
          w: w / idx[1],
        });
      }
    }
    result.push(kernel);
  }

  return result;
}

const scaled255 = 1 / 255;

//--------------------------------------------------------------------------------------------------------------------

/**
 * http://caca.zoy.org/study
 */

/**
 * https://en.wikipedia.org/wiki/Ordered_dithering
 */

function bayer(data) {
  const mY = matrixInputLUT.mY;
  const mX = matrixInputLUT.mX;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;
        const bVal = matrixInputLUT[(y % mY) * mX + (x % mX)];

        data[i + c] = floor(data[i + c] * scaled255 * colorLimit + bVal) * colorLimitScaled;
      }
    }
  }
}

/**
 * Arithmetic dither
 * By Øyvind Kolås
 *
 * https://pippin.gimp.org/a_dither
 *
 * Added "v" variable for current pixel value. Can be used with ternary operator for whatever you want
 */

function arithmetic(data) {
  const cp = new Function("x", "y", "c", "v", "return " + arithmeticInput + ";");

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;
        const v = data[i + c];

        data[i + c] = floor(v * scaled255 * colorLimit + cp(x, y, c, v)) * colorLimitScaled;
      }
    }
  }
}

/**
 * https://en.wikipedia.org/wiki/Error_diffusion
 * http://caca.zoy.org/study
 */

function errDiffs(data) {
  setErrDiffsTarget(data);
  if (useBuffer) errDiffsBuffer.fill(0);

  const errDiffsKernelLength = errDiffsKernel.length;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const el = colorErrArray[c];

    for (let y = 0; y < canvasHeight; y++) {
      const yBase = y * canvasWidth;
      const isOdd = useSerpentine && y % 2 === 1;

      const xStart = isOdd ? canvasWidth - 1 : 0;
      const xEnd = isOdd ? 0 : canvasWidth;
      const xStep = isOdd ? -1 : 1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const i = (x + yBase) << 2;

        const bSRGB = getBufferValue(i, c);
        const cl = data[i + c];

        const result = round((cl + bSRGB) * scaled255 * colorLimit) * colorLimitScaled;
        const errStrength = (cl - result + bSRGB) * el;

        data[i + c] = result;

        for (let k = 0; k < errDiffsKernelLength; k++) {
          const {ox, oy, w} = errDiffsKernel[k];

          const newX = x + (isOdd ? -ox : ox);
          const newY = y + oy;

          if (newX >= 0 && newX < canvasWidth && newY >= 0 && newY < canvasHeight) {
            const ni = (newY * canvasWidth + newX) << 2;
            errDiffsBufferTarget[ni + c] += errStrength * w;
          }
        }
      }
    }
  }
}

/**
 * Variable Error Diffusion
 * By Victor Ostromoukhov
 * https://perso.liris.cnrs.fr/ostrom/publications/pdf/SIGGRAPH01_varcoeffED.pdf
 */

function varErrDiffs(data) {
  setErrDiffsTarget(data);
  if (useBuffer) errDiffsBuffer.fill(0);

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const el = colorErrArray[c];

    for (let y = 0; y < canvasHeight; y++) {
      const yBase = y * canvasWidth;
      const isOdd = useSerpentine && y % 2 === 1;

      const xStart = isOdd ? canvasWidth - 1 : 0;
      const xEnd = isOdd ? 0 : canvasWidth;
      const xStep = isOdd ? -1 : 1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const i = (x + yBase) << 2;

        const bSRGB = getBufferValue(i, c);
        const cl = data[i + c];
        const coeff = varErrDiffsKernel[cl];
        const varErrDiffsKernelMatrixLength = varErrDiffsKernel[cl].length;

        const result = round((cl + bSRGB) * scaled255 * colorLimit) * colorLimitScaled;
        const errStrength = (cl - result + bSRGB) * el;

        data[i + c] = result;

        for (let k = 0; k < varErrDiffsKernelMatrixLength; k++) {
          const {ox, oy, w} = coeff[k];

          const newX = x + (isOdd ? -ox : ox);
          const newY = y + oy;

          if (newX >= 0 && newX < canvasWidth && newY >= 0 && newY < canvasHeight) {
            const ni = (newY * canvasWidth + newX) << 2;
            errDiffsBufferTarget[ni + c] += errStrength * w;
          }
        }
      }
    }
  }
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

const dotDiffs = (data) => {
  setErrDiffsTarget(data);
  if (useBuffer) errDiffsBuffer.fill(0);

  const errDiffsKernelLength = errDiffsKernel.length;
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const el = colorErrArray[c];

    for (
      let classValue = 0, length = dotDiffsClassMatrixCanvasLUT.length;
      classValue < length;
      classValue++
    ) {
      const indexesOfClassValueLength = dotDiffsClassMatrixCanvasLUT[classValue].length;

      for (let i = 0, length = indexesOfClassValueLength; i < length; i++) {
        const idx = dotDiffsClassMatrixCanvasLUT[classValue][i];

        const x = (idx >> 2) % canvasWidth;
        const y = Math.floor(idx / (canvasWidth << 2));

        const bSRGB = getBufferValue(idx, c);
        const cl = data[idx + c];

        const result = round((cl + bSRGB) * scaled255 * colorLimit) * colorLimitScaled;
        const errStrength = (cl - result + bSRGB) * el;

        data[idx + c] = result;

        let weightedNeighbors = [];
        let totalWeight = 0;

        for (let k = 0; k < errDiffsKernelLength; k++) {
          const {ox, oy, w} = errDiffsKernel[k];
          const newX = x + ox;
          const newY = y + oy;
          if (newX < 0 || newY < 0 || newX >= canvasWidth || newY >= canvasHeight) continue;

          if (matrixInput[newY % classHeight][newX % classWidth] > classValue) {
            totalWeight += w;
            weightedNeighbors.push({newX, newY, w});
          }
        }
        if (totalWeight > 0) {
          const scale = errStrength / totalWeight;

          for (let i = 0, length = weightedNeighbors.length; i < length; i++) {
            const {newX, newY, w} = weightedNeighbors[i];

            errDiffsBufferTarget[((newY * canvasWidth + newX) << 2) + c] += w * scale;
          }
        }
      }
    }
  }
};

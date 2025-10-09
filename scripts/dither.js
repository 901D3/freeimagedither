function presets() {
  const dropdown = gIdV("dither");
  if (dropdown === "matrixThreshold") {
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
      return;
    }

    const highest = findHighest(matrixInput.flat()) + 1;
    gId("matrixInput").value = formatNestedArray(matrixInput);
    gId("divisionInput").value = highest;
    divisionInput = highest;
    matrixInputLUTCreate();
  } else if (dropdown === "arithmetic") {
    const a = gId("arithmetic").value;

    if (a === "arithmeticAdd") {
      arithmeticInput = "(((x + c * 67 + y * 236) * 119) & 255) / 255";
    } else if (a === "arithmeticAddConvariant") {
      arithmeticInput = "((x + y * 237) * 119 & 255) / 255";
    } else if (a === "arithmeticXor") {
      arithmeticInput = "(((x + c * 17) ^ y * 149) * 1234 & 255) / 255";
    } else if (a === "arithmeticXorConvariant") {
      arithmeticInput = "(((x ^ (y * 149)) * 1234) & 255) / 255";
    } else if (a === "halftone") {
      arithmeticInput = "0.5 + 0.5 * sin(0.8 * x) * sin(0.8 * y)";
    } else if (a === "colorShiftedHalftone") {
      arithmeticInput = "0.5 + 0.5 * sin(0.3 * x + 0.4 * c) * sin(0.3 * y + 0.4 * c)";
    }

    gId("arithmeticInput").value = arithmeticInput;
  } else if (dropdown === "errDiffs") {
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
    } else if (a === "javisjudiceninke") {
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
    }

    errDiffsDivisionInput = matrixSum_2D(errDiffsMatrixInput) + 1;

    gId("errDiffsMatrixInput").value = formatNestedArray(errDiffsMatrixInput);
    gId("errDiffsDivisionInput").value = errDiffsDivisionInput;
    errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);
  } else if (dropdown === "varErrDiffs") {
    const a = gId("varErrDiffs").value;

    if (a === "ostromoukhov") {
      varErrDiffsMatrixInput = varErrDiffsRsrc.ostromoukhov();
    } else if (a === "zhouFang") {
      varErrDiffsMatrixInput = varErrDiffsRsrc.zhouFang();
    }

    gId("varErrDiffsMatrixInput").value = formatNestedArray(varErrDiffsMatrixInput);
    varErrDiffsKernel = parseKernelVarErrDiffs(varErrDiffsMatrixInput);
  }
  process();
}

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
  presets();
});
gId("matrix").addEventListener("change", presets);
gId("arithmetic").addEventListener("change", presets);
gId("errDiffs").addEventListener("change", presets);
gId("varErrDiffs").addEventListener("change", presets);

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
  if (v === "Int16Array") return new Int8Array(sqSz4);
  if (v === "Int32Array") return new Int8Array(sqSz4);
  if (v === "Float16Array") return new Float16Array(sqSz4); //new typed array
  if (v === "Float32Array") return new Float32Array(sqSz4);
  if (v === "Float64Array") return new Float32Array(sqSz4);
}

gId("buffer").addEventListener("change", () => {
  bufferChange();
  process();
});

function parseKernelErrDiffs(matrix, division) {
  const start = findStart_2D(matrix, -1);
  const kernel = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const w = matrix[y][x];
      if (w === -1 || w === 0) continue;

      kernel.push({
        ox: x - start.x,
        oy: y - start.y,
        w: w / division,
      });
    }
  }

  return kernel;
}

function parseKernelVarErrDiffs(matrix) {
  const matrixLength = useMirror ? (matrix.length === 256 ? matrix.length : matrix.length * 2) : matrix.length;
  const result = [];

  for (let i = 0; i < matrixLength; i++) {
    const idx = useMirror ? matrix[mirrorIdx(i, 128)] : matrix[i];
    const start = findStart_2D(idx[0], -1);
    const kernel = [];

    for (let y = 0; y < idx[0].length; y++) {
      const yIdx = idx[0];
      for (let x = 0; x < yIdx[y].length; x++) {
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

function bayer(d) {
  const mY = matrixInputLUT.mY;
  const mX = matrixInputLUT.mX;
  const colorArray = [rLvls, gLvls, bLvls];

  for (let c = 0; c < 3; c++) {
    const color = colorArray[c];

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;
        const bVal = matrixInputLUT[(y % mY) * mX + (x % mX)];

        d[i + c] = (floor(d[i + c] * scaled255 * color + bVal) / color) * 255;
      }
    }
  }
}

function arithmetic(d) {
  const cp = new Function("x", "y", "c", "return " + arithmeticInput + ";");
  const colorArray = [rLvls, gLvls, bLvls];

  for (let c = 0; c < 3; c++) {
    const color = colorArray[c];
    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;

        d[i + c] = (floor(d[i + c] * scaled255 * color + cp(x, y, c)) / color) * 255;
      }
    }
  }
}

function errDiffs(d) {
  setErrDiffsTarget(d);
  if (useBuffer) errDiffsBuffer.fill(0);

  const colorArray = [rLvls, gLvls, bLvls];
  const colorErrArray = [rErrLvls, gErrLvls, bErrLvls];
  const errDiffsKernelLength = errDiffsKernel.length;

  for (let c = 0; c < 3; c++) {
    const color = colorArray[c];
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
        const cl = d[i + c];

        const result = (round((cl + bSRGB) * scaled255 * color) / color) * 255;
        const errStrength = (cl - result + bSRGB) * el;

        d[i + c] = result;

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

function varErrDiffs(d) {
  setErrDiffsTarget(d);
  if (useBuffer) errDiffsBuffer.fill(0);

  const colorArray = [rLvls, gLvls, bLvls];
  const colorErrArray = [rErrLvls, gErrLvls, bErrLvls];

  for (let c = 0; c < 3; c++) {
    const color = colorArray[c];
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
        const cl = d[i + c];
        const coeff = varErrDiffsKernel[cl];
        const varErrDiffsKernelMatrixLength = varErrDiffsKernel[cl].length;

        const result = (round((cl + bSRGB) * scaled255 * color) / color) * 255;
        const errStrength = (cl - result + bSRGB) * el;

        d[i + c] = result;

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

//--------------------------------------------------------------------------------------------------------------------

/**
 *
 * https://en.wikipedia.org/wiki/Error_diffusion
 * https://pippin.gimp.org/a_dither/
 * https://potch.me/demos/playdither
 * https://github.com/robertkist/libdither
 * https://app.dithermark.com
 * https://perso.liris.cnrs.fr/ostrom/publications/pdf/SIGGRAPH01_varcoeffED.pdf
 * https://observablehq.com/@jobleonard/variable-coefficient-dithering
 * http://research.cs.wisc.edu/graphics/Courses/559-f2002/lectures/cs559-5.ppt
 * http://caca.zoy.org/study
 *
 */

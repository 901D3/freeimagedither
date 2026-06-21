document.getElementById("saveImage").addEventListener("click", function () {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = crypto.randomUUID() + ".png";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

document.getElementById('RCountSlider').addEventListener('input',
  function () {
    gCtx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), undefined, 'slider');
    CompilePalette();
  }
);

document.getElementById('RCountInput').addEventListener('input',
  function () {
    gCtx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), 2, 'input');
    CompilePalette();
  }
);

document.getElementById('GCountSlider').addEventListener('input',
  function () {
    gCtx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), undefined, 'slider');
    CompilePalette();
  }
);

document.getElementById('GCountInput').addEventListener('input',
  function () {
    gCtx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), 2, 'input');
    CompilePalette();
  }
);

document.getElementById('BCountSlider').addEventListener('input',
  function () {
    gCtx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), undefined, 'slider');
    CompilePalette();
  }
);

document.getElementById('BCountInput').addEventListener('input',
  function () {
    gCtx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), 2, 'input');
    CompilePalette();
  }
);

document.getElementById('UseLinear').addEventListener('input',
  function () { gCtx.linear = document.getElementById('UseLinear').checked; });

document.getElementById('UseSerpentine').addEventListener('input',
  function () {
    gCtx.serpentine = document.getElementById('UseSerpentine').checked;

    const a = document.getElementById('Dither').value;
    if (a === 'ErrorDiffusion' || a === 'VariableErrorDiffusion')
      CompileClassMap();
  }
);

const ditherPresets = {
  'None': [],

  'Ordered': [
    { value: 'Threshold', label: 'Threshold' },
    { value: 'Bayer2', label: 'Bayer 2x2' },
    { value: 'Bayer4', label: 'Bayer 4x4' },
    { value: 'Bayer8', label: 'Bayer 8x8' },
    { value: 'Bayer16', label: 'Bayer 16x16' },
    { value: 'Cluster', label: 'Cluster' },
    { value: 'Fishnet', label: 'Fishnet' },
    { value: 'Halftone', label: 'Halftone' },
    { value: 'HatchLeft', label: 'Hatch Left' },
    { value: 'HatchRight', label: 'Hatch Right' },
    { value: 'HatchVertical', label: 'Hatch Vertical' },
    { value: 'HatchHorizontal', label: 'Hatch Horizontal' },
    { value: 'CrossHatchLeft', label: 'Cross Hatch Left' },
    { value: 'CrossHatchRight', label: 'Cross Hatch Right' },
    { value: 'CrossHatchVertical', label: 'Cross Hatch Vertical' },
    { value: 'CrossHatchHorizontal', label: 'Cross Hatch Horizontal' },
    { value: 'ZigZag4', label: 'Zig Zag 4' },
    { value: 'ZigZag8', label: 'Zig Zag 8' },
    { value: 'ZigZag16', label: 'Zig Zag 16' },
    { value: 'Dot4', label: 'Dot 4' },
    { value: 'Dot8', label: 'Dot 8' },
    { value: 'Rylander', label: 'Rylander' },
  ],

  'Arithmetic': [
    { value: 'ArithmeticAddConvariant', label: 'Arithmetic ADD Convariant' },
    { value: 'ArithmeticXorConvariant', label: 'Arithmetic XOR Convariant' },
    { value: 'Halftone', label: 'Halftone' },
  ],

  'ErrorDiffusion': [
    { value: 'FloydSteinberg', label: 'Floyd-Steinberg' },
    { value: 'FalseFloydSteinberg', label: 'False Floyd-Steinberg' },
    { value: 'Fan', label: 'Fan' },
    { value: 'ShiauFan', label: 'Shiau-Fan' },
    { value: 'ShiauFan2', label: 'Shiau-Fan 2' },
    { value: 'Atkinson', label: 'Atkinson' },
    { value: 'Burkes', label: 'Burkes' },
    { value: 'JavisJudiceNinke', label: 'Javis Judice Ninke' },
    { value: 'Stucki', label: 'Stucki' },
    { value: 'Sierra', label: 'Sierra' },
    { value: 'SierraLite', label: 'Sierra Lite' },
    { value: 'Sierra2', label: 'Sierra 2' },
    { value: 'Box', label: 'Box' },
    { value: 'Diagonal', label: 'Diagonal' },
    { value: 'Pigeon', label: 'Pigeon' },
    { value: 'Kist', label: 'Kist' },
    { value: 'Arce', label: 'Arce' },
    { value: 'Xot', label: 'Xot' },
    { value: 'TwoD', label: '2D' },
    { value: 'OneD', label: '1D' },
    { value: 'Knuth', label: 'Knuth' },
    { value: 'Box3', label: 'Box 3' },
    { value: 'Box5', label: 'Box 5' },
    { value: 'Box7', label: 'Box 7' },
    { value: 'Box9', label: 'Box 9' },
    { value: 'Cross', label: 'Cross' },
    { value: 'DiagonalCross', label: 'Diagonal Cross' },
  ],

  'VariableErrorDiffusion': [
    { value: 'Ostromoukhov', label: 'Ostromoukhov' },
    { value: 'ZhouFang', label: 'Zhou-Fang' },
  ],
};

document.getElementById('Dither').addEventListener('change',
  function () {
    const a = document.getElementById('Presets');

    a.innerHTML = '';

    const b = document.getElementById('Dither').value;

    if (b === 'DotDiffusion') {
      let gr = document.createElement('optgroup');
      gr.label = 'Class Matrix';

      for (const option of ditherPresets['Ordered'])
        gr.appendChild(new Option(option.label, option.value));

      a.appendChild(gr);

      gr = document.createElement('optgroup');
      gr.label = 'Diffuse Matrix';

      for (const option of ditherPresets['ErrorDiffusion'])
        gr.appendChild(new Option(option.label, option.value));

      a.appendChild(gr);
    }
    else {
      for (const option of ditherPresets[b])
        a.add(new Option(option.label, option.value));
    }

    if (b === 'Ordered') SetOrderedDitherPreset();
    else if (b === 'Arithmetic') SetArithmeticDitherPresets();
    else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') SetErrorDiffsPreset();
  }
);

document.getElementById('Presets').addEventListener('change',
  function () {
    const b = document.getElementById('Dither').value;

    if (b === 'Ordered') SetOrderedDitherPreset();
    else if (b === 'Arithmetic') SetArithmeticDitherPresets();
    else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') SetErrorDiffsPreset();
  }
);

document.getElementById('PrimeTextarea').addEventListener('input',
  function () {
    const b = document.getElementById('Dither').value;

    if (b === 'Ordered') CompileOrderedDitherMatrix();
    else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') CompileErrorDiffusionMatrices();
  }
);

/*
// Improved Dot Diffusion For Image Halftoning
// https://web.archive.org/web/20240720181431/https://apps.dtic.mil/sti/pdfs/ADA368062.pdf

ImproveClassMatrix = function (gray, candidates1, candidates2, sigma) {
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;

  const sqSz = classWidth * classHeight;

  const kernelArray = BlueNoiseFloat64.getGaussianKernel(sigma);
  const kernelWidth = (Math.ceil(3 * sigma) << 1) + 1;

  const ditheredArray = new Float32Array(sqSz);
  const errorArray = new Float32Array(sqSz);

  ditheredArray.fill(gray);
  dotDiffsClassInputLUTCreateSimple(classWidth, classHeight);
  dotDiffsSimple(ditheredArray, classWidth, classHeight, sqSz);

  for (let i = 0; i < sqSz; i++) {
    errorArray[i] = gray - ditheredArray[i];
  }

  let currentCost = BlueNoiseUtils.computeEnergyWrapAround(
    errorArray,
    classWidth,
    classHeight,
    kernelArray,
    kernelWidth,
    kernelWidth
  );

  let improved = true;

  breaked: while (improved) {
    improved = false;

    for (let candidate1 = 0; candidate1 < candidates1; candidate1++) {
      const candidateIdx1 = (Math.random() * sqSz) | 0;

      for (let candidate2 = 0; candidate2 < candidates2; candidate2++) {
        let candidateIdx2 = (Math.random() * sqSz) | 0;

        while (candidateIdx1 === candidateIdx2) candidateIdx2 = (Math.random() * sqSz) | 0;

        const tmp = dotDiffsClassMatrixCanvasLUT[candidateIdx1];
        dotDiffsClassMatrixCanvasLUT[candidateIdx1] =
          dotDiffsClassMatrixCanvasLUT[candidateIdx2];
        dotDiffsClassMatrixCanvasLUT[candidateIdx2] = tmp;

        ditheredArray.fill(gray);
        dotDiffsSimple(ditheredArray, classWidth, classHeight, sqSz);

        for (let i = 0; i < sqSz; i++) {
          errorArray[i] = gray - ditheredArray[i];
        }

        const cost = BlueNoiseUtils.computeEnergyWrapAround(
          errorArray,
          classWidth,
          classHeight,
          kernelArray,
          kernelWidth,
          kernelWidth
        );

        if (cost > currentCost) {
          currentCost = cost;
          improved = true;

          continue breaked;
        }

        dotDiffsClassMatrixCanvasLUT[candidateIdx2] =
          dotDiffsClassMatrixCanvasLUT[candidateIdx1];
        dotDiffsClassMatrixCanvasLUT[candidateIdx1] = tmp;
      }
    }
  }

  for (let y = 0; y < classHeight; y++) {
    const yOffs = y * classWidth;

    for (let x = 0; x < classWidth; x++) {
      matrixInput[y][x] = dotDiffsClassMatrixCanvasLUT[yOffs + x];
    }
  }
};
*/


(function () {
  gCtx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), 2, 'input');
  gCtx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), 2, 'input');
  gCtx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), 2, 'input');

  CompilePalette();

  useLinear = document.getElementById('UseLinear').checked;
  useSerpentine = document.getElementById('UseSerpentine').checked;
})();

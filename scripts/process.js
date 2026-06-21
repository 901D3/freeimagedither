
Process = function () {
  const t0 = performance.now();

  ProcessFrame();

  const time = performance.now() - t0;

  SpeedsInit();
  SpeedsLog(time + 'ms');
};

function ProcessFrame() {
  gCtx.ctx.drawImage(gCtx.image, 0, 0, gCtx.width, gCtx.height);
  const frame = gCtx.ctx.getImageData(0, 0, gCtx.width, gCtx.height);
  const imageData = frame.data;

  if (gCtx.linear)
    for (let i = imageData.length - 1; i >= 0; i--) imageData[i] = gCtx.linearLUT[imageData[i]];

  const a = document.getElementById('Dither').value;

  if (a === 'Ordered') {
    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteB);
  }
  else if (a === 'Arithmetic') {
    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteB);
  }
  else if (a === 'ErrorDiffusion') {
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteB);
  }
  else if (a === 'VariableErrorDiffusion') {
    const errorBuffer = new Float32Array(gCtx.width * gCtx.height);
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteB);
  }

  gCtx.ctx.putImageData(frame, 0, 0);
}

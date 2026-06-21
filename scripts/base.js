
SpeedsInit = function () {
  gCtx.speeds.innerText = '';
};

SpeedsLog = function (msg) {
  gCtx.speeds.appendChild(document.createTextNode(msg + "\n"));
};

UploadImageHandler = function (event) {
  const file = event.target.files[0];
  if (file)
    gCtx.image.src = URL.createObjectURL(file);

}

ChangeCanvasSize = function () {
  const width = Number(document.getElementById("CanvasWidth").value);
  const height = Number(document.getElementById("CanvasHeight").value);

  if (width && height) {
    gCtx.width = width, gCtx.height = height;
    gCtx.canvas.width = gCtx.width, gCtx.canvas.height = gCtx.height;

    CompileClassMap();
  }
}

GenerateBayer = function (size) {
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
        let v = seed[x % n][y % n];
        if (x < n && y < n) mat[x][y] = v * 4;
        else if (x < n && y >= n) mat[x][y] = v * 4 + 2;
        else if (x >= n && y < n) mat[x][y] = v * 4 + 3;
        else mat[x][y] = v * 4 + 1;

      }
    }

    seed = mat;
  }

  return seed;
}

BaseInit = function () {
  gCtx.canvas = document.getElementById("canvas");
  gCtx.ctx = gCtx.canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: false,
  });

  document.getElementById("Upload").addEventListener("change",
    function (e) { UploadImageHandler(e); });

  gCtx.linearLUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    gCtx.linearLUT[i] = (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) * 255;
  }

  gCtx.image = document.getElementById("image");
  gCtx.speeds = document.getElementById('Speeds');

  errorDiffs.fn.DitherErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(true, true);
  errorDiffs.fn.DitherVariableErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(false, true);

  gCtx.image.src = "test_small.png";
  gCtx.image.onload = function () {
    gCtx.width = gCtx.image.width;
    gCtx.height = gCtx.image.height;
  };
}

document.addEventListener("DOMContentLoaded", BaseInit);

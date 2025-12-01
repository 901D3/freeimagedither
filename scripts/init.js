function gId(i) {
  return document.getElementById(i);
}

function gIdV(i) {
  return document.getElementById(i).value;
}

function pFl(i) {
  return parseFloat(i);
}

function pIn(i) {
  return parseInt(i);
}

function lwC(i) {
  return i.toLowerCase();
}

function setDisp(i, s) {
  return (gId(i).style.display = s);
}

function logVar(variable) {
  let varName = (function () {
    for (const key in window) {
      if (window[key] === variable) return key;
    }
  })();
  console.log(varName + ": ");
  console.log(variable);
}

function defV(v1, v2, vx) {
  //v1 for input value, v2 for default value, vx for returning v2 if v1 = vx
  if (isNaN(vx) || !isFinite(vx)) vx = 1;
  if (Number.isNaN(v1) || !isFinite(v1) || v1 === vx) return v2;
  else return v1;
}

function defVAdv(v1, v2, vmin = 0, vmax = 100, ltvmin = false, gtvmax = false) {
  if (Number.isNaN(v1) || !isFinite(v1)) return v2;
  if (ltvmin && v1 < vmin) return v2;
  if (gtvmax && v1 > vmax) return v2;

  return v1;
}

let A = 1.7976931348623157e308,
  B = 5e-324;

function hideElements() {
  elementsToHide.forEach((id) => setDisp(id, "none"));
}

var canvas = gId("canvas");
var ctx = canvas.getContext("2d", {
  willReadFrequently: true,
  alpha: false,
  colorSpace: "srgb",
  colorType: "float16",
  desynchronized: false,
});
ctx.imageSmoothingEnabled = false;
var blueNoiseCanvas = gId("blueNoiseCanvas");
var blueNoiseCtx = blueNoiseCanvas.getContext("2d");
var video = gId("video");
var ditherDropdown = gId("dither");
var ditherDropdownValue = "none";
var canvasStream = canvas.captureStream();
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var isProcessing = false;
var frm = 0;
var stT = 0;
var lsUpdT = 0;
var lLT = 0;
var telemetry = false;
var sqSz;

var {
  abs,
  acos,
  acosh,
  asin,
  asinh,
  atan,
  atan2,
  atanh,
  cbrt,
  ceil,
  cos,
  cosh,
  exp,
  floor,
  fround,
  log,
  log10,
  log1p,
  log2,
  max,
  min,
  pow,
  random,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  trunc,
  LN10,
  LN2,
  LOG10E,
  LOG2E,
  PI,
  SQRT1_2,
  SQRT2,
} = Math;

var _2PI = PI * 2;

var rLvls;
var gLvls;
var bLvls;

var rErrLvls;
var gErrLvls;
var bErrLvls;

var colorLimitArray = [rLvls, gLvls, bLvls];
var colorErrArray = [rErrLvls, gErrLvls, bErrLvls];

var useLinear;
var useSerpentine;
var useBuffer;

var matrixInput = [[1]];
var matrixInputLUT;
var divisionInput = 1;
var autoDiv;
var arithmeticInput;
var errDiffsMatrixInput = [[-1]];
var errDiffsKernel;
var errDiffsMatrixInputXStart;
var errDiffsMatrixInputYStart;
var errDiffsDivisionInput;
var errDiffsAutoDiv;
var errDiffsBuffer;
var errDiffsBufferTarget;

var varErrDiffsMatrixInput = [[-1], 1];
var varErrDiffsKernel;
var useMirror;

var dotDiffsClassMatrixCanvasLUT;
var dotDiffsAvailableClassValues;

var blueNoiseWidth = 64;
var blueNoiseHeight = 64;
var blueNoiseAlgo = "VACluster";

var frameRate = 30;
var frameTime = 1000 / frameRate;

var setErrDiffsTarget = () => {};
var getBufferValue = () => {};

var getLinear = useLinear ? (val) => linearLUT[val] : (val) => val;
var getBuffer = useBuffer ? (i, c) => errDiffsBuffer[i + c] : () => 0;
var getIndex = useSerpentine
  ? (x, yOffs, y) => ((y & 1 ? canvasWidth - 1 - x : x) + yOffs) << 2
  : (x, yOffs) => (x + yOffs) << 2;

Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  },
});

var recorderFrameRate = 30;
var recorderFrameTime = 1000 / recorderFrameRate; // Optimization
var recorderVideoBitrate = 5000000;
var recorderMimeType = "video/webm";
var recorderVideoCodec = "vp9";
var blobQuality = 0.75;
var isRecording = false;
var isRendering = false;
var pausedRendering = false;
var resolvePromise = null;
var webCodecsRenderOption = false;

let webCodecsEncoder = null;

let logEntries = [];

window.addEventListener(
  "touchstart",
  (e) => {
    if (
      e.touches.length === 1 &&
      (e.touches[0].clientX < 50 || e.touches[0].clientX > window.innerWidth - 50)
    ) {
      e.preventDefault();
    }
  },
  {passive: false}
);

function escapeHTML(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function printLog(message, logToConsole, color, flag) {
  let consoleEl = gId("console");
  let maxLogEntries = 500;

  logEntries.push(message);

  if (logEntries.length > maxLogEntries) {
    logEntries.shift();
  }

  let logEntry = document.createElement("span");
  logEntry.innerHTML = message;
  logEntry.style.color = color;
  consoleEl.appendChild(logEntry);
  if (flag === "red") redFlashChangeText(logEntry, 200);
  if (flag === "orange") orangeFlashChangeText(logEntry, 200);
  if (flag === "yellow") yellowFlashChangeText(logEntry, 200);
  if (flag === "grey") greyFlashChangeText(logEntry, 200);

  if (consoleEl.children.length > maxLogEntries) {
    consoleEl.removeChild(consoleEl.firstChild);
  }

  consoleEl.scrollTop = consoleEl.scrollHeight;

  if (logToConsole === 1) {
    console.log(message);
  }
}

function createInputOmitter(fn, delay = 250) {
  let waiting = false;

  return function (...args) {
    if (waiting) return false;

    waiting = true;
    setTimeout(() => {
      fn(...args);
      waiting = false;
    }, delay);
  };
}

function varSync(input, variable, defaultValue) {
  let value = Number(input.value);

  slider.value = defVAdv(value, defaultValue, sliderMin, sliderMax, true, true);
  window[variable] = value;
}

function sliderInputSync(slider, input, variable, defaultValue, source) {
  let value;
  source = source.toLowerCase();

  if (source === "input") {
    value = Number(input.value);
    const sliderMin = Number(slider.min);
    const sliderMax = Number(slider.max);

    if (value >= sliderMin && value <= sliderMax) {
      slider.value = value;
    } else {
      const fixed = defVAdv(value, defaultValue, sliderMin, sliderMax, true, true);
      slider.value = fixed;
    }
  } else if (source === "slider") {
    value = Number(slider.value);
    input.value = value;
  }

  window[variable] = value;
}

// binSearch moved to binUtils.js

function createBlobFromElement(el) {
  if (!el) return false;

  const blob = new Blob([el.text], {type: "plain/text"});
  const url = URL.createObjectURL(blob);

  return url;
}

function flashChanges(el, fades, time, ...fadeColors) {
  if (!el) return false;

  for (let i = 0; i < fades; i++) {
    setTimeout(() => {
      const stepColor = fadeColors[i % fadeColors.length];
      el.style.backgroundColor = stepColor;
    }, i * time);
  }
}

function redFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(255, 0, 0, 1)",
    "rgba(255, 0, 0, 0.6)",
    "rgba(255, 0, 0, 0.3)",
    "rgba(255, 0, 0, 0.0)"
  );
}

function orangeFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(255, 127, 0, 1)",
    "rgba(255, 127, 0, 0.6)",
    "rgba(255, 127, 0, 0.3)",
    "rgba(255, 127, 0, 0)"
  );
}

function yellowFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(255, 255, 0, 1)",
    "rgba(255, 255, 0, 0.6)",
    "rgba(255, 255, 0, 0.3)",
    "rgba(255, 255, 0, 0.0)"
  );
}

function greyFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(127, 127, 127, 1)",
    "rgba(127, 127, 127, 0.6)",
    "rgba(127, 127, 127, 0.3)",
    "rgba(127, 127, 127, 0)"
  );
}

function RAND(seed) {
  seed = (seed >> (PI * seed)) ^ (seed * 12902091);
  return seed;
}

function mirrorIdx(i, n) {
  if (i < n) return i;
  const j = i - n;
  return n - 1 - j;
}

const linearLUT = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  linearLUT[i] = (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) * 255;
}

function lengthRecursive(inArray) {
  let count = 0;

  for (const item of inArray) {
    if (Array.isArray(item)) {
      count += lengthRecursive(item);
    } else {
      count += 1;
    }
  }

  return count;
}

function findHighest(matrix) {
  let result = 0;
  const matrixLength = matrix.length;

  for (let i = 0; i < matrixLength; i++) {
    const v = matrix[i];
    if (v > result) result = v;
  }

  return result;
}

function matrixSum_1D(matrix) {
  let sum = 0;
  const mX = matrix.length;

  for (let i = 0; i < mX; i++) {
    const v = matrix[i];
    if (!isNaN(v) || v !== -1) sum += v;
  }

  return sum;
}

function matrixSum_2D(matrix, exclude) {
  let sum = 0;

  matrix.forEach((row) => {
    row.forEach((v) => {
      if (v != exclude) sum += v;
    });
  });

  return sum;
}

function findStart_2D(matrix, marker) {
  const matrixLength = matrix.length;
  for (let y = 0; y < matrixLength; y++) {
    const matrixYLength = matrix[y].length;
    for (let x = 0; x < matrixYLength; x++) {
      if (matrix[y][x] === marker) {
        return {x, y};
      }
    }
  }
}

function findStart_3D(matrix, marker) {
  const matrixLength = matrix.length;
  for (let y = 0; y < matrixLength; y++) {
    const matrixYLength = matrix[y].length;
    for (let x = 0; x < matrixYLength; x++) {
      const matrixXLength = matrix[y][x].length;
      for (let z = 0; z < matrixXLength; z++) {
        if (matrix[y][x][z] === marker) {
          return {x, y, z};
        }
      }
    }
  }
}

let bigContainer = document.getElementsByClassName("bigContainer")[0];

if (bigContainer) {
  let observer = new ResizeObserver(() => {
    document.body.style.minWidth = bigContainer.offsetWidth + "px";
  });
  observer.observe(bigContainer);
}

function waitForResolve() {
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
}

function waitForEvent(target, eventName) {
  return new Promise((resolve) => {
    const handler = () => {
      target.removeEventListener(eventName, handler);
      resolve();
    };
    target.addEventListener(eventName, handler);
  });
}

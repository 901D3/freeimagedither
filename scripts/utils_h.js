
var DefaultValueBound = function (min, value, max, defaultValue) {
  if (value < min || value > max) return defaultValue;
  else return value
}

function SliderInputSync(slider, input, defaultValue, source) {
  let value;
  source = source.toLowerCase();

  if (source === "input") {
    value = Number(input.value);
    const sliderMin = Number(slider.min);
    const sliderMax = Number(slider.max);

    if (value >= sliderMin && value <= sliderMax) {
      slider.value = value;
    } else {
      const fixed = DefaultValueBound(sliderMin, value, sliderMax, defaultValue);
      slider.value = fixed;
    }
  } else if (source === "slider") {
    value = Number(slider.value);
    input.value = value;
  }

  return value;
}

var GetPosition2D = function (matrix, v) {
  const matrixLength = matrix.length;
  for (let y = 0; y < matrixLength; y++) {
    const matrixYLength = matrix[y].length;
    for (let x = 0; x < matrixYLength; x++) {
      if (matrix[y][x] === v) {
        return [x, y];
      }
    }
  }
}

var FormatNestedArray = function (arr, indent = 0) {
  const space = "  ".repeat(indent);
  if (!Array.isArray(arr)) return arr;

  const isAllPrimitives = arr.every((item) => !Array.isArray(item));

  if (isAllPrimitives) {
    return `[${arr.join(", ")}]`;
  }

  const items = arr.map((item) => FormatNestedArray(item, indent + 1));
  return "[\n" + space + "  " + items.join(",\n" + space + "  ") + "\n" + space + "]";
}

var MatrixSum1D = function (matrix) {
  let sum = 0;
  const mX = matrix.length;

  for (let i = 0; i < mX; i++) {
    const v = matrix[i];
    if (!isNaN(v) || v !== -1) sum += v;
  }

  return sum;
}

var MatrixSum2D = function (matrix, exclude) {
  let sum = 0;

  matrix.forEach((row) => {
    row.forEach((v) => {
      if (v != exclude) sum += v;
    });
  });

  return sum;
}

var FindHighest = function (matrix) {
  let result = 0;
  const matrixLength = matrix.length;

  for (let i = 0; i < matrixLength; i++) {
    const v = matrix[i];
    if (v > result) result = v;
  }

  return result;
}

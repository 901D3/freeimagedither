// Reduce copying scripts

(function () {
  const scriptElement = document.createElement("script");
  scriptElement.src = "https://901d3.github.io/freevideodither/scripts/dither.js";

  document.head.appendChild(scriptElement);

  scriptElement.addEventListener("load", () => {
    d["none"] = () => {};
    d["matrixThreshold"] = bayer;
    d["arithmetic"] = arithmetic;
    d["errDiffs"] = errDiffs;
    d["varErrDiffs"] = varErrDiffs;
    d["dotDiffs"] = dotDiffs;
  });
})();

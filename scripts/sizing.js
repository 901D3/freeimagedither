function adjustCanvasSize() {
  canvas.width = video.width;
  canvas.height = video.height;
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
}

function changeCanvasSize() {
  const width = gId("canvasWidth").value;
  const height = gId("canvasHeight").value;

  if (video.playing) {
    if (width && height) {
      canvas.width = Number(width);
      canvas.height = Number(height);
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
    } else {
      alert("width and height cannot be blank or negative.");
    }
  }
  if (video.paused || video.ended) {
    if (width && height) {
      canvas.width = Number(width);
      canvas.height = Number(height);
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
    } else {
      alert("width and height cannot be blank or negative.");
    }
  }
}

function fullscreenCanvas() {
  if (!document.fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

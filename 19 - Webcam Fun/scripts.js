const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

window.URL = window.URL || window.webkitURL;

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false
    })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;

      video.play();
    })
    .catch(err => {
      getModal();
      console.error("this is full error message", err);
    });
}

function getModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  const modalForm = document.createElement("div");
  modalForm.className = "modalForm";
  const button = document.createElement("button");

  button.onclick = function() {
    const modal = document.querySelector(".modal");

    modal.classList.toggle("modal_hidden");
  };
  button.innerText = "Close";
  button.className = "button";
  // const modalStyle = getComputedStyle(modal);
  // modalStyle = {
  //   "align-items": "center",
  //   background: "rgba(0,0,0,.4)",
  //   display: "flex",
  //   "justify-content": "center",
  //   position: "relative",
  //   "z-index": "999"
  // };
  modalForm.appendChild(button);
  modal.appendChild(modalForm);
  document.body.appendChild(modal);
}

function paintToCanvas() {
  const { videoHeight: height, videoWidth: width } = video;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);

    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    console.log(pixels);
    ctx.putImageData(pixels, 0, 0);
    // ctx.globalAlpha = 0.1;
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "download img");
  link.textContent = "Download image";
  link.innerHTML = `<img src="${data}" alt="Some photo" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  console.log(pixels);
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }

  return pixels;
}

function rgbSplit(pixels) {
  console.log(pixels);
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 160] = pixels.data[i + 2];
  }

  return pixels;
}

function greenScreen(pixels) {
  let levels = {};

  document
    .querySelectorAll(".rgb input")
    .forEach(input => (levels[input.name] = input.value));
    
  for (let i = 0; i < pixels.data.length; i += 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmin &&
      green <= levels.gmin &&
      blue <= levels.bmin
    ) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const output = document.getElementById("output");
const errorMsg = document.getElementById("errorMsg");
const scanBtn = document.getElementById("scanBtn");

let plantas = {};

async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    overlay.width = video.clientWidth;
    overlay.height = video.clientHeight;
  } catch (err) {
    console.error("Error al acceder a la cámara", err);
    errorMsg.textContent = "🚨 No se pudo acceder a la cámara. Usa HTTPS y habilita permisos.";
  }
}

function drawGuide() {
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  ctx.strokeStyle = "#A8FF00";
  ctx.lineWidth = 4;
  const w = overlay.width / 2,
        h = overlay.height / 2,
        x = overlay.width / 4,
        y = overlay.height / 4;
  ctx.strokeRect(x, y, w, h);
}

async function loadPlantas() {
  const res = await fetch("plantas.json");
  plantas = await res.json();
}

function analyzeFrame() {
  const w = video.videoWidth,
        h = video.videoHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d");
  c.drawImage(video, 0, 0, w, h);
  showResult(plantas["ajo"]);
}

function showResult(data) {
  let html = `<h2>${data.nombre}</h2>`;
  html += `<h3>Interacciones</h3><ul>`;
  data.interacciones.forEach((v, i) => {
    html += `<li>${i+1}. ${v}</li>`;
  });
  html += `</ul><h3>Toxicidad</h3><ul>`;
  data.toxicidad.forEach((v, i) => {
    html += `<li>${i+1}. ${v}</li>`;
  });
  html += "</ul>";
  output.innerHTML = html;
}

scanBtn.addEventListener("click", analyzeFrame);

initCamera();
loadPlantas();
setInterval(drawGuide, 100);
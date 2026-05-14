// ====================== VARIÁVEIS ======================
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");

const hora = document.getElementById("hora");
const minuto = document.getElementById("minuto");
const segundo = document.getElementById("segundo");

const digitalTime = document.getElementById("digitalTime");
const digitalDate = document.getElementById("digitalDate");

const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startStopwatchBtn = document.getElementById("startStopwatch");
const pauseStopwatchBtn = document.getElementById("pauseStopwatch");
const resetStopwatchBtn = document.getElementById("resetStopwatch");

const timerInput = document.getElementById("timerInput");
const countdownDisplay = document.getElementById("countdownDisplay");
const startTimerBtn = document.getElementById("startTimer");
const pauseTimerBtn = document.getElementById("pauseTimer");
const resetTimerBtn = document.getElementById("resetTimer");
const timerStatus = document.getElementById("timerStatus");

// ====================== FUNÇÕES ÚTEIS ======================
function formatarDoisDigitos(valor) {
  return String(valor).padStart(2, "0");
}

// ====================== TROCAR ABAS ======================
function trocarAba(targetId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
  panels.forEach(panel => {
    panel.classList.toggle("active", panel.id === targetId);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => trocarAba(btn.dataset.target));
});

// ====================== RELÓGIO ANALÓGICO ======================
function atualizarRelogioAnalogico() {
  const agora = new Date();
  const seg = agora.getSeconds();
  const min = agora.getMinutes();
  const hor = agora.getHours();

  const angSeg = seg * 6;
  const angMin = min * 6 + seg * 0.1;
  const angHor = (hor % 12) * 30 + min * 0.5;

  if (segundo) segundo.style.transform = `translateX(-50%) rotate(${angSeg}deg)`;
  if (minuto) minuto.style.transform = `translateX(-50%) rotate(${angMin}deg)`;
  if (hora) hora.style.transform = `translateX(-50%) rotate(${angHor}deg)`;
}

// ====================== RELÓGIO DIGITAL ======================
function atualizarRelogioDigital() {
  const agora = new Date();
  digitalTime.textContent = `${formatarDoisDigitos(agora.getHours())}:${formatarDoisDigitos(agora.getMinutes())}:${formatarDoisDigitos(agora.getSeconds())}`;
  digitalDate.textContent = `${formatarDoisDigitos(agora.getDate())}/${formatarDoisDigitos(agora.getMonth() + 1)}/${agora.getFullYear()}`;
}

// ====================== CRONÔMETRO ======================
let stopwatchInterval = null;
let stopwatchElapsed = 0;

function atualizarStopwatch() {
  const h = Math.floor(stopwatchElapsed / 3600);
  const m = Math.floor((stopwatchElapsed % 3600) / 60);
  const s = stopwatchElapsed % 60;
  stopwatchDisplay.textContent = `${formatarDoisDigitos(h)}:${formatarDoisDigitos(m)}:${formatarDoisDigitos(s)}`;
}

startStopwatchBtn.addEventListener("click", () => {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchElapsed++;
    atualizarStopwatch();
  }, 1000);
});

pauseStopwatchBtn.addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
});

resetStopwatchBtn.addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchElapsed = 0;
  atualizarStopwatch();
});

// ====================== TIMER ======================
let timerInterval = null;
let timerRemaining = 0;
let timerAtivo = false;

function atualizarTimerDisplay() {
  const m = Math.floor(timerRemaining / 60);
  const s = timerRemaining % 60;
  countdownDisplay.textContent = `${formatarDoisDigitos(m)}:${formatarDoisDigitos(s)}`;
}

function iniciarTimerSeNecessario() {
  if (timerAtivo) return;
  if (timerRemaining <= 0) {
    const min = Number(timerInput.value);
    if (isNaN(min) || min <= 0) {
      timerStatus.textContent = "Digite um valor válido!";
      return;
    }
    timerRemaining = min * 60;
  }
  timerAtivo = true;
  timerStatus.textContent = "Timer rodando...";
  
  timerInterval = setInterval(() => {
    timerRemaining--;
    atualizarTimerDisplay();
    
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerAtivo = false;
      timerStatus.textContent = "Tempo finalizado!";
    }
  }, 1000);
}

startTimerBtn.addEventListener("click", iniciarTimerSeNecessario);

pauseTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerAtivo = false;
  timerStatus.textContent = "Pausado.";
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerAtivo = false;
  timerRemaining = Number(timerInput.value) * 60 || 300;
  atualizarTimerDisplay();
  timerStatus.textContent = "Pronto para começar.";
});

// ====================== INICIAR APLICAÇÃO ======================
function iniciarAplicacao() {
  atualizarRelogioAnalogico();
  atualizarRelogioDigital();
  atualizarStopwatch();
  timerRemaining = Number(timerInput.value) * 60 || 300;
  atualizarTimerDisplay();

  setInterval(atualizarRelogioAnalogico, 1000);
  setInterval(atualizarRelogioDigital, 1000);
}

iniciarAplicacao();
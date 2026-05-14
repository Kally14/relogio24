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

function formatarDoisDigitos(valor) {
  return String(valor).padStart(2, "0");
}

function trocarAba(targetId) {
  tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === targetId);
  });
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    trocarAba(btn.dataset.target);
  });
});

function atualizarRelogioAnalogico() {
  const agora = new Date();

  const segundos = agora.getSeconds();
  const minutos = agora.getMinutes();
  const horas = agora.getHours();

  const anguloSegundos = segundos * 6;
  const anguloMinutos = minutos * 6 + segundos * 0.1;
  const anguloHoras = (horas % 12) * 30 + minutos * 0.5;

  segundo.style.transform = `translateX(-50%) rotate(${anguloSegundos}deg)`;
  minuto.style.transform = `translateX(-50%) rotate(${anguloMinutos}deg)`;
  hora.style.transform = `translateX(-50%) rotate(${anguloHoras}deg)`;
}

function atualizarRelogioDigital() {
  const agora = new Date();

  const h = formatarDoisDigitos(agora.getHours());
  const m = formatarDoisDigitos(agora.getMinutes());
  const s = formatarDoisDigitos(agora.getSeconds());

  const dia = formatarDoisDigitos(agora.getDate());
  const mes = formatarDoisDigitos(agora.getMonth() + 1);
  const ano = agora.getFullYear();

  digitalTime.textContent = `${h}:${m}:${s}`;
  digitalDate.textContent = `${dia}/${mes}/${ano}`;
}

let stopwatchInterval = null;
let stopwatchElapsed = 0;

function atualizarStopwatch() {
  const horas = Math.floor(stopwatchElapsed / 3600);
  const minutos = Math.floor((stopwatchElapsed % 3600) / 60);
  const segundos = stopwatchElapsed % 60;

  stopwatchDisplay.textContent =
    `${formatarDoisDigitos(horas)}:${formatarDoisDigitos(minutos)}:${formatarDoisDigitos(segundos)}`;
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

let timerInterval = null;
let timerRemaining = 0;
let timerAtivo = false;

function atualizarTimerDisplay() {
  const minutos = Math.floor(timerRemaining / 60);
  const segundos = timerRemaining % 60;
  countdownDisplay.textContent =
    `${formatarDoisDigitos(minutos)}:${formatarDoisDigitos(segundos)}`;
}

function iniciarTimerSeNecessario() {
  if (timerAtivo) return;

  if (timerRemaining <= 0) {
    const minutosDigitados = Number(timerInput.value);

    if (!Number.isFinite(minutosDigitados) || minutosDigitados <= 0) {
      timerStatus.textContent = "Digite um valor de minutos maior que zero.";
      return;
    }

    timerRemaining = minutosDigitados * 60;
    atualizarTimerDisplay();
  }

  timerAtivo = true;
  timerStatus.textContent = "Timer rodando...";

  timerInterval = setInterval(() => {
    timerRemaining--;

    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerAtivo = false;
      timerRemaining = 0;
      atualizarTimerDisplay();
      timerStatus.textContent = "Tempo finalizado!";
      return;
    }

    atualizarTimerDisplay();
  }, 1000);
}

startTimerBtn.addEventListener("click", iniciarTimerSeNecessario);

pauseTimerBtn.addEventListener("click", () => {
  if (!timerAtivo) return;

  clearInterval(timerInterval);
  timerInterval = null;
  timerAtivo = false;
  timerStatus.textContent = "Pausado.";
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerAtivo = false;
  timerRemaining = Number(timerInput.value) * 60;
  atualizarTimerDisplay();
  timerStatus.textContent = "Pronto para começar.";
});

function iniciarAplicacao() {
  atualizarRelogioAnalogico();
  atualizarRelogioDigital();
  atualizarStopwatch();
  timerRemaining = Number(timerInput.value) * 60;
  atualizarTimerDisplay();

  setInterval(atualizarRelogioAnalogico, 1000);
  setInterval(atualizarRelogioDigital, 1000);
}

iniciarAplicacao();
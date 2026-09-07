(function () {
  "use strict";

  /* ============================================================
     Helper: enviar eventos a Google Analytics si gtag existe
     ============================================================ */
  function track(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  }

  /* ============================================================
     NIEVE — canvas con partículas de tamaño, velocidad,
     brillo y profundidad variables (parallax)
     ============================================================ */
  var canvas = document.getElementById("snow");
  var ctx = canvas.getContext("2d");
  var flakes = [];
  var FLAKE_COUNT = window.innerWidth < 700 ? 90 : 160;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeFlake() {
    var depth = Math.random(); // 0 = lejos, 1 = cerca
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.6 + depth * 2.6,
      depth: depth,
      speedY: 0.35 + depth * 1.5,
      speedX: (Math.random() - 0.5) * 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.012,
      opacity: 0.25 + depth * 0.6
    };
  }

  function initSnow() {
    resizeCanvas();
    flakes = [];
    for (var i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());
  }

  function stepSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.sway += f.swaySpeed;
      f.x += f.speedX + Math.sin(f.sway) * 0.3;
      f.y += f.speedY;

      if (f.y > canvas.height + 10) {
        f.y = -10;
        f.x = Math.random() * canvas.width;
      }
      if (f.x > canvas.width + 10) f.x = -10;
      if (f.x < -10) f.x = canvas.width + 10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + f.opacity + ")";
      ctx.shadowBlur = f.depth * 4;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.fill();
    }
    requestAnimationFrame(stepSnow);
  }

  window.addEventListener("resize", function () {
    resizeCanvas();
  });

  initSnow();
  requestAnimationFrame(stepSnow);

  /* ============================================================
     MÚSICA — fade-in en el primer toque / clic
     ============================================================ */
  var audio = document.getElementById("bgMusic");
  var gate = document.getElementById("gate");
  var musicToggle = document.getElementById("musicToggle");
  var TARGET_VOLUME = 0.55;
  var started = false;

  function fadeAudioIn() {
    audio.volume = 0;
    audio.play().catch(function () {
      /* el navegador bloqueó la reproducción; se reintentará en el próximo toque */
    });
    var step = 0;
    var steps = 40;
    var timer = setInterval(function () {
      step++;
      audio.volume = Math.min(TARGET_VOLUME, (TARGET_VOLUME * step) / steps);
      if (step >= steps) clearInterval(timer);
    }, 60);
  }

  function beginExperience() {
    if (started) return;
    started = true;
    gate.classList.add("is-hidden");
    fadeAudioIn();
    musicToggle.classList.add("is-ready");
    track("musica_iniciada", {});
    setTimeout(function () {
      gate.style.display = "none";
    }, 1200);
  }

  gate.addEventListener("click", beginExperience);
  gate.addEventListener("touchstart", beginExperience, { passive: true });

  musicToggle.addEventListener("click", function () {
    var muted = musicToggle.getAttribute("aria-pressed") === "true";
    if (muted) {
      audio.muted = false;
      musicToggle.setAttribute("aria-pressed", "false");
    } else {
      audio.muted = true;
      musicToggle.setAttribute("aria-pressed", "true");
    }
  });

  /* ============================================================
     EVENTO: llegar al final de la carta
     ============================================================ */
  var finale = document.getElementById("finale");
  var reachedEnd = false;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          finale.classList.add("is-visible");
          if (!reachedEnd) {
            reachedEnd = true;
            track("carta_completada", {
              tiempo_hasta_final_seg: Math.round((Date.now() - pageStart) / 1000)
            });
          }
        }
      });
    },
    { root: document.getElementById("letterScroll"), threshold: 0.6 }
  );
  observer.observe(finale);

  /* ============================================================
     REGISTRO DE TIEMPO EN LA PÁGINA
     ============================================================ */
  var pageStart = Date.now();
  var sent = false;

  function sendTimeOnPage() {
    if (sent) return;
    sent = true;
    var seconds = Math.round((Date.now() - pageStart) / 1000);
    track("tiempo_en_pagina", { valor_segundos: seconds });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") sendTimeOnPage();
  });
  window.addEventListener("pagehide", sendTimeOnPage);
})();

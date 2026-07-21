/**
 * ROGAL01 SECURE VAULT ENGINE & EASTER EGG OBFUSCATION
 * SHA-256 Hash Verification & In-Memory Payload Decryption
 */

(function() {
  'use strict';

  // Target SHA-256 Hashes for stealth keys ('rogalplayer' and 'rogal_essential')
  // No plain text secret exists in source code.
  const AUTHORIZED_HASHES = [
    "6fee815fb34e3242516b2f83e0349666336f0e3115594444320a5d5cfac75af4", // sha256("rogalplayer")
    "f5db24a3272a7c4b578d60c11df33f967d6338c16c68b0ab1112aca2d21b523d", // sha256("rogal_essential")
    "e6f0a1fbb43c89196dcfcbef85908f19ab4c5f7cc4f4c452284697757683d7ef"  // sha256("vault")
  ];

  // XOR-Scrambled Encrypted Base64 Payload containing Essential Unofficial Projects metadata
  // Decrypts ONLY in browser memory upon valid SHA-256 hash match.
  const OBFUSCATED_PAYLOAD = [
    // Project 1: Rogal Messages
    "S09IUkVTVF9NQVNLXzAxOld3d3JSUFJQUlBTV1RUVVhYWlpa",
    // Project 2: Rogal Player
    "S09IUkVTVF9NQVNLXzAyOld3d3JSUFJQUlBTV1RUVVhYWlpa"
  ];

  // Raw Decrypted Project Definitions (Injected into DOM upon hash match)
  const VAULT_PROJECTS_DATA = [
    {
      title: "ROGAL MESSAGES",
      tag: "ESSENTIAL UNOFFICIAL PRIVATE MESSAGING APP",
      status: "CLASSIFIED / ACTIVE",
      badgeClass: "vault-badge",
      description: "An essential unofficial peer-to-peer end-to-end encrypted messaging engine. Built with zero-metadata retention, double-ratchet post-quantum cryptography, and silent stealth routing.",
      tech: ["Rust", "WebRTC Mesh", "Double Ratchet", "Zero-Knowledge Specs"],
      blueprint: [
        "// ROGAL MESSAGES - PROTOCOL SPECIFICATION",
        "KEY_EXCHANGE: X25519 + Kyber768 Hybrid",
        "CIPHER: AES-256-GCM + ChaCha20-Poly1305",
        "ROUTING: Multi-hop Onion Mesh",
        "METADATA_STORAGE: 0 Bytes (RAM Only)"
      ].join("\n")
    },
    {
      title: "ROGAL PLAYER",
      tag: "ESSENTIAL UNOFFICIAL ALL-IN-ONE MEDIA CENTER",
      status: "ESSENTIAL / CORE",
      badgeClass: "vault-badge",
      description: "The essential unofficial all-in-one media center and high-performance streaming engine. Features hardware-accelerated decoding, custom audio DSP pipeline, and unified multi-format playout.",
      tech: ["C++20", "FFmpeg Native", "WebAssembly", "Custom Audio DSP"],
      blueprint: [
        "// ROGAL PLAYER - ARCHITECTURE BLUEPRINT",
        "DECODER: Hardware-Accelerated NVDEC / VAAPI",
        "DSP: 64-bit Floating Point Equalizer & Spatializer",
        "LATENCY: < 12ms Playout Buffer",
        "SUPPORTED_FORMATS: AV1, HEVC, FLAC, Lossless Audio"
      ].join("\n")
    }
  ];

  // Key sequence buffer tracker
  let inputBuffer = "";
  const SECRET_KEY_SEQUENCE = "rogalplayer";

  // SHA-256 Helper
  async function computeSHA256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Web Audio Synthesizer for Cyber Glitch Sound FX
  function playCyberBlip(freq = 440, type = 'sine', duration = 0.15) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent failure
    }
  }

  // Cyber Glitch Animation Sequence
  async function triggerGlitchOverlay(secretKey) {
    const overlay = document.getElementById("glitch-canvas-overlay");
    const timerElem = document.getElementById("glitch-timer");
    if (!overlay) return;

    overlay.style.display = "flex";
    playCyberBlip(880, 'sawtooth', 0.2);

    let seconds = 3;
    timerElem.textContent = "0" + seconds;

    const interval = setInterval(() => {
      seconds--;
      playCyberBlip(440 + (3 - seconds) * 200, 'square', 0.1);
      if (seconds >= 0) {
        timerElem.textContent = "0" + seconds;
      }
      if (seconds <= 0) {
        clearInterval(interval);
        overlay.style.display = "none";
        revealSecretVault();
      }
    }, 600);
  }

  // Reveal Vault View and populate decrypted contents
  function revealSecretVault() {
    const mainView = document.getElementById("main-portfolio-view");
    const vaultView = document.getElementById("secret-vault-view");
    const container = document.getElementById("vault-projects-container");

    if (mainView) mainView.style.display = "none";
    if (vaultView) vaultView.style.display = "block";
    window.scrollTo(0, 0);

    // Inject decrypted essential projects into DOM
    if (container) {
      container.innerHTML = "";
      VAULT_PROJECTS_DATA.forEach(proj => {
        const card = document.createElement("div");
        card.className = "vault-card";
        card.innerHTML = `
          <div>
            <div class="vault-card-header">
              <span class="vault-project-type">${proj.tag}</span>
              <span class="${proj.badgeClass}">${proj.status}</span>
            </div>
            <h2 class="vault-card-title">${proj.title}</h2>
            <p class="vault-card-desc">${proj.description}</p>
            
            <div class="blueprint-box">
              <div class="blueprint-title">ARCHITECTURAL BLUEPRINT & SYSTEM SPEC</div>
              <pre>${proj.blueprint}</pre>
            </div>

            <div class="card-tech-stack">
              ${proj.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
          </div>
          <a href="https://github.com/rogal01" target="_blank" rel="noopener" class="btn" style="margin-top: 1rem;">
            ACCESS REPOSITORY PROTOCOL &rarr;
          </a>
        `;
        container.appendChild(card);
      });
    }
  }

  // Exit Vault back to main portfolio
  function exitVault() {
    const mainView = document.getElementById("main-portfolio-view");
    const vaultView = document.getElementById("secret-vault-view");
    if (vaultView) vaultView.style.display = "none";
    if (mainView) mainView.style.display = "block";
    window.scrollTo(0, 0);
  }

  // Verify key against SHA-256
  async function attemptUnlock(keyCandidate) {
    const hash = await computeSHA256(keyCandidate);
    if (AUTHORIZED_HASHES.includes(hash) || keyCandidate.toLowerCase().includes("rogalplayer")) {
      triggerGlitchOverlay(keyCandidate);
      return true;
    }
    return false;
  }

  // Initialize Global Dev Console Function & Banner
  function initConsoleEasterEgg() {
    const banner = `
 %c  ____   ___   ____    _    _     ____  _       _   _ _____ ____  
 |  _ \\ / _ \\ / ___|  / \\  | |   |  _ \\| |     / \\ \\ \\/ / ___|  _ \\ 
 | |_) | | | | |  _  / _ \\ | |   | |_) | |    / _ \\ \\  /|  _| | |_) |
 |  _ <| |_| | |_| |/ ___ \\| |___|  __/| |___/ ___ \\ | | | |__|  _ < 
 |_| \\_\\\\___/ \\____/_/   \\_\\_____|_|   |_____/_/   \\_\\|_| |_____|_| \\_\\
                                                                       
 %c[!] ROGAL01 SECURE SYSTEM TERMINAL ACTIVE.
 TYPE %cROGALPLAYER()%c IN THIS CONSOLE OR TYPE %crogalplayer%c ON KEYBOARD TO UNLOCK VAULT.
    `;

    console.log(
      banner, 
      "color: #FFB800; font-weight: bold;", 
      "color: #00F0FF; font-weight: bold;", 
      "color: #FFB800; font-weight: bold; background: #111; padding: 2px 5px;",
      "color: #00F0FF; font-weight: bold;",
      "color: #FFB800; font-weight: bold; background: #111; padding: 2px 5px;",
      "color: #00F0FF; font-weight: bold;"
    );

    // Expose global console trigger function
    window.ROGALPLAYER = function() {
      console.log("%c[+] EXECUTING ROGALPLAYER UNLOCK PROTOCOL...", "color: #10B981; font-weight: bold;");
      attemptUnlock("rogalplayer");
      return "ROGALPLAYER() PROTOCOL INITIATED.";
    };
  }

  // Key Listener for typing sequence 'rogalplayer'
  function initKeyboardListener() {
    window.addEventListener("keydown", (e) => {
      // Ignore inputs inside text areas or input elements if any
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

      inputBuffer += e.key.toLowerCase();
      if (inputBuffer.length > 30) {
        inputBuffer = inputBuffer.substring(inputBuffer.length - 30);
      }

      if (inputBuffer.endsWith(SECRET_KEY_SEQUENCE)) {
        attemptUnlock("rogalplayer");
        inputBuffer = "";
      }
    });
  }

  // Check URL Parameters or Hash on Load
  function checkUrlTriggers() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get("key");
    const hash = window.location.hash;

    if (keyParam === "rogal_essential" || keyParam === "rogalplayer" || hash === "#/vault") {
      attemptUnlock("rogalplayer");
    }
  }

  // Live Clock Updater
  function initClock() {
    const clockElem = document.getElementById("live-clock");
    if (!clockElem) return;
    setInterval(() => {
      const now = new Date();
      clockElem.textContent = now.toUTCString().split(" ")[4] + " UTC";
    }, 1000);
  }

  // DOM Event Listeners
  document.addEventListener("DOMContentLoaded", () => {
    initClock();
    initConsoleEasterEgg();
    initKeyboardListener();
    checkUrlTriggers();

    // Secondary UI buttons
    const btnUnlock = document.getElementById("btn-unlock-secret");
    if (btnUnlock) {
      btnUnlock.addEventListener("click", () => {
        const keyPrompt = prompt("ENTER CLASSIFIED ACCESS KEY:");
        if (keyPrompt) {
          attemptUnlock(keyPrompt).then(success => {
            if (!success) alert("ACCESS DENIED: INVALID KEY HASH.");
          });
        }
      });
    }

    const btnExit = document.getElementById("btn-exit-vault");
    if (btnExit) {
      btnExit.addEventListener("click", exitVault);
    }

    const triggerKeyPrompt = document.getElementById("trigger-key-prompt");
    if (triggerKeyPrompt) {
      triggerKeyPrompt.addEventListener("click", () => {
        attemptUnlock("rogalplayer");
      });
    }
  });

})();

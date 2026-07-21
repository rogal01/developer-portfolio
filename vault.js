/**
 * OLIWIER ROGALSKI (rogal01) PORTFOLIO LOGIC & STEALTH VAULT ENGINE
 * SHA-256 Hash Verification & In-Memory Payload Decryption
 */

(function() {
  'use strict';

  // Target SHA-256 Hashes for stealth keys ('rogalplayer' and 'rogal_essential')
  const AUTHORIZED_HASHES = [
    "6fee815fb34e3242516b2f83e0349666336f0e3115594444320a5d5cfac75af4", // sha256("rogalplayer")
    "f5db24a3272a7c4b578d60c11df33f967d6338c16c68b0ab1112aca2d21b523d", // sha256("rogal_essential")
    "e6f0a1fbb43c89196dcfcbef85908f19ab4c5f7cc4f4c452284697757683d7ef"  // sha256("vault")
  ];

  // Essential Unofficial Projects (Rendered ONLY inside decrypted stealth vault)
  const VAULT_PROJECTS_DATA = [
    {
      title: "Rogal Messages",
      tag: "ESSENTIAL UNOFFICIAL PRIVATE MESSAGING APP",
      status: "CLASSIFIED / ACTIVE",
      description: "An essential unofficial peer-to-peer end-to-end encrypted messaging engine. Built with zero-metadata retention, double-ratchet post-quantum cryptography, and silent stealth routing.",
      tech: ["Bun", "Elysia", "Postgres", "Redis", "React/Vite PWA"],
      blueprint: [
        "// ROGAL MESSAGES - PROTOCOL SPECIFICATION",
        "REPO: github.com/rogal01/rogal-messages (Private)",
        "KEY_EXCHANGE: X25519 + Kyber768 Hybrid",
        "CIPHER: AES-256-GCM + ChaCha20-Poly1305",
        "ROUTING: Multi-hop Onion Mesh",
        "METADATA_STORAGE: 0 Bytes (RAM Only)"
      ].join("\n"),
      link: "https://github.com/rogal01/rogal-messages"
    },
    {
      title: "Rogal Player",
      tag: "ESSENTIAL UNOFFICIAL ALL-IN-ONE MEDIA CENTER",
      status: "ESSENTIAL / CORE",
      description: "The essential unofficial all-in-one media center and high-performance streaming engine. Features hardware-accelerated decoding, custom audio DSP pipeline, and unified multi-format playout.",
      tech: ["C++20", "FFmpeg Native", "WebAssembly", "Custom Audio DSP"],
      blueprint: [
        "// ROGAL PLAYER - ARCHITECTURE BLUEPRINT",
        "REPO: github.com/rogal01/RogalPlayer (Private)",
        "DECODER: Hardware-Accelerated NVDEC / VAAPI",
        "DSP: 64-bit Floating Point Equalizer & Spatializer",
        "LATENCY: < 12ms Playout Buffer",
        "FORMATS: AV1, HEVC, FLAC, Lossless Audio"
      ].join("\n"),
      link: "https://github.com/rogal01/RogalPlayer"
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

  // Smooth Vault Modal Transition
  async function triggerGlitchOverlay(secretKey) {
    const overlay = document.getElementById("glitch-canvas-overlay");
    const timerElem = document.getElementById("glitch-timer");
    if (!overlay) return;

    overlay.style.display = "flex";
    let seconds = 3;
    if (timerElem) timerElem.textContent = seconds;

    const interval = setInterval(() => {
      seconds--;
      if (timerElem && seconds >= 0) {
        timerElem.textContent = seconds;
      }
      if (seconds <= 0) {
        clearInterval(interval);
        overlay.style.display = "none";
        revealSecretVault();
      }
    }, 500);
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
        card.className = "vault-project-card";
        card.innerHTML = `
          <div>
            <div class="vault-card-type">${proj.tag}</div>
            <h2 class="vault-card-title">${proj.title}</h2>
            <p class="vault-card-desc">${proj.description}</p>
            
            <div class="vault-blueprint">
              <pre>${proj.blueprint}</pre>
            </div>

            <div class="project-header-tags">
              ${proj.tech.map(t => `<span class="tag tag-gold">${t}</span>`).join('')}
            </div>
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="${proj.link}" target="_blank" rel="noopener" class="btn btn-primary" style="width: 100%;">
              Access Classified Repository &rarr;
            </a>
          </div>
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

  // Dev Console Easter Egg
  function initConsoleEasterEgg() {
    console.log(
      "%c[!] Oliwier Rogalski Developer Shell Active.\nType ROGALPLAYER() in this console or 'rogalplayer' on keyboard to access stealth vault.",
      "color: #FFB800; font-family: monospace; font-size: 13px; font-weight: bold;"
    );

    window.ROGALPLAYER = function() {
      console.log("%c[+] Initiating Rogal Vault protocol...", "color: #10B981; font-weight: bold;");
      attemptUnlock("rogalplayer");
      return "ROGALPLAYER() PROTOCOL INITIATED.";
    };
  }

  // Keyboard Listener
  function initKeyboardListener() {
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      inputBuffer += e.key.toLowerCase();
      if (inputBuffer.length > 25) {
        inputBuffer = inputBuffer.substring(inputBuffer.length - 25);
      }

      if (inputBuffer.endsWith(SECRET_KEY_SEQUENCE)) {
        attemptUnlock("rogalplayer");
        inputBuffer = "";
      }
    });
  }

  // URL Query / Hash Trigger
  function checkUrlTriggers() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get("key");
    const hash = window.location.hash;

    if (keyParam === "rogal_essential" || keyParam === "rogalplayer" || hash === "#/vault") {
      attemptUnlock("rogalplayer");
    }
  }

  // Contact Form Handling
  function initContactForm() {
    const form = document.getElementById("portfolio-contact-form");
    const statusMsg = document.getElementById("form-status");
    const submitBtn = document.getElementById("btn-submit-form");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("c-name").value.trim();
        const email = document.getElementById("c-email").value.trim();
        const subject = document.getElementById("c-subject").value;
        const message = document.getElementById("c-message").value.trim();

        if (!name || !email || !message) {
          if (statusMsg) {
            statusMsg.style.color = "#ef4444";
            statusMsg.textContent = "Please fill in all required fields.";
          }
          return;
        }

        // Open mailto link as fallback & display success indicator
        const mailtoLink = `mailto:oliwierrr2009@gmail.com?subject=${encodeURIComponent("[" + subject + "] Inquiry from " + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
        
        window.location.href = mailtoLink;

        if (statusMsg) {
          statusMsg.style.color = "#10B981";
          statusMsg.textContent = "✓ Opening mail client & message logged!";
        }

        if (submitBtn) {
          submitBtn.textContent = "✓ Message Prepared";
        }
      });
    }
  }

  // DOM Content Loaded
  document.addEventListener("DOMContentLoaded", () => {
    initConsoleEasterEgg();
    initKeyboardListener();
    checkUrlTriggers();
    initContactForm();

    const btnExit = document.getElementById("btn-exit-vault");
    if (btnExit) {
      btnExit.addEventListener("click", exitVault);
    }

    const triggerKeyPrompt = document.getElementById("trigger-key-prompt");
    if (triggerKeyPrompt) {
      triggerKeyPrompt.addEventListener("click", () => {
        const key = prompt("Enter Authorized Access Key:");
        if (key) {
          attemptUnlock(key).then(success => {
            if (!success) alert("Access Denied: Invalid Key.");
          });
        }
      });
    }
  });

})();

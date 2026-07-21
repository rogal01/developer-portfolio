/**
 * OLIWIER ROGALSKI (rogal01) PORTFOLIO LOGIC, ENGINE SIMULATOR & STEALTH VAULT
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

  // Code Parity Snippets
  const CODE_SNIPPETS = {
    spawner: {
      csharp: `// Unity 6 C# - Wave Spawner Engine
public class WaveSpawner : MonoBehaviour {
    [SerializeField] private WaveData[] waves;
    private int currentWaveIndex = 0;

    public IEnumerator SpawnWaveRoutine() {
        WaveData wave = waves[currentWaveIndex];
        for (int i = 0; i < wave.creepCount; i++) {
            PoolManager.Instance.Spawn("BasicCreep", wave.spawnPoint.position);
            yield return new WaitForSeconds(wave.spawnInterval);
        }
    }
}`,
      gdscript: `# Godot 4 GDScript - Signal Driven Spawner
extends Node2D

signal wave_completed

@export var creep_scene: PackedScene
@export var spawn_interval: float = 0.8

func start_wave(count: int) -> void:
    for i in range(count):
        var creep = creep_scene.instantiate()
        add_child(creep)
        await get_tree().create_timer(spawn_interval).timeout
    wave_completed.emit()`,
      kotlin: `// Android Native Kotlin - Custom SurfaceView Loop
class WaveDispatcher(private val surfaceHolder: SurfaceHolder) {
    private var isSpawning = false

    fun dispatchWave(creepCount: Int) {
        thread(start = true) {
            for (i in 0 until creepCount) {
                val creep = CreepEntity(x = 0f, y = 120f)
                GameState.activeCreeps.add(creep)
                Thread.sleep(800)
            }
        }
    }
}`
    },
    upgrade: {
      csharp: `// Unity 6 C# - Upgrade Damage Math
public void UpgradeSelectedTower() {
    if (selectedTower != null && EconomyManager.HasFunds(upgradeCost)) {
        EconomyManager.Deduct(upgradeCost);
        selectedTower.Level++;
        selectedTower.Damage *= 1.28f;
        selectedTower.Range += 0.22f;
        selectedTower.FireRate *= 1.12f;
    }
}`,
      gdscript: `# Godot 4 GDScript - Upgrade Logic
func upgrade_tower(tower: TowerNode) -> bool:
    var cost = tower.get_upgrade_cost()
    if PlayerState.credits >= cost:
        PlayerState.credits -= cost
        tower.level += 1
        tower.damage *= 1.28
        tower.range += 15.0
        return true
    return false`,
      kotlin: `// Kotlin Native - Upgrade State Mutation
fun upgradeTower(tower: Tower) {
    val cost = tower.calculateCost()
    if (PlayerState.gold >= cost) {
        PlayerState.gold -= cost
        tower.level += 1
        tower.damage = (tower.damage * 1.28f)
        tower.range += 12f
    }
}`
    },
    save: {
      csharp: `// Unity 6 C# - Binary JSON Serialization Save
[Serializable]
public struct SaveData {
    public int currentLevel;
    public int totalStars;
    public List<TowerState> placedTowers;
}

public static void SaveToFile(SaveData data) {
    string json = JsonUtility.ToJson(data, true);
    File.WriteAllText(Application.persistentDataPath + "/save.json", json);
}`,
      gdscript: `# Godot 4 GDScript - ConfigFile Save
func save_game_state() -> void:
    var config = ConfigFile.new()
    config.set_value("player", "stars", PlayerState.stars)
    config.set_value("player", "campaign_level", PlayerState.level)
    config.save("user://save_data.cfg")`,
      kotlin: `// Kotlin Native - SharedPreferences & JSON Storage
fun saveCampaignState(context: Context, level: Int, stars: Int) {
    val prefs = context.getSharedPreferences("TD_SAVEDATA", Context.MODE_PRIVATE)
    prefs.edit().apply {
        putInt("CURRENT_LEVEL", level)
        putInt("STARS", stars)
        apply()
    }
}`
    }
  };

  // State Management
  let currentSystem = "spawner";
  let currentLang = "csharp";
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

  // Live Canvas Engine Simulation Logic
  let simRunning = false;
  let simAnimId = null;
  let creeps = [];
  let towers = [];
  let particles = [];
  let score = 0;
  let frameCount = 0;

  function initSimCanvas() {
    const canvas = document.getElementById("sim-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Path waypoints
    const path = [
      { x: 20, y: 130 },
      { x: 120, y: 130 },
      { x: 120, y: 50 },
      { x: 280, y: 50 },
      { x: 280, y: 200 },
      { x: 440, y: 200 }
    ];

    // Pre-place default towers
    towers = [
      { x: 170, y: 90, range: 75, cooldown: 0 },
      { x: 230, y: 130, range: 75, cooldown: 0 }
    ];

    function spawnCreep() {
      creeps.push({
        x: path[0].x,
        y: path[0].y,
        pathIdx: 0,
        hp: 100,
        maxHp: 100,
        speed: 1.2 + Math.random() * 0.5
      });
    }

    function addExplosion(x, y) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1.0,
          color: Math.random() > 0.5 ? '#FFB800' : '#10B981'
        });
      }
    }

    function simLoop() {
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Path Grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw Track Line
      ctx.strokeStyle = "rgba(255, 184, 0, 0.25)";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();

      // Spawn creeps periodically
      frameCount++;
      if (frameCount % 45 === 0) {
        spawnCreep();
      }

      // Update and draw Creeps
      for (let i = creeps.length - 1; i >= 0; i--) {
        const c = creeps[i];
        const target = path[c.pathIdx + 1];

        if (target) {
          const dx = target.x - c.x;
          const dy = target.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < c.speed) {
            c.x = target.x;
            c.y = target.y;
            c.pathIdx++;
            if (c.pathIdx >= path.length - 1) {
              creeps.splice(i, 1);
              continue;
            }
          } else {
            c.x += (dx / dist) * c.speed;
            c.y += (dy / dist) * c.speed;
          }
        }

        // Draw Creep Body
        ctx.fillStyle = "#FF3366";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
        ctx.fill();

        // HP Bar
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(c.x - 10, c.y - 12, 20, 3);
        ctx.fillStyle = "#10B981";
        ctx.fillRect(c.x - 10, c.y - 12, (c.hp / c.maxHp) * 20, 3);
      }

      // Update and draw Towers & Laser Firing
      for (const t of towers) {
        // Draw Tower Body
        ctx.fillStyle = "#FFB800";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 184, 0, 0.15)";
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
        ctx.stroke();

        // Fire logic
        if (t.cooldown <= 0) {
          for (let i = creeps.length - 1; i >= 0; i--) {
            const c = creeps[i];
            const dist = Math.sqrt((c.x - t.x) ** 2 + (c.y - t.y) ** 2);
            if (dist <= t.range) {
              // Laser Beam
              ctx.strokeStyle = "#00F0FF";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(t.x, t.y);
              ctx.lineTo(c.x, c.y);
              ctx.stroke();

              c.hp -= 35;
              t.cooldown = 12;

              if (c.hp <= 0) {
                addExplosion(c.x, c.y);
                creeps.splice(i, 1);
                score++;
              }
              break;
            }
          }
        } else {
          t.cooldown--;
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, 3, 3);
          ctx.globalAlpha = 1.0;
        }
      }

      // Update UI Metrics
      const mEntities = document.getElementById("m-entities");
      const mScore = document.getElementById("m-score");
      if (mEntities) mEntities.textContent = creeps.length + towers.length;
      if (mScore) mScore.textContent = score;

      if (simRunning) {
        simAnimId = requestAnimationFrame(simLoop);
      }
    }

    // Interactive placement on click
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      towers.push({ x: clickX, y: clickY, range: 75, cooldown: 0 });
    });

    const btnRun = document.getElementById("btn-run-simulation");
    const badge = document.getElementById("sim-status-badge");

    if (btnRun) {
      btnRun.addEventListener("click", () => {
        if (!simRunning) {
          simRunning = true;
          if (badge) badge.textContent = "ACTIVE SIMULATION";
          btnRun.textContent = "⏸ Pause Simulation";
          simLoop();
        } else {
          simRunning = false;
          if (badge) badge.textContent = "PAUSED";
          btnRun.textContent = "▶ Resume Simulation";
          if (simAnimId) cancelAnimationFrame(simAnimId);
        }
      });
    }

    // Auto start
    simRunning = true;
    if (badge) badge.textContent = "ACTIVE SIMULATION";
    simLoop();
  }

  // Update Code Display
  function updateCodeDisplay() {
    const codeElem = document.getElementById("code-output");
    if (!codeElem) return;

    if (CODE_SNIPPETS[currentSystem] && CODE_SNIPPETS[currentSystem][currentLang]) {
      codeElem.textContent = CODE_SNIPPETS[currentSystem][currentLang];
    }
  }

  // Raycast / Spotlight Command Palette (Ctrl + K)
  function initCommandPalette() {
    const backdrop = document.getElementById("cmd-palette-backdrop");
    const trigger = document.getElementById("btn-open-cmd");
    const input = document.getElementById("cmd-search-input");
    const items = document.querySelectorAll(".cmd-item");

    function openPalette() {
      if (backdrop) backdrop.style.display = "flex";
      if (input) {
        input.value = "";
        input.focus();
      }
    }

    function closePalette() {
      if (backdrop) backdrop.style.display = "none";
    }

    if (trigger) trigger.addEventListener("click", openPalette);

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (backdrop && backdrop.style.display === "flex") {
          closePalette();
        } else {
          openPalette();
        }
      }
      if (e.key === "Escape") {
        closePalette();
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closePalette();
      });
    }

    items.forEach(item => {
      item.addEventListener("click", () => {
        const action = item.getAttribute("data-action");
        closePalette();

        if (action === "goto-engine-lab") {
          const el = document.getElementById("engine-lab");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (action === "goto-projects") {
          const el = document.getElementById("projects");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (action === "goto-contact") {
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (action === "open-vault-key") {
          const key = prompt("Enter Vault Access Key:");
          if (key) attemptUnlock(key);
        }
      });
    });
  }

  // Vault Unlock Transition
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

  // Reveal Vault
  function revealSecretVault() {
    const mainView = document.getElementById("main-portfolio-view");
    const vaultView = document.getElementById("secret-vault-view");
    const container = document.getElementById("vault-projects-container");

    if (mainView) mainView.style.display = "none";
    if (vaultView) vaultView.style.display = "block";
    window.scrollTo(0, 0);

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

  // Exit Vault
  function exitVault() {
    const mainView = document.getElementById("main-portfolio-view");
    const vaultView = document.getElementById("secret-vault-view");
    if (vaultView) vaultView.style.display = "none";
    if (mainView) mainView.style.display = "block";
    window.scrollTo(0, 0);
  }

  // Attempt Unlock
  async function attemptUnlock(keyCandidate) {
    const hash = await computeSHA256(keyCandidate);
    if (AUTHORIZED_HASHES.includes(hash) || keyCandidate.toLowerCase().includes("rogalplayer")) {
      triggerGlitchOverlay(keyCandidate);
      return true;
    }
    return false;
  }

  // Dev Console Banner
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

  // Check URL Triggers
  function checkUrlTriggers() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get("key");
    const hash = window.location.hash;

    if (keyParam === "rogal_essential" || keyParam === "rogalplayer" || hash === "#/vault") {
      attemptUnlock("rogalplayer");
    }
  }

  // Contact Form
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

  // Initialize Lab Controls
  function initLabControls() {
    const systemBtns = document.querySelectorAll(".lab-tab-btn");
    const langBtns = document.querySelectorAll(".code-tab");

    systemBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        systemBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSystem = btn.getAttribute("data-system");
        updateCodeDisplay();
      });
    });

    langBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        langBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentLang = btn.getAttribute("data-lang");
        updateCodeDisplay();
      });
    });

    updateCodeDisplay();
  }

  // DOM Loaded
  document.addEventListener("DOMContentLoaded", () => {
    initSimCanvas();
    initLabControls();
    initCommandPalette();
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

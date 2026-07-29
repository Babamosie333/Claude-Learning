(function () {
  // ---- CONFIG ----
  // Point this at your deployed backend once it's live (see backend/README.md).
  const API_BASE = window.BABA_AI_API_BASE || '';

  // ---- STYLES ----
  const style = document.createElement('style');
  style.textContent = `
    #baba-launcher {
      position: fixed; bottom: 24px; left: 24px; z-index: 9999;
      width: 62px; height: 62px; border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #1a2030, #0a0d14);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,172,254,0.15);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s ease;
    }
    #baba-launcher:hover { transform: scale(1.06); }
    #baba-face { position: relative; width: 34px; height: 20px; }
    .baba-eye {
      position: absolute; top: 0; width: 12px; height: 12px; border-radius: 50%;
      background: #0a0d14; border: 1.5px solid rgba(79,172,254,0.6);
      overflow: hidden;
    }
    .baba-eye.left { left: 0; }
    .baba-eye.right { right: 0; }
    .baba-pupil {
      position: absolute; top: 3px; left: 3px; width: 6px; height: 6px; border-radius: 50%;
      background: linear-gradient(135deg, #4facfe, #8b7bff);
      transition: transform 0.06s linear;
    }
    .baba-mouth {
      position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
      width: 16px; height: 7px; border-radius: 0 0 10px 10px;
      border-bottom: 2px solid #4facfe; border-left: 2px solid transparent; border-right: 2px solid transparent;
    }

    #baba-panel {
      position: fixed; bottom: 96px; left: 24px; z-index: 9999;
      width: 320px; max-width: calc(100vw - 48px); height: 420px; max-height: 60vh;
      background: #0a0d14; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      display: none; flex-direction: column; overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      font-family: 'Poppins', sans-serif;
    }
    #baba-panel.open { display: flex; }
    #baba-header {
      padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: space-between;
    }
    #baba-header .title { font-size: 14px; font-weight: 700; color: #f3f5fa; }
    #baba-header .subtitle { font-size: 11px; color: #6b7690; }
    #baba-close { background: none; border: none; color: #9aa4bb; cursor: pointer; font-size: 16px; }
    #baba-messages {
      flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
    }
    .baba-msg { font-size: 13px; line-height: 1.5; padding: 9px 12px; border-radius: 10px; max-width: 85%; }
    .baba-msg.bot { background: rgba(79,172,254,0.08); color: #dfe4ee; align-self: flex-start; }
    .baba-msg.user { background: rgba(255,255,255,0.06); color: #e6e9f2; align-self: flex-end; }
    #baba-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
    #baba-input {
      flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; padding: 9px 12px; color: #e6e9f2; font-size: 13px; font-family: inherit;
    }
    #baba-input:focus { outline: none; border-color: #4facfe; }
    #baba-send {
      background: linear-gradient(90deg, #4facfe, #8b7bff); border: none; border-radius: 8px;
      color: #06090f; font-weight: 600; font-size: 13px; padding: 0 14px; cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // ---- MARKUP ----
  const launcher = document.createElement('div');
  launcher.id = 'baba-launcher';
  launcher.innerHTML = `
    <div id="baba-face">
      <div class="baba-eye left"><div class="baba-pupil" id="pupil-l"></div></div>
      <div class="baba-eye right"><div class="baba-pupil" id="pupil-r"></div></div>
      <div class="baba-mouth"></div>
    </div>`;

  const panel = document.createElement('div');
  panel.id = 'baba-panel';
  panel.innerHTML = `
    <div id="baba-header">
      <div>
        <div class="title">Baba AI</div>
        <div class="subtitle">by Vikram Singh</div>
      </div>
      <button id="baba-close">&times;</button>
    </div>
    <div id="baba-messages">
      <div class="baba-msg bot">Hi! I'm Baba AI. Ask me anything about HTML, CSS, JavaScript, or this test.</div>
    </div>
    <div id="baba-input-row">
      <input id="baba-input" placeholder="Ask Baba AI..." autocomplete="off">
      <button id="baba-send">Send</button>
    </div>`;

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  // ---- EYE TRACKING ----
  document.addEventListener('mousemove', (e) => {
    [document.getElementById('pupil-l'), document.getElementById('pupil-r')].forEach(pupil => {
      const eye = pupil.parentElement.getBoundingClientRect();
      const cx = eye.left + eye.width / 2;
      const cy = eye.top + eye.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(2.5, Math.hypot(e.clientX - cx, e.clientY - cy) / 20);
      pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    });
  });

  // ---- OPEN / CLOSE ----
  launcher.addEventListener('click', () => panel.classList.add('open'));
  document.getElementById('baba-close').addEventListener('click', () => panel.classList.remove('open'));

  // ---- CHAT LOGIC ----
  const history = [];
  const messagesEl = document.getElementById('baba-messages');
  const inputEl = document.getElementById('baba-input');

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'baba-msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });
    inputEl.value = '';

    addMessage('Thinking...', 'bot');
    const thinkingEl = messagesEl.lastChild;

    try {
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });
      const data = await res.json();
      thinkingEl.remove();
      const reply = data.reply || data.error || 'Something went wrong.';
      addMessage(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      thinkingEl.remove();
      addMessage("Baba AI isn't reachable right now. Make sure GROQ_API_KEY is set in your Vercel project's environment variables.", 'bot');
    }
  }

  document.getElementById('baba-send').addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
})();

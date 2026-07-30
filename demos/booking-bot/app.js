(() => {
  const chat = document.getElementById("chat");
  const actions = document.getElementById("actions");
  const leadsBody = document.getElementById("leads-body");
  const resetBtn = document.getElementById("reset-btn");

  const SERVICES = [
    { id: "consult", label: "30-min consult", price: "$49" },
    { id: "setup", label: "Site setup call", price: "$99" },
    { id: "audit", label: "Store audit", price: "$129" },
  ];
  const SLOTS = ["Tue 10:00", "Tue 14:30", "Wed 11:00", "Thu 16:00"];
  const STORAGE_KEY = "deskbot-leads-v2";
  const MAX_LEADS = 12;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = { service: null, slot: null, contact: null };

  let leads = loadLeads();

  function loadLeads() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((l) => l && typeof l === "object")
        .slice(0, MAX_LEADS)
        .map((l) => ({
          time: String(l.time || ""),
          service: String(l.service || ""),
          slot: String(l.slot || ""),
          contact: String(l.contact || ""),
        }));
    } catch {
      return [];
    }
  }

  function saveLeads() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      /* storage unavailable — the demo still works for this session */
    }
  }

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  function addBubble(text, who = "bot") {
    const el = document.createElement("div");
    el.className = `bubble ${who}`;
    el.textContent = text;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
  }

  /* Clearing here keeps stale buttons from being clickable while the bot "types". */
  function botSays(text, delay = 520) {
    clearActions();
    if (reduced) {
      addBubble(text, "bot");
      return Promise.resolve();
    }
    const typing = document.createElement("div");
    typing.className = "bubble bot typing";
    typing.innerHTML = "<i></i><i></i><i></i>";
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
    return new Promise((resolve) => {
      setTimeout(() => {
        typing.remove();
        addBubble(text, "bot");
        resolve();
      }, delay);
    });
  }

  function clearActions() {
    actions.innerHTML = "";
  }

  function buttons(options, onPick) {
    clearActions();
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => onPick(opt));
      actions.appendChild(btn);
    });
  }

  function contactInput() {
    clearActions();
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Name + Telegram or email";
    input.setAttribute("aria-label", "Your contact details");
    const send = document.createElement("button");
    send.type = "button";
    send.className = "send";
    send.textContent = "Send";

    const submit = () => {
      const value = input.value.trim();
      if (value.length < 3) {
        input.classList.add("invalid");
        input.focus();
        return;
      }
      state.contact = value;
      addBubble(value, "user");
      finish();
    };

    send.addEventListener("click", submit);
    input.addEventListener("input", () => input.classList.remove("invalid"));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
    actions.append(input, send);
    input.focus();
  }

  function renderLeads() {
    if (!leads.length) {
      leadsBody.innerHTML = `<tr class="empty-row"><td colspan="4">No leads yet — finish a booking in the bot.</td></tr>`;
      return;
    }
    leadsBody.innerHTML = leads
      .map(
        (l) => `
      <tr>
        <td>${escapeHtml(l.time)}</td>
        <td>${escapeHtml(l.service)}</td>
        <td>${escapeHtml(l.slot)}</td>
        <td>${escapeHtml(l.contact)}</td>
      </tr>`
      )
      .join("");
  }

  async function finish() {
    clearActions();
    const lead = {
      time: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      service: state.service.label,
      slot: state.slot,
      contact: state.contact,
    };
    leads = [lead, ...leads].slice(0, MAX_LEADS);
    saveLeads();
    renderLeads();

    await botSays(
      `Booked.\n${lead.service} · ${lead.slot}\nI'll confirm by message.\n\n(Lead written to the sheet →)`
    );
    addBubble("Demo complete", "system");
    buttons([{ id: "again", label: "Book another" }], () => {
      addBubble("Book another", "user");
      startFlow(true);
    });
  }

  async function pickSlot() {
    await botSays("Pick a time slot:");
    buttons(
      SLOTS.map((s) => ({ id: s, label: s })),
      async (opt) => {
        state.slot = opt.label;
        addBubble(opt.label, "user");
        await botSays("Great. How should I reach you?");
        contactInput();
      }
    );
  }

  async function pickService() {
    await botSays("What do you need?");
    buttons(
      SERVICES.map((s) => ({ id: s.id, label: `${s.label} · ${s.price}`, raw: s })),
      (opt) => {
        state.service = opt.raw;
        addBubble(opt.label, "user");
        pickSlot();
      }
    );
  }

  async function startFlow(again = false) {
    state.service = null;
    state.slot = null;
    state.contact = null;
    clearActions();

    if (again) {
      await botSays("Let's book another slot.");
    } else {
      chat.innerHTML = "";
      await botSays(
        "Hi — I'm DeskBot.\nI book short calls and write every lead to a sheet (the n8n / Google Sheets pattern).",
        300
      );
    }
    pickService();
  }

  resetBtn.addEventListener("click", () => {
    leads = [];
    saveLeads();
    renderLeads();
    startFlow(false);
  });

  renderLeads();
  startFlow(false);
})();

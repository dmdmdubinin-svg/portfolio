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

  const state = {
    step: "start",
    service: null,
    slot: null,
    contact: null,
  };

  let leads = JSON.parse(localStorage.getItem("deskbot-leads") || "[]");

  function addBubble(text, who = "bot") {
    const el = document.createElement("div");
    el.className = `bubble ${who}`;
    el.textContent = text;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
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
    input.setAttribute("aria-label", "Contact");
    const send = document.createElement("button");
    send.type = "button";
    send.className = "send";
    send.textContent = "Send";
    const submit = () => {
      const value = input.value.trim();
      if (value.length < 3) {
        input.focus();
        return;
      }
      state.contact = value;
      addBubble(value, "user");
      finish();
    };
    send.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
    actions.appendChild(input);
    actions.appendChild(send);
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
        <td>${l.time}</td>
        <td>${l.service}</td>
        <td>${l.slot}</td>
        <td>${l.contact}</td>
      </tr>`
      )
      .join("");
  }

  function finish() {
    clearActions();
    const lead = {
      time: new Date().toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }),
      service: state.service.label,
      slot: state.slot,
      contact: state.contact,
    };
    leads = [lead, ...leads].slice(0, 12);
    localStorage.setItem("deskbot-leads", JSON.stringify(leads));
    renderLeads();
    addBubble(
      `Booked.\n${lead.service} · ${lead.slot}\nI'll confirm by message.\n\n(Lead written to the sheet →)`,
      "bot"
    );
    addBubble("Demo complete", "system");
    buttons([{ id: "again", label: "Book another" }], () => {
      addBubble("Book another", "user");
      startFlow(true);
    });
  }

  function pickSlot() {
    addBubble("Pick a time slot:", "bot");
    buttons(
      SLOTS.map((s) => ({ id: s, label: s })),
      (opt) => {
        state.slot = opt.label;
        addBubble(opt.label, "user");
        addBubble("Great. How should I reach you?", "bot");
        contactInput();
      }
    );
  }

  function pickService() {
    addBubble("What do you need?", "bot");
    buttons(
      SERVICES.map((s) => ({ id: s.id, label: `${s.label} · ${s.price}`, raw: s })),
      (opt) => {
        state.service = opt.raw;
        addBubble(opt.label, "user");
        pickSlot();
      }
    );
  }

  function startFlow(again = false) {
    state.step = "service";
    state.service = null;
    state.slot = null;
    state.contact = null;
    if (!again) {
      chat.innerHTML = "";
      addBubble("Hi — I’m DeskBot.\nI book short calls and write leads to a sheet (n8n / Sheets pattern).", "bot");
    } else {
      addBubble("Let’s book another slot.", "bot");
    }
    pickService();
  }

  resetBtn.addEventListener("click", () => {
    leads = [];
    localStorage.removeItem("deskbot-leads");
    renderLeads();
    startFlow(false);
  });

  renderLeads();
  startFlow(false);
})();

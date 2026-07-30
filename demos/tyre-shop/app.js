(() => {
  const form = document.getElementById("booking-form");
  const msg = document.getElementById("form-msg");
  if (!form || !msg) return;

  const slotFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  function formatSlot(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : slotFormatter.format(date);
  }

  function show(text, kind) {
    msg.hidden = false;
    msg.textContent = text;
    msg.classList.toggle("msg-error", kind === "error");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    let firstInvalid = null;
    for (const field of form.querySelectorAll("input, select")) {
      const empty = !String(field.value || "").trim();
      field.classList.toggle("invalid", empty);
      if (empty && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      show("Please fill every field before submitting.", "error");
      firstInvalid.focus();
      return;
    }

    const digits = String(data.phone).replace(/\D/g, "");
    if (digits.length < 7) {
      form.elements.phone.classList.add("invalid");
      form.elements.phone.focus();
      show("That phone number looks too short — please check it.", "error");
      return;
    }

    const slotDate = new Date(data.slot);
    if (!Number.isNaN(slotDate.getTime()) && slotDate.getTime() < Date.now()) {
      form.elements.slot.classList.add("invalid");
      form.elements.slot.focus();
      show("Pick a slot in the future.", "error");
      return;
    }

    show(
      `Thanks, ${data.name}. ${data.service} requested for ${formatSlot(data.slot)}. We'll confirm by SMS.`,
      "ok"
    );
    form.reset();
  });

  form.addEventListener("input", (e) => {
    e.target.classList.remove("invalid");
  });
})();

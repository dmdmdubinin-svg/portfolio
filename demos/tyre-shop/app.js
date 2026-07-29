(() => {
  const form = document.getElementById("booking-form");
  const msg = document.getElementById("form-msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const missing = Object.entries(data).filter(([, v]) => !String(v).trim());
    if (missing.length) {
      msg.hidden = false;
      msg.textContent = "Please fill every field before submitting.";
      msg.style.color = "#ff8f70";
      return;
    }
    msg.hidden = false;
    msg.style.color = "#9dff57";
    msg.textContent = `Thanks, ${data.name}. ${data.service} requested for ${data.slot}. We'll confirm by SMS.`;
    form.reset();
  });
})();

/* ---------------------------------------------------------------
   CONTACT — fill these two lines and every CTA on the page updates.
   You can also test without editing: append ?tg=handle&email=you@mail.com
   --------------------------------------------------------------- */
const CONTACT = {
  telegram: "",
  email: "",
};

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel) => document.querySelector(sel);

  /* ---------- contact resolution ---------- */

  const params = new URLSearchParams(window.location.search);
  const telegram = (params.get("tg") || CONTACT.telegram || "").replace(/^@/, "").trim();
  const email = (params.get("email") || CONTACT.email || "").trim();

  /* ---------- footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- mobile navigation ---------- */

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", closeNav);
  }

  /* ---------- reveal on scroll ---------- */

  const revealTargets = document.querySelectorAll(
    ".case, .offer-item, .risk-item, .steps li, .strip-item, .faq-list details, .contact-copy, .brief"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }

  /* ---------- active section in nav ---------- */

  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- hero parallax (rAF throttled) ---------- */

  const stage = $(".stage-panel");
  if (stage && !reduced && window.matchMedia("(pointer: fine)").matches) {
    let targetX = 0;
    let targetY = 0;
    let queued = false;

    const apply = () => {
      queued = false;
      stage.style.setProperty("--px", `${targetX}px`);
      stage.style.setProperty("--py", `${targetY}px`);
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 10;
        targetY = (e.clientY / window.innerHeight - 0.5) * 10;
        if (queued) return;
        queued = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );
  }

  /* ---------- floating mobile CTA ---------- */

  const mobileCta = document.getElementById("mobile-cta");
  const contactSection = document.getElementById("contact");
  if (mobileCta && contactSection && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(
      ([entry]) => mobileCta.classList.toggle("hidden", entry.isIntersecting),
      { threshold: 0.12 }
    );
    ctaObserver.observe(contactSection);
  }

  /* ---------- brief builder ---------- */

  const form = document.getElementById("brief-form");
  if (!form) return;

  const output = document.getElementById("brief-output");
  const briefText = document.getElementById("brief-text");
  const status = document.getElementById("brief-status");
  const copyBtn = document.getElementById("copy-brief");
  const resetBtn = document.getElementById("brief-reset");
  const tgLink = document.getElementById("tg-link");
  const mailLink = document.getElementById("mail-link");

  function setStatus(text, isError = false) {
    status.textContent = text;
    status.classList.toggle("error", isError);
  }

  function buildBrief(data) {
    return [
      "Hi Dmitry — project brief:",
      "",
      `Type: ${data.type}`,
      `Goal: ${data.goal}`,
      `Deadline: ${data.deadline}`,
      `Budget: ${data.budget}`,
      `Contact: ${data.contact}`,
      "",
      "Please send a fixed quote and your next open slot.",
    ].join("\n");
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* fall through to the legacy path */
      }
    }
    briefText.removeAttribute("readonly");
    briefText.select();
    const ok = document.execCommand ? document.execCommand("copy") : false;
    briefText.setAttribute("readonly", "readonly");
    window.getSelection()?.removeAllRanges();
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = ["type", "goal", "deadline", "budget", "contact"];
    const data = {};
    let firstInvalid = null;

    fields.forEach((name) => {
      const el = form.elements[name];
      const value = String(el.value || "").trim();
      const valid = name === "goal" ? value.length >= 10 : value.length > 0;
      el.classList.toggle("invalid", !valid);
      if (!valid && !firstInvalid) firstInvalid = el;
      data[name] = value;
    });

    if (firstInvalid) {
      output.hidden = true;
      setStatus(
        firstInvalid.name === "goal"
          ? "Tell me a bit more about the goal — one full sentence is enough."
          : "Please fill in every field so the quote is accurate.",
        true
      );
      firstInvalid.focus();
      return;
    }

    const text = buildBrief(data);
    briefText.value = text;
    output.hidden = false;

    if (telegram) {
      tgLink.href = `https://t.me/${telegram}`;
      tgLink.textContent = "Copy & open Telegram";
      tgLink.hidden = false;
    } else {
      tgLink.hidden = true;
    }

    if (email) {
      const subject = encodeURIComponent(`Project brief — ${data.type}`);
      mailLink.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(text)}`;
      mailLink.hidden = false;
    } else {
      mailLink.hidden = true;
    }

    setStatus(
      telegram || email
        ? "Brief ready. Copy it or send it straight through."
        : "Brief ready. Copy it and paste it into your freelance-platform message."
    );
    output.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  });

  copyBtn.addEventListener("click", async () => {
    const ok = await copyText(briefText.value);
    setStatus(ok ? "Copied to clipboard." : "Select the text above and copy it manually.", !ok);
  });

  /* Telegram cannot pre-fill a message, so the brief goes to the clipboard first. */
  tgLink.addEventListener("click", () => {
    if (briefText.value) copyText(briefText.value);
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    output.hidden = true;
    setStatus("");
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  });

  form.addEventListener("input", (e) => {
    if (e.target.classList.contains("invalid")) e.target.classList.remove("invalid");
  });
})();

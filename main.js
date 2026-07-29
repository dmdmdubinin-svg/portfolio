(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(".case, .offer-item, .steps li, .contact, .strip-item");
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }

  // Soft parallax on hero stage
  const stage = document.querySelector(".stage-panel");
  if (stage && !prefersReduced) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        stage.style.transform = `rotate(2deg) translate(${x}px, ${y}px)`;
      },
      { passive: true }
    );
  }

  // Optional contact overrides via query params: ?tg=username&email=you@mail.com
  const params = new URLSearchParams(window.location.search);
  const tg = params.get("tg");
  const email = params.get("email");
  const tgLink = document.getElementById("tg-link");
  const mailLink = document.getElementById("mail-link");
  if (tg && tgLink) tgLink.href = `https://t.me/${tg.replace("@", "")}`;
  if (email && mailLink) mailLink.href = `mailto:${email}`;
})();

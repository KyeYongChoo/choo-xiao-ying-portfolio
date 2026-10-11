(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Filmography cards ---------- */
  const strip = document.getElementById("filmstrip");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  PROJECTS.forEach((p, i) => {
    const take = String(i + 1).padStart(2, "0");
    const playable = Boolean(p.youtube);
    const href = playable ? `https://youtu.be/${p.youtube}` : p.link || "";
    const tag = href ? "a" : "div";
    const attrs = href
      ? `href="${esc(href)}" target="_blank" rel="noopener"${playable ? ` data-youtube="${esc(p.youtube)}"` : ""}`
      : "";

    const media = p.still
      ? `<img src="${esc(p.still)}" alt="Still from ${esc(p.title)}" loading="lazy">`
      : `<div class="still-missing"><span>STILL NEEDED</span><small>[ placeholder ]</small></div>`;

    const action = playable ? "▶ Play" : href ? "Watch ↗" : "Link coming soon";

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.category = p.category.join(" ");
    card.innerHTML = `
      <${tag} class="card__link" ${attrs} aria-label="${esc(p.title)} — ${esc(action)}">
        <div class="card__media">
          ${media}
          <span class="card__play">${action}</span>
        </div>
        <div class="card__slate">
          <span><small>Take</small>${take}</span>
          <span><small>Format</small>${esc(p.type)}</span>
          <span><small>Year</small>${esc(p.year || "—")}</span>
        </div>
        <div class="card__body">
          <h3>${esc(p.title)}</h3>
          <p class="card__role">${esc(p.role)}</p>
          ${p.tasks ? `<p class="card__tasks">${esc(p.tasks)}</p>` : ""}
        </div>
      </${tag}>`;
    strip.appendChild(card);
  });

  /* ---------- Filters ---------- */
  const filters = document.querySelectorAll(".filter");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn);
      });
      const f = btn.dataset.filter;
      strip.querySelectorAll(".card").forEach((c) => {
        c.hidden = f !== "all" && !c.dataset.category.split(" ").includes(f);
      });
    })
  );

  /* ---------- Video lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const caption = document.getElementById("lightbox-caption");

  strip.addEventListener("click", (e) => {
    const link = e.target.closest("[data-youtube]");
    if (!link || typeof lightbox.showModal !== "function") return;
    e.preventDefault();
    const id = link.dataset.youtube;
    const title = link.querySelector("h3").textContent;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    caption.textContent = title;
    lightbox.showModal();
  });

  const closeLightbox = () => lightbox.close();
  lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener("close", () => { frame.innerHTML = ""; });

  /* ---------- Hero still rotation ---------- */
  const stills = document.querySelectorAll(".hero__stills img");
  const stillCaption = document.getElementById("still-caption");
  const captions = [
    "Still — <em>The Mission</em> (2026)",
    "Still — <em>Satu Pinggan Harapan</em> (2025)",
    "Still — <em>Chiral</em> (2025)",
    "Still — <em>The Writer</em> (2025)",
  ];
  let current = 0;
  if (!reduceMotion && stills.length > 1) {
    setInterval(() => {
      stills[current].classList.remove("is-active");
      current = (current + 1) % stills.length;
      stills[current].classList.add("is-active");
      stillCaption.innerHTML = captions[current] || "";
    }, 6000);
  }

  /* ---------- Running timecode ---------- */
  const tc = document.getElementById("timecode");
  const start = performance.now();
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const ms = performance.now() - start;
    const s = Math.floor(ms / 1000);
    tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor((ms % 1000) / (1000 / 24)))}`;
    requestAnimationFrame(tick);
  };
  if (!reduceMotion) requestAnimationFrame(tick);

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const toggle = nav.querySelector(".nav__toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".section__head, .card, .phase, .about__text, .about__photo, .quote, .toolkit");
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
})();

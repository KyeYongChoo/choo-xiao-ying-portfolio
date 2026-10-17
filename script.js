(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Filmography cards ---------- */
  const work = document.getElementById("work");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // [text](https://…) in the "about" field becomes a link
  const withLinks = (s) =>
    esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a class="card__inline" href="$2" target="_blank" rel="noopener">$1 ↗</a>');
  const linkLabel = (url) =>
    url.includes("instagram.com") ? "View on Instagram ↗" : url.includes("tiktok.com") ? "Watch on TikTok ↗" : "Watch ↗";

  PROJECTS.forEach((p, i) => {
    const take = String(i + 1).padStart(2, "0");
    let href = p.link || "";
    let data = "";
    let action = href ? linkLabel(href) : "Link coming soon";
    if (p.youtube) {
      href = `https://youtu.be/${p.youtube}`;
      data = ` data-youtube="${esc(p.youtube)}"`;
      action = "▶ Play";
    } else if (p.instagram) {
      href = `https://www.instagram.com/${p.instagram}/`;
      data = ` data-instagram="${esc(p.instagram)}"`;
      action = "▶ Play";
    }
    // accepts the video number or a full TikTok video link
    const tiktokId = String(p.tiktok || "").match(/(\d{8,})\/?(?:[?#].*)?$/)?.[1];
    const live = tiktokId && !reduceMotion;
    if (live) {
      href = href || `https://www.tiktok.com/video/${tiktokId}`;
      action = "Watch on TikTok ↗";
    }

    const still = p.still
      ? `<img src="${esc(p.still)}" alt="Still from ${esc(p.title)}" loading="lazy"${p.stillBg ? ' class="is-logo"' : ""}>`
      : `<div class="still-missing"><span>STILL NEEDED</span><small>[ placeholder ]</small></div>`;

    const title = href
      ? `<a class="card__link" href="${esc(href)}" target="_blank" rel="noopener"${data} aria-label="${esc(p.title)} — ${esc(action)}">${esc(p.title)}</a>`
      : esc(p.title);

    const card = document.createElement("article");
    card.className = `card card--${p.group}${href ? " is-linked" : ""}`;
    card.innerHTML = `
      <div class="card__media"${p.stillBg ? ` style="background:${esc(p.stillBg)}"` : ""}>
        ${still}
        ${live ? `<div class="card__live" data-tiktok="${tiktokId}"></div>` : ""}
        <span class="card__play">${action}</span>
      </div>
      <div class="card__slate">
        <span><small>Take</small>${take}</span>
        <span><small>Format</small>${esc(p.type)}</span>
        <span><small>Lang</small>${esc(p.lang || "—")}</span>
        <span><small>Year</small>${esc(p.year || "—")}</span>
      </div>
      <div class="card__body">
        <h3>${title}</h3>
        <p class="card__role">${esc(p.role)}</p>
        ${p.about ? `<p class="card__about">${withLinks(p.about)}</p>` : ""}
        ${p.tasks ? `<p class="card__tasks">${esc(p.tasks)}</p>` : ""}
      </div>`;
    work.querySelector(`[data-group="${p.group}"]`).appendChild(card);
  });

  /* ---------- TikTok previews: loop silently while on screen ---------- */
  const tiktokSrc = (id) =>
    `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}?` +
    new URLSearchParams({
      autoplay: 1, muted: 1, loop: 1, controls: 0, progress_bar: 0, play_button: 0, volume_control: 0,
      fullscreen_button: 0, timestamp: 0, music_info: 0, description: 0, rel: 0, native_context_menu: 0, closed_caption: 0,
    });
  const tell = (iframe, type) => iframe.contentWindow?.postMessage({ type, "x-tiktok-player": true }, "*");
  const lives = work.querySelectorAll(".card__live");
  if (lives.length && "IntersectionObserver" in window) {
    const liveIO = new IntersectionObserver((entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        let iframe = target.querySelector("iframe");
        if (!iframe && isIntersecting) {
          target.innerHTML = `<iframe src="${tiktokSrc(target.dataset.tiktok)}" title="Muted preview" allow="autoplay; encrypted-media" tabindex="-1"></iframe>`;
          iframe = target.querySelector("iframe");
          iframe.addEventListener("load", () => { target.classList.add("is-ready"); tell(iframe, "mute"); });
        } else if (iframe) {
          tell(iframe, isIntersecting ? "play" : "pause");
        }
      })
    , { threshold: 0.25 });
    lives.forEach((el) => liveIO.observe(el));
  }

  /* ---------- Video lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const frame = document.getElementById("lightbox-frame");
  const caption = document.getElementById("lightbox-caption");
  const srcLink = document.getElementById("lightbox-src");

  work.addEventListener("click", (e) => {
    const link = e.target.closest("[data-youtube], [data-instagram]");
    if (!link || typeof lightbox.showModal !== "function") return;
    e.preventDefault();
    const title = link.textContent;
    const { youtube, instagram } = link.dataset;
    let src;
    if (youtube) {
      const params = new URLSearchParams({ autoplay: 1, rel: 0, playsinline: 1 });
      if (location.protocol.startsWith("http")) params.set("origin", location.origin);
      src = `https://www.youtube.com/embed/${encodeURIComponent(youtube)}?${params}`;
      srcLink.textContent = "Watch on YouTube ↗";
    } else {
      src = `https://www.instagram.com/${instagram}/embed/`;
      srcLink.textContent = "Watch on Instagram ↗";
    }
    frame.innerHTML = `<iframe src="${esc(src)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    lightbox.classList.toggle("lightbox--vertical", Boolean(instagram));
    caption.textContent = title;
    srcLink.href = link.href;
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
    "<em>The Mission</em> (2026)",
    "<em>Satu Pinggan Harapan</em> (2025)",
    "<em>Chiral</em> (2025)",
    "<em>The Writer</em> (2025)",
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
  const revealEls = document.querySelectorAll(".section__head, .work__group, .card, .phase, .about__text, .about__photo, .toolkit");
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

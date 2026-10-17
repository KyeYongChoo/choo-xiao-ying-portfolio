(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Filmography cards ---------- */
  const work = document.getElementById("work");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // [text](https://…) in the "about" field becomes a link
  const withLinks = (s) =>
    esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a class="card__inline" href="$2" target="_blank" rel="noopener">$1 ↗</a>');
  const linkLabel = (url) =>
    /instagram\.com\/(reel|p)\//.test(url) ? "Watch on Instagram ↗"
      : url.includes("instagram.com") ? "View on Instagram ↗"
      : url.includes("tiktok.com") ? "Watch on TikTok ↗" : "Watch ↗";

  // accepts the video number or a full TikTok video link
  const tiktokIdOf = (v) => String(v || "").match(/(\d{8,})\/?(?:[?#].*)?$/)?.[1];

  PROJECTS.forEach((p, i) => {
    const take = String(i + 1).padStart(2, "0");
    const tiktokId = tiktokIdOf(p.tiktok);
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
    } else if (tiktokId) {
      href = /^https?:/.test(p.tiktok) ? p.tiktok : href;
      data = ` data-tiktok="${tiktokId}"`;
      action = "▶ Play";
    }

    const still = p.still
      ? `<img src="${esc(p.still)}" alt="Still from ${esc(p.title)}" loading="lazy"${p.stillBg ? ' class="is-logo"' : ""}>`
      : `<div class="still-missing"><span>STILL NEEDED</span><small>[ placeholder ]</small></div>`;
    const loop = p.loop && !reduceMotion
      ? `<video class="card__loop" src="${esc(p.loop)}" muted loop playsinline preload="none" tabindex="-1" aria-hidden="true"></video>`
      : "";
    const about = p.about ? withLinks(p.about) : "";
    const card = document.createElement("article");

    if (p.group === "social") {
      // reel: picture fills the screen, caption sits over the bottom like TikTok / Instagram
      if (action === "▶ Play") action = "▶ Play with sound";
      const meta = [`Take ${take}`, p.type, p.lang, p.year].filter(Boolean).map(esc).join(" · ");
      card.className = "reel";
      card.dataset.still = p.still || "";
      card.innerHTML = `
        <div class="reel__screen">
          ${still}
          ${tiktokId && !reduceMotion ? `<div class="card__live" data-preview="${tiktokId}"></div>` : ""}
          ${loop}
          ${href ? `<a class="reel__hit" href="${esc(href)}" target="_blank" rel="noopener"${data} data-title="${esc(p.title)}" tabindex="-1" aria-hidden="true"></a>` : ""}
          <div class="reel__overlay">
            <p class="reel__meta">${meta}</p>
            <h3>${href ? `<a href="${esc(href)}" target="_blank" rel="noopener"${data} aria-label="${esc(p.title)} — ${esc(action)}">${esc(p.title)}</a>` : esc(p.title)}</h3>
            <p class="reel__role">${esc(p.role)}</p>
            ${about ? `<p class="reel__about">${about}</p>` : ""}
            ${p.tasks ? `<p class="reel__tasks">${esc(p.tasks)}</p>` : ""}
            ${href ? `<span class="reel__cta">${action}</span>` : ""}
          </div>
        </div>`;
    } else {
      const title = href
        ? `<a class="card__link" href="${esc(href)}" target="_blank" rel="noopener"${data} aria-label="${esc(p.title)} — ${esc(action)}">${esc(p.title)}</a>`
        : esc(p.title);
      card.className = `card card--${p.group}${href ? " is-linked" : ""}`;
      card.innerHTML = `
        <div class="card__media"${p.stillBg ? ` style="background:${esc(p.stillBg)}"` : ""}>
          ${still}
          ${loop}
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
          ${about ? `<p class="card__about">${about}</p>` : ""}
          ${p.tasks ? `<p class="card__tasks">${esc(p.tasks)}</p>` : ""}
        </div>`;
    }
    work.querySelector(`[data-group="${p.group}"]`).appendChild(card);
  });

  /* ---------- Reels: one plays at a time, and its picture fills the background ---------- */
  const lightbox = document.getElementById("lightbox");
  const tiktokSrc = (id, sound) =>
    `https://www.tiktok.com/player/v1/${encodeURIComponent(id)}?` +
    new URLSearchParams(sound
      ? { autoplay: 1, loop: 1, rel: 0, music_info: 0, description: 0 }
      : { autoplay: 1, muted: 1, loop: 1, controls: 0, progress_bar: 0, play_button: 0, volume_control: 0,
          fullscreen_button: 0, timestamp: 0, music_info: 0, description: 0, rel: 0, native_context_menu: 0, closed_caption: 0 });
  const tell = (iframe, type) => iframe.contentWindow?.postMessage({ type, "x-tiktok-player": true }, "*");

  const stage = work.querySelector(".reels");
  const track = stage.querySelector(".reels__track");
  const reels = [...track.querySelectorAll(".reel")];
  const backdrop = stage.querySelector(".reels__backdrop");
  reels.forEach((r) => backdrop.insertAdjacentHTML("beforeend", r.dataset.still ? `<img src="${esc(r.dataset.still)}" alt="">` : "<i></i>"));
  const backdrops = [...backdrop.children];
  let active = reels[0];
  let onScreen = false;

  const sync = () => {
    reels.forEach((r, i) => {
      const isActive = r === active;
      r.classList.toggle("is-active", isActive);
      backdrops[i].classList.toggle("is-active", isActive);
      const play = isActive && onScreen && !lightbox.open;
      const live = r.querySelector(".card__live");
      if (live) {
        let iframe = live.querySelector("iframe");
        if (!iframe && play) {
          live.innerHTML = `<iframe src="${tiktokSrc(live.dataset.preview)}" title="Muted preview" allow="autoplay; encrypted-media" tabindex="-1"></iframe>`;
          iframe = live.querySelector("iframe");
          iframe.addEventListener("load", () => { live.classList.add("is-ready"); tell(iframe, "mute"); });
        } else if (iframe) {
          tell(iframe, play ? "play" : "pause");
        }
      }
      const video = r.querySelector(".card__loop");
      if (video) {
        if (play) video.play().then(() => video.classList.add("is-ready"), () => {});
        else video.pause();
      }
    });
  };
  const activate = (r) => { if (r !== active) { active = r; sync(); } };
  sync();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(stage);
    // phones: the reel swiped into the middle becomes the active one
    const swipeIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting && track.scrollWidth > track.clientWidth) activate(e.target); }),
      { root: track, threshold: 0.6 }
    );
    reels.forEach((r) => swipeIO.observe(r));
  }
  // desktop: pointing at a reel makes it the active one
  reels.forEach((r) => {
    r.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") activate(r); });
    r.addEventListener("focusin", () => activate(r));
  });

  /* ---------- Silent loops on the other cards: play while on screen ---------- */
  const cardLoops = work.querySelectorAll(".card .card__loop");
  if (cardLoops.length && "IntersectionObserver" in window) {
    const loopIO = new IntersectionObserver((entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting && !lightbox.open) target.play().then(() => target.classList.add("is-ready"), () => {});
        else target.pause();
      })
    , { threshold: 0.4 });
    cardLoops.forEach((v) => loopIO.observe(v));
  }

  /* ---------- Video lightbox ---------- */
  const frame = document.getElementById("lightbox-frame");
  const caption = document.getElementById("lightbox-caption");
  const srcLink = document.getElementById("lightbox-src");

  work.addEventListener("click", (e) => {
    const link = e.target.closest("[data-youtube], [data-instagram], [data-tiktok]");
    if (!link || typeof lightbox.showModal !== "function") return;
    e.preventDefault();
    const title = link.dataset.title || link.textContent;
    const { youtube, instagram, tiktok } = link.dataset;
    srcLink.href = link.href;
    caption.textContent = title;
    let src;
    if (youtube) {
      const params = new URLSearchParams({ autoplay: 1, rel: 0, playsinline: 1 });
      if (location.protocol.startsWith("http")) params.set("origin", location.origin);
      src = `https://www.youtube.com/embed/${encodeURIComponent(youtube)}?${params}`;
      srcLink.textContent = "Watch on YouTube ↗";
    } else if (instagram) {
      src = `https://www.instagram.com/${instagram}/embed/`;
      srcLink.textContent = "Watch on Instagram ↗";
    } else {
      src = tiktokSrc(tiktok, true);
      srcLink.textContent = "Watch on TikTok ↗";
    }
    frame.innerHTML = `<iframe src="${esc(src)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    lightbox.classList.toggle("lightbox--vertical", !youtube);
    lightbox.showModal();
    sync();
  });

  const closeLightbox = () => lightbox.close();
  lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener("close", () => { frame.innerHTML = ""; frame.style.height = ""; sync(); });
  // Instagram reports how tall its post is; fit the pop-up to it instead of leaving white space below
  addEventListener("message", (e) => {
    if (e.origin !== "https://www.instagram.com" || !lightbox.open) return;
    let msg;
    try { msg = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch { return; }
    const h = msg?.type === "MEASURE" && msg.details?.height;
    if (h > 0) frame.style.height = `${Math.min(h, innerHeight * 0.8)}px`;
  });

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

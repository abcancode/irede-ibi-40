// ===== Mobile menu =====
const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector("#mobileMenu");

const setMenuOpen = (open) => {
  if (!header || !menuBtn || !mobileMenu) return;

  header.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));

  if (open) {
    mobileMenu.hidden = false;
    const firstLink = mobileMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  } else {
    mobileMenu.hidden = true;
  }
};

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });
}

document.addEventListener("keydown", (e) => {
  if (!menuBtn) return;
  const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
  if (!isOpen) return;

  if (e.key === "Escape") {
    setMenuOpen(false);
    menuBtn.focus();
  }
});

if (mobileMenu) {
  mobileMenu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setMenuOpen(false);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenuOpen(false);
});

// ===== Smooth scroll only for internal anchors =====
const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
const sections = links
  .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
  .filter(Boolean);

links.forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });
});

const setActive = (id) => {
  links.forEach((a) => {
    const isMatch = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("is-active", isMatch);
  });
};

if (sections.length) {
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    { threshold: [0.35, 0.5, 0.75] },
  );

  sections.forEach((sec) => obs.observe(sec));
}

window.addEventListener("load", () => {
  const hash = location.hash?.replace("#", "");
  if (hash) setActive(hash);
});

/* ==========================
   Countdown Timer
========================== */
const eventDate = new Date("August 16, 2026 18:00:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function updateCountdown() {
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance < 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Message form =====
const messageForm = document.getElementById("messageForm");
const privacyCheck = document.getElementById("privacyCheck");
const formNote = document.getElementById("formNote");

if (messageForm) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(messageForm);
    const msg = String(fd.get("message") || "").trim();

    if (!msg) {
      if (formNote) {
        formNote.textContent = "Please write a message before sending.";
      }
      return;
    }

    if (!privacyCheck?.checked) {
      if (formNote) {
        formNote.textContent =
          "Please agree to the privacy policy to continue.";
      }
      return;
    }

    if (formNote) {
      formNote.textContent =
        "Thank you! Your message has been recorded (demo).";
    }
    messageForm.reset();
  });
}

/* ==========================
   Add to Calendar (Google + ICS)
========================== */
const mainEvent = {
  title: "Irede & Ibi’s 40th Birthday — Main Event (Lamu)",
  description:
    "Join us in Lamu for Irede & Ibi’s 40th Birthday celebration. More details will be shared in due course.",
  location: "The Majlis Resort, Lamu, Kenya",
  startLocal: "2026-08-18T15:00:00",
  endLocal: "2026-08-22T12:00:00",
};

const optionalEvent = {
  title: "Irede & Ibi’s 40th Birthday — Optional (Nairobi)",
  description:
    "Optional Nairobi stay for Irede & Ibi’s 40th Birthday celebration.",
  location: "JW Marriott Hotel Nairobi, Kenya",
  startLocal: "2026-08-16T15:00:00",
  endLocal: "2026-08-18T12:00:00",
};

function toUtcStamp(localIsoString) {
  const d = new Date(localIsoString);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

function encodeGCalParam(str) {
  return encodeURIComponent(str || "");
}

function buildGoogleCalendarUrl(evt) {
  const dates = `${toUtcStamp(evt.startLocal)}/${toUtcStamp(evt.endLocal)}`;
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  return (
    `${base}` +
    `&text=${encodeGCalParam(evt.title)}` +
    `&details=${encodeGCalParam(evt.description)}` +
    `&location=${encodeGCalParam(evt.location)}` +
    `&dates=${encodeGCalParam(dates)}`
  );
}

function escapeIcsText(str) {
  return String(str || "")
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");
}

function buildIcsFile(evt) {
  const uid = `${Date.now()}@iredeibi40`;
  const dtstamp = toUtcStamp(new Date().toISOString());
  const dtstart = toUtcStamp(evt.startLocal);
  const dtend = toUtcStamp(evt.endLocal);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IredeIbi40//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeIcsText(evt.title)}`,
    `DESCRIPTION:${escapeIcsText(evt.description)}`,
    `LOCATION:${escapeIcsText(evt.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadTextFile(filename, content, mime = "text/calendar") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

const gcalMain = document.getElementById("gcalMainEvent");
const gcalOptional = document.getElementById("gcalOptionalEvent");

if (gcalMain) gcalMain.href = buildGoogleCalendarUrl(mainEvent);
if (gcalOptional) gcalOptional.href = buildGoogleCalendarUrl(optionalEvent);

const icsMainBtn = document.getElementById("icsMainEvent");
const icsOptionalBtn = document.getElementById("icsOptionalEvent");

if (icsMainBtn) {
  icsMainBtn.addEventListener("click", () => {
    downloadTextFile("Irede-Ibi-40th-Main-Event.ics", buildIcsFile(mainEvent));
  });
}

if (icsOptionalBtn) {
  icsOptionalBtn.addEventListener("click", () => {
    downloadTextFile(
      "Irede-Ibi-40th-Optional-Nairobi.ics",
      buildIcsFile(optionalEvent),
    );
  });
}

document.addEventListener("click", (e) => {
  const dd = document.getElementById("calendarDropdown");
  if (!dd || !dd.open) return;
  if (!dd.contains(e.target)) dd.open = false;
});

// ===== Itinerary Accordion =====
const itineraryItems = Array.from(document.querySelectorAll(".itinerary-item"));

function closeAllItinerary() {
  itineraryItems.forEach((item) => {
    item.classList.remove("open");
    const content = item.querySelector(".itinerary-content");
    if (content) content.style.maxHeight = null;
  });
}

function openItinerary(item) {
  const content = item.querySelector(".itinerary-content");
  if (!content) return;
  item.classList.add("open");
  content.style.maxHeight = `${content.scrollHeight}px`;
}

itineraryItems.forEach((item) => {
  const btn = item.querySelector(".itinerary-header");
  const content = item.querySelector(".itinerary-content");
  if (!btn || !content) return;

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    closeAllItinerary();
    if (!isOpen) openItinerary(item);
  });
});

window.addEventListener("resize", () => {
  const openItem = document.querySelector(".itinerary-item.open");
  if (!openItem) return;
  const content = openItem.querySelector(".itinerary-content");
  if (!content) return;
  content.style.maxHeight = `${content.scrollHeight}px`;
});

/* ==========================
   Galleries: Scroll reveal + Lightbox
========================== */
const galleryGrids = document.querySelectorAll(
  "#galleryGridCouple, #galleryGridRoyal",
);
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");

let galleryItems = [];
let activeIndex = 0;

galleryGrids.forEach((grid) => {
  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  items.forEach((el) => el.classList.add("reveal"));

  const galObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
      });
    },
    { threshold: 0.18 },
  );

  items.forEach((el) => galObs.observe(el));

  items.forEach((item) => {
    item.addEventListener("click", () => {
      galleryItems = items;
      activeIndex = items.indexOf(item);
      openLightbox(activeIndex);
    });
  });
});

function openLightbox(idx) {
  if (!galleryItems.length || !lightbox || !lightboxImg || !lightboxCap) return;

  activeIndex = idx;
  const item = galleryItems[activeIndex];
  const full = item.getAttribute("data-full") || item.querySelector("img")?.src;
  const cap = item.querySelector(".gallery-cap")?.textContent?.trim() || "";

  lightboxImg.src = full;
  lightboxCap.textContent = cap;
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function goNext() {
  if (!galleryItems.length) return;
  activeIndex = (activeIndex + 1) % galleryItems.length;
  openLightbox(activeIndex);
}

function goPrev() {
  if (!galleryItems.length) return;
  activeIndex = (activeIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(activeIndex);
}

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.matches("[data-close]")) closeLightbox();
  });

  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goNext();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  });
}

/* ==========================
   Back to Top + Scroll Progress Ring
========================== */
const backTop = document.getElementById("backTop");
const progressPath = document.querySelector(".backtop__progress");

function getScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  if (scrollHeight <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / scrollHeight));
}

function updateBackTop() {
  if (!backTop) return;

  const y = window.scrollY || document.documentElement.scrollTop;
  const showAfter = 420;

  if (y > showAfter) {
    backTop.hidden = false;
    backTop.classList.add("is-visible");
  } else {
    backTop.classList.remove("is-visible");
    setTimeout(() => {
      if (!backTop.classList.contains("is-visible")) backTop.hidden = true;
    }, 250);
  }

  if (progressPath) {
    const p = getScrollProgress();
    const dash = 100 - p * 100;
    progressPath.style.strokeDashoffset = String(dash);

    if (p > 0.95) {
      backTop.classList.add("is-complete");
    } else {
      backTop.classList.remove("is-complete");
    }
  }
}

updateBackTop();
window.addEventListener("scroll", updateBackTop, { passive: true });
window.addEventListener("resize", updateBackTop);

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==========================
   Prep Section Slider
========================== */
const prepSlides = document.querySelectorAll(".prep-slider .slide");

if (prepSlides.length) {
  let prepIndex = 0;

  setInterval(() => {
    prepSlides[prepIndex].classList.remove("active");
    prepIndex = (prepIndex + 1) % prepSlides.length;
    prepSlides[prepIndex].classList.add("active");
  }, 5000);
}

/* =========================
   Background Music on First Interaction
========================= */
const heroMusic = document.getElementById("heroMusic");

if (heroMusic) {
  heroMusic.volume = 0.35;

  const startMusic = async () => {
    try {
      await heroMusic.play();
    } catch (err) {
      console.log("Music blocked:", err);
    }
  };

  window.addEventListener("click", startMusic, { once: true });
  window.addEventListener("touchstart", startMusic, { once: true });
  window.addEventListener("keydown", startMusic, { once: true });
  window.addEventListener("scroll", startMusic, { once: true });
  window.addEventListener("wheel", startMusic, { once: true });
}

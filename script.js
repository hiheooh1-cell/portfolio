// ===== PORTFOLIO SCRIPT =====
// Mobile menu, navbar state, active link, scroll reveal,
// proficiency bars, back-to-top and dynamic year.

// ----- 1. Mobile menu -----
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

const closeMenu = () => {
  navLinks.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
};

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") closeMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navLinks.classList.contains("open")) closeMenu();
});

// ----- 2. Scroll-reveal animations -----
const revealTargets = document.querySelectorAll(
  ".section-title, .section-desc, .about-text, .about-facts, .about-photo, .stat, .expertise-card, .proficiency, .project-card, .timeline-item, .contact-text, .contact-list, .social-links, .contributor-card"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ----- 3. Proficiency bars (animate to data-level when visible) -----
const barFills = document.querySelectorAll(".bar-fill");

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.level + "%";
        barObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.4 }
);

barFills.forEach((el) => barObserver.observe(el));

// ----- 4. Active nav link, navbar shadow & back-to-top (unified) -----
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("to-top");
const sections = document.querySelectorAll("main section[id]");
const linkMap = new Map(
  [...navLinks.querySelectorAll("a")].map((a) => [a.getAttribute("href").slice(1), a])
);

const onScroll = () => {
  const y = window.scrollY;

  navbar.classList.toggle("scrolled", y > 10);
  backToTop.hidden = y < 400;

  let current = "home";
  sections.forEach((sec) => {
    if (y >= sec.offsetTop - 140) current = sec.id;
  });
  linkMap.forEach((link, id) => link.classList.toggle("active", id === current));
};

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    onScroll();
    ticking = false;
  });
}, { passive: true });

onScroll(); // initial state

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ----- 5. Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();

// ----- 6. 3D tilt cards + hero parallax (2026-11-08) -----
// Only for fine-pointer devices (mouse/trackpad); touch users and
// reduced-motion users keep the plain hover behaviour.
(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reducedMotion) return;

  const MAX_TILT = 7; // degrees
  document.querySelectorAll(".project-card, .expertise-card, .contributor-card").forEach((card) => {
    card.classList.add("tilt");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform =
        `perspective(900px) rotateX(${((0.5 - py) * MAX_TILT).toFixed(2)}deg) ` +
        `rotateY(${((px - 0.5) * MAX_TILT).toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Gentle parallax: the hero 3D scene drifts a few pixels with the cursor.
  const scene = document.querySelector(".hero-3d-scene");
  const hero = document.querySelector(".hero");
  if (scene && hero) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      scene.style.transform = `translate3d(${(dx * 18).toFixed(1)}px, ${(dy * 14).toFixed(1)}px, 0)`;
    });
    hero.addEventListener("mouseleave", () => {
      scene.style.transform = "";
    });
  }
})();

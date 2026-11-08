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

const aboutDetailItems = Array.from(document.querySelectorAll("[data-about-section]"));
const aboutDetailTargets = Array.from(document.querySelectorAll("[data-about-target]"));
let aboutDetailScrollFrame = 0;
let isAboutScrollSyncReady = false;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const syncAboutUrl = (sectionId) => {
  window.history.replaceState({}, "", `./about.html?section=${sectionId}`);
};

const setActiveAboutSection = (sectionId, syncUrl = true) => {
  aboutDetailItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.aboutSection === sectionId);
  });
  if (syncUrl) syncAboutUrl(sectionId);
};

const jumpToAboutSection = (sectionId) => {
  const target = document.querySelector(`[data-about-target="${sectionId}"]`);
  if (!target) return;
  setActiveAboutSection(sectionId);
  const headerOffset = 117;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, Math.max(0, targetTop));
  window.requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
};

const updateAboutSectionFromScroll = () => {
  aboutDetailScrollFrame = 0;
  const experience = document.querySelector('[data-about-target="experience"]');
  if (!experience) return;
  const activationLine = 117 + window.innerHeight * 0.2;
  const isAtPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const sectionId = isAtPageBottom || experience.getBoundingClientRect().top <= activationLine
    ? "experience"
    : "profile";
  setActiveAboutSection(sectionId);
};

aboutDetailItems.forEach((item) => {
  item.addEventListener("click", () => jumpToAboutSection(item.dataset.aboutSection));
});

window.addEventListener("scroll", () => {
  if (!isAboutScrollSyncReady || aboutDetailScrollFrame) return;
  aboutDetailScrollFrame = window.requestAnimationFrame(updateAboutSectionFromScroll);
}, { passive: true });

if (aboutDetailItems.length) {
  const requestedSection = new URLSearchParams(window.location.search).get("section");
  const initialSection = ["profile", "experience"].includes(requestedSection) ? requestedSection : "profile";
  setActiveAboutSection(initialSection);
  window.requestAnimationFrame(() => {
    jumpToAboutSection(initialSection);
    window.requestAnimationFrame(() => {
      isAboutScrollSyncReady = true;
      updateAboutSectionFromScroll();
    });
  });
}

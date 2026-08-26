const configureReveal = (element, level = "section", delay = 0) => {
  if (!(element instanceof HTMLElement)) return;
  element.classList.add("reveal");
  element.dataset.reveal = "";
  element.dataset.revealLevel = level;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
};

const unwrapReveal = (element) => {
  if (!(element instanceof HTMLElement)) return;
  element.classList.remove("reveal", "is-visible");
  element.removeAttribute("data-reveal");
  element.removeAttribute("data-reveal-level");
  element.style.removeProperty("--reveal-delay");
};

const prepareRevealSystem = () => {
  if (document.documentElement.classList.contains("homepage-root")) {
    const heroIntro = document.querySelector(".intro");
    const aboutHeading = document.querySelector(".about-heading");

    [heroIntro, aboutHeading].forEach(unwrapReveal);

    configureReveal(heroIntro?.querySelector("h1"), "hero", 0);
    configureReveal(heroIntro?.querySelector(".intro-meta"), "secondary", 100);
    configureReveal(document.querySelector(".card-stage"), "visual", 240);

    configureReveal(aboutHeading?.querySelector("h2"), "hero", 0);
    configureReveal(aboutHeading?.querySelector(".about-introduction"), "section", 70);
    configureReveal(aboutHeading?.querySelector(".about-actions"), "secondary", 140);
    configureReveal(document.querySelector(".about-polaroids"), "visual", 190);

    [
      [".work-projects-heading", "hero", 0],
      [".work-projects-sidebar", "section", 90],
      [".work-project-visual-wrap", "visual", 190],
      [".playground-heading", "hero", 0],
      [".playground-sidebar", "section", 90],
      [".playground-visual-wrap", "visual", 190],
    ].forEach(([selector, level, delay]) =>
      configureReveal(document.querySelector(selector), level, delay)
    );
    return;
  }

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    const level = element.matches("header, .case-title, .professional-case-header")
      ? "hero"
      : element.matches("figure, .case-media")
        ? "visual"
        : "section";
    configureReveal(element, level, level === "visual" ? 120 : 0);
  });

  document
    .querySelectorAll(
      ".case-content > header, .case-content > section, .about-detail-content > section"
    )
    .forEach((element) => {
      if (element.matches("[data-reveal]") || element.querySelector("[data-reveal]")) return;
      const level = element.matches("header, :first-child") ? "hero" : "section";
      configureReveal(element, level, 0);
    });
};

prepareRevealSystem();
const revealItems = document.querySelectorAll("[data-reveal]");
const siteHeader = document.querySelector(".site-header");
const mainNavLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const flipCard = document.querySelector(".portfolio-card");
const heroSection = document.querySelector(".hero");
const contactMenu = document.querySelector(".contact-menu");
const contactButton = contactMenu?.querySelector(".contact-button");
const copyToast = document.querySelector(".copy-toast");
const workSection = document.querySelector(".work-projects");
const workTabs = document.querySelectorAll(".work-tab");
const workProjects = document.querySelectorAll(".work-project");
const workVisual = document.querySelector("[data-project-visual]");
const workVisualImage = document.querySelector("[data-project-visual-image]");
const workVisualLink = document.querySelector("[data-project-visual-link]");
const workProjectDuration = 4000;
let workProjectTimer;
let workSectionInView = false;
const aboutSection = document.querySelector(".about-section");
const aboutItems = document.querySelectorAll(".about-item");
const aboutPanels = document.querySelectorAll("[data-about-panel]");
const aboutGallery = document.querySelector(".about-gallery");
const aboutGalleryTrack = document.querySelector("[data-about-gallery-track]");
const aboutDuration = 4000;
let aboutTimer;
let aboutSectionInView = false;
const playgroundSection = document.querySelector(".playground-section");
const playgroundItems = document.querySelectorAll(".playground-item");
const playgroundPanels = document.querySelectorAll("[data-playground-panel]");
const playgroundVisual = document.querySelector("[data-playground-visual]");
const playgroundVisualLink = document.querySelector("[data-playground-visual-link]");
const playgroundDuration = 4000;
let playgroundTimer;
let playgroundSectionInView = false;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (aboutGallery && aboutGalleryTrack) {
  const cards = Array.from(aboutGalleryTrack.querySelectorAll(".about-gallery-card"));
  const hint = aboutGallery.querySelector(".about-gallery-hint");
  const motion = {
    position: 0,
    velocity: 0.36,
    seekTarget: null,
    lastFrameTime: 0,
    lastPointerTime: 0,
    lastPointerX: 0,
    startPointerX: 0,
    startPosition: 0,
    pointerId: null,
    dragging: false,
    moved: false,
    suppressClick: false,
    lastActiveIndex: -1,
    frame: 0,
  };
  const AUTO_VELOCITY = 0.36;
  const CARD_GAP = 16;

  const wrapIndex = (index) => ((index % cards.length) + cards.length) % cards.length;
  const wrapDistance = (distance) => {
    const half = cards.length / 2;
    return ((distance + half) % cards.length + cards.length) % cards.length - half;
  };

  const getActiveIndex = () => wrapIndex(Math.round(motion.position));

  const announceActiveCard = () => {
    if (!hint) return;
    const activeCard = cards[getActiveIndex()];
    hint.textContent = `${activeCard?.dataset.galleryTitle || "照片"} · 左右拖动浏览`;
  };

  const renderAboutGallery = () => {
    const cardWidth = cards[0]?.offsetWidth || 282;
    const baseGap = cardWidth + CARD_GAP;

    cards.forEach((card, index) => {
      const offset = wrapDistance(index - motion.position);
      const distance = Math.abs(offset);
      const direction = Math.sign(offset);
      const x = offset * baseGap;
      const y = Math.pow(distance, 1.5) * 3;
      const z = Math.max(-160, 100 - Math.pow(distance, 1.35) * 45);

      let scale;
      let opacity;
      let rotateAmount;

      if (distance <= 1) {
        scale = 1 - distance * 0.04;
        opacity = 1;
        rotateAmount = distance * 7;
      } else if (distance <= 2) {
        scale = 0.96 - (distance - 1) * 0.06;
        opacity = 1 - (distance - 1) * 0.05;
        rotateAmount = 7 + (distance - 1) * 6;
      } else if (distance <= 3) {
        scale = 0.9 - (distance - 2) * 0.08;
        opacity = 0.95 - (distance - 2) * 0.15;
        rotateAmount = 13 + (distance - 2) * 8;
      } else {
        scale = Math.max(0.72, 0.82 - (distance - 3) * 0.1);
        opacity = Math.max(0.38, 0.8 - (distance - 3) * 0.25);
        rotateAmount = Math.min(32, 21 + (distance - 3) * 9);
      }

      const rotate = direction * -rotateAmount;

      card.style.setProperty("--gallery-x", `${x.toFixed(2)}px`);
      card.style.setProperty("--gallery-y", `${y.toFixed(2)}px`);
      card.style.setProperty("--gallery-scale", scale.toFixed(4));
      card.style.setProperty("--gallery-rotate", `${rotate.toFixed(2)}deg`);
      card.style.setProperty("--gallery-opacity", opacity.toFixed(3));
      card.style.setProperty("--gallery-z", `${z.toFixed(2)}px`);
      card.style.zIndex = String(100 - Math.round(distance * 10));
      card.style.pointerEvents = opacity < 0.12 ? "none" : "auto";

      const isCenter = distance < 0.5;
      card.classList.toggle("is-center", isCenter);
      if (isCenter) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });

    const activeIndex = getActiveIndex();
    if (activeIndex !== motion.lastActiveIndex) {
      motion.lastActiveIndex = activeIndex;
      announceActiveCard();
    }
  };

  const animateAboutGallery = (time) => {
    if (!motion.lastFrameTime) motion.lastFrameTime = time;
    const delta = Math.min((time - motion.lastFrameTime) / 1000, 0.05);
    motion.lastFrameTime = time;

    if (!motion.dragging) {
      if (reducedMotion.matches) {
        motion.velocity = 0;
      } else {
        motion.velocity = AUTO_VELOCITY;
        motion.position += motion.velocity * delta;
      }
    }

    renderAboutGallery();
    motion.frame = window.requestAnimationFrame(animateAboutGallery);
  };

  const finishDrag = (event) => {
    if (!motion.dragging || event.pointerId !== motion.pointerId) return;
    motion.dragging = false;
    aboutGallery.classList.remove("is-dragging");
    if (aboutGallery.hasPointerCapture(event.pointerId)) {
      aboutGallery.releasePointerCapture(event.pointerId);
    }
    motion.pointerId = null;
    motion.velocity = AUTO_VELOCITY;
    if (motion.moved) {
      motion.suppressClick = true;
    }
  };

  aboutGalleryTrack.tabIndex = 0;
  aboutGalleryTrack.setAttribute("aria-label", "关于我空间画廊，可左右拖动浏览");

  aboutGallery.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    motion.dragging = true;
    motion.moved = false;
    motion.pointerId = event.pointerId;
    motion.startPointerX = event.clientX;
    motion.lastPointerX = event.clientX;
    motion.startPosition = motion.position;
    motion.lastPointerTime = performance.now();
    motion.seekTarget = null;
    aboutGallery.classList.add("is-dragging");
    aboutGallery.setPointerCapture(event.pointerId);
  });

  aboutGallery.addEventListener("pointermove", (event) => {
    if (!motion.dragging || event.pointerId !== motion.pointerId) return;
    const now = performance.now();
    const totalDelta = event.clientX - motion.startPointerX;

    if (Math.abs(totalDelta) > 5) motion.moved = true;
    const cardDragDistance = (cards[0]?.offsetWidth || 282) + CARD_GAP;
    motion.position = motion.startPosition - totalDelta / cardDragDistance;
    motion.velocity = AUTO_VELOCITY;
    motion.lastPointerX = event.clientX;
    motion.lastPointerTime = now;
    renderAboutGallery();
  });

  aboutGallery.addEventListener("pointerup", finishDrag);
  aboutGallery.addEventListener("pointercancel", finishDrag);

  aboutGallery.addEventListener(
    "click",
    (event) => {
      if (!motion.suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      motion.suppressClick = false;
    },
    true
  );

  aboutGallery.addEventListener("dragstart", (event) => event.preventDefault());

  window.addEventListener("resize", renderAboutGallery);
  announceActiveCard();
  renderAboutGallery();
  motion.frame = window.requestAnimationFrame(animateAboutGallery);
}

let lastCardScrollY = window.scrollY;
let cardHasLeftHero = false;
let cardScrollFrame = 0;
const maskWidth = 39.57;
const maskHeight = 70.46;
const tiltMaxX = 2.2;
const tiltMaxY = 2.8;
const cardMotion = {
  frame: 0,
  active: false,
  current: { maskX: 50, maskY: 50, tiltX: 0, tiltY: 0 },
  target: { maskX: 50, maskY: 50, tiltX: 0, tiltY: 0 },
};
const navigationSections = Array.from(mainNavLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const slidingTabBars = [];

const setupSlidingTabBar = (container, itemSelector, activeSelector) => {
  if (!container) return null;
  const indicator = document.createElement("span");
  indicator.className = "tab-selection-slider";
  indicator.setAttribute("aria-hidden", "true");
  container.prepend(indicator);

  const update = (animate = true) => {
    const activeItem = container.querySelector(activeSelector);
    if (!activeItem || activeItem.hidden) {
      indicator.classList.remove("is-visible");
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    indicator.classList.toggle("is-instant", !animate);
    indicator.style.setProperty("--slider-x", `${itemRect.left - containerRect.left}px`);
    indicator.style.setProperty("--slider-y", `${itemRect.top - containerRect.top}px`);
    indicator.style.setProperty("--slider-width", `${itemRect.width}px`);
    indicator.style.setProperty("--slider-height", `${itemRect.height}px`);
    indicator.classList.add("is-visible");
    if (!animate) {
      window.requestAnimationFrame(() => indicator.classList.remove("is-instant"));
    }
  };

  container.querySelectorAll(itemSelector).forEach((item) => {
    item.classList.add("has-selection-slider");
  });
  const controller = { container, update };
  slidingTabBars.push(controller);
  window.requestAnimationFrame(() => update(false));
  return controller;
};

const mainNavSlider = setupSlidingTabBar(
  document.querySelector(".main-nav"),
  'a[href^="#"]',
  'a[aria-current="true"]'
);
const workTabsSlider = setupSlidingTabBar(
  document.querySelector(".work-tabs"),
  ".work-tab",
  ".work-tab.is-active"
);

const updateNavigationState = () => {
  const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
  const activationLine = headerHeight + window.innerHeight * 0.22;
  const matchedSection = navigationSections.find((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= activationLine && bounds.bottom > activationLine;
  });

  const footerBounds = document.querySelector("#footer")?.getBoundingClientRect();
  const isFooterActive = footerBounds
    ? footerBounds.top <= activationLine && footerBounds.bottom > activationLine
    : false;
  const currentSection = isFooterActive ? undefined : matchedSection;

  const currentSectionId = currentSection?.id;
  siteHeader?.classList.toggle(
    "is-dark-section",
    currentSectionId === "work" || currentSectionId === "playground"
  );
  siteHeader?.classList.toggle("is-playground-section", currentSectionId === "playground");

  mainNavLinks.forEach((link) => {
    const isCurrent = currentSection && link.getAttribute("href") === `#${currentSection.id}`;
    if (isCurrent) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  mainNavSlider?.update();
};

const updatePageNavigation = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 4);
  updateNavigationState();
};

updatePageNavigation();
window.addEventListener("scroll", updatePageNavigation, { passive: true });
window.addEventListener("resize", () => {
  updateNavigationState();
  slidingTabBars.forEach(({ update }) => update(false));
});

const resetCardMotion = () => {
  if (cardMotion.frame) {
    window.cancelAnimationFrame(cardMotion.frame);
    cardMotion.frame = 0;
  }
  cardMotion.active = false;
  cardMotion.current = { maskX: 50, maskY: 50, tiltX: 0, tiltY: 0 };
  cardMotion.target = { maskX: 50, maskY: 50, tiltX: 0, tiltY: 0 };
  flipCard?.classList.remove("is-pointer-tracking");
  flipCard?.style.removeProperty("--mask-pos-x");
  flipCard?.style.removeProperty("--mask-pos-y");
  flipCard?.style.removeProperty("--tilt-x");
  flipCard?.style.removeProperty("--tilt-y");
};

const renderCardMotion = () => {
  if (!flipCard || !cardMotion.active) {
    cardMotion.frame = 0;
    return;
  }

  const smoothing = 0.24;
  Object.keys(cardMotion.current).forEach((key) => {
    cardMotion.current[key] +=
      (cardMotion.target[key] - cardMotion.current[key]) * smoothing;
  });

  flipCard.style.setProperty("--mask-pos-x", `${cardMotion.current.maskX.toFixed(2)}%`);
  flipCard.style.setProperty("--mask-pos-y", `${cardMotion.current.maskY.toFixed(2)}%`);
  flipCard.style.setProperty("--tilt-x", `${cardMotion.current.tiltX.toFixed(2)}deg`);
  flipCard.style.setProperty("--tilt-y", `${cardMotion.current.tiltY.toFixed(2)}deg`);
  cardMotion.frame = window.requestAnimationFrame(renderCardMotion);
};

const setContactMenu = (isOpen) => {
  contactMenu?.classList.toggle("is-open", isOpen);
  contactButton?.setAttribute("aria-expanded", String(isOpen));
};

contactButton?.addEventListener("click", () => {
  setContactMenu(!contactMenu?.classList.contains("is-open"));
});

const footerContactTrigger = document.querySelector("[data-footer-contact]");
const footerContactModal = document.querySelector("[data-footer-contact-modal]");
const footerModalClose = footerContactModal?.querySelector("[data-footer-modal-close]");
const footerModalConfirm = footerContactModal?.querySelector("[data-footer-modal-confirm]");
const footerCtaTitle = document.querySelector("#footer-cta-title");

const setFooterContactModal = (isOpen) => {
  if (!footerContactModal) return;
  footerContactModal.hidden = !isOpen;
  document.body.classList.toggle("has-open-modal", isOpen);
  if (isOpen) {
    footerModalClose?.focus({ preventScroll: true });
  } else {
    footerContactTrigger?.focus({ preventScroll: true });
  }
};

footerContactTrigger?.addEventListener("click", () => setFooterContactModal(true));
footerModalClose?.addEventListener("click", () => setFooterContactModal(false));
footerModalConfirm?.addEventListener("click", () => setFooterContactModal(false));
footerContactModal?.addEventListener("click", (event) => {
  if (event.target === footerContactModal) setFooterContactModal(false);
});

if (footerCtaTitle && "IntersectionObserver" in window && !reducedMotion.matches) {
  const footerTitleObserver = new IntersectionObserver(
    (entries, observer) => {
      const titleEntry = entries.find((entry) => entry.isIntersecting);
      if (!titleEntry) return;
      footerCtaTitle.classList.add("is-shimmering");
      observer.disconnect();
    },
    { threshold: 0.65 }
  );
  footerTitleObserver.observe(footerCtaTitle);
  footerCtaTitle.addEventListener(
    "animationend",
    () => footerCtaTitle.classList.remove("is-shimmering"),
    { once: true }
  );
}

document.addEventListener("click", (event) => {
  if (contactMenu && !contactMenu.contains(event.target)) {
    setContactMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (footerContactModal && !footerContactModal.hidden) {
    setFooterContactModal(false);
    return;
  }
  setContactMenu(false);
  contactButton?.focus();
});

let toastTimer;

const showCopyToast = () => {
  window.clearTimeout(toastTimer);
  copyToast?.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    copyToast?.classList.remove("is-visible");
  }, 1800);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
};

document.querySelectorAll(".contact-copy").forEach((copyButton) => {
  copyButton.addEventListener("click", async () => {
    const input = document.getElementById(copyButton.dataset.copyTarget);
    if (!input) return;
    await copyText(input.value);
    showCopyToast();
  });
});

const showRevealItems = () => revealItems.forEach((item) => item.classList.add("is-visible"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 10% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  showRevealItems();
}

const setCardFlipped = (shouldFlip, animate = true) => {
  if (!flipCard) return;

  const isFlipped = flipCard.getAttribute("aria-pressed") === "true";
  if (isFlipped === shouldFlip) return;

  const motionClass = shouldFlip ? "is-flipping-forward" : "is-flipping-backward";
  flipCard.classList.remove("is-flipping-forward", "is-flipping-backward");
  flipCard.setAttribute("aria-pressed", String(shouldFlip));
  resetCardMotion();

  if (animate && !reducedMotion.matches) {
    void flipCard.offsetWidth;
    flipCard.classList.add(motionClass);
  }

  const front = flipCard.querySelector(".card-front");
  const back = flipCard.querySelector(".card-back");
  front?.setAttribute("aria-hidden", String(shouldFlip));
  back?.setAttribute("aria-hidden", String(!shouldFlip));
};

flipCard?.addEventListener("click", () => {
  const isFlipped = flipCard.getAttribute("aria-pressed") === "true";
  setCardFlipped(!isFlipped);
});

flipCard?.querySelector(".card-inner")?.addEventListener("animationend", () => {
  flipCard.classList.remove("is-flipping-forward", "is-flipping-backward");
});

const updateCardScrollFlip = () => {
  cardScrollFrame = 0;
  if (!flipCard || !heroSection) return;

  const currentScrollY = window.scrollY;
  const direction = currentScrollY - lastCardScrollY;
  const heroHeight = heroSection.offsetHeight;
  const flipDownAt = Math.min(150, Math.max(72, window.innerHeight * 0.09));

  if (currentScrollY >= flipDownAt) {
    cardHasLeftHero = true;
    if (direction > 0) setCardFlipped(true);
  }

  if (currentScrollY < flipDownAt) {
    if (cardHasLeftHero) setCardFlipped(false);
    cardHasLeftHero = false;
  }

  lastCardScrollY = currentScrollY;
};

window.addEventListener(
  "scroll",
  () => {
    if (cardScrollFrame) return;
    cardScrollFrame = window.requestAnimationFrame(updateCardScrollFlip);
  },
  { passive: true }
);

flipCard?.addEventListener("pointermove", (event) => {
  if (flipCard.getAttribute("aria-pressed") === "true") {
    resetCardMotion();
    return;
  }

  const bounds = flipCard.getBoundingClientRect();
  const pointerX = Math.max(
    0,
    Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)
  );
  const pointerY = Math.max(
    0,
    Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)
  );
  const maskPositionX = Math.max(
    0,
    Math.min(100, ((pointerX - maskWidth / 2) / (100 - maskWidth)) * 100)
  );
  const maskPositionY = Math.max(
    0,
    Math.min(100, ((pointerY - maskHeight / 2) / (100 - maskHeight)) * 100)
  );

  const tiltX = ((50 - pointerY) / 50) * tiltMaxX;
  const tiltY = ((pointerX - 50) / 50) * tiltMaxY;
  cardMotion.target = {
    maskX: maskPositionX,
    maskY: maskPositionY,
    tiltX,
    tiltY,
  };

  if (!cardMotion.active) {
    cardMotion.active = true;
    flipCard.classList.add("is-pointer-tracking");
    cardMotion.frame = window.requestAnimationFrame(renderCardMotion);
  }
});

flipCard?.addEventListener("pointerleave", () => {
  resetCardMotion();
});

const projectVisuals = {
  "customer-service": {
    title: "AI X C端客服",
    description: "AI驱动客服场景体验升级",
    background: 'url("./assets/home-work-customer-service-v3.png") right center / contain no-repeat',
  },
  professional: {
    title: "AI X 专业",
    description: "让专业工作流更快、更清晰",
    background: 'url("./assets/home-work-professional.png") right center / contain no-repeat',
  },
  research: {
    title: "AI X 用户研究",
    description: "从真实洞察出发设计更好的体验",
    background: 'url("./assets/home-work-research.png") right center / contain no-repeat',
  },
  growth: {
    title: "增长玩法",
    description: "通过关键节点设计与活动视觉包装，提升参与意愿和转化效率，推动业务目标落地。",
    background: 'url("./assets/home-work-growth-v2.png") right center / contain no-repeat',
  },
  branding: {
    title: "品牌设计",
    description: "内部玲珑系统logo设计",
    background: 'url("./assets/home-work-branding.png") right center / contain no-repeat',
  },
  "asian-games": {
    title: "亚运会电竞会场",
    description: "2023亚运会相关设计",
    background: 'url("./assets/home-work-asian-games.png") right center / contain no-repeat',
  },
  "spring-festival": {
    title: "春节泛化线会场",
    description: "2024春节设计",
    background: 'url("./assets/home-work-spring-festival.png") right center / contain no-repeat',
  },
  "visual-design": {
    title: "视觉设计",
    description: "直播礼物设计、人物活动海报、物料延展等",
    background: 'url("./assets/home-work-visual-design.png") right center / contain no-repeat',
  },
  "meituan-internship": {
    title: "美团",
    description: "聚焦增长玩法、商详体验优化与品牌视觉建设",
    background: 'url("./assets/home-work-meituan-internship.png") right center / contain no-repeat',
  },
  "kuaishou-internship": {
    title: "快手",
    description: "聚焦大型活动会场、春节项目与运营视觉设计",
    background: 'url("./assets/home-work-kuaishou-internship.png") right center / contain no-repeat',
  },
  "other-project": {
    title: "快抢APP虚拟项目",
    description: "站酷二次项目、点赞收藏99+",
    background: 'url("./assets/home-work-other-project.png") right center / contain no-repeat',
  },
};

const workCompanies = {
  bytedance: [
    {
      id: "customer-service",
      title: "AI X C端客服",
      description: "AI驱动客服场景体验升级",
      url: "./detail.html",
    },
    {
      id: "professional",
      title: "AI X 专业",
      description: "AI驱动设计生产力升级，探索智能化产品与创意设计新范式",
      url: "./detail.html?project=professional",
    },
    {
      id: "research",
      title: "AI X 用户研究",
      description: "AI调研能力建设与平台升级，推动智能访谈及问卷全链路提效",
      url: "./detail.html?project=research",
    },
  ],
  internship: [
    {
      id: "meituan-internship",
      title: "美团",
      description: "聚焦增长玩法、商详体验优化与品牌视觉建设",
      url: "./detail.html?company=internship&project=growth",
    },
    {
      id: "kuaishou-internship",
      title: "快手",
      description: "聚焦大型活动会场、春节项目与运营视觉设计",
      url: "./detail.html?company=internship&project=asian-games",
    },
  ],
  other: [
    {
      id: "other-project",
      title: "快枪APP虚拟项目",
      description: "站酷二次项目、点赞收藏99+",
      url: "./detail.html?company=other&project=other-project",
    },
  ],
};

const activateProject = (projectId) => {
  const project = projectVisuals[projectId] ?? projectVisuals["customer-service"];
  const suppliedImageProjectIds = [
    "customer-service",
    "professional",
    "research",
    "growth",
    "branding",
    "asian-games",
    "spring-festival",
    "visual-design",
    "meituan-internship",
    "kuaishou-internship",
    "other-project",
  ];
  window.clearTimeout(workProjectTimer);
  const visibleProjects = Array.from(workProjects).filter((item) => item.dataset.project);
  const projectToActivate = visibleProjects.find(
    (item) => item.dataset.project === projectId
  );
  if (projectToActivate?.classList.contains("is-active")) {
    projectToActivate.classList.remove("is-active");
    projectToActivate.offsetWidth;
  }
  workSection?.classList.toggle("is-static", visibleProjects.length < 2);
  workProjects.forEach((item) => {
    const isActive = item.dataset.project === projectId;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  const activeProjectLink = projectToActivate?.querySelector(".work-project-link");
  const activeProjectHref = activeProjectLink?.getAttribute("href");
  if (workVisualLink && activeProjectHref) {
    workVisualLink.href = activeProjectHref;
    workVisualLink.setAttribute("aria-label", `查看${project.title}项目详情`);
  }

  if (!workVisual) return;
  const isSuppliedImage = suppliedImageProjectIds.includes(projectId);
  const imageUrl = project.background
    .match(/url\(([^)]+)\)/)?.[1]
    ?.replace(/^['"]|['"]$/g, "") ?? "";
  workVisual.classList.toggle(
    "has-supplied-image",
    isSuppliedImage
  );
  if (workVisualImage) {
    workVisualImage.hidden = !isSuppliedImage || !imageUrl;
    if (imageUrl) workVisualImage.src = imageUrl;
  }
  workVisual.classList.add("is-changing");
  workVisual.style.background = isSuppliedImage ? "transparent" : project.background;
  window.setTimeout(() => {
    workVisual.style.background = isSuppliedImage ? "transparent" : project.background;
    workVisual.setAttribute("aria-label", `${project.title}项目展示`);
    workVisual.classList.remove("is-changing");
  }, 160);

  if (visibleProjects.length < 2 || !workSectionInView || reducedMotion.matches) return;

  workProjectTimer = window.setTimeout(() => {
    const activeIndex = visibleProjects.findIndex(
      (item) => item.dataset.project === projectId
    );
    const nextProject = visibleProjects[(activeIndex + 1) % visibleProjects.length];
    if (nextProject) activateProject(nextProject.dataset.project);
  }, workProjectDuration);
};

const renderWorkCompany = (companyId, shouldActivate = true) => {
  const projects = workCompanies[companyId] ?? workCompanies.bytedance;
  workProjects.forEach((project, index) => {
    const projectData = projects[index];
    const title = project.querySelector(".work-project-title");
    const description = project.querySelector(".work-project-description");
    const link = project.querySelector(".work-project-link");
    if (!title || !description || !link) return;

    project.dataset.project = projectData?.id ?? "";
    project.hidden = !projectData;
    project.setAttribute("aria-hidden", String(!projectData));
    project.classList.toggle("is-active", Boolean(projectData && index === 0));
    project.setAttribute("aria-selected", String(Boolean(projectData && index === 0)));
    if (!projectData) return;

    title.textContent = projectData.title;
    description.textContent = projectData.description;
    if (projectData.url) {
      link.href = projectData.url;
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("aria-disabled");
    } else {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.setAttribute("aria-disabled", "true");
    }
    project.setAttribute("aria-label", `${projectData.title} ${projectData.description}`);
  });

  if (shouldActivate && projects[0]) {
    activateProject(projects[0].id);
  }
};

workTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    workTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });
    workTabsSlider?.update();
    renderWorkCompany(tab.dataset.category);
  });
});

document.querySelectorAll(".work-project-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
    if (link.getAttribute("aria-disabled") === "true" || !link.getAttribute("href")) {
      event.preventDefault();
    }
  });
});

workProjects.forEach((project) => {
  project.addEventListener("click", () => activateProject(project.dataset.project));
  project.addEventListener("keydown", (event) => {
    if (event.target.closest(".work-project-link")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activateProject(project.dataset.project);
  });
});

if (workProjects.length) {
  renderWorkCompany("bytedance");
}

const activateAbout = (aboutId) => {
  window.clearTimeout(aboutTimer);
  const aboutToActivate = Array.from(aboutItems).find(
    (item) => item.dataset.about === aboutId
  );
  if (aboutToActivate?.classList.contains("is-active")) {
    aboutToActivate.classList.remove("is-active");
    aboutToActivate.offsetWidth;
  }
  aboutItems.forEach((item) => {
    const isActive = item.dataset.about === aboutId;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  aboutPanels.forEach((panel) => {
    const isActive = panel.dataset.aboutPanel === aboutId;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  if (!aboutSectionInView || reducedMotion.matches) return;

  const currentIndex = Array.from(aboutItems).findIndex(
    (item) => item.dataset.about === aboutId
  );
  aboutTimer = window.setTimeout(() => {
    const nextItem = aboutItems[(currentIndex + 1) % aboutItems.length];
    if (nextItem) activateAbout(nextItem.dataset.about);
  }, aboutDuration);
};

aboutItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.closest(".about-item-link")) return;
    activateAbout(item.dataset.about);
  });
  item.addEventListener("keydown", (event) => {
    if (event.target.closest(".about-item-link")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activateAbout(item.dataset.about);
  });
});

if (aboutItems.length) activateAbout(aboutItems[0].dataset.about);

const playgroundVisuals = {
  product: {
    background: "transparent",
    label: "产品设计实验",
  },
  creative: {
    background: "transparent",
    label: "创意设计实验",
  },
};

const activatePlayground = (playgroundId) => {
  window.clearTimeout(playgroundTimer);
  const playgroundToActivate = Array.from(playgroundItems).find(
    (item) => item.dataset.playground === playgroundId
  );
  if (playgroundToActivate?.classList.contains("is-active")) {
    playgroundToActivate.classList.remove("is-active");
    playgroundToActivate.offsetWidth;
  }
  playgroundItems.forEach((item) => {
    const isActive = item.dataset.playground === playgroundId;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  playgroundPanels.forEach((panel) => {
    const isActive = panel.dataset.playgroundPanel === playgroundId;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  const visual = playgroundVisuals[playgroundId] ?? playgroundVisuals.product;
  const activePlaygroundLink = playgroundToActivate?.querySelector(".playground-item-link");
  const activePlaygroundHref = activePlaygroundLink?.getAttribute("href");
  if (playgroundVisualLink && activePlaygroundHref) {
    playgroundVisualLink.href = activePlaygroundHref;
    playgroundVisualLink.setAttribute("aria-label", `查看${playgroundToActivate.querySelector(".playground-item-title")?.textContent ?? "AI Playground"}详情`);
  }
  if (playgroundVisual) {
    playgroundVisual.style.background = visual.background;
    playgroundVisual.setAttribute("aria-label", visual.label);
  }

  if (!playgroundSectionInView || reducedMotion.matches) return;

  const currentIndex = Array.from(playgroundItems).findIndex(
    (item) => item.dataset.playground === playgroundId
  );
  playgroundTimer = window.setTimeout(() => {
    const nextItem = playgroundItems[(currentIndex + 1) % playgroundItems.length];
    if (nextItem) activatePlayground(nextItem.dataset.playground);
  }, playgroundDuration);
};

playgroundItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.closest(".playground-item-link")) return;
    activatePlayground(item.dataset.playground);
  });
  item.addEventListener("keydown", (event) => {
    if (event.target.closest(".playground-item-link")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activatePlayground(item.dataset.playground);
  });
});

if (playgroundItems.length) activatePlayground(playgroundItems[0].dataset.playground);

const observeAutoAdvanceSection = ({
  section,
  setInView,
  clearTimer,
  resetToFirst,
}) => {
  if (!section) return;

  if (!("IntersectionObserver" in window)) {
    setInView(true);
    resetToFirst();
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      const isCurrentScreen = entry.isIntersecting && entry.intersectionRatio >= 0.25;
      setInView(isCurrentScreen);
      section.classList.toggle("is-in-view", isCurrentScreen);

      if (isCurrentScreen) {
        resetToFirst();
      } else {
        clearTimer();
      }
    },
    { threshold: [0, 0.25] }
  );

  observer.observe(section);
};

observeAutoAdvanceSection({
  section: workSection,
  setInView: (value) => {
    workSectionInView = value;
  },
  clearTimer: () => window.clearTimeout(workProjectTimer),
  resetToFirst: () => {
    const firstProject = Array.from(workProjects).find((item) => item.dataset.project);
    if (firstProject) activateProject(firstProject.dataset.project);
  },
});

observeAutoAdvanceSection({
  section: aboutSection,
  setInView: (value) => {
    aboutSectionInView = value;
  },
  clearTimer: () => window.clearTimeout(aboutTimer),
  resetToFirst: () => {
    if (aboutItems[0]) activateAbout(aboutItems[0].dataset.about);
  },
});

observeAutoAdvanceSection({
  section: playgroundSection,
  setInView: (value) => {
    playgroundSectionInView = value;
  },
  clearTimer: () => window.clearTimeout(playgroundTimer),
  resetToFirst: () => {
    if (playgroundItems[0]) activatePlayground(playgroundItems[0].dataset.playground);
  },
});

const detailPreviewImages = Array.from(
  document.querySelectorAll(
    ".case-content .case-media img, .case-content .other-project-cover:not([href]) img"
  )
);

if (detailPreviewImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "图片预览");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="关闭图片预览">×</button>
    <button class="image-lightbox-nav image-lightbox-prev" type="button" aria-label="查看上一张图片">‹</button>
    <div class="image-lightbox-stage">
      <img class="image-lightbox-image" alt="" draggable="false" />
    </div>
    <button class="image-lightbox-nav image-lightbox-next" type="button" aria-label="查看下一张图片">›</button>
    <div class="image-lightbox-toolbar" aria-label="图片缩放工具栏">
      <button type="button" data-lightbox-zoom-out aria-label="缩小图片">−</button>
      <output class="image-lightbox-zoom" aria-live="polite">100%</output>
      <button type="button" data-lightbox-zoom-in aria-label="放大图片">＋</button>
      <button type="button" data-lightbox-zoom-reset aria-label="恢复原始缩放">1:1</button>
    </div>
    <div class="image-lightbox-counter" aria-live="polite"></div>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector(".image-lightbox-image");
  const lightboxClose = lightbox.querySelector(".image-lightbox-close");
  const lightboxStage = lightbox.querySelector(".image-lightbox-stage");
  const lightboxPrev = lightbox.querySelector(".image-lightbox-prev");
  const lightboxNext = lightbox.querySelector(".image-lightbox-next");
  const zoomOutButton = lightbox.querySelector("[data-lightbox-zoom-out]");
  const zoomInButton = lightbox.querySelector("[data-lightbox-zoom-in]");
  const zoomResetButton = lightbox.querySelector("[data-lightbox-zoom-reset]");
  const zoomOutput = lightbox.querySelector(".image-lightbox-zoom");
  const lightboxCounter = lightbox.querySelector(".image-lightbox-counter");
  let imagePreviewTrigger = null;
  let previousBodyOverflow = "";
  let previewSequence = [];
  let previewIndex = 0;
  let zoomLevel = 1;
  let panX = 0;
  let panY = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartPanX = 0;
  let dragStartPanY = 0;
  let activePointerId = null;

  const getPanLimits = () => ({
    x: Math.max(0, (lightboxImage.clientWidth * zoomLevel - lightboxStage.clientWidth) / 2),
    y: Math.max(0, (lightboxImage.clientHeight * zoomLevel - lightboxStage.clientHeight) / 2),
  });

  const setPan = (nextPanX, nextPanY) => {
    const panLimits = getPanLimits();
    panX = Math.min(panLimits.x, Math.max(-panLimits.x, nextPanX));
    panY = Math.min(panLimits.y, Math.max(-panLimits.y, nextPanY));
    lightboxImage.style.setProperty("--lightbox-pan-x", `${panX}px`);
    lightboxImage.style.setProperty("--lightbox-pan-y", `${panY}px`);
    lightboxStage.classList.toggle(
      "can-pan",
      zoomLevel > 1 && (panLimits.x > 1 || panLimits.y > 1)
    );
  };

  const resetPan = () => setPan(0, 0);

  const setZoom = (nextZoom) => {
    zoomLevel = Math.min(4, Math.max(0.5, Math.round(nextZoom * 4) / 4));
    lightboxImage.style.setProperty("--lightbox-zoom", String(zoomLevel));
    zoomOutput.value = `${Math.round(zoomLevel * 100)}%`;
    lightboxStage.classList.toggle("is-zoomed", zoomLevel > 1);
    window.requestAnimationFrame(() => {
      if (zoomLevel <= 1) resetPan();
      else setPan(panX, panY);
    });
  };

  const renderPreviewImage = () => {
    const image = previewSequence[previewIndex];
    if (!image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "详情图片";
    lightboxCounter.textContent = `${previewIndex + 1} / ${previewSequence.length}`;
    const hasMultipleImages = previewSequence.length > 1;
    lightboxPrev.hidden = !hasMultipleImages;
    lightboxNext.hidden = !hasMultipleImages;
    setZoom(1);
    resetPan();
    lightboxStage.scrollTo({ top: 0, left: 0 });
  };

  const stepPreview = (direction) => {
    if (previewSequence.length < 2) return;
    previewIndex = (previewIndex + direction + previewSequence.length) % previewSequence.length;
    renderPreviewImage();
  };

  const closeImagePreview = () => {
    if (lightbox.hidden) return;
    lightbox.classList.remove("is-open");
    window.setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.removeAttribute("src");
      previewSequence = [];
    }, 180);
    document.body.style.overflow = previousBodyOverflow;
    imagePreviewTrigger?.focus({ preventScroll: true });
  };

  const openImagePreview = (image) => {
    imagePreviewTrigger = image;
    previousBodyOverflow = document.body.style.overflow;
    previewSequence = detailPreviewImages.filter(
      (candidate) => candidate.offsetParent !== null && !candidate.closest("[hidden]")
    );
    if (!previewSequence.includes(image)) previewSequence = [image, ...previewSequence];
    previewIndex = Math.max(0, previewSequence.indexOf(image));
    renderPreviewImage();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      lightboxClose.focus({ preventScroll: true });
    });
  };

  detailPreviewImages.forEach((image) => {
    image.classList.add("is-previewable");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt || "详情图片"}，点击放大查看`);
    image.addEventListener("click", () => openImagePreview(image));
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openImagePreview(image);
    });
  });

  lightboxClose.addEventListener("click", closeImagePreview);
  lightboxPrev.addEventListener("click", () => stepPreview(-1));
  lightboxNext.addEventListener("click", () => stepPreview(1));
  zoomOutButton.addEventListener("click", () => setZoom(zoomLevel - 0.25));
  zoomInButton.addEventListener("click", () => setZoom(zoomLevel + 0.25));
  zoomResetButton.addEventListener("click", () => setZoom(1));
  lightboxStage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      setZoom(zoomLevel + (event.deltaY < 0 ? 0.25 : -0.25));
    },
    { passive: true }
  );
  lightboxImage.addEventListener("load", () => setPan(panX, panY));
  lightboxImage.addEventListener("dragstart", (event) => event.preventDefault());
  lightboxStage.addEventListener("pointerdown", (event) => {
    const panLimits = getPanLimits();
    if (event.button !== 0 || zoomLevel <= 1 || (panLimits.x <= 1 && panLimits.y <= 1)) return;
    event.preventDefault();
    activePointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStartPanX = panX;
    dragStartPanY = panY;
    lightboxStage.setPointerCapture(activePointerId);
    lightboxStage.classList.add("is-dragging");
  });
  lightboxStage.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointerId) return;
    event.preventDefault();
    setPan(
      dragStartPanX + event.clientX - dragStartX,
      dragStartPanY + event.clientY - dragStartY
    );
  });

  const finishLightboxDrag = (event) => {
    if (event.pointerId !== activePointerId) return;
    if (lightboxStage.hasPointerCapture(activePointerId)) {
      lightboxStage.releasePointerCapture(activePointerId);
    }
    activePointerId = null;
    lightboxStage.classList.remove("is-dragging");
    setPan(panX, panY);
  };

  lightboxStage.addEventListener("pointerup", finishLightboxDrag);
  lightboxStage.addEventListener("pointercancel", finishLightboxDrag);
  window.addEventListener("resize", () => {
    if (!lightbox.hidden) setPan(panX, panY);
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeImagePreview();
  });
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeImagePreview();
    if (event.key === "ArrowLeft") stepPreview(-1);
    if (event.key === "ArrowRight") stepPreview(1);
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setZoom(zoomLevel + 0.25);
    }
    if (event.key === "-") {
      event.preventDefault();
      setZoom(zoomLevel - 0.25);
    }
    if (event.key === "0") {
      event.preventDefault();
      setZoom(1);
    }
  });
}

const experienceOpenButton = document.querySelector("[data-experience-open]");
const experienceModal = document.querySelector("[data-experience-modal]");
const experienceCloseButton = document.querySelector("[data-experience-close]");

if (experienceOpenButton && experienceModal && experienceCloseButton) {
  let experiencePreviousOverflow = "";

  const closeExperienceModal = () => {
    if (experienceModal.hidden) return;
    experienceModal.classList.remove("is-open");
    window.setTimeout(() => {
      experienceModal.hidden = true;
    }, 180);
    document.body.style.overflow = experiencePreviousOverflow;
    experienceOpenButton.focus({ preventScroll: true });
  };

  const openExperienceModal = () => {
    experiencePreviousOverflow = document.body.style.overflow;
    experienceModal.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      experienceModal.classList.add("is-open");
      experienceCloseButton.focus({ preventScroll: true });
    });
  };

  experienceOpenButton.addEventListener("click", openExperienceModal);
  experienceCloseButton.addEventListener("click", closeExperienceModal);
  experienceModal.addEventListener("click", (event) => {
    if (event.target === experienceModal) closeExperienceModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !experienceModal.hidden) closeExperienceModal();
  });
}

if (document.documentElement.classList.contains("homepage-root")) {
  const homepageSlides = [
    heroSection,
    workSection,
    aboutSection,
    playgroundSection,
    document.querySelector("#footer"),
  ].filter(Boolean);

  let keyboardSlideLocked = false;
  let heroWheelLastEventAt = Number.NEGATIVE_INFINITY;
  const heroWheelGestureGap = 90;

  const getHeaderOffset = () => siteHeader?.getBoundingClientRect().height || 0;
  const getCurrentSlideIndex = () => {
    const anchorY = getHeaderOffset() + 2;
    const containingIndex = homepageSlides.findIndex((slide) => {
      const rect = slide.getBoundingClientRect();
      return rect.top <= anchorY && rect.bottom > anchorY;
    });

    if (containingIndex !== -1) return containingIndex;

    return homepageSlides.reduce((closestIndex, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().top - anchorY);
      const closestDistance = Math.abs(
        homepageSlides[closestIndex].getBoundingClientRect().top - anchorY
      );
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  };

  const goToHomepageSlide = (index) => {
    const nextIndex = Math.max(0, Math.min(homepageSlides.length - 1, index));
    const target = homepageSlides[nextIndex];
    if (!target || keyboardSlideLocked) return;

    keyboardSlideLocked = true;
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => {
      keyboardSlideLocked = false;
    }, reducedMotion.matches ? 80 : 500);
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        event.deltaY <= 0 ||
        Math.abs(event.deltaY) < 1.5
      ) {
        return;
      }
      if (
        document.querySelector(".image-lightbox:not([hidden])") ||
        document.querySelector(".experience-modal:not([hidden])")
      ) {
        return;
      }

      const currentIndex = getCurrentSlideIndex();
      if (currentIndex !== 0) return;

      const now = performance.now();
      const isNewGesture = now - heroWheelLastEventAt > heroWheelGestureGap;
      heroWheelLastEventAt = now;
      event.preventDefault();

      // Consume every wheel event belonging to the same physical gesture so
      // the first downward gesture only flips the card. A fresh gesture then
      // advances to Work Projects.
      if (!isNewGesture) return;

      const isFlipped = flipCard?.getAttribute("aria-pressed") === "true";
      if (!isFlipped) {
        setCardFlipped(true);
        return;
      }

      goToHomepageSlide(1);
    },
    { passive: false }
  );

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (
      event.target instanceof Element &&
      event.target.closest("input, textarea, select, button, a, [contenteditable='true']")
    ) {
      return;
    }
    if (
      document.querySelector(".image-lightbox:not([hidden])") ||
      document.querySelector(".experience-modal:not([hidden])")
    ) {
      return;
    }

    const currentIndex = getCurrentSlideIndex();
    let targetIndex = null;

    if (event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey)) {
      const isFlipped = flipCard?.getAttribute("aria-pressed") === "true";
      if (currentIndex === 0 && !isFlipped) {
        event.preventDefault();
        setCardFlipped(true);
        return;
      }
      targetIndex = currentIndex + 1;
    } else if (event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey)) {
      targetIndex = currentIndex - 1;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = homepageSlides.length - 1;
    }

    if (targetIndex === null) return;
    event.preventDefault();
    goToHomepageSlide(targetIndex);
  });
}

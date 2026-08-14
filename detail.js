const detailCompanyTabs = Array.from(document.querySelectorAll("[data-detail-company]"));
const detailOutline = document.querySelector("[data-detail-outline]");
const detailCategoryTitle = document.querySelector("[data-detail-category-title]");
const detailMain = document.querySelector("[data-detail-main]");
const detailProfessional = document.querySelector("[data-detail-professional]");
const detailResearch = document.querySelector("[data-detail-research]");
const detailInternship = document.querySelector("[data-detail-internship]");
const detailMeituan = document.querySelector("[data-detail-meituan]");
const detailKuaishou = document.querySelector("[data-detail-kuaishou]");
const detailOther = document.querySelector("[data-detail-other]");
let activeDetailCompany = "bytedance";
let activeDetailProject = "customer-service";
let activeCustomerSection = "cs-context";
let activeProfessionalSection = "pro-context";
let activeResearchSection = null;
let scrollFrame = 0;
let isScrollSyncReady = false;

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const detailCompanyProjects = {
  bytedance: [
    { id: "customer-service", title: "AI X C端客服", description: "AI驱动客服场景体验升级" },
    { id: "professional", title: "AI X 专业", description: "AI驱动设计生产力升级，探索智能化产品与创意设计新范式" },
    { id: "research", title: "AI X 用户研究", description: "AI调研能力建设与平台升级，推动智能访谈及问卷全链路提效" },
  ],
  internship: [
    { id: "growth", title: "增长玩法", description: "通过关键节点设计与活动视觉包装，提升参与意愿和转化效率" },
    { id: "branding", title: "品牌设计", description: "内部玲珑系统 Logo 设计" },
    { id: "asian-games", title: "亚运会电竞会场", description: "2023 亚运会相关设计" },
    { id: "spring-festival", title: "春节泛化线会场", description: "2024 春节设计" },
  ],
  other: [
    { id: "other-project", title: "快枪APP虚拟项目", description: "站酷二次项目、点赞收藏99+" },
  ],
};

const getResearchSections = () => Array.from(detailResearch?.querySelectorAll(".research-project") ?? []);

const setVisibleCategory = (companyId, projectId) => {
  if (companyId === "bytedance") {
    if (detailMain) detailMain.hidden = projectId !== "customer-service";
    if (detailProfessional) detailProfessional.hidden = projectId !== "professional";
    if (detailResearch) detailResearch.hidden = projectId !== "research";
    return;
  }
  if (companyId === "internship") {
    if (detailInternship) detailInternship.hidden = false;
    const isMeituan = ["growth", "branding"].includes(projectId);
    const isKuaishou = ["asian-games", "spring-festival"].includes(projectId);
    if (detailMeituan) detailMeituan.hidden = !isMeituan;
    if (detailKuaishou) detailKuaishou.hidden = !isKuaishou;
    return;
  }
  if (detailOther) detailOther.hidden = companyId !== "other";
};

const setVisibleInternalProject = (projectId, sectionId = null) => {
  if (projectId === "professional") {
    if (detailProfessional) detailProfessional.hidden = false;
  }
  if (projectId === "research") {
    getResearchSections().forEach((section) => {
      section.hidden = false;
    });
    detailResearch?.querySelectorAll(".case-divider").forEach((divider) => {
      divider.hidden = true;
    });
  }
  if (["growth", "branding"].includes(projectId)) {
    detailMeituan?.querySelectorAll("[data-meituan-project]").forEach((section) => {
      section.hidden = false;
    });
    detailKuaishou?.querySelectorAll("[data-kuaishou-project]").forEach((section) => {
      section.hidden = true;
    });
  }
  if (["asian-games", "spring-festival"].includes(projectId)) {
    detailMeituan?.querySelectorAll("[data-meituan-project]").forEach((section) => {
      section.hidden = true;
    });
    detailKuaishou?.querySelectorAll("[data-kuaishou-project]").forEach((section) => {
      section.hidden = false;
    });
  }
  if (projectId === "other-project") {
    detailOther?.removeAttribute("hidden");
  }
};

const getDetailSidebarModel = (companyId, projectId) => {
  if (companyId === "bytedance") {
    if (projectId === "professional") {
      return {
        key: "professional",
        title: "AI X 专业",
        items: [
          { key: "pro-context", title: "背景与挑战", description: "从单点交付到智能化生产" },
          { key: "pro-product", title: "产品设计", description: "设计系统与 AI 生产能力" },
          { key: "pro-creative", title: "创意设计", description: "AIGC 视觉与体验创新" },
          { key: "pro-summary", title: "总结", description: "可被 AI 调用的设计生产力" },
        ],
      };
    }
    if (projectId === "research") {
      return {
        key: "research",
        title: "AI X 用户研究",
        items: [
          { key: "authoring", title: "扣子用研 Agent 创编能力升级", description: "多题型配置与多模态作答体验" },
          { key: "analysis", title: "扣子用研 Agent 回收能力升级", description: "回收分析与报告产出体验" },
        ],
      };
    }
    return {
      key: "customer-service",
      title: "AI X C端客服",
      items: [
        { key: "cs-context", title: "背景与挑战", description: "从 Answer 到 Assist，再到 Agent" },
        { key: "cs-ui", title: "AI 生成 UI", description: "Text2UI / A2UI Engine" },
        { key: "cs-flow", title: "AI 增强服务流程", description: "VOIP 与 SMB 智能服务接入" },
        { key: "cs-role", title: "AI 角色化服务", description: "建立人格化的信任连接" },
        { key: "cs-summary", title: "总结", description: "下一代智能客服体验范式" },
      ],
    };
  }

  if (companyId === "internship") {
    const isKuaishou = ["asian-games", "spring-festival"].includes(projectId);
    return {
      key: isKuaishou ? "kuaishou" : "meituan",
      title: isKuaishou ? "快手" : "美团",
      items: (isKuaishou ? detailCompanyProjects.internship.slice(2) : detailCompanyProjects.internship.slice(0, 2))
        .map((project) => ({ key: project.id, title: project.title, description: project.description })),
    };
  }

  return {
    key: "other",
    title: "其他",
    items: detailCompanyProjects.other.map((project) => ({ key: project.id, title: project.title, description: project.description })),
  };
};

const syncProjectUrl = (projectId) => {
  let nextUrl;
  if (activeDetailCompany === "bytedance") {
    const nextUrlByProject = {
      "customer-service": "./detail.html",
      professional: "./detail.html?project=professional",
      research: activeResearchSection && activeResearchSection !== "authoring"
        ? `./detail.html?project=research&section=${activeResearchSection}`
        : "./detail.html?project=research",
    };
    nextUrl = nextUrlByProject[projectId] ?? nextUrlByProject["customer-service"];
  } else if (["internship", "other"].includes(activeDetailCompany)) {
    nextUrl = `./detail.html?company=${activeDetailCompany}&project=${projectId}`;
  } else {
    return;
  }
  window.history.replaceState({}, "", nextUrl);
};

const setActiveDetailProject = (projectId, syncUrl = true) => {
  const sidebarModel = getDetailSidebarModel(activeDetailCompany, projectId);
  if (detailOutline && sidebarModel && detailOutline.dataset.sidebarGroup !== sidebarModel.key) {
    activeDetailProject = projectId;
    renderDetailOutline(activeDetailCompany, projectId);
    if (syncUrl) syncProjectUrl(projectId);
    return;
  }
  activeDetailProject = projectId;
  document.querySelectorAll("[data-detail-project]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.detailProject === projectId);
  });
  document.querySelectorAll("[data-detail-section]").forEach((item) => {
    item.classList.toggle(
      "is-active",
      (projectId === "professional" && item.dataset.detailSection === activeProfessionalSection) ||
      (projectId === "research" && item.dataset.detailSection === activeResearchSection) ||
      (projectId === "customer-service" && item.dataset.detailSection === activeCustomerSection),
    );
  });
  if (syncUrl) syncProjectUrl(projectId);
};

const jumpToDetailProject = (projectId) => {
  const bytedanceTargets = {
    "customer-service": detailMain,
    professional: detailProfessional,
    research: detailResearch,
  };
  let target = bytedanceTargets[projectId];
  if (activeDetailCompany === "internship") {
    target = detailMeituan?.querySelector(`[data-meituan-project="${projectId}"]`)
      ?? detailKuaishou?.querySelector(`[data-kuaishou-project="${projectId}"]`);
  } else if (activeDetailCompany === "other") {
    target = detailOther;
  }
  if (!target) return;
  setVisibleCategory(activeDetailCompany, projectId);
  setVisibleInternalProject(projectId);
  setActiveDetailProject(projectId);
  if (activeDetailCompany === "internship") {
    target.scrollIntoView({ behavior: isScrollSyncReady ? "smooth" : "auto", block: "start" });
  } else {
    window.scrollTo(0, 0);
  }
};

const jumpToProfessionalSection = (sectionId) => {
  const target = document.getElementById(sectionId);
  if (!target) return;
  activeProfessionalSection = sectionId;
  setVisibleCategory("bytedance", "professional");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  renderDetailOutline("bytedance", "professional");
  setActiveDetailProject("professional");
};

const jumpToResearchSection = (sectionId) => {
  const target = document.getElementById(`research-${sectionId}`);
  if (!target) return;
  activeResearchSection = sectionId;
  setVisibleCategory("bytedance", "research");
  setVisibleInternalProject("research", sectionId);
  renderDetailOutline("bytedance", "research");
  setActiveDetailProject("research");
  target.scrollIntoView({ behavior: isScrollSyncReady ? "smooth" : "auto", block: "start" });
};

const renderDetailOutline = (companyId, selectedProjectId) => {
  const model = getDetailSidebarModel(companyId, selectedProjectId);
  if (!detailOutline || !model) return;
  activeDetailProject = selectedProjectId ?? model.items[0]?.key;
  detailOutline.dataset.sidebarGroup = model.key;
  if (detailCategoryTitle) detailCategoryTitle.textContent = model.title;

  detailOutline.replaceChildren(
    ...model.items.map((project) => {
      const canOpenDetail =
        companyId === "internship" || companyId === "other" ||
        (companyId === "bytedance" && ["customer-service", "professional", "research"].includes(selectedProjectId));
      const item = document.createElement(canOpenDetail ? "button" : "div");
      const isProfessional = companyId === "bytedance" && selectedProjectId === "professional";
      const isResearch = companyId === "bytedance" && selectedProjectId === "research";
      const isCustomerService = companyId === "bytedance" && selectedProjectId === "customer-service";
      const isActive = isProfessional
        ? project.key === (activeProfessionalSection ?? "pro-context")
        : isResearch
          ? project.key === (activeResearchSection ?? "authoring")
          : isCustomerService
            ? project.key === activeCustomerSection
            : project.key === activeDetailProject;
      item.className = `outline-item${isActive ? " is-active" : ""}`;
      if (isProfessional || isResearch || isCustomerService) item.dataset.detailSection = project.key;
      else item.dataset.detailProject = selectedProjectId === "customer-service" ? "customer-service" : project.key;

      if (canOpenDetail) {
        item.type = "button";
        item.addEventListener("click", () => {
          if (isProfessional) {
            jumpToProfessionalSection(project.key);
          } else if (isResearch) {
            jumpToResearchSection(project.key);
          } else if (isCustomerService) {
            activeCustomerSection = project.key;
            document.getElementById(project.key)?.scrollIntoView({ behavior: "smooth", block: "start" });
            renderDetailOutline("bytedance", "customer-service");
          } else {
            activeProfessionalSection = null;
            jumpToDetailProject(project.key);
          }
        });
      }

      const title = document.createElement("strong");
      const description = document.createElement("span");
      title.textContent = project.title;
      description.textContent = project.description;
      item.append(title, description);
      return item;
    })
  );
};

const activateDetailCompany = (companyId) => {
  activeDetailCompany = companyId;
  activeResearchSection = null;
  detailCompanyTabs.forEach((tab) => {
    const isActive = tab.dataset.detailCompany === companyId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (detailOutline) detailOutline.hidden = false;
  if (detailMain) detailMain.hidden = companyId !== "bytedance";
  if (detailProfessional) detailProfessional.hidden = companyId !== "bytedance";
  if (detailResearch) detailResearch.hidden = companyId !== "bytedance";
  if (detailInternship) detailInternship.hidden = companyId !== "internship";
  if (detailOther) detailOther.hidden = companyId !== "other";

  const firstProjectId = detailCompanyProjects[companyId]?.[0]?.id;
  renderDetailOutline(companyId, firstProjectId);
  syncProjectUrl(firstProjectId);
};

const updateProjectFromScroll = () => {
  scrollFrame = 0;
  if (activeDetailCompany === "internship") {
    const visibleArticle = detailMeituan && !detailMeituan.hidden ? detailMeituan : detailKuaishou;
    const projectSelector = visibleArticle === detailMeituan ? "[data-meituan-project]" : "[data-kuaishou-project]";
    const sections = Array.from(visibleArticle?.querySelectorAll(projectSelector) ?? [])
      .filter((section) => !section.hidden && section.getBoundingClientRect().height > 0);
    if (!sections.length) return;

    const readingLine = Math.min(window.innerHeight * 0.42, 420);
    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= readingLine) currentSection = section;
    });
    const nextProjectId = currentSection.dataset.meituanProject ?? currentSection.dataset.kuaishouProject;
    if (nextProjectId && nextProjectId !== activeDetailProject) setActiveDetailProject(nextProjectId);
    return;
  }

  // Detail categories remain independent. Long-form customer-service and
  // professional stories only sync their active chapter in the sticky outline.
  if (
    activeDetailCompany !== "bytedance" ||
    !["customer-service", "professional", "research"].includes(activeDetailProject)
  ) return;

  if (activeDetailProject === "research") {
    const sections = getResearchSections().filter((section) => !section.hidden);
    if (!sections.length) return;
    const readingLine = Math.min(window.innerHeight * 0.42, 420);
    let currentSection = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= readingLine) currentSection = section;
    });
    const nextSectionId = currentSection.id.replace("research-", "");
    if (!nextSectionId || nextSectionId === activeResearchSection) return;
    activeResearchSection = nextSectionId;
    document.querySelectorAll("[data-detail-section]").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.detailSection === nextSectionId);
    });
    syncProjectUrl("research");
    return;
  }

  const activeArticle = activeDetailProject === "professional" ? detailProfessional : detailMain;
  if (!activeArticle || activeArticle.hidden) return;

  const sections = Array.from(activeArticle.querySelectorAll(".customer-chapter[id]"));
  if (!sections.length) return;

  // Switch when the next chapter enters the upper reading area. The line sits
  // below the sticky header so the outline changes together with visible copy.
  const readingLine = Math.min(window.innerHeight * 0.42, 420);
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= readingLine) currentSection = section;
  });

  const nextSectionId = currentSection.id;
  const previousSectionId = activeDetailProject === "professional" ? activeProfessionalSection : activeCustomerSection;
  if (!nextSectionId || nextSectionId === previousSectionId) return;

  if (activeDetailProject === "professional") activeProfessionalSection = nextSectionId;
  else activeCustomerSection = nextSectionId;
  document.querySelectorAll("[data-detail-section]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.detailSection === nextSectionId);
  });
};

window.addEventListener("scroll", () => {
  if (!isScrollSyncReady) return;
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateProjectFromScroll);
}, { passive: true });

detailCompanyTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeProfessionalSection = null;
    const companyId = tab.dataset.detailCompany;
    activateDetailCompany(companyId);
    const firstProjectId = detailCompanyProjects[companyId]?.[0]?.id;
    if (["bytedance", "internship", "other"].includes(companyId) && firstProjectId) {
      window.requestAnimationFrame(() => jumpToDetailProject(firstProjectId));
    }
  });
});

if (detailCompanyTabs.length) {
  const searchParams = new URLSearchParams(window.location.search);
  const requestedCompany = searchParams.get("company");
  const initialCompany = requestedCompany === "meituan" || requestedCompany === "kuaishou"
    ? "internship"
    : ["internship", "other"].includes(requestedCompany)
      ? requestedCompany
      : "bytedance";
  const initialProject = searchParams.get("project");
  const validInitialProject = detailCompanyProjects[initialCompany]?.some((project) => project.id === initialProject)
    ? initialProject
    : detailCompanyProjects[initialCompany]?.[0]?.id;
  const requestedProfessionalSection = searchParams.get("section");
  const validProfessionalSection = initialCompany === "bytedance" && validInitialProject === "professional" && ["pro-context", "pro-product", "pro-creative", "pro-summary"].includes(requestedProfessionalSection)
    ? requestedProfessionalSection
    : null;
  const validResearchSection = initialCompany === "bytedance" && validInitialProject === "research" && ["authoring", "analysis"].includes(requestedProfessionalSection)
    ? requestedProfessionalSection
    : null;
  const isCustomerServiceOnly = initialCompany === "bytedance" && validInitialProject === "customer-service";

  activateDetailCompany(initialCompany);
  document.querySelector(".case-page")?.classList.remove("is-single-project");
  const detailSidebar = document.querySelector(".case-sidebar");
  if (detailSidebar) detailSidebar.hidden = false;

  if (isCustomerServiceOnly) {
    activeDetailProject = "customer-service";
    if (detailMain) detailMain.hidden = false;
    if (detailProfessional) detailProfessional.hidden = true;
    if (detailResearch) detailResearch.hidden = true;
    if (detailInternship) detailInternship.hidden = true;
    if (detailOther) detailOther.hidden = true;
    setVisibleCategory("bytedance", "customer-service");
    setVisibleInternalProject("customer-service");
    syncProjectUrl("customer-service");
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => {
      isScrollSyncReady = true;
      updateProjectFromScroll();
    });
  }
  activeProfessionalSection = validProfessionalSection ?? (validInitialProject === "professional" ? "pro-context" : null);
  activeResearchSection = validResearchSection ?? (validInitialProject === "research" ? "authoring" : null);
  if (validInitialProject && !isCustomerServiceOnly) {
    renderDetailOutline(initialCompany, validInitialProject);
    window.requestAnimationFrame(() => {
      if (validProfessionalSection) {
        jumpToProfessionalSection(validProfessionalSection);
      } else if (validResearchSection) {
        jumpToResearchSection(validResearchSection);
      } else {
        jumpToDetailProject(validInitialProject);
      }
      window.requestAnimationFrame(() => {
        isScrollSyncReady = true;
        updateProjectFromScroll();
      });
    });
  } else if (!isCustomerServiceOnly) {
    isScrollSyncReady = true;
    updateProjectFromScroll();
  }
}

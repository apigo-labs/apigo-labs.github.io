import "./editorial.css";
import "./immersive.css";
import "./immersive";

const isEnglish = document.documentElement.lang.startsWith("en");
const uiText = (zh: string, en: string) => (isEnglish ? en : zh);

type Architecture = "community" | "cloud" | "enterprise";

const architectureContent: Record<
  Architecture,
  {
    description: string;
    environment: string;
    chip: string;
    note: string;
    link: string;
    action: string;
  }
> = {
  community: {
    description:
      "在自己的环境运行开源基础组件，使用自有模型 Key。掌握部署、升级与运维节奏。",
    environment: "你的基础设施",
    chip: "开放基础",
    note: "BYOK · 自带模型密钥 · 自主管理基础设施",
    link: `${import.meta.env.BASE_URL}docs/#community`,
    action: "了解 Community 开源计划 ↗",
  },
  cloud: {
    description:
      "通过 APIGO Cloud 的统一 API 接入托管模型，将模型服务的运营交给 APIGO，让团队专注产品。",
    environment: "APIGO 托管环境",
    chip: "托管服务",
    note: "统一 API · 托管模型 · 云端用量与账单",
    link: "https://www.apigo.ai/",
    action: "体验 APIGO Cloud ↗",
  },
  enterprise: {
    description:
      "按企业需求评估 VPC、私有化或混合部署，约定身份集成、数据边界、商业授权与运维责任。",
    environment: "企业专属环境 · 方案示意",
    chip: "按需交付",
    note: "专属模型池 · 商业授权按需集成 · 以交付合同为准",
    link: `${import.meta.env.BASE_URL}enterprise/`,
    action: "了解企业私有化方案 ↗",
  },
};

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.querySelector<HTMLElement>("#main-nav");
function closeMenu(restoreFocus = false) {
  navigation?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", uiText("打开导航", "Open navigation"));
  if (restoreFocus) menuToggle?.focus();
}
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open
      ? uiText("关闭导航", "Close navigation")
      : uiText("打开导航", "Open navigation"),
  );
  navigation?.classList.toggle("open", open);
});
navigation?.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle?.getAttribute("aria-expanded") === "true"
  )
    closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!(event.target as HTMLElement).closest(".site-header")) closeMenu();
});
window
  .matchMedia("(min-width: 951px)")
  .addEventListener("change", () => closeMenu());

const tabs = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-architecture]"),
];
function selectArchitecture(tab: HTMLButtonElement) {
  const key = tab.dataset.architecture as Architecture;
  const content = architectureContent[key];
  if (!content) return;
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  const texts: Record<string, string> = {
    "architecture-description": content.description,
    "diagram-environment": content.environment,
    "diagram-chip": content.chip,
    "diagram-note": content.note,
  };
  Object.entries(texts).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
  document
    .querySelector("#architecture-panel")
    ?.setAttribute("aria-labelledby", tab.id);
  const link = document.querySelector<HTMLAnchorElement>("#architecture-link");
  if (link) {
    link.href = content.link;
    link.textContent = content.action;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectArchitecture(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[nextIndex].focus();
    selectArchitecture(tabs[nextIndex]);
  });
});

const toast = document.querySelector<HTMLElement>(".toast");
let toastTimeout: ReturnType<typeof setTimeout>;
function announce(message: string) {
  if (!toast) return;
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3500);
}

document
  .querySelectorAll<HTMLButtonElement>("[data-copy]")
  .forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copy ?? "");
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent ?? "");
        announce(uiText("已复制到剪贴板", "Copied to clipboard"));
        const label = button.textContent;
        button.textContent = uiText("已复制 ✓", "Copied ✓");
        button.disabled = true;
        setTimeout(() => {
          button.textContent = label;
          button.disabled = false;
        }, 2000);
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection?.removeAllRanges();
        selection?.addRange(range);
        announce(
          uiText(
            "自动复制不可用，已选中内容，请手动复制",
            "Automatic copying is unavailable. The text is selected for manual copying.",
          ),
        );
      }
    });
  });

const form = document.querySelector<HTMLFormElement>("#enterprise-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const company = String(data.get("company") ?? "").trim();
  const requirements = String(data.get("requirements") ?? "").trim();
  if (!company || !requirements) {
    announce("请填写企业名称和需求概述");
    return;
  }
  const body = `企业 / 团队：${company}\n部署方式：${data.get("deployment")}\n\n需求概述：\n${requirements}`;
  const draft = document.querySelector("#inquiry-text");
  if (draft) draft.textContent = body;
  document
    .querySelector<HTMLElement>("#mail-fallback")
    ?.removeAttribute("hidden");
  const subject = encodeURIComponent(`APIGO 企业方案咨询 - ${company}`);
  window.location.href = `mailto:sales@apigo.ai?subject=${subject}&body=${encodeURIComponent(body)}`;
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}

// Keep theme and motion preferences in the current browser only.
const root = document.documentElement;
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeButton = document.querySelector<HTMLButtonElement>(".theme-toggle");
function readPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Keep the current page usable when browser storage is unavailable. */
  }
}
function applyTheme(theme: "light" | "dark") {
  root.dataset.theme = theme;
  const next =
    theme === "dark" ? uiText("浅色", "light") : uiText("深色", "dark");
  const themeLabel = isEnglish
    ? `Switch to ${next} appearance`
    : `切换为${next}外观`;
  themeButton?.setAttribute("aria-label", themeLabel);
  themeButton?.setAttribute("title", themeLabel);
  if (themeButton) {
    themeButton.innerHTML =
      theme === "dark"
        ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      "content",
      document.body.dataset.page === "home"
        ? "#0b0b0e"
        : theme === "dark"
          ? "#131313"
          : "#fafafa",
    );
}
const storedTheme = readPreference("apigo-theme");
applyTheme(
  storedTheme === "dark" || storedTheme === "light"
    ? storedTheme
    : systemTheme.matches
      ? "dark"
      : "light",
);
themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  savePreference("apigo-theme", next);
  applyTheme(next);
});
systemTheme.addEventListener("change", () => {
  if (!readPreference("apigo-theme"))
    applyTheme(systemTheme.matches ? "dark" : "light");
});
const motionButton =
  document.querySelector<HTMLButtonElement>(".motion-toggle");
let motionPaused = readPreference("apigo-motion") === "paused";
function updateMotion() {
  root.dataset.motion =
    motionPaused || reducedMotion.matches ? "paused" : "running";
  if (motionButton) {
    motionButton.setAttribute(
      "aria-pressed",
      String(motionPaused || reducedMotion.matches),
    );
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute(
      "aria-label",
      reducedMotion.matches
        ? uiText(
            "系统已启用减少动画",
            "Reduced motion is enabled by your system",
          )
        : motionPaused
          ? uiText("播放背景动画", "Play background animation")
          : uiText("暂停背景动画", "Pause background animation"),
    );
    motionButton.innerHTML = `<span class="motion-icon" aria-hidden="true">${motionPaused || reducedMotion.matches ? "▷" : "Ⅱ"}</span><span>${reducedMotion.matches ? uiText("减少动画", "Reduced motion") : motionPaused ? uiText("播放动画", "Play animation") : uiText("暂停动画", "Pause animation")}</span>`;
  }
}
updateMotion();
motionButton?.addEventListener("click", () => {
  motionPaused = !motionPaused;
  savePreference("apigo-motion", motionPaused ? "paused" : "running");
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);

const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const routeExamples: Record<string, string> = {
  cost: "在满足任务要求的候选模型中，优先考虑调用成本。",
  latency: "对响应时间敏感的业务，优先考虑可用模型的响应速度。",
  quality: "面向复杂任务，在候选模型中优先考虑质量目标。",
};
document
  .querySelectorAll<HTMLButtonElement>("[data-route-mode]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.routeMode ?? "cost";
      const panel = button.closest<HTMLElement>(".route-visual");
      if (!panel || !routeExamples[mode]) return;
      panel.dataset.route = mode;
      panel
        .querySelectorAll<HTMLButtonElement>("[data-route-mode]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const description = panel.querySelector(".route-explanation");
      if (description) description.textContent = routeExamples[mode];
    });
  });
document
  .querySelectorAll<HTMLElement>(".button, .feature-columns article, .edition")
  .forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      if (!precisePointer.matches || reducedMotion.matches || motionPaused)
        return;
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty(
        "--pointer-x",
        `${event.clientX - rect.left}px`,
      );
      surface.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });
document
  .querySelectorAll(".feature-columns, .edition-grid")
  .forEach((group) => {
    group
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((item, index) =>
        item.style.setProperty("--reveal-delay", `${index * 85}ms`),
      );
  });
let scrollFrame = 0;
function updateScrollProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  root.style.setProperty(
    "--scroll-progress",
    String(distance > 0 ? Math.min(1, scrollY / distance) : 0),
  );
  scrollFrame = 0;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    root.dataset.motion = "paused";
  } else updateMotion();
});

export {};

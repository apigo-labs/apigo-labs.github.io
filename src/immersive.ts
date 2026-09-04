import "./hero-particles";

const immersion = document.querySelector<HTMLElement>(".immersion");
if (immersion) {
  const hero = immersion.querySelector<HTMLElement>(".immersive-hero");
  const chapters = [
    ...immersion.querySelectorAll<HTMLElement>("[data-chapter]"),
  ];
  const links = [
    ...immersion.querySelectorAll<HTMLAnchorElement>("[data-chapter-link]"),
  ];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const isPaused = () =>
    reduce.matches || document.documentElement.dataset.motion === "paused";
  const update = () => {
    frame = 0;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--scene-x", isPaused() ? "0px" : `${pointerX}px`);
      hero.style.setProperty(
        "--scene-y",
        isPaused()
          ? "0px"
          : `${Math.min(90, Math.max(0, -rect.top) * 0.14) + pointerY}px`,
      );
    }
    const current = chapters.find((section) => {
      const r = section.getBoundingClientRect();
      return r.top < innerHeight * 0.55 && r.bottom > innerHeight * 0.45;
    })?.dataset.chapter;
    if (current) document.body.dataset.activeChapter = current;
    else delete document.body.dataset.activeChapter;
    links.forEach((link) => {
      if (link.dataset.chapterLink === current)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  hero?.addEventListener("pointermove", (event) => {
    if (!pointer.matches || isPaused()) return;
    const r = hero.getBoundingClientRect();
    pointerX = ((event.clientX - r.left) / r.width - 0.5) * -15;
    pointerY = ((event.clientY - r.top) / r.height - 0.5) * -10;
    schedule();
  });
  hero?.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    schedule();
  });
  new MutationObserver(schedule).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  reduce.addEventListener("change", schedule);
  update();
}
export {};

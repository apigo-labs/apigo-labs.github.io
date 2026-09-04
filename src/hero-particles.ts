const scene = document.querySelector<HTMLElement>(
  ".immersive-hero .hero-scene-inner",
);

if (scene) {
  const namespace = "http://www.w3.org/2000/svg";
  const element = <K extends keyof SVGElementTagNameMap>(
    tag: K,
    attributes: Record<string, string>,
  ): SVGElementTagNameMap[K] => {
    const node = document.createElementNS(namespace, tag);
    for (const [name, value] of Object.entries(attributes)) {
      node.setAttribute(name, value);
    }
    return node;
  };

  const svg = element("svg", {
    class: "fiber-particles",
    viewBox: "0 0 1672 941",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true",
    focusable: "false",
    fill: "none",
  });
  // Follow the original curved light flow without drawing additional tracks.
  for (let index = 0; index < 22; index++) {
    const y = 660 + index * 12;
    const path = element("path", {
      class: "fiber-particle",
      d: `M-100 ${y} C650 ${y + 30} 900 ${y} 1050 ${y - 270} S1300 ${y - 730} 1850 ${y - 900}`,
      pathLength: "1000",
    });
    path.style.setProperty("--particle", String(index));
    path.style.setProperty("--phase", `${(index * 137.508) % 1000}px`);
    svg.append(path);
  }

  scene.append(svg);
  const hero = scene.closest<HTMLElement>(".immersive-hero")!;
  let inView = true;
  const updateActivity = () => {
    hero.dataset.particlesActive = String(inView && !document.hidden);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        updateActivity();
      },
      { threshold: 0 },
    ).observe(hero);
  }
  document.addEventListener("visibilitychange", updateActivity);
  updateActivity();
}

export {};

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
    class: "digital-flow",
    viewBox: "0 0 1672 941",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true",
    focusable: "false",
    fill: "none",
  });
  const definitions = element("defs", {});
  const grid = element("pattern", {
    id: "signal-grid",
    width: "48",
    height: "48",
    patternUnits: "userSpaceOnUse",
  });
  grid.append(
    element("path", { class: "signal-grid-mark", d: "M24 21V27M21 24H27" }),
  );
  definitions.append(grid);
  svg.append(definitions);
  svg.append(
    element("rect", {
      class: "signal-grid",
      x: "730",
      y: "90",
      width: "950",
      height: "850",
      fill: "url(#signal-grid)",
    }),
    element("path", {
      class: "signal-scan",
      d: "M920 130V850",
    }),
  );

  // Normalized paths keep packet spacing consistent across different lanes.
  for (let index = 0; index < 28; index++) {
    const x = 620 + index * 12;
    const y = 670 + index * 10;
    const path = `M-120 ${y}H${x}L${x + 170} ${y - 170}H${x + 280}L${x + 650} ${y - 540}H1840`;
    const lane = element("g", {
      class: `signal-lane${index % 7 === 0 ? " signal-warm" : index % 3 === 0 ? " signal-violet" : ""}`,
    });
    lane.style.setProperty("--lane", String(index));
    lane.append(
      element("path", {
        class: "signal-track",
        d: path,
        pathLength: "1000",
      }),
      element("path", {
        class: "signal-packets",
        d: path,
        pathLength: "1000",
      }),
    );
    if (index % 4 === 0) {
      lane.append(
        element("rect", {
          class: "signal-node-frame",
          x: String(x + 272),
          y: String(y - 178),
          width: "16",
          height: "16",
        }),
        element("rect", {
          class: "signal-node",
          x: String(x + 277),
          y: String(y - 173),
          width: "6",
          height: "6",
        }),
      );
    }
    svg.append(lane);
  }

  scene.append(svg);
  scene.classList.add("has-digital-flow");
  const hero = scene.closest<HTMLElement>(".immersive-hero")!;
  let inView = true;
  const updateActivity = () => {
    hero.dataset.signalActive = String(inView && !document.hidden);
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

const motionUrl = "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setupTopics();
setupHeader();

if (!reduceMotion) {
  boot();
}

function setupHeader() {
  const header = document.querySelector(".page-home .site-header");
  if (!header) return;
  let frame = 0;
  const update = () => {
    frame = 0;
    header.classList.toggle("is-compact", window.scrollY > 72);
  };
  update();
  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  }, { passive: true });
}

function setupTopics() {
  const topics = document.querySelectorAll("button.topic");
  const sun = document.querySelector(".sun");
  const cards = document.querySelectorAll(".post-card");
  const grid = document.querySelector(".post-grid");
  const live = document.querySelector(".topics-live");
  const empty = document.querySelector(".latest-none");
  if (!topics.length && !sun) return;

  const apply = (id) => {
    let shown = 0;
    cards.forEach((card) => {
      const keys = (card.getAttribute("data-topics") || "").trim().split(/\s+/).filter(Boolean);
      const match = !id || keys.indexOf(id) !== -1;
      const withinCap = Boolean(id) || shown < 4;
      const visible = match && withinCap;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (grid) grid.classList.toggle("is-filtered", Boolean(id));
    if (empty) empty.hidden = !id || shown > 0;
  };

  const selectAll = () => {
    topics.forEach((other) => {
      other.setAttribute("aria-pressed", "false");
      other.classList.remove("is-selected");
    });
    if (sun) {
      sun.setAttribute("aria-pressed", "true");
      sun.classList.add("is-all");
    }
    apply(null);
    if (live) live.textContent = "Alle Beiträge";
  };

  const selectTopic = (topic) => {
    topics.forEach((other) => {
      other.setAttribute("aria-pressed", "false");
      other.classList.remove("is-selected");
    });
    topic.setAttribute("aria-pressed", "true");
    topic.classList.add("is-selected");
    if (sun) {
      sun.setAttribute("aria-pressed", "false");
      sun.classList.remove("is-all");
    }
    apply(topic.getAttribute("data-topic"));
    const label = topic.getAttribute("data-label") || "Thema";
    if (live) live.textContent = label + " ausgewählt";
  };

  if (sun) sun.addEventListener("click", selectAll);

  topics.forEach((topic) => {
    topic.addEventListener("click", () => {
      if (topic.getAttribute("aria-pressed") === "true") selectAll();
      else selectTopic(topic);
    });
  });
}

async function boot() {
  let motion;
  try {
    motion = await import(motionUrl);
  } catch {
    document.documentElement.classList.add("motion-off");
    return;
  }

  const { animate, stagger, inView, scroll } = motion;

  const brand = document.querySelector(".brand");
  if (brand) {
    animate(
      brand,
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    );
  }

  const rules = document.querySelectorAll(".rule");
  if (rules.length) {
    animate(
      rules,
      { transform: ["scaleX(0)", "scaleX(1)"] },
      { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }
    );
  }

  const sun = document.querySelector(".sun");
  if (sun) {
    animate(
      sun,
      { opacity: [0, 1], scale: [0.97, 1] },
      { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    );
  }

  const rings = document.querySelector(".orbit-rings");
  if (rings) {
    animate(rings, { opacity: [0, 1] }, { duration: 0.8, ease: "easeOut" });
  }

  const bubbles = document.querySelectorAll(".topic");
  if (bubbles.length) {
    animate(
      bubbles,
      { opacity: [0, 1], y: [8, 0] },
      { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: stagger(0.06, { startDelay: 0.06 }) }
    );
  }

  const cards = document.querySelectorAll(".post-card");
  if (cards.length) {
    const entrance = animate(
      cards,
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.45, ease: "easeOut", delay: stagger(0.06, { startDelay: 0.12 }) }
    );
    if (entrance && typeof entrance.then === "function") {
      entrance.then(() => {
        cards.forEach((card) => {
          card.style.willChange = "auto";
        });
      });
    }
  }

  const reveals = [...document.querySelectorAll(".reveal")];
  if (reveals.length) {
    inView(
      reveals,
      (element) => {
        const index = reveals.indexOf(element);
        animate(
          element,
          { opacity: [0, 1], y: [12, 0] },
          {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: Math.min(index * 0.05, 0.16),
          }
        );
      },
      { margin: "0px 0px -8% 0px" }
    );
  }

  const bar = document.querySelector(".read-progress");
  const article = document.querySelector(".post");
  if (bar && article && document.documentElement.scrollHeight > window.innerHeight + 64) {
    bar.hidden = false;
    try {
      scroll(animate(bar, { transform: ["scaleX(0)", "scaleX(1)"] }, { ease: "linear" }));
    } catch {
      bar.hidden = true;
    }
  }
}

const motionUrl = "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setupTopics();

if (!reduceMotion) {
  boot();
}

function setupTopics() {
  const topics = document.querySelectorAll("button.topic");
  const cards = document.querySelectorAll(".post-card");
  const grid = document.querySelector(".post-grid");
  const live = document.querySelector(".topics-live");
  const empty = document.querySelector(".latest-none");
  if (!topics.length) return;

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

  topics.forEach((topic) => {
    topic.addEventListener("click", () => {
      const id = topic.getAttribute("data-topic");
      const selected = topic.getAttribute("aria-pressed") === "true";
      topics.forEach((other) => {
        other.setAttribute("aria-pressed", "false");
        other.classList.remove("is-selected");
      });
      if (selected) {
        apply(null);
        if (live) live.textContent = "Alle Beiträge";
        return;
      }
      topic.setAttribute("aria-pressed", "true");
      topic.classList.add("is-selected");
      apply(id);
      const label = topic.getAttribute("data-label") || "Thema";
      if (live) live.textContent = label + " ausgewählt";
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

  const { animate, stagger, inView, hover, scroll } = motion;

  const brand = document.querySelector(".brand");
  if (brand) {
    animate(
      brand,
      { opacity: [0, 1], transform: ["translateY(14px)", "none"] },
      { duration: 0.55, ease: "easeOut" }
    );
  }

  const rules = document.querySelectorAll(".rule");
  if (rules.length) {
    animate(
      rules,
      { transform: ["scaleX(0)", "scaleX(1)"] },
      { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }
    );
  }

  const bubbles = document.querySelectorAll(".topic, .topics-soon");
  if (bubbles.length) {
    animate(
      bubbles,
      { opacity: [0, 1], y: [10, 0] },
      { duration: 0.5, ease: "easeOut", delay: stagger(0.07, { startDelay: 0.08 }) }
    );
  }

  const activeTopics = document.querySelectorAll("button.topic");
  if (activeTopics.length) {
    hover(activeTopics, (element) => {
      const bubble = element.querySelector(".bubble");
      if (!bubble) return;
      bubble.style.willChange = "transform";
      animate(bubble, { scale: 1.045 }, { type: "spring", bounce: 0.16, visualDuration: 0.28 });
      return () => {
        const leave = animate(bubble, { scale: 1 }, { type: "spring", bounce: 0.1, visualDuration: 0.32 });
        if (leave && typeof leave.then === "function") {
          leave.then(() => {
            bubble.style.willChange = "auto";
          });
        }
      };
    });
  }

  const cards = document.querySelectorAll(".post-card");
  if (cards.length) {
    const entrance = animate(
      cards,
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.48, ease: "easeOut", delay: stagger(0.08, { startDelay: 0.16 }) }
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
          { opacity: [0, 1], transform: ["translateY(16px)", "none"] },
          {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: Math.min(index * 0.06, 0.2),
          }
        );
      },
      { margin: "0px 0px -8% 0px" }
    );
  }

  hover("nav a", (element) => {
    const line = element.querySelector(".nav-line");
    if (!line) return;
    animate(line, { transform: "scaleX(1)" }, { duration: 0.22, ease: "easeOut" });
    return () => {
      if (element.getAttribute("aria-current") === "page") return;
      animate(line, { transform: "scaleX(0)" }, { duration: 0.18, ease: "easeIn" });
    };
  });

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

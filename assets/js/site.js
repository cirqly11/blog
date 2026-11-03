const motionUrl = "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setupTopicFilter();

if (!reduceMotion) {
  boot();
}

function setupTopicFilter() {
  const bubbles = [...document.querySelectorAll(".bubble.is-live")];
  if (!bubbles.length) return;

  const cards = [...document.querySelectorAll(".post-card")];
  const heading = document.querySelector("[data-latest-heading]");
  const note = document.querySelector("[data-filter-note]");
  const empty = document.querySelector("[data-empty]");
  const defaultHeading = heading ? heading.textContent : "";

  function apply(slug) {
    bubbles.forEach((bubble) => {
      const on = Boolean(slug) && bubble.dataset.topic === slug;
      bubble.classList.toggle("is-selected", on);
      bubble.setAttribute("aria-pressed", on ? "true" : "false");
    });

    cards.forEach((card) => {
      const topics = (card.dataset.topics || "").split(/\s+/).filter(Boolean);
      card.hidden = Boolean(slug) && !topics.includes(slug);
    });

    const current = bubbles.find((bubble) => bubble.dataset.topic === slug);
    if (heading) heading.textContent = current ? current.dataset.name : defaultHeading;
    if (note) {
      note.textContent = current ? `Beiträge zu ${current.dataset.name}` : "Alle Beiträge";
    }
    if (empty) empty.hidden = cards.some((card) => !card.hidden);
  }

  bubbles.forEach((bubble) => {
    bubble.addEventListener("click", () => {
      const next = bubble.classList.contains("is-selected") ? "" : bubble.dataset.topic;
      apply(next);
      const url = new URL(window.location.href);
      url.hash = next ? next : "";
      const nextUrl = url.pathname + url.search + (next ? `#${next}` : "");
      history.replaceState(null, "", nextUrl);
    });
  });

  const initial = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (initial && bubbles.some((bubble) => bubble.dataset.topic === initial)) {
    apply(initial);
  }
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

  const heroCopy = document.querySelector(".hero-copy");
  if (heroCopy) {
    animate(
      heroCopy,
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

  const liveBubbles = document.querySelectorAll(".bubble.is-live");
  if (liveBubbles.length) {
    hover(liveBubbles, (element) => {
      element.style.willChange = "transform";
      animate(element, { scale: 1.045 }, { type: "spring", bounce: 0.2, visualDuration: 0.32 });
      return () => {
        const leave = animate(element, { scale: 1 }, { type: "spring", bounce: 0.14, visualDuration: 0.36 });
        if (leave && typeof leave.then === "function") {
          leave.then(() => {
            element.style.willChange = "auto";
          });
        } else {
          element.style.willChange = "auto";
        }
      };
    });
  }

  const frame = document.querySelector(".ambient");
  const hero = document.querySelector(".hero");
  if (frame && hero) {
    try {
      scroll(animate(frame, { opacity: [1, 0] }, { ease: "linear" }), {
        target: hero,
        offset: ["start start", "end start"],
      });
    } catch {
      frame.style.opacity = "1";
    }
  }

  const cards = document.querySelectorAll(".post-card");
  if (cards.length) {
    cards.forEach((card) => {
      card.style.willChange = "transform";
    });
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

    hover(cards, (element) => {
      element.style.willChange = "transform";
      animate(element, { y: -3 }, { type: "spring", bounce: 0.18, visualDuration: 0.24 });
      return () => {
        const leave = animate(element, { y: 0 }, { type: "spring", bounce: 0.12, visualDuration: 0.28 });
        if (leave && typeof leave.then === "function") {
          leave.then(() => {
            element.style.willChange = "auto";
          });
        }
      };
    });
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

  hover(".site-header nav a", (element) => {
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

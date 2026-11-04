const motionUrl = "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setupTopics();
setupHeader();

if (!reduceMotion) {
  boot();
}

function setupHeader() {
  const mast = document.querySelector(".page-home .site-header");
  const bar = document.querySelector(".running-head");
  if (!mast || !bar) return;

  let frame = 0;
  let shown = false;

  const title = mast.querySelector(".wordmark");

  const update = () => {
    frame = 0;
    const titleBottom = (title || mast).getBoundingClientRect().bottom;
    if (!shown && titleBottom < 2) shown = true;
    else if (shown && titleBottom > 36) shown = false;
    bar.classList.toggle("is-visible", shown);
    bar.setAttribute("aria-hidden", shown ? "false" : "true");
  };

  update();
  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener("resize", () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  });
}

function setupTopics() {
  const topics = document.querySelectorAll("button.topic");
  const sun = document.querySelector(".sun");
  const cards = document.querySelectorAll(".post-card");
  const grid = document.querySelector(".post-grid");
  const latestBody = document.querySelector(".latest-body");
  const live = document.querySelector(".topics-live");
  const empty = document.querySelector(".latest-none");
  const kicker = document.querySelector(".filter-kicker");
  if (!topics.length && !sun) return;

  if (latestBody) latestBody.style.minHeight = latestBody.offsetHeight + "px";

  const pinScroll = (fn) => {
    const y = window.scrollY;
    fn();
    const restore = () => {
      if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
    };
    restore();
    requestAnimationFrame(() => requestAnimationFrame(restore));
  };

  const focusStill = (button) => {
    button.focus({ preventScroll: true });
  };

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
    if (kicker) {
      kicker.textContent = "Alle Beiträge";
      kicker.classList.remove("is-filtered");
    }
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
    if (kicker) {
      kicker.textContent = label;
      kicker.classList.add("is-filtered");
    }
  };

  const stage = document.querySelector(".orbit-stage");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let hoverPaused = false;
  let held = false;
  let pointerHandled = false;

  const applyPause = () => {
    if (!stage) return;
    const value = hoverPaused || held ? "paused" : "";
    stage.querySelectorAll(".planet, .planet-slot").forEach((el) => {
      el.style.animationPlayState = value;
    });
  };

  if (stage && canHover) {
    stage.addEventListener("pointerenter", () => {
      hoverPaused = true;
      applyPause();
    });
    stage.addEventListener("pointerleave", () => {
      hoverPaused = false;
      applyPause();
    });
  }

  const chooseTopic = (topic) => {
    pinScroll(() => {
      if (topic.getAttribute("aria-pressed") === "true") selectAll();
      else selectTopic(topic);
    });
  };

  if (sun) {
    sun.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      pointerHandled = true;
      focusStill(sun);
      pinScroll(selectAll);
    });
    sun.addEventListener("click", () => {
      if (pointerHandled) {
        pointerHandled = false;
        return;
      }
      pinScroll(selectAll);
    });
  }

  topics.forEach((topic) => {
    topic.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      pointerHandled = true;
      focusStill(topic);
      held = true;
      applyPause();
      chooseTopic(topic);
    });
    topic.addEventListener("pointerup", () => {
      held = false;
      applyPause();
    });
    topic.addEventListener("pointercancel", () => {
      held = false;
      applyPause();
    });
    topic.addEventListener("click", () => {
      if (pointerHandled) {
        pointerHandled = false;
        return;
      }
      chooseTopic(topic);
    });
  });
}

async function boot() {
  let motion;
  try {
    motion = await import(motionUrl);
  } catch {
    return;
  }

  const { animate, scroll } = motion;
  const bar = document.querySelector(".read-progress");
  const article = document.querySelector(".post");
  if (!bar || !article || document.documentElement.scrollHeight <= window.innerHeight + 64) return;

  bar.hidden = false;
  try {
    scroll(animate(bar, { transform: ["scaleX(0)", "scaleX(1)"] }, { ease: "linear" }));
  } catch {
    bar.hidden = true;
  }
}

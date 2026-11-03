const motionUrl = "https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  boot();
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

  const mark = document.querySelector(".mark");
  if (mark) {
    const cells = mark.querySelectorAll("span");
    const style = getComputedStyle(mark);
    const columns = style.gridTemplateColumns.split(" ").filter((part) => part && part !== "none").length;
    const rows = style.gridTemplateRows.split(" ").filter((part) => part && part !== "none").length;
    const delay = columns && rows
      ? stagger(0.045, { grid: [columns, rows], from: "center" })
      : stagger(0.04, { from: "center" });

    animate(
      cells,
      { opacity: [0, 1], transform: ["scale(0.5)", "scale(1)"] },
      { duration: 0.45, ease: "easeOut", delay }
    );

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

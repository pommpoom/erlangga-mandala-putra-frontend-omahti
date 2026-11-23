(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const active = new Set();
  const easing = "cubic-bezier(0.22, 0.61, 0.36, 1)";

  // Every exit path restores the natural layout, including resize and reduced motion.
  const play = (steps, complete) => {
    if (reducedMotion.matches) {
      complete();
      return () => {};
    }

    const animations = steps.map(({ element, frames, duration = 320 }) =>
      element.animate(frames, { duration, easing, fill: "both" })
    );
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      active.delete(finish);
      animations.forEach((animation) => animation.cancel());
      complete();
    };
    active.add(finish);
    Promise.all(animations.map((animation) => animation.finished))
      .then(finish)
      .catch(finish);
    return finish;
  };

  const settle = () => [...active].forEach((finish) => finish());
  window.addEventListener("resize", settle);
  reducedMotion.addEventListener("change", settle);

  (() => {
    const portfolio = document.querySelector(".portfolio");
    if (!portfolio) return;
    const grid = portfolio.querySelector(".portfolio__grid");
    const button = portfolio.querySelector(".portfolio__more");
    const label = portfolio.querySelector(".portfolio__more-label");
    const extraCards = [...portfolio.querySelectorAll(".portfolio__card[hidden]")];
    if (!grid || !button || !label) return;
    let busy = false;

    button.addEventListener("click", () => {
      if (busy) return;
      busy = true;
      const expanded = button.getAttribute("aria-expanded") !== "true";
      const startHeight = grid.getBoundingClientRect().height;
      extraCards.forEach((card) => {
        card.hidden = !expanded;
      });
      const endHeight = grid.getBoundingClientRect().height;
      extraCards.forEach((card) => {
        card.hidden = false;
      });
      button.setAttribute("aria-expanded", String(expanded));
      label.textContent = expanded ? "Show Less" : "Show More";
      grid.classList.add("portfolio__grid--animating");

      play([
        { element: grid, frames: [{ height: `${startHeight}px` }, { height: `${endHeight}px` }] },
        ...extraCards.map((element) => ({
          element,
          duration: expanded ? 320 : 180,
          frames: expanded
            ? [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }]
            : [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(8px)" }],
        })),
      ], () => {
        extraCards.forEach((card) => {
          card.hidden = !expanded;
        });
        grid.classList.remove("portfolio__grid--animating");
        busy = false;
      });
    });
  })();

  (() => {
    const section = document.querySelector(".testimonial-section");
    if (!section) return;
    const viewport = section.querySelector(".testimonial-viewport");
    const track = section.querySelector(".testimonial-track");
    const previous = section.querySelector(".testimonial-nav--previous");
    const next = section.querySelector(".testimonial-nav--next");
    if (!viewport || !track || !previous || !next) return;
    let busy = false;

    const slide = (direction) => {
      if (busy || !track.children.length) return;
      const rotate = () => {
        if (direction === 1) track.append(track.firstElementChild);
        else track.prepend(track.lastElementChild);
      };
      if (reducedMotion.matches) {
        rotate();
        return;
      }
      busy = true;
      const cards = [...track.children];
      const visible = cards.filter((card) => getComputedStyle(card).display !== "none");
      const origin = viewport.getBoundingClientRect().left;
      const slots = visible.map((card) => {
        const rect = card.getBoundingClientRect();
        return { x: rect.left - origin, width: rect.width };
      });
      const gap = parseFloat(getComputedStyle(track).columnGap);
      const outsideLeft = { x: -slots[0].width - gap, width: slots[0].width };
      const last = slots[slots.length - 1];
      const outsideRight = { x: last.x + last.width + gap, width: last.width };
      const layer = document.createElement("div");
      layer.className = "testimonial-motion";
      layer.setAttribute("aria-hidden", "true");
      layer.inert = true;
      const steps = [];
      const addSlide = (card, from, to) => {
        const clone = card.cloneNode(true);
        clone.removeAttribute("id");
        clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
        // Inline display overrides the responsive nth-child visibility on copies only.
        clone.style.display = "block";
        clone.style.position = "absolute";
        clone.style.top = "0";
        clone.style.left = "0";
        layer.append(clone);
        steps.push({
          element: clone,
          duration: 400,
          frames: [
            { transform: `translateX(${from.x}px)`, width: `${from.width}px` },
            { transform: `translateX(${to.x}px)`, width: `${to.width}px` },
          ],
        });
      };
      visible.forEach((card, index) => {
        const target = direction === 1
          ? (slots[index - 1] || outsideLeft)
          : (slots[index + 1] || outsideRight);
        addSlide(card, slots[index], target);
      });
      const incoming = direction === 1
        ? cards[visible.length % cards.length]
        : cards[cards.length - 1];
      addSlide(incoming, direction === 1 ? outsideRight : outsideLeft, direction === 1 ? last : slots[0]);
      viewport.append(layer);
      track.classList.add("testimonial-track--animating");
      play(steps, () => {
        rotate();
        layer.remove();
        track.classList.remove("testimonial-track--animating");
        busy = false;
      });
    };
    next.addEventListener("click", () => slide(1));
    previous.addEventListener("click", () => slide(-1));
  })();

  (() => {
    const section = document.querySelector(".faq-section");
    if (!section) return;
    const items = [...section.querySelectorAll(".faq-item")].map((item) => ({
      trigger: item.querySelector(".faq-trigger"),
      answer: item.querySelector(".faq-answer"),
    }));
    let finish = () => {};

    items.forEach(({ trigger }) => {
      trigger.addEventListener("click", () => {
        finish();
        const open = trigger.getAttribute("aria-expanded") !== "true";
        const steps = [];
        const states = items.map(({ trigger: current, answer }) => {
          const expanded = current === trigger && open;
          const wasExpanded = current.getAttribute("aria-expanded") === "true";
          current.setAttribute("aria-expanded", String(expanded));
          if (expanded !== wasExpanded) {
            answer.hidden = false;
            const height = answer.getBoundingClientRect().height;
            const style = getComputedStyle(answer);
            const collapsed = {
              height: "0px",
              opacity: 0,
              paddingTop: "0px",
              paddingBottom: "0px",
              borderBottomWidth: "0px"
            };
            const natural = {
              height: `${height}px`,
              opacity: 1,
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
              borderBottomWidth: style.borderBottomWidth
            };
            answer.classList.add("faq-answer--animating");
            answer.inert = !expanded;
            answer.setAttribute("aria-hidden", String(!expanded));
            steps.push({ element: answer, frames: expanded ? [collapsed, natural] : [natural, collapsed] });
          }
          return { answer, expanded };
        });
        finish = play(steps, () => {
          states.forEach(({ answer, expanded }) => {
            answer.hidden = !expanded;
            answer.inert = false;
            answer.removeAttribute("aria-hidden");
            answer.classList.remove("faq-answer--animating");
          });
        });
      });
    });
  })();
})();

(() => {
  const section = document.querySelector(".contact-section");
  if (!section) return;

  const form = section.querySelector(".contact-form");
  const status = section.querySelector(".contact-form__status");
  const fields = Array.from(form.querySelectorAll(".contact-form__input"));

  const validateWhitespace = (field) => {
    field.setCustomValidity(
      field.value.length > 0 && !field.value.trim()
        ? "Please enter more than whitespace."
        : ""
    );
  };

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateWhitespace(field);
      status.hidden = true;
      status.textContent = "";
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach(validateWhitespace);
    if (!form.reportValidity()) return;

    status.hidden = false;
    status.textContent = "Ini masih form demo yaa, jadi pesannya belum bisa dikirim.";
  });
})();

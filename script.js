(() => {
  const portfolio = document.querySelector(".portfolio");
  if (!portfolio) return;

  const button = portfolio.querySelector(".portfolio__more");
  const label = portfolio.querySelector(".portfolio__more-label");
  const extraCards = portfolio.querySelectorAll(".portfolio__card[hidden]");
  if (!button || !label) return;

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") !== "true";

    extraCards.forEach((card) => {
      card.hidden = !expanded;
    });

    button.setAttribute("aria-expanded", String(expanded));
    label.textContent = expanded ? "Show Less" : "Show More";
  });
})();

(() => {
  const section = document.querySelector(".testimonial-section");
  if (!section) return;

  const track = section.querySelector(".testimonial-track");
  const previous = section.querySelector(".testimonial-nav--previous");
  const next = section.querySelector(".testimonial-nav--next");
  if (!track || !previous || !next || !track.children.length) return;

  next.addEventListener("click", () => {
    track.append(track.firstElementChild);
  });

  previous.addEventListener("click", () => {
    track.prepend(track.lastElementChild);
  });
})();

(() => {
  const section = document.querySelector(".faq-section");
  if (!section) return;

  const items = Array.from(section.querySelectorAll(".faq-item"), (item) => ({
    trigger: item.querySelector(".faq-trigger"),
    answer: item.querySelector(".faq-answer"),
  }));

  items.forEach(({ trigger }) => {
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") !== "true";

      items.forEach(({ trigger: current, answer }) => {
        const expanded = current === trigger && open;
        current.setAttribute("aria-expanded", String(expanded));
        answer.hidden = !expanded;
      });
    });
  });
})();

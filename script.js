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

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

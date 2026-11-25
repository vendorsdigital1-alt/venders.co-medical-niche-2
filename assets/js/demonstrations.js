(() => {
  const selector = document.querySelector("[data-practice-selector]");
  if (selector) {
    const tabs = Array.from(selector.querySelectorAll("[data-practice-tab]"));
    const panel = selector.querySelector("[role='tabpanel']");
    const image = selector.querySelector("[data-practice-preview-image]");
    const name = selector.querySelector("[data-practice-preview-name]");
    const heading = selector.querySelector("[data-practice-preview-heading]");
    const description = selector.querySelector("[data-practice-preview-description]");
    const link = selector.querySelector("[data-practice-preview-link]");
    const counter = selector.querySelector(".practice-preview-index");

    if (!tabs.length || !panel || !image || !name || !heading || !description || !link || !counter) {
      console.error("The practice preview selector is missing required content.");
    } else {
      const activateTab = (tab, focus = false) => {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute("aria-selected", String(selected));
          item.tabIndex = selected ? 0 : -1;
        });

        panel.setAttribute("aria-labelledby", tab.id);
        name.textContent = tab.dataset.name;
        heading.textContent = tab.dataset.heading;
        description.textContent = tab.dataset.copy;
        link.href = tab.dataset.href;
        link.firstChild.textContent = `Explore the ${tab.textContent.trim().toLowerCase()} concept `;
        image.alt = tab.dataset.imageAlt;
        image.loading = "eager";
        counter.textContent = `${String(tabs.indexOf(tab) + 1).padStart(2, "0")} / ${String(tabs.length).padStart(2, "0")}`;
        image.onerror = () => {
          if (image.src !== new URL(tab.dataset.imageFallback, document.baseURI).href) {
            image.src = tab.dataset.imageFallback;
          } else {
            console.error(`Practice preview image could not be loaded: ${image.src}`);
            image.onerror = null;
          }
        };
        image.src = tab.dataset.imageWebp;
        if (focus) tab.focus();
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tab));
        tab.addEventListener("keydown", (event) => {
          let nextIndex;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (index + 1) % tabs.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = tabs.length - 1;
          } else {
            return;
          }

          event.preventDefault();
          activateTab(tabs[nextIndex], true);
        });
      });

      activateTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
    }
  }

  const filters = document.querySelectorAll("[data-demo-filter]");
  const cards = document.querySelectorAll("[data-demo-category]");
  const status = document.querySelector(".filter-status");

  if (!filters.length || !cards.length) return;

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-demo-filter");
      let visibleCount = 0;

      filters.forEach((item) => {
        const isSelected = item === filter;
        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      cards.forEach((card) => {
        const shouldShow = category === "all" || card.getAttribute("data-demo-category") === category;
        card.hidden = !shouldShow;
        if (shouldShow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          card.classList.remove("is-filtering");
          requestAnimationFrame(() => card.classList.add("is-filtering"));
          window.setTimeout(() => card.classList.remove("is-filtering"), 220);
        }
        if (shouldShow) visibleCount += 1;
      });

      if (status) {
        status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "specialty" : "specialties"}.`;
      }
    });
  });
})();

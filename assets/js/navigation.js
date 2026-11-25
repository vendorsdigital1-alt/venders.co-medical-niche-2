(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const header = document.querySelector(".site-header");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menuButton.getAttribute("aria-expanded") !== "true") return;
      closeMenu();
      menuButton.focus();
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  if (header) {
    const anchorLinks = navigation
      ? Array.from(navigation.querySelectorAll('a[href^="#"]'))
      : [];
    const linkedSections = anchorLinks
      .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
      .filter(({ section }) => section);
    let updatePending = false;

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
      header.style.setProperty("--scroll-progress", String(progress));

      let activeLink = null;
      if (window.scrollY > 12) {
        linkedSections.forEach(({ link, section }) => {
          if (section.getBoundingClientRect().top <= header.offsetHeight + 24) activeLink = link;
        });
      }
      anchorLinks.forEach((link) => {
        if (link === activeLink) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const requestHeaderUpdate = () => {
      if (updatePending) return;
      updatePending = true;
      window.requestAnimationFrame(() => {
        updatePending = false;
        updateHeader();
      });
    };

    updateHeader();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    window.addEventListener("resize", requestHeaderUpdate, { passive: true });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach((section) => {
      section.setAttribute("data-reveal", "");
      observer.observe(section);
    });
  }
})();

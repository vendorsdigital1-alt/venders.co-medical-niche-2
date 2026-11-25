(() => {
  const practice = document.body;
  const phone = practice.dataset.phone || "";
  const phoneHref = phone.trim().replace(/[\s()-]/g, "");
  const validPhone = /^\+?[0-9]{8,15}$/.test(phoneHref);
  const whatsappNumber = (practice.dataset.whatsapp || "").replace(/\D/g, "");
  const validWhatsapp = whatsappNumber.length >= 8 && whatsappNumber.length <= 15;

  const initializeServiceExplorer = () => {
    document.querySelectorAll(".care-cards").forEach((cards, groupIndex) => {
      if (cards.hasAttribute("data-static-services")) return;
      const serviceCards = Array.from(cards.querySelectorAll(".care-card"));
      if (serviceCards.length < 2) return;

      const explorer = document.createElement("div");
      explorer.className = "service-explorer";
      const tabs = document.createElement("div");
      tabs.className = "service-explorer-tabs";
      tabs.setAttribute("role", "tablist");
      tabs.setAttribute("aria-label", "Explore the practice services");

      const panel = document.createElement("section");
      panel.className = "service-explorer-panel";
      panel.id = `service-explorer-${groupIndex + 1}`;
      panel.setAttribute("role", "tabpanel");
      panel.tabIndex = 0;

      const visual = document.createElement("div");
      visual.className = "service-explorer-visual";
      visual.setAttribute("aria-hidden", "true");
      const copy = document.createElement("div");
      copy.className = "service-explorer-copy";
      const kicker = document.createElement("span");
      kicker.className = "care-kicker";
      const heading = document.createElement("h3");
      const description = document.createElement("p");
      let action = document.createElement("a");
      action.className = "text-link";
      copy.append(kicker, heading, description, action);
      panel.append(visual, copy);
      explorer.append(tabs, panel);

      const serviceTabs = serviceCards.map((card, index) => {
        const title = card.querySelector("h3")?.textContent?.trim();
        const icon = card.querySelector(".care-icon")?.textContent?.trim();
        const link = card.querySelector("a");
        if (!title || !icon || !link) {
          console.error("A service card is missing its title, visual, or action.");
          return null;
        }

        const tab = document.createElement("button");
        tab.type = "button";
        tab.id = `service-tab-${groupIndex + 1}-${index + 1}`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panel.id);
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
        tab.dataset.serviceIndex = String(index);

        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");
        const label = document.createElement("span");
        label.textContent = title;
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        tab.append(number, label, arrow);
        tabs.append(tab);
        return { tab, card, title, icon, link };
      });

      const validServices = serviceTabs.filter(Boolean);
      if (validServices.length !== serviceCards.length) return;

      const activateService = (index, focus = false) => {
        const service = validServices[index];
        validServices.forEach(({ tab }, tabIndex) => {
          const selected = tabIndex === index;
          tab.setAttribute("aria-selected", String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        panel.setAttribute("aria-labelledby", service.tab.id);
        visual.textContent = service.icon;
        kicker.textContent = service.card.querySelector(".care-kicker").textContent;
        heading.textContent = service.title;
        description.textContent = service.card.querySelector("p").textContent.trim();
        const originalAction = service.link.cloneNode(true);
        originalAction.className = "text-link";
        action.replaceWith(originalAction);
        action = originalAction;
        if (focus) service.tab.focus();
      };

      validServices.forEach(({ tab }, index) => {
        tab.addEventListener("click", () => activateService(index));
        tab.addEventListener("keydown", (event) => {
          let nextIndex;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (index + 1) % validServices.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (index - 1 + validServices.length) % validServices.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = validServices.length - 1;
          } else {
            return;
          }

          event.preventDefault();
          activateService(nextIndex, true);
        });
      });

      cards.before(explorer);
      cards.hidden = true;
      activateService(0);
    });
  };

  const initializePracticeFooter = () => {
    const footer = document.querySelector(".site-footer");
    const footerBottom = footer?.querySelector(".footer-bottom");
    if (!footer || !footerBottom || footer.querySelector(".footer-directory")) return;

    const privacyNote = footer.querySelector(".compliance-note");
    if (privacyNote) privacyNote.id = "practice-privacy";

    const directory = document.createElement("nav");
    directory.className = "container footer-directory";
    directory.setAttribute("aria-label", "Practice footer navigation");

    const group = (title, items) => {
      const section = document.createElement("section");
      const heading = document.createElement("h2");
      heading.textContent = title;
      const list = document.createElement("ul");
      items.forEach(({ label, href, action, plain }) => {
        const item = document.createElement("li");
        if (plain) {
          const text = document.createElement("p");
          text.textContent = label;
          item.append(text);
          list.append(item);
          return;
        }
        const link = document.createElement("a");
        link.textContent = label;
        link.href = href;
        if (action) link.dataset.practiceAction = action;
        item.append(link);
        list.append(item);
      });
      section.append(heading, list);
      return section;
    };

    const services = Array.from(document.querySelectorAll(".care-card h3")).map((heading) => ({
      label: heading.textContent.trim(),
      href: "#care"
    }));
    const detailCards = Array.from(document.querySelectorAll(".practice-details-grid .practice-card"));
    const locationCard = detailCards.find((card) => card.querySelector("[data-practice-directions]"));
    const hoursCard = detailCards.find((card) => card.querySelector("ul"));
    const address = locationCard?.querySelector("p")?.textContent.trim();
    const hours = Array.from(hoursCard?.querySelectorAll("li") || [])
      .map((item) => item.textContent.trim())
      .join(" · ");

    directory.append(
      group("Explore", [
        { label: "About the practice", href: "#about" },
        { label: "Plan a visit", href: "#practice-details" },
        { label: "Privacy & HPCSA information", href: "#practice-privacy" }
      ]),
      group("Services", services),
      group("Visit the practice", [
        { label: address ? `Address · ${address}` : "Add the verified practice address.", plain: true },
        { label: hours ? `Hours · ${hours}` : "Add the verified opening hours.", plain: true },
        { label: "Full location and hours", href: "#practice-details" }
      ]),
      group("Get in touch", [
        { label: validPhone ? `Call · ${phone}` : "Call · [PRACTICE PHONE]", href: "#practice-details", action: "call" },
        { label: validWhatsapp ? "Message us on WhatsApp" : "WhatsApp · [PRACTICE WHATSAPP NUMBER]", href: "#book", action: "whatsapp" },
        { label: "Request an appointment", href: "#book" }
      ])
    );
    footer.insertBefore(directory, footerBottom);
  };

  initializeServiceExplorer();
  initializePracticeFooter();

  const disableAction = (link, label) => {
    link.href = "#practice-details";
    link.setAttribute("aria-disabled", "true");
    link.title = `Add the practice ${label} before publishing.`;
    link.addEventListener("click", (event) => event.preventDefault());
  };

  document.querySelectorAll('[data-practice-action="call"]').forEach((link) => {
    if (validPhone) {
      link.href = `tel:${phoneHref}`;
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
    } else {
      disableAction(link, "phone number");
    }
  });

  document.querySelectorAll('[data-practice-action="whatsapp"]').forEach((link) => {
    if (validWhatsapp) {
      link.href = `https://wa.me/${whatsappNumber}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");
    } else {
      disableAction(link, "WhatsApp number");
    }
  });

  const directions = practice.dataset.directions || "";
  document.querySelectorAll("[data-practice-directions]").forEach((link) => {
    if (directions) {
      try {
        const url = new URL(directions, window.location.href);
        if (url.protocol !== "https:") {
          console.error("Practice directions URL must use HTTPS.");
          disableAction(link, "directions URL");
          return;
        }
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
        link.removeAttribute("title");
      } catch (error) {
        console.error("Practice directions URL is invalid.", error);
        disableAction(link, "directions URL");
      }
    } else {
      disableAction(link, "address and directions URL");
    }
  });

  const hoursStatuses = document.querySelectorAll("[data-hours-status]");
  const setHoursStatus = (message) => hoursStatuses.forEach((element) => {
    element.textContent = message;
  });
  const scheduleText = practice.dataset.openingHours || "{}";
  let schedule;
  try {
    schedule = JSON.parse(scheduleText);
  } catch (error) {
    console.error("Opening hours must be valid JSON.", error);
    setHoursStatus("Opening hours need to be configured.");
    return;
  }

  if (!hoursStatuses.length) return;

  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    setHoursStatus("Opening hours need to be configured.");
    console.error("Opening hours must be a JSON object.");
    return;
  }

  if (!Object.keys(schedule).length) {
    setHoursStatus("Hours have not been added yet.");
    return;
  }

  const updateHours = () => {
    const parts = new Intl.DateTimeFormat("en-ZA", {
      timeZone: "Africa/Johannesburg",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const key = values.weekday.toLowerCase().slice(0, 3);
    const currentTime = `${values.hour}:${values.minute}`;
    const intervals = schedule[key];

    if (!Array.isArray(intervals)) {
      setHoursStatus("Opening hours need to be configured.");
      console.error(`Opening hours are missing a valid ${key} schedule.`);
      return;
    }

    for (const interval of intervals) {
      if (!Array.isArray(interval) || interval.length !== 2 ||
          !interval.every((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) ||
          interval[0] >= interval[1]) {
        setHoursStatus("Opening hours need to be configured.");
        console.error(`Invalid opening-hours interval for ${key}.`);
        return;
      }
    }

    const openInterval = intervals.find(([start, end]) => currentTime >= start && currentTime < end);
    if (openInterval) {
      setHoursStatus(`Open now · closes at ${openInterval[1]}`);
    } else {
      setHoursStatus("Closed now");
    }
  };

  updateHours();
  window.setInterval(updateHours, 60_000);
})();

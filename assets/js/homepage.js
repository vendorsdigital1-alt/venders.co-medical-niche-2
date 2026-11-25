(() => {
  const contactDialog = document.querySelector(".home-contact-dialog");
  if (contactDialog instanceof HTMLDialogElement) {
    contactDialog.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      contactDialog.close();
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const contactLink = event.target.closest('a[href="#contact"]');
      if (!contactLink) return;
      event.preventDefault();
      if (!contactDialog.open) contactDialog.showModal();
    });

    contactDialog.querySelector("[data-contact-close]")?.addEventListener("click", () => {
      contactDialog.close();
    });

    contactDialog.addEventListener("click", (event) => {
      if (event.target === contactDialog) contactDialog.close();
    });
  }

  const faqLink = document.querySelector('.home-footer-main a[href="#faq"]');
  const faqDetails = document.querySelector(".home-nav-faq");
  faqLink?.addEventListener("click", () => {
    if (faqDetails instanceof HTMLDetailsElement) faqDetails.open = true;
  });
})();

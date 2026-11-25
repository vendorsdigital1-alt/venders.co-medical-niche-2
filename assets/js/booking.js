(() => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);

  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = localToday;
  });

  const clearError = (field) => {
    const error = field.parentElement.querySelector("[data-field-error]");
    if (error) error.remove();
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  };

  const showError = (field) => {
    clearError(field);
    const error = document.createElement("span");
    error.className = "form-field-error";
    error.dataset.fieldError = "";
    error.id = `${field.name || "field"}-error`;
    error.textContent = field.validity.valueMissing
      ? "Please complete this field."
      : field.validationMessage;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", error.id);
    field.insertAdjacentElement("afterend", error);
  };

  document.querySelectorAll("[data-booking-form]").forEach((form) => {
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    form.noValidate = true;
    fields.forEach((field) => field.addEventListener("input", () => clearError(field)));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!(form instanceof HTMLFormElement)) return;

      const invalidFields = fields.filter((field) => !field.checkValidity());
      if (invalidFields.length) {
        invalidFields.forEach(showError);
        invalidFields[0].focus();
        return;
      }

      const feedback = form.querySelector("[data-form-feedback]");
      const whatsapp = document.body.dataset.whatsapp?.replace(/\D/g, "");
      if (whatsapp && whatsapp.length >= 8 && whatsapp.length <= 15) {
        const values = new FormData(form);
        const message = [
          `Hello, I’d like to request an appointment with ${document.body.dataset.practice || "the practice"}.`,
          `My name is ${values.get("name")}.`,
          `My preferred date is ${values.get("date")}.`,
          "Please let me know what times are available."
        ].join("\n");
        const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        if (feedback) feedback.textContent = "Your request is ready in WhatsApp. The website does not store your details.";
      } else if (feedback) {
        feedback.textContent = "Thanks — this demo is ready to use, but no details are sent or stored until a practice WhatsApp number is added.";
      }
      form.reset();
      form.querySelector('input[type="date"]')?.setAttribute("min", localToday);
    });
  });
})();

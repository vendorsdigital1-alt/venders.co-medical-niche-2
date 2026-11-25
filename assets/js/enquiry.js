(() => {
  document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));
    form.noValidate = true;
    const clearError = (field) => {
      const error = field.parentElement.querySelector("[data-field-error]");
      if (error) error.remove();
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => clearError(field));
      field.addEventListener("change", () => clearError(field));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!(form instanceof HTMLFormElement)) return;

      const invalidFields = fields.filter((field) => !field.checkValidity());
      if (invalidFields.length) {
        invalidFields.forEach((field) => {
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
        });
        invalidFields[0].focus();
        return;
      }

      const feedback = form.querySelector("[data-form-feedback]");
      if (feedback) {
        feedback.textContent = "Thanks for your interest. This demo does not transmit or store your information.";
      }
      form.reset();
    });
  });
})();

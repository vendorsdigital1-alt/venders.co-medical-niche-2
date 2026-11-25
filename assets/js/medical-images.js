const imageDirectory = new URL("../images/medical/", document.currentScript.src);
const supportsWebp = (() => {
  const canvas = document.createElement("canvas");
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
})();
const imageFiles = Object.freeze({
  hero: "medical-gp-consultation",
  professional: "medical-professional.svg",
  dental: "medical-dental-room",
  general: "medical-gp-consultation",
  dermatology: "medical-dermatology-room",
  physiotherapy: "medical-physiotherapy-session",
  psychology: "medical-psychology-room",
  optometry: "medical-optometry-showroom",
  booking: "medical-psychology-room",
  showcase: "medical-care-collage",
});

document.querySelectorAll("[data-medical-image], [data-medical-background]").forEach((element) => {
  const backgroundKey = element.getAttribute("data-medical-background");
  const key = backgroundKey || element.getAttribute("data-medical-image");
  const file = imageFiles[key];
  if (!file) return;

  if (file.endsWith(".svg")) {
    const url = new URL(file, imageDirectory).href;
    if (backgroundKey) {
      element.style.backgroundImage = `url("${url}")`;
    } else if (element instanceof HTMLImageElement) {
      element.src = url;
    }
    return;
  }

  const preferred = new URL(`${file}.${supportsWebp ? "webp" : "jpg"}`, imageDirectory).href;
  const fallback = new URL(`${file}.jpg`, imageDirectory).href;
  if (backgroundKey) {
    element.style.backgroundImage = `url("${preferred}")`;
    if (supportsWebp) {
      const probe = new Image();
      probe.addEventListener("error", () => {
        element.style.backgroundImage = `url("${fallback}")`;
        console.error(`WebP image unavailable; using JPEG fallback for "${key}".`);
      }, { once: true });
      probe.src = preferred;
    }
  } else if (element instanceof HTMLImageElement) {
    element.addEventListener("error", () => {
      if (element.src !== fallback) {
        element.src = fallback;
        console.error(`WebP image unavailable; using JPEG fallback for "${key}".`);
      } else {
        console.error(`Healthcare image could not be loaded: ${fallback}`);
      }
    });
    element.src = preferred;
  }
});

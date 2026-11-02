// Runs in the head before paint; the same implementation also wires the control.
(() => {
  const key = "theme-preference";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = (value) => ["light", "dark", "system"].includes(value);
  let mode = "system";
  try {
    const stored = window.localStorage.getItem(key);
    if (valid(stored)) mode = stored;
  } catch {
    /* Preferences are optional when storage is blocked. */
  }

  const apply = () => {
    const root = document.documentElement;
    const dark = mode === "dark" || (mode === "system" && media.matches);
    if (mode === "system") root.removeAttribute("data-theme");
    else root.dataset.theme = mode;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.hidden = false;
    button.dataset.mode = mode;
    const label = `${button.dataset[mode]} — ${button.dataset.action}`;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.querySelectorAll("[data-icon]").forEach((icon) => {
      icon.hidden = icon.dataset.icon !== mode;
    });
  };
  apply();
  media.addEventListener("change", apply);
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      apply();
      document
        .querySelector("[data-theme-toggle]")
        ?.addEventListener("click", () => {
          mode = { system: "light", light: "dark", dark: "system" }[mode];
          try {
            if (mode === "system") window.localStorage.removeItem(key);
            else window.localStorage.setItem(key, mode);
          } catch {
            /* The current page can still change theme. */
          }
          apply();
        });
    },
    { once: true },
  );
})();

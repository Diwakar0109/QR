export const showMessage = (el, message, type = "success") => {
  el.classList.remove("hidden", "alert-error");
  el.textContent = message;
  if (type === "error") {
    el.classList.add("alert-error");
  }
};

export const hideMessage = (el) => {
  el.classList.add("hidden");
  el.textContent = "";
};

export const setLoading = (button, isLoading, text = "Please wait...") => {
  if (!button) {
    return;
  }
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }
  button.disabled = Boolean(isLoading);
  button.textContent = isLoading ? text : button.dataset.originalText;
};

export const toDate = (value) => new Date(value).toLocaleString();

export const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");


import { hideMessage, setLoading, showMessage } from "../components/ui.js";

export const createAuthScreen = ({ api, onLoggedIn }) => {
  const authForm = document.getElementById("authForm");
  const authToggle = document.getElementById("authToggle");
  const authTitle = document.getElementById("authTitle");
  const nameField = document.getElementById("nameField");
  const roleField = document.getElementById("roleField");
  const authError = document.getElementById("authError");
  const authSubmit = document.getElementById("authSubmit");

  let signupMode = false;

  const setMode = (isSignup) => {
    signupMode = isSignup;
    authTitle.textContent = isSignup ? "Create Account" : "Login";
    authSubmit.textContent = isSignup ? "Create Account" : "Login";
    authToggle.textContent = isSignup
      ? "Already have account? Login"
      : "New user? Create account";
    nameField.classList.toggle("hidden", !isSignup);
    roleField.classList.toggle("hidden", !isSignup);
    hideMessage(authError);
  };

  authToggle.addEventListener("click", () => setMode(!signupMode));

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(authError);
    setLoading(authSubmit, true);

    try {
      const form = new FormData(authForm);
      const email = String(form.get("email") || "").trim();
      const password = String(form.get("password") || "").trim();

      let payload;
      let result;

      if (signupMode) {
        payload = {
          name: String(form.get("name") || "").trim(),
          email,
          password,
          role: String(form.get("role") || "student")
        };
        result = await api.signup(payload);
      } else {
        payload = { email, password };
        result = await api.login(payload);
      }

      api.setToken(result.token);
      onLoggedIn(result.user);
    } catch (error) {
      showMessage(authError, error.message, "error");
    } finally {
      setLoading(authSubmit, false);
    }
  });

  return {
    setMode
  };
};


import { ApiClient } from "./services/api.js";
import { createAuthScreen } from "./screens/auth.js";
import { createDashboard } from "./screens/dashboard.js";

const API_BASE_URL = "/api";
const api = new ApiClient(API_BASE_URL);

const screens = {
  splash: document.getElementById("splash"),
  auth: document.getElementById("auth"),
  dashboard: document.getElementById("dashboard")
};

const showScreen = (name) => {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen-active"));
  screens[name].classList.add("screen-active");
};

let dashboard = null;

const logout = () => {
  api.setToken("");
  dashboard = null;
  showScreen("auth");
};

const startDashboard = (user) => {
  showScreen("dashboard");
  dashboard = createDashboard({ api, currentUser: user, onLogout: logout });
  dashboard.init();
};

const bootstrap = async () => {
  showScreen("splash");

  createAuthScreen({
    api,
    onLoggedIn: (user) => startDashboard(user)
  }).setMode(false);

  setTimeout(async () => {
    if (!api.token) {
      showScreen("auth");
      return;
    }

    try {
      const result = await api.me();
      startDashboard(result.user);
    } catch (_error) {
      api.setToken("");
      showScreen("auth");
    }
  }, 1000);
};

bootstrap();


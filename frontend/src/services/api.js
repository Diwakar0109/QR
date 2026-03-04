export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("qr_token") || "";
  }

  setToken(token) {
    this.token = token || "";
    if (this.token) {
      localStorage.setItem("qr_token", this.token);
    } else {
      localStorage.removeItem("qr_token");
    }
  }

  async request(path, options = {}) {
    const headers = {
      ...(options.headers || {})
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = data?.message || "Request failed";
      throw new Error(message);
    }
    return data;
  }

  signup(payload) {
    return this.request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  login(payload) {
    return this.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  me() {
    return this.request("/auth/me");
  }

  users() {
    return this.request("/auth/users");
  }

  getServerIp() {
    return this.request("/ip");
  }

  getRecords() {
    return this.request("/qrs");
  }

  createRecord(formData) {
    return this.request("/qrs", { method: "POST", body: formData });
  }

  updateRecord(id, formData) {
    return this.request(`/qrs/${id}`, { method: "PUT", body: formData });
  }

  deleteRecord(id) {
    return this.request(`/qrs/${id}`, { method: "DELETE" });
  }
}


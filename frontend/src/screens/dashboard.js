import { hideMessage, setLoading, showMessage, toDate, escapeHtml } from "../components/ui.js";

export const createDashboard = ({ api, currentUser, onLogout }) => {
  const userInfo = document.getElementById("userInfo");
  const refreshBtn = document.getElementById("refreshBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const globalMessage = document.getElementById("globalMessage");
  const qrForm = document.getElementById("qrForm");
  const clearFormBtn = document.getElementById("clearFormBtn");
  const recordList = document.getElementById("recordList");
  const recordCount = document.getElementById("recordCount");
  const usersList = document.getElementById("usersList");
  const adminPanel = document.getElementById("adminPanel");
  const loadUsersBtn = document.getElementById("loadUsersBtn");
  const qrTextInput = document.getElementById("qrText");
  const downloadQrBtn = document.getElementById("downloadQrBtn");
  const qrCanvas = document.getElementById("qrCanvas");

  userInfo.textContent = `${currentUser.name} (${currentUser.role})`;
  adminPanel.classList.toggle("hidden", currentUser.role !== "admin");

  let records = [];
  let previewQr = null;
  let serverIp = "localhost";

  const initServerIp = async () => {
    try {
      const res = await api.getServerIp();
      serverIp = res.ip || "localhost";
    } catch (e) {
      console.warn("Could not fetch server IP");
    }
  };

  const clearForm = () => {
    qrForm.reset();
    document.getElementById("recordId").value = "";
    renderPreview("");
  };

  const renderPreview = (text) => {
    qrCanvas.innerHTML = "";
    let value = String(text || "").trim();
    if (!value) {
      return;
    }

    if (serverIp !== "localhost" && serverIp !== "127.0.0.1") {
      value = value.replace(/localhost|127\.0\.0\.1/g, serverIp);
    }
    previewQr = new QRCode(qrCanvas, {
      text: value,
      width: 180,
      height: 180,
      correctLevel: QRCode.CorrectLevel.M
    });
    return previewQr;
  };

  qrTextInput.addEventListener("input", (event) => {
    renderPreview(event.target.value);
  });

  downloadQrBtn.addEventListener("click", () => {
    const img = qrCanvas.querySelector("img");
    const canvas = qrCanvas.querySelector("canvas");
    const src = img ? img.src : canvas ? canvas.toDataURL("image/png") : "";
    if (!src) {
      showMessage(globalMessage, "Enter QR text first to generate preview", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = src;
    link.download = "qr-code.png";
    link.click();
  });

  const buildRecordItem = (record) => {
    const item = document.createElement("div");
    item.className = "record-item";
    item.innerHTML = `
      <p>${escapeHtml(record.qr_text)}</p>
      <p class="record-meta">By: ${escapeHtml(record.creator_name)} (${escapeHtml(record.creator_role)})</p>
      <p class="record-meta">Updated: ${toDate(record.updated_at)}</p>
      <div class="record-actions">
        <button class="btn btn-ghost" data-action="edit" data-id="${record.id}">Edit</button>
        <button class="btn btn-danger btn-delete" data-action="delete" data-id="${record.id}">Delete</button>
      </div>
    `;
    return item;
  };

  const renderRecords = () => {
    recordList.innerHTML = "";
    recordCount.textContent = String(records.length);

    if (!records.length) {
      recordList.innerHTML = "<p class='muted'>No records found.</p>";
      return;
    }

    const fragment = document.createDocumentFragment();
    records.forEach((record) => {
      fragment.appendChild(buildRecordItem(record));
    });
    recordList.appendChild(fragment);
  };

  const loadRecords = async () => {
    try {
      hideMessage(globalMessage);
      setLoading(refreshBtn, true, "Refreshing...");
      const response = await api.getRecords();
      records = response.records || [];
      renderRecords();
    } catch (error) {
      showMessage(globalMessage, error.message, "error");
    } finally {
      setLoading(refreshBtn, false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(loadUsersBtn, true, "Loading...");
      const response = await api.users();
      const users = response.users || [];
      if (!users.length) {
        usersList.innerHTML = "<p class='muted'>No users found.</p>";
        return;
      }
      usersList.innerHTML = users
        .map((u) => `<p>${u.name} (${u.role}) - ${u.email}</p>`)
        .join("");
    } catch (error) {
      showMessage(globalMessage, error.message, "error");
    } finally {
      setLoading(loadUsersBtn, false);
    }
  };

  qrForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("recordId").value;
    const saveRecordBtn = document.getElementById("saveRecordBtn");

    try {
      hideMessage(globalMessage);
      setLoading(saveRecordBtn, true, "Saving...");

      const formData = new FormData();
      const content = document.getElementById("qrText").value.trim();
      formData.append("title", content);
      formData.append("qrText", content);

      if (id) {
        await api.updateRecord(id, formData);
        showMessage(globalMessage, "Record updated");
      } else {
        await api.createRecord(formData);
        showMessage(globalMessage, "Record created");
      }

      clearForm();
      loadRecords();
    } catch (error) {
      showMessage(globalMessage, error.message, "error");
    } finally {
      setLoading(saveRecordBtn, false);
    }
  });

  recordList.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) {
      return;
    }

    const record = records.find((item) => String(item.id) === String(id));
    if (!record) {
      return;
    }

    if (action === "edit") {
      document.getElementById("recordId").value = record.id;
      document.getElementById("qrText").value = record.qr_text;
      renderPreview(record.qr_text);
      showMessage(globalMessage, `Editing record #${record.id}`);
      qrForm.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "delete") {
      if (!window.confirm("Delete this record?")) {
        return;
      }
      try {
        setLoading(target, true, "Deleting...");
        await api.deleteRecord(id);
        showMessage(globalMessage, "Record deleted");
        loadRecords();
      } catch (error) {
        showMessage(globalMessage, error.message, "error");
        setLoading(target, false);
      }
    }
  });

  clearFormBtn.addEventListener("click", clearForm);
  refreshBtn.addEventListener("click", loadRecords);
  logoutBtn.addEventListener("click", onLogout);
  loadUsersBtn.addEventListener("click", loadUsers);

  return {
    init: async () => {
      await initServerIp();
      await loadRecords();
    }
  };
};

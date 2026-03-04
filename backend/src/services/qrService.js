const { all, get, run } = require("../config/db");

const createQrRecord = async ({
  title,
  qrText,
  category,
  filePath,
  fileName,
  createdBy
}) => {
  const result = await run(
    `
    INSERT INTO qr_records(title, qr_text, category, file_path, file_name, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [title, qrText, category || "general", filePath || null, fileName || null, createdBy]
  );

  return getQrById(result.id);
};

const getQrById = (id) =>
  get(
    `
    SELECT q.*, u.name as creator_name, u.role as creator_role
    FROM qr_records q
    JOIN users u ON q.created_by = u.id
    WHERE q.id = ?
  `,
    [id]
  );

const listQrRecords = ({ userId, role }) => {
  if (role === "student") {
    return all(
      `
      SELECT q.*, u.name as creator_name, u.role as creator_role
      FROM qr_records q
      JOIN users u ON q.created_by = u.id
      WHERE q.created_by = ?
      ORDER BY q.id DESC
    `,
      [userId]
    );
  }

  return all(
    `
    SELECT q.*, u.name as creator_name, u.role as creator_role
    FROM qr_records q
    JOIN users u ON q.created_by = u.id
    ORDER BY q.id DESC
  `
  );
};

const updateQrRecord = async ({ id, title, qrText, category, filePath, fileName }) => {
  const current = await getQrById(id);
  if (!current) {
    return null;
  }

  await run(
    `
    UPDATE qr_records
    SET title = ?, qr_text = ?, category = ?, file_path = ?, file_name = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
    [
      title ?? current.title,
      qrText ?? current.qr_text,
      category ?? current.category,
      filePath ?? current.file_path,
      fileName ?? current.file_name,
      id
    ]
  );

  return getQrById(id);
};

const deleteQrRecord = (id) => run("DELETE FROM qr_records WHERE id = ?", [id]);

module.exports = {
  createQrRecord,
  getQrById,
  listQrRecords,
  updateQrRecord,
  deleteQrRecord
};


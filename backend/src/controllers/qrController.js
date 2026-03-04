const fs = require("fs");
const path = require("path");
const {
  createQrRecord,
  getQrById,
  listQrRecords,
  updateQrRecord,
  deleteQrRecord
} = require("../services/qrService");

const canMutate = (user, record) => {
  if (!record) {
    return false;
  }
  if (user.role === "admin" || user.role === "mentor") {
    return true;
  }
  return record.created_by === user.id;
};

const list = async (req, res, next) => {
  try {
    const records = await listQrRecords({ userId: req.user.id, role: req.user.role });
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, qrText, category } = req.body;
    if (!title || !qrText) {
      return res.status(400).json({ message: "Title and qrText are required" });
    }

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const fileName = req.file ? req.file.originalname : null;

    const record = await createQrRecord({
      title,
      qrText,
      category,
      filePath,
      fileName,
      createdBy: req.user.id
    });

    return res.status(201).json({ record });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const current = await getQrById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: "Record not found" });
    }
    if (!canMutate(req.user, current)) {
      return res.status(403).json({ message: "Not allowed to edit this record" });
    }

    const updated = await updateQrRecord({
      id: req.params.id,
      title: req.body.title,
      qrText: req.body.qrText,
      category: req.body.category,
      filePath: req.file ? `/uploads/${req.file.filename}` : undefined,
      fileName: req.file ? req.file.originalname : undefined
    });

    return res.json({ record: updated });
  } catch (error) {
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const current = await getQrById(req.params.id);
    if (!current) {
      return res.status(404).json({ message: "Record not found" });
    }
    if (!canMutate(req.user, current)) {
      return res.status(403).json({ message: "Not allowed to delete this record" });
    }

    if (current.file_path) {
      const fullPath = path.join(process.cwd(), current.file_path.replace("/uploads/", "uploads/"));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await deleteQrRecord(req.params.id);
    return res.json({ message: "Record deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  create,
  update,
  remove
};


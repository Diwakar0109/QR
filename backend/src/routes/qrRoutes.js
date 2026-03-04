const express = require("express");
const { list, create, update, remove } = require("../controllers/qrController");
const { authRequired } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", authRequired, list);
router.post("/", authRequired, upload.single("attachment"), create);
router.put("/:id", authRequired, upload.single("attachment"), update);
router.delete("/:id", authRequired, remove);

module.exports = router;


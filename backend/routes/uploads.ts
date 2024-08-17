import express from "express";
import multer from "multer";
import path from "path";
import fileUpload from "express-fileupload";

const router = express.Router();
router.use(fileUpload());

router.post("/", (req, res) => {
  console.log(req.files);

  if (!req.files) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({ files: req.files });
});

export default router;

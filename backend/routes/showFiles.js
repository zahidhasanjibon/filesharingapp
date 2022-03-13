const router = require("express").Router();
const File = require("../models/file");
router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });
    if (!file) {
      return res.render("downloadPage", { error: "link expires" });
    }
    return res.render("downloadPage", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("downloadPage", { error: "something went wrong" });
  }
});

module.exports = router;

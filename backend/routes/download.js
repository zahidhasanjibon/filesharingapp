const router = require("express").Router();
const File = require("../models/file");
const path = require("path");
router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({
      uuid: req.params.uuid,
    });

    if (!file) {
      return res.render("downloadPage", {
        error: "link has been expired",
      });
    }
    const filePath = path.resolve(`${__dirname}/../${file.path}`);
    return res.download(filePath);
  } catch (error) {
    return res.render("downloadPage", {
      error: "server side error",
    });
  }
});

module.exports = router;

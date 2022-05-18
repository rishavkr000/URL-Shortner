const express = require('express');
let router = express.Router();
const urlController = require("../controllers/urlController")
const auth = require("../cache/auth")


router.post("/", (req, res) => {
    res.send('ok')
})

router.post("/url/shorten", urlController.createUrl )
// router.get('/:urlCode', urlController.getUrl);

router.get('/:urlCode', auth.fetchUrl);


module.exports = router;
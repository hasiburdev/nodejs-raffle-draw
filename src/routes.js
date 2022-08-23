const router = require("express").Router();
const { sellBulkTicket, sellSingleTicket } = require("./controllers");

router.route("/t/:id").get().put().delete();

router.route("/u/:username").get().put().delete();

router.post("/bulk", sellBulkTicket);
router.get("/draw");

router.route("/").get().post(sellSingleTicket);

module.exports = router;

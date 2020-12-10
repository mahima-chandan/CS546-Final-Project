const c = require("../config");
const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("fund", {});
  } catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

router.post("/fund", async (req, res) => {
  try {
    let Balance = await valiData.updateBalance(
      req.body.cardname,
      req.body.funamot
    );

    res.render("success/success", { Balance: Balance });
  } catch (e) {
    res.sendStatus(500);
  }
});

/* Mahima to develop this
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    res.sendFile(path.resolve('public/bet.html'));
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});
*/

module.exports = router;

const c = require("../config");
const express = require("express");
const path = require("path");
const router = express.Router();
const { bets } = require("../data");
const { users } = require("../data");

router.get("/", async (req, res) => {
  try {
    let user = await users.getUserByName("mahima")
        let amountBal = user.balance;
        let name = user.username;
        res.render("fund", {Balance:amountBal,Name:name});
  } catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

router.post("/", async (req, res) => {
        try {
           let Balance = await users.updateBalance(req.body.cardname,req.body.funamot);
            res.render("bet", {});
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    });

module.exports = router;

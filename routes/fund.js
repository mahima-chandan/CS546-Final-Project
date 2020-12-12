const c = require("../config");
const express = require("express");
const path = require("path");
const { bets } = require("../data");
const { users } = require("../data");

const router = express.Router();

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
/* commented out doesn't compile, Dale
//updated ,Mahima
  try {
    let Balance = await valiData.updateBalance(
      req.body.cardname,
      req.body.funamot
    );
*/

try {
        let Balance = await users.updateBalance(
            req.body.cardname,
            req.body.funamot)
            res.render("bet", {});
        } catch (e) {
            res.sendStatus(500);
        }
    });

    
//done with this, Mahima
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

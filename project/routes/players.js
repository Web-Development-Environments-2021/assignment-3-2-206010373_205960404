var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
console.log("######################");
router.get("/Details/:player_id", async (req, res, next) => {
  try {
    const player_details = await players_utils.getPlayerDetails(
      req.params.player_id
    );
    console.log(player_details);
    //we should keep implementing team page.....
    res.send(player_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/matches_utils");

///////think
router.get("/nextLeagueMatch", async (req, res, next) => {
    try {
      const match = await matches_utils.getNextGameDetails();
      if (match == null) {
        res.status(204).send('There are no future matches');
      }
      res.status(200).send(game)
    } catch (error) {
      next(error);
    }
});



module.exports = router;
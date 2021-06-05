var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const matches_utils = require("./utils/matches_utils");

/* This path returns the favorites matchs that were saved by the logged-in user*/
router.get("/pastMatches", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const pastMatchesret = await matches_utils.getPastMatches();
        res.status(200).send(pastMatchesret);
    } catch (error) {
      next(error);
    }
  });

  /* This path returns the favorites matchs that were saved by the logged-in user*/
router.get("/futureMatches", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const futureMatchesret = await matches_utils.getFutureMatches();
        res.status(200).send(futureMatchesret);
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
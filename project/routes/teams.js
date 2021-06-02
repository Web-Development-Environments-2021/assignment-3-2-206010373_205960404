var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    const team_coach = await teams_utils.getTeamCoachName(
      req.params.teamId
    );

    //we should keep implementing team page.....
    //console.log(team_details);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

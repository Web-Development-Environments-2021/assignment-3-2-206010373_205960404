var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  try {
    team_players = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    const team_coach = await teams_utils.getTeamCoachName(
      req.params.teamId
    );

    const matches = await teams_utils.getTeamMatchesByName(
      teamName
    );
    //we should keep implementing team page.....
    //console.log(team_details);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

router.get("/FutureMatches", async (req, res, next) => {
  try {
    
    const matches = await matches_utils.getTeamsFutureMatches();
    if (matches == null) {
      res.status(204).send('There are no future matches');
    }
    res.status(200).send(matches);
  } catch (error) {
    next(error);
  }
});

router.get("/PastMatches", async (req, res, next) => {
  try {
    
    const matches = await matches_utils.getTeamsPastMatches();
    
    if (matches == null) {
      res.status(204).send('There are no past matches');
    }

    res.status(200).send(matches);

  } catch (error) {
    next(error);
  }
});
module.exports = router;

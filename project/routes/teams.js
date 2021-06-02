var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  try {
    team_players = await players_utils.getPlayersByTeam(req.params.teamId);
    const team_name = await teams_utils.getTeamName(req.params.teamId);
    const team_coach = await teams_utils.getTeamCoachName(req.params.teamId);
    const team_logo = await teams_utils.getTeamLogo(teamName);
    //we should keep implementing team page.....

    res.send({
      id: req.params.teamId,
      name: team_name,
      coach: team_coach,
      logoPath: team_logo,
      players: team_players,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/TeamsFutureMatches", async (req, res, next) => {
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

router.get("/TeamsPastMatches", async (req, res, next) => {
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


router.get("/SearchTeam", async (req, res, next) => {
  try {
    
    const matches = await teams_utils.getTeamsByName();
    
    if (matches == null) {
      res.status(204).send('There are no past matches');
    }

    res.status(200).send(matches);

  } catch (error) {
    next(error);
  }
});

module.exports = router;

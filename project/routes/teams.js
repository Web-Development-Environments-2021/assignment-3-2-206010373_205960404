var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const teams_utils = require("./utils/teams_utils");
const players_utils = require("./utils/players_utils");
const matches_utils = require("./utils/matches_utils");


router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_players = [];
  try {
    //team_players = await players_utils.getPlayersByTeam(req.params.teamId);
    const teamDetails = await teams_utils.getTeamDetails(req.params.teamId);
    const pastMatches = await matches_utils.getTeamsPastMatches(req.params.teamId);
    const futureMatches = await matches_utils.getTeamsFutureMatches(req.params.teamId);


    res.send({
      id: req.params.teamId,
      name: teamDetails.teamName,
      coach: teamDetails.teamCoachName,
      logoPath: teamDetails.logo,
      //players: team_players,
      pastMatches : pastMatches,
      futureMatches : futureMatches 
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


router.get("/SearchTeam/:teamName", async (req, res, next) => {
  try {
    console.log("#############");
    console.log(req.params);
    const teamSearch = await teams_utils.getTeamsByName(req.params.teamName);
    
    if (teamSearch == null) {
      res.status(204).send('Team not founded');
    }

    res.status(200).send(teamSearch);

  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

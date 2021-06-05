const e = require("express");
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");


/* this path returns Details about a player */
router.get("/Details/:player_id", async (req, res, next) => {
  try {
    const player_details = await players_utils.getPlayerDetails(
      req.params.player_id
    );
    res.send(player_details);
  } catch (error) {
    next(error);
  }
});

/* this path returns PreviewDetails about a player */
router.get("/preview/:player_id", async (req, res, next) => {
  try {
    const player_preview = await players_utils.getPlayerPreviewDetails(
      req.params.player_id
    );
    res.send(player_preview);
  } catch (error) {
    next(error);
  }
});

/* this path returns Details about a players by Name */
router.get("/SearchPlayer/:playerName", async (req, res, next) => {
  try {

    const playerSearch = await players_utils.getplayersByName(req.params.playerName);
    if (playerSearch.length == 0) {
      res.status(404).send('Players not founded');
    }
    else{
    res.status(200).send(playerSearch);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});


/* this path returns Details about a players by Name filtered by their positionId */
router.get("/FilterByPositionId/:playerName/:positionId", async (req, res, next) => {
  let FilteredPositionPlayers = [];
  try {
    const playerSearch = await players_utils.getplayersByName(req.params.playerName);
    if (playerSearch.length == 0) {
      res.status(404).send('Players not founded');
    }
    else{
    for (i=0; i < playerSearch.length;i++)
      {
        if(req.params.positionId == playerSearch[i].position){
          FilteredPositionPlayers.push(playerSearch[i]);
        }
      }
    res.send(FilteredPositionPlayers);
    }
  } catch (error) {
    next(error);
  }
});

/* this path returns Details about a players by Name filtered by their teamName */
router.get("/FilterByTeamName/:playerName/:teamName", async (req, res, next) => {
  let FilteredTeamPlayers = [];
  try {
    const playerSearch = await players_utils.getplayersByName(req.params.playerName);
    if (playerSearch.length == 0) {
      res.status(404).send('Players not founded');
    }
    else{
      for (i=0; i< playerSearch.length;i++)
        {
          if(req.params.teamName == playerSearch[i].team_name){
            FilteredTeamPlayers.push(playerSearch[i]);
          }
        }
      res.send(FilteredTeamPlayers);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
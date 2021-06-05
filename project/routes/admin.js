var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const users_utils = require("./utils/users_utils");
const admin_utils = require("./utils/admin_utils");


/* this function finds the user that is in the system*/ 
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM Users")
          .then((users) => {
              if (users.find((x) => x.user_id === req.session.user_id)) {
                  req.user_id = req.session.user_id;
                  next();
              }
          })
          .catch((err) => next(err));
  } else {
      res.sendStatus(401);
  }
});


/* function that Allows the adimin to add Matches (history matches)*/ 
router.post("/addMatch", async (req, res, next) => {
  try {
      const user_id = req.session.user_id;
      const adminCheck = await admin_utils.ifisAdmin(user_id);
      if (!adminCheck) { //not admin 
          res.status(403).send("The user doesn't have Permissions to add games")
      }
      else {
          await DButils.execQuery(
           `INSERT INTO dbo.Matches (Date, Hour, Stadium, SuperligaName, SeasonName, StageName, HomeTeamID, AwayTeamID, RefereeName, HomeGoals, AwayGoals) VALUES 
              ('${req.body.previewMatch.date}','${req.body.previewMatch.hour}', '${req.body.previewMatch.stadium}','${req.body.previewMatch.superligaName}','${req.body.previewMatch.seasonName}','${req.body.previewMatch.stageName}','${req.body.previewMatch.homeTeamID}','${req.body.previewMatch.awayTeamID}','${req.body.previewMatch.refereeName}','${req.body.homeGoals}','${req.body.awayGoals}')`
          );
          res.status(201).send("match that was played has been added succesfully");
      }
  } catch (error) {
      next(error);
  }
});


/* function that Allows the adimin to add Matches (preview matches)*/ 
router.post("/addPreviewMatch", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        console.log(user_id);
        const adminCheck = await admin_utils.ifisAdmin(user_id);
        console.log(adminCheck);
        if (!adminCheck) { //not admin 
            res.status(403).send("The user doesn't have Permissions to add a match")
        }
        else {
            console.log(req.body);
            console.log(req.body.seasonName);
            await DButils.execQuery(
                `INSERT INTO dbo.Matches (Date, Hour, Stadium, SuperligaName, SeasonName, StageName, RefereeName, HomeTeamID, AwayTeamID) VALUES 
                ('${req.body.date}','${req.body.hour}', '${req.body.stadium}','${req.body.superligaName}','${req.body.seasonName}','${req.body.stageName}','${req.body.refereeName}','${req.body.homeTeamID}','${req.body.awayTeamID}')`
                );
            res.status(201).send("match that was not played was added succesfully");
        }
    } catch (error) {
        next(error);
    }
  });
 
  /* function that Allows the adimin to add Score to Matches */ 
router.put("/addScoretoMatch", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const adminCheck = await admin_utils.ifisAdmin(user_id);
        if (!adminCheck) {
            res.status(403).send("The user doesn't have Permissions to add a match score")
        }
        else {
            const MatchId = req.body.MatchId;
            const HomeGoals = req.body.HomeGoals;
            const AwayGoals = req.body.AwayGoals;
            const GameExists = (
                await DButils.execQuery(
                `SELECT * FROM dbo.Matches WHERE MatchID = '${MatchId}'`
                )
            ); 
            if(GameExists.length == 0 ){
                res.status(404).send("Can't add a Score to a match that doesn't exists")
            }
            else{
            await DButils.execQuery(
                `update dbo.Matches set HomeGoals = '${HomeGoals}' , AwayGoals = '${AwayGoals}' where MatchID = '${MatchId}'`    
            );
            await users_utils.removeAsFavorite("FavoriteMatches", "match_id", user_id, MatchId);
            res.status(201).send("score has been added to match");
            }
        }
    } catch (error) {
        next(error);
    }
});

 /* function that Allows the adimin to add Events to Matches */ 
router.post("/addEventtoMatch", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const adminCheck = await admin_utils.ifisAdmin(user_id);
        if (!adminCheck) {
            res.status(403).send("The user doesn't have Permissions to add a match Event")
        }
        else {
            const MatchId = req.body.MatchId;
            const GameExists = 
                await DButils.execQuery(
                `SELECT * FROM dbo.Matches WHERE MatchID = '${MatchId}'`
                );
            if(GameExists.length == 0 ){
                res.status(404).send("Can't add Event to a match that doesn't exists");
            }
            else{
            await DButils.execQuery(
                `INSERT INTO dbo.EventDetails (MatchId, Date, Hour, TimeMinuteInGame, EventInGame, PlayerName, Description) VALUES ('${req.body.MatchId}', '${req.body.Date}','${req.body.Hour}', '${req.body.TimeMinuteInGame}','${req.body.EventInGame}','${req.body.player_name}','${req.body.Description}')`
            );
            res.status(201).send("event has been added succesfully");
        }
    }
    } catch (error) {
        next(error);
    }
});

module.exports = router;

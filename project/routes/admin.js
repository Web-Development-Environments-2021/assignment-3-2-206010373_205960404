var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");



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

router.post("/addMatch", async (req, res, next) => {
  try {
      const user_id = req.session.user_id;
      if (user_id != 2) { //not admin 
          res.status(403).send("The user doesn't have Permissions to add games")
      }
      else {
          await DButils.execQuery(
           `INSERT INTO dbo.Matches (Date, Hour, Stadium, SuperligaName, SeasonName, StageName, HomeTeamID, AwayTeamID, RefereeName, HomeGoals, AwayGoals) VALUES 
              ('${req.body.previewMatch.date}','${req.body.previewMatch.hour}', '${req.body.previewMatch.stadium}','${req.body.previewMatch.superligaName}','${req.body.previewMatch.seasonName}','${req.body.previewMatch.stageName}','${req.body.previewMatch.homeTeamID}','${req.body.previewMatch.awayTeamID}','${req.body.refereeName}','${req.body.homeGoals}','${req.body.awayGoals}')`
          );
          res.status(201).send("match that was played has been added succesfully");
      }
  } catch (error) {
      next(error);
  }
});


router.post("/addPreview", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) { //not admin 
            res.status(403).send("The user doesn't have Permissions to add a match")
        }
        else {
            await DButils.execQuery(
                `INSERT INTO dbo.Matches (Date, Hour, Stadium, SuperligaName, SeasonName, StageName, HomeTeamID, AwayTeamID, RefereeName) VALUES 
                ('${req.body.Date}','${req.body.Hour}', '${req.body.Stadium}','${req.body.SuperligaName}','${req.body.SeasonName}','${req.body.StageName}','${req.body.HomeTeamID}','${req.body.AwayTeamID}','${req.body.RefereeName}')`
            );
            res.status(201).send("match that was not played was added succesfully");
        }
    } catch (error) {
        next(error);
    }
  });
 
router.put("/addScoretoMatch", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) {
            res.status(403).send("The user doesn't have Permissions to add a match score")
        }
        else {
            const gameid = req.body.gameId;
            const HomeGoals = req.body.score;
            const AwayGoals = req.body.score;

            await DButils.execQuery(
                `update dbo.Matches set HomeGoals = '${HomeGoals}' and AwayGoals = '${AwayGoals}' where gameID = '${gameid}'`
            );
            res.status(201).send("score has been added to match");
        }
    } catch (error) {
        next(error);
    }
});

router.post("/addEventtoMatch", async (req, res, next) => {
    try {
        const user_id = req.session.user_id;
        if (user_id != 1) {
            res.status(403).send("The user doesn't have Permissions to add a match Event")
        }
        else {
            const user_id = req.session.user_id;
            await DButils.execQuery(
                `INSERT INTO dbo.EventDetails (gameID, Date, Hour, TimeMinuteInGame, EventInGame, playerID, Description) VALUES ('${req.body.gameID}', '${req.body.Date}','${req.body.Hour}', '${req.body.TimeMinuteInGame}','${req.body.EventInGame}','${req.body.PlayerID}','${req.body.Description}')`
            );
            res.status(201).send("event has been added succesfully");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;

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

// router.post("/addMatch", async (req, res, next) => {
//   try {
//       const user_id = req.session.user_id;
//       if (user_id != 1) { //not admin 
//           res.status(403).send("The user doesn't have Permissions to add games")
//       }
//       else {
//           await DButils.execQuery(
//               `INSERT INTO dbo.games (MatchID, Date, Hour, Stadium, SuperligaName, SeasonName, StageName, HomeTeamID, AwayTeamID, RefereeName, HomeGoals, AwayGoals) VALUES 
//               ('${req.body.MatchID}', '${req.body.Date}','${req.body.Hour}', '${req.body.Stadium}','${req.body.SuperligaName}','${req.body.SeasonName}','${req.body.StageName}','${req.body.HomeTeamID}','${req.body.AwayTeamID}','${req.body.RefereeName}','${req.body.HomeGoals}','${req.body.AwayGoals}')`
//           );
//           res.status(201).send("game has been added");
//       }
//   } catch (error) {
//       next(error);
//   }
// });


// // add score and events 

module.exports = router;

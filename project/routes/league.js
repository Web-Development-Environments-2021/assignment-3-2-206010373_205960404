var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const users_utils = require("./utils/users_utils");
const matches_utils = require("./utils/matches_utils");

/* this path returns LeagueDetails - checks if the user is logged in and returns the relevant data Respectively */
router.get("/getDetails", async (req, res, next) => {
  try {
    ret_arr = []
    const league_details = await league_utils.getLeagueDetails();
    league_details.favoriteMatches = [];
    if (req.session && req.session.user_id) {
      const match_ids = await users_utils.getFavorites("FavoriteMatches", req.session.user_id, "match_id");
      let match_ids_array = [];
      match_ids.map((element) => match_ids_array.push(element.match_id)); //extracting the matchs ids into array
      const results = await matches_utils.getMatchesInfo(match_ids_array);
      console.log(results);
      if (results.length <= 3){
        for(i=0;i<results.length;i++){
          league_details.favoriteMatches.push(results[i][0]);
        }
      }
      else{
        for (i = 0; i < 3; i++){
          league_details.favoriteMatches.push(results[i][0]);
        }
      }
    }
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

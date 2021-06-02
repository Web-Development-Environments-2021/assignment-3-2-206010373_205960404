var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const users_utils = require("./utils/users_utils");
const matches_utils = require("./utils/matches_utils");


router.get("/getDetails", async (req, res, next) => {
  try {
    ret_arr = []
    const league_details = await league_utils.getLeagueDetails();
    ret_arr.push(league_details);
    console.log(req.session);
    if(Object.entries(req.session).length != 0){
      const match_ids = await users_utils.getFavorites("FavoriteMatches", req.session.user_id, "match_id");
      let match_ids_array = [];
      match_ids.map((element) => match_ids_array.push(element.match_id)); //extracting the matchs ids into array
      const results = await matches_utils.getMatchesInfo(match_ids_array);
      if (results.length <= 3){
        ret_arr.push(results);
      }
      else{
        var arr_temp = [];
        for (i = 0; i < 3; i++){
          arr_temp.push(results[i]);
        }
        ret_arr.push(arr_temp);
      }
      console.log(results);
      console.log(results.length);
    }
    res.send(ret_arr);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");

/* this function takes all league (superliga) relevant data from the API and returns it*/
async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  if (league.data.data.current_stage_id == null){
    var stageName = "No Stage on the momennt";
  }
  else{
    const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
    var stageName = stage.data.data.name;
  }

  const next_game = await DButils.execQuery(`SELECT TOP 1 * FROM dbo.Matches WHERE HomeGoals IS NULL ORDER BY Date asc`);

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stageName,
    nextgame: next_game
  };
}
exports.getLeagueDetails = getLeagueDetails;

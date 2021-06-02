const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const teams_utils = require("./teams_utils");


async function getPreviewMatch(MatchId) {
    
    Match = await DButils.execQuery(
      `select MatchId, Date, Hour, Stadium, HomeTeamID, AwayTeamID from dbo.Matches where MatchId='${MatchId}'`
    );
    console.log(Match);
    Match[0].HomeTeamName = await teams_utils.getTeamName(Match[0].HomeTeamID);
    Match[0].AwayTeamName = await teams_utils.getTeamName(Match[0].AwayTeamID);
    console.log(Match);
    return Match;
}

async function getDetailsFinishMatch(MatchId) {
    
    const Match = await DButils.execQuery(
      `select * from dbo.Matches where MatchId='${MatchId}'`
    );
    return Match;
}

async function getMatchesInfo(players_ids_list) {
    let promises = [];
    players_ids_list.map((id) =>
      promises.push(getPreviewMatch(id))
    );
    let matches_info = await Promise.all(promises);
    return matches_info;
  }
  

  async function getTeamsPastMatches(teamId) {
    try {
        const games = (
            await DButils.execQuery(
            `SELECT * FROM dbo.Matches WHERE HomeTeamId = '${teamId}' OR AwayTeamId = '${teamId}'`
            )
        );    
        const promises = games.map(async (game) => {
            return await extractRelevantPastGameData(game);
        });
        return Promise.all(promises);
        } catch (error) {
        throw new Error(error);
    }
}

async function getTeamsFutureMatches(teamId) {
  try {
      const games = (
          await DButils.execQuery(
              `SELECT * FROM dbo.Matches WHERE HomeGoals = 'NULL' AND AwayGoals = 'NULL' AND (HomeTeamID = '${teamId}' OR AwayTeamID = '${teamId}'`
          )
      );

      return games.map((game_info) => { 
          return extractRelevantFutureGameData(game_info); 
      });

      } catch (error) {
      throw new Error(error);
  }
}

exports.getPreviewMatch = getPreviewMatch;
exports.getDetailsFinishMatch = getDetailsFinishMatch;
exports.getMatchesInfo = getMatchesInfo;

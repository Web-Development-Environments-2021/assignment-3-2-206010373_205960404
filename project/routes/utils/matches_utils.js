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
  
async function getNextGameDetails(){
    let matches = await DButils.execQuery(`SELECT * FROM dbo.matches WHERE HomeGoals IS NOT NULL`); 
    if(matches.length==0){
        return null;
    }


    let nextGame = matches[0];
    for(let i =1;i<matches.length;i++){
        if(matches[i].MatchDate < nextGame.MatchDate){
            nextGame = matches[i];
        }
    }

    return matchPrev;
}

  async function getTeamsPastMatches(teamId) {
    try {
        const matches = (
            await DButils.execQuery(
            `SELECT * FROM dbo.Matches WHERE (HomeTeamId = '${teamId}' OR AwayTeamId = '${teamId}') AND HomeGoals IS NOT NULL AND AwayGoals IS NOT NULL`
            )
        );    
        console.log(matches);
        return matches;
        // const promises = matches.map(async (match) => {
        //     return await extractRelevantPastGameData(match);
        // });
        // return Promise.all(promises);
        } catch (error) {
        throw new Error(error);
    }
}

async function getTeamsFutureMatches(teamId) {
  try {
      const fmatches = (
          await DButils.execQuery(
              `SELECT * FROM dbo.Matches WHERE HomeGoals IS NULL AND AwayGoals IS NULL AND (HomeTeamID = '${teamId}' OR AwayTeamID = '${teamId}')`
          )
      );
      console.log(fmatches);
      return fmatches;
    //   return matches.map((match) => { 
    //       return extractRelevantFutureGameData(match); 
    //   });

      } catch (error) {
      throw new Error(error);
  }
}

exports.getPreviewMatch = getPreviewMatch;
exports.getDetailsFinishMatch = getDetailsFinishMatch;
exports.getMatchesInfo = getMatchesInfo;
exports.getNextGameDetails = getNextGameDetails;
exports.getTeamsPastMatches = getTeamsPastMatches;
exports.getTeamsFutureMatches = getTeamsFutureMatches;

